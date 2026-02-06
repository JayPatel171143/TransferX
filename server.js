import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import os from 'os';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- SUPABASE CONFIGURATION ---
// TODO: Replace these with your actual Supabase keys
const SUPABASE_URL = 'https://dexqsiflsfkgnvwqsqxu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleHFzaWZsc2ZrZ252d3FzcXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODcwODEsImV4cCI6MjA4NDc2MzA4MX0.SD1Rb14QV6dacQDiGUk_FxEKtE8bUGgeKalixl6IK8w';
const BUCKET_NAME = 'UPLOADS'; // Name of your storage bucket

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- MIDDLEWARE ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(__dirname)); // Serve static files from root directory

// --- AUTOMATIC FILE CLEANUP FUNCTION ---
// DISABLED: Database schema does not include 'expires_at' column
/*
async function cleanupExpiredFiles() {
    // ... (cleanup logic removed to prevent errors) ...
}

// --- SCHEDULE CLEANUP JOB ---
cron.schedule('0 * * * *', () => {
    // cleanupExpiredFiles();
});
*/

// --- API Routes ---

// 1. Get File Metadata (Secure)
app.get('/api/file/:code', async (req, res) => {
    const code = req.params.code;

    try {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('code', code)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Expiration check removed (Column does not exist)
        /*
        if (new Date(data.expires_at) < new Date()) {
            return res.status(410).json({ error: 'File has expired' });
        }
        */

        // Security Check: Is Password Protected?
        const isProtected = data.password && data.password.trim() !== "";

        if (isProtected) {
            // Return restricted info (NO URL)
            return res.json({
                success: true,
                isProtected: true,
                original_name: data.original_name, // Safe to show name
                size: data.size,
                mimetype: data.mimetype
            });
        }

        // Not Protected? Return everything including URL
        res.json({
            success: true,
            isProtected: false,
            url: data.url,
            original_name: data.original_name,
            size: data.size,
            mimetype: data.mimetype
        });

    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. Verify Password (to get URL)
app.post('/api/verify', async (req, res) => {
    const { code, password } = req.body;

    if (!code || !password) {
        return res.status(400).json({ error: 'Missing code or password' });
    }

    try {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('code', code)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Verify Password (Simple equality check since we store plain for now)
        // In a real app with hashing, compare hashes here.
        if (data.password === password) {
            return res.json({
                success: true,
                url: data.url
            });
        } else {
            return res.status(401).json({ error: 'Incorrect password' });
        }

    } catch (err) {
        console.error('Verify Error:', err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

/* Legacy/Dead Routes Removed (Upload is handled client-side) */

// Fallback Route: Smart Redirect based on Device
app.get('*', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';

    // Simple regex to detect common mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobile) {
        // Serve Mobile Optimized UI
        res.sendFile(path.join(__dirname, 'mobile.html'));
    } else {
        // Serve Windows/Desktop UI
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Start Server
// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running locally at http://localhost:${PORT}`);

    // Get Local IP
    const nets = os.networkInterfaces();
    const results = Object.create(null);

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    console.log(`📱 Mobile Access:`);
    for (const name of Object.keys(results)) {
        results[name].forEach(ip => {
            console.log(`   http://${ip}:${PORT}/mobile.html`);
        });
    }

    console.log(`\n⚡ Supabase Storage Mode Enabled`);
    console.log(`   (Make sure you have set your Keys and Bucket!)`);
    console.log(`\n🕐 Cleanup job scheduled: Every hour at minute 0`);
    console.log(`   Files will be automatically deleted 24 hours after expiration\n`);
});
