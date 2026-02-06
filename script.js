// Firebase imports removed - Using Local Backend API

document.addEventListener('DOMContentLoaded', () => {
    // ===== CUSTOM NOTIFICATION SYSTEM =====
    const notificationModal = document.getElementById('notificationModal');
    const notificationContent = document.getElementById('notificationContent');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationClose = document.getElementById('notificationClose');

    const confirmModal = document.getElementById('confirmModal');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');

    let confirmResolve = null;

    // Show Notification (replaces alert)
    function showNotification(title, message, type = 'info') {
        const types = {
            success: {
                icon: `<svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
                border: 'border-green-500',
                bg: 'bg-green-50 dark:bg-green-900/20'
            },
            error: {
                icon: `<svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
                border: 'border-red-500',
                bg: 'bg-red-50 dark:bg-red-900/20'
            },
            warning: {
                icon: `<svg class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
                border: 'border-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-900/20'
            },
            info: {
                icon: `<svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
                border: 'border-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-900/20'
            }
        };

        const config = types[type] || types.info;

        // Set content
        notificationIcon.innerHTML = config.icon;
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;

        // Update styles
        notificationContent.className = `bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl max-w-sm border-l-4 flex items-start gap-4 ${config.border} ${config.bg}`;

        // Show notification
        notificationModal.classList.remove('hidden');
        setTimeout(() => {
            notificationModal.classList.remove('translate-x-full');
        }, 10);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification();
        }, 5000);
    }

    function hideNotification() {
        notificationModal.classList.add('translate-x-full');
        setTimeout(() => {
            notificationModal.classList.add('hidden');
        }, 300);
    }

    if (notificationClose) {
        notificationClose.addEventListener('click', hideNotification);
    }

    // Show Confirmation (replaces confirm)
    function showConfirm(title, message) {
        return new Promise((resolve) => {
            confirmResolve = resolve;
            confirmTitle.textContent = title;
            confirmMessage.textContent = message;

            confirmModal.classList.remove('hidden');
            confirmModal.classList.add('flex');
            setTimeout(() => {
                confirmModal.classList.remove('opacity-0');
                confirmModal.querySelector('div').classList.remove('scale-95');
                confirmModal.querySelector('div').classList.add('scale-100');
            }, 10);
        });
    }

    function hideConfirm(result) {
        confirmModal.classList.add('opacity-0');
        confirmModal.querySelector('div').classList.remove('scale-100');
        confirmModal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            confirmModal.classList.remove('flex');
            confirmModal.classList.add('hidden');
            if (confirmResolve) {
                confirmResolve(result);
                confirmResolve = null;
            }
        }, 300);
    }

    if (confirmOkBtn) {
        confirmOkBtn.addEventListener('click', () => hideConfirm(true));
    }

    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', () => hideConfirm(false));
    }

    // ===== END NOTIFICATION SYSTEM =====

    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const stateDefault = document.getElementById('uploadStateDefault');
    const stateUploading = document.getElementById('uploadStateUploading');
    const stateSuccess = document.getElementById('uploadStateSuccess');
    const copyBtn = document.getElementById('copyBtn');
    // expirySelect removed
    // passwordToggle removed
    // passwordInputContainer removed
    // passwordInputs removed

    // Password Logic REMOVED
    // Expiration Logic remains (if any)

    // Toggle Mode Logic
    const modeSendBtn = document.getElementById('modeSendBtn');
    const modeReceiveBtn = document.getElementById('modeReceiveBtn');
    const modeIndicator = document.getElementById('modeIndicator');
    const sectionSend = document.getElementById('sectionSend');
    const sectionReceive = document.getElementById('sectionReceive');
    const heroAction = document.getElementById('heroAction'); // Dynamic headline

    function switchMode(mode) {
        if (mode === 'send') {
            modeIndicator.style.transform = 'translateX(0)';
            modeSendBtn.classList.add('text-black', 'dark:text-white');
            modeSendBtn.classList.remove('text-slate-500', 'dark:text-slate-400');

            modeReceiveBtn.classList.remove('text-black', 'dark:text-white');
            modeReceiveBtn.classList.add('text-slate-500', 'dark:text-slate-400');

            sectionSend.classList.remove('hidden');
            sectionReceive.classList.add('hidden');

            // Update headline
            if (heroAction) heroAction.textContent = 'SEND FILES';
        } else {
            modeIndicator.style.transform = 'translateX(100%)'; // Perfectly aligned now
            modeReceiveBtn.classList.add('text-black', 'dark:text-white');
            modeReceiveBtn.classList.remove('text-slate-500', 'dark:text-slate-400');

            modeSendBtn.classList.remove('text-black', 'dark:text-white');
            modeSendBtn.classList.add('text-slate-500', 'dark:text-slate-400');

            sectionReceive.classList.remove('hidden');
            sectionSend.classList.add('hidden');

            // Update headline
            if (heroAction) heroAction.textContent = 'RECEIVE FILES';
        }
    }

    if (modeSendBtn) modeSendBtn.addEventListener('click', () => switchMode('send'));
    if (modeReceiveBtn) modeReceiveBtn.addEventListener('click', () => switchMode('receive'));


    // --- SUPABASE CONFIGURATION (Frontend) ---
    // Loaded from config.js
    if (typeof AppConfig === 'undefined') {
        console.error("AppConfig not found. Make sure config.js is loaded.");
        alert("Configuration Error: AppConfig missing.");
        return;
    }

    const { supabaseUrl, supabaseKey, bucketName } = AppConfig;
    const BUCKET_NAME = bucketName; // Keep consistent naming

    // Initialize Supabase Client
    let supabase;
    if (window.supabase) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    } else {
        console.error("Supabase SDK not loaded");
        alert("Supabase SDK failed to load. Please refresh.");
        return;
    }

    // Click listener removed to avoid conflict with settings (Drop area has specific onclick)
    if (uploadBox) {
        // Drag & Drop logic remains below

        // Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            uploadBox.classList.add('drag-active');
        }

        function unhighlight(e) {
            uploadBox.classList.remove('drag-active');
        }

        uploadBox.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files: files } });
        }
    }

    if (fileInput) {
        fileInput.addEventListener('change', handleFiles);
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    }

    // Helper: Switch Upload States with Smooth Transitions
    function switchUploadState(state) {
        console.log(`Switching state to: ${state}`);

        // Force hide all first to ensure no overlap
        [stateDefault, stateUploading, stateSuccess].forEach(el => {
            if (el) {
                el.classList.remove('active');
                // Optional: force hide if CSS transition isn't enough
                el.style.display = 'none';
            }
        });

        // Add active class to target state
        let target = null;
        if (state === 'default') target = stateDefault;
        else if (state === 'uploading') target = stateUploading;
        else if (state === 'success') target = stateSuccess;

        if (target) {
            target.style.display = ''; // Remove inline override to let CSS handle it
            // Force reflow
            void target.offsetWidth;
            target.classList.add('active');
        }
    }

    // Helper: Update Circular Progress
    function updateProgress(percent) {
        const progressText = document.getElementById('uploadProgress');
        const progressCircle = document.getElementById('progressCircle');

        if (progressText) {
            progressText.textContent = percent;
        }

        if (progressCircle) {
            // Circle circumference = 2 * π * r = 2 * 3.14159 * 54 ≈ 339.29
            const circumference = 339.29;
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    // Helper: Sleep function for delays
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Helper: Get File Icon based on extension
    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();

        // Common styles
        const iconClass = "w-8 h-8 text-mint-500";

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
            // Image Icon
            return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
        } else if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
            // Document Icon
            return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`;
        } else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
            // Video Icon
            return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`;
        } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
            // Audio Icon
            return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>`;
        } else if (['zip', 'rar', '7z', 'tar'].includes(ext)) {
            // Archive Icon
            return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>`;
        } else {
            // Generic File Icon
            return `<svg class="${iconClass}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`;
        }
    }

    async function uploadFile(file) {
        // Prevent multiple simultaneous uploads
        if (uploadInProgress) {
            showNotification('Upload In Progress', 'Please wait for the current upload to complete.', 'warning');
            return;
        }

        // Validation: Max 50MB
        const MAX_SIZE = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > MAX_SIZE) {
            showNotification('File Too Large', 'Please upload files smaller than 50MB.', 'error');
            return;
        }

        // Validation: File type (optional - allow all for now)
        if (file.size === 0) {
            showNotification('Invalid File', 'Cannot upload empty files.', 'error');
            return;
        }

        // Calculate Expiration (Default: 3 Hours)
        const expiryMinutes = 180;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60000).toISOString();

        // Password (Disabled)
        let filePassword = null;

        console.log(`Setting expiration: Default (Permanent), Password: ${filePassword ? 'YES' : 'NO'}`);

        // Set upload in progress
        uploadInProgress = true;

        // UI Transition: Default -> Uploading
        switchUploadState('uploading');

        // Display file name and Icon
        const fileNameEl = document.getElementById('uploadFileName');
        if (fileNameEl) {
            fileNameEl.textContent = file.name;
        }

        const fileIconContainer = document.getElementById('uploadFileIcon');
        if (fileIconContainer) {
            fileIconContainer.innerHTML = getFileIcon(file.name);
        }

        const statusText = document.getElementById('uploadStatusText');

        try {
            // Check if upload was aborted
            if (uploadAborted) {
                uploadAborted = false;
                return;
            }

            // Start Upload
            if (statusText) statusText.textContent = "Preparing...";
            updateProgress(10);
            await sleep(500);

            // Upload to Supabase
            if (statusText) statusText.textContent = "Uploading...";
            updateProgress(30);
            await sleep(300);
            // Sanitize filename
            const sanitizeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const storageFilename = `${Date.now()}-${sanitizeName}`;

            updateProgress(50);

            // 2. Upload directly to Supabase Storage
            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .upload(storageFilename, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;
            updateProgress(75);

            // Get Public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from(BUCKET_NAME)
                .getPublicUrl(storageFilename);

            updateProgress(85);

            // Finalizing
            if (statusText) statusText.textContent = "Finalizing...";
            updateProgress(90);
            await sleep(500);

            // 4. Generate Code & Save to Supabase Database (Directly from Client)
            const secretCode = Math.floor(100000 + Math.random() * 900000).toString();

            const { data: dbData, error: dbError } = await supabase
                .from('files')
                .insert([
                    {
                        code: secretCode,
                        original_name: file.name,
                        storage_name: storageFilename,
                        size: file.size,
                        mimetype: file.type,
                        url: publicUrl,
                        // expires_at: expiresAt, // Removed: Database column does not exist
                        password: filePassword // Include Password
                    }
                ]);

            if (dbError) {
                console.error('Supabase DB Error:', dbError);
            }

            updateProgress(100);
            if (statusText) statusText.textContent = "Complete!";
            await sleep(300);

            // Reset upload in progress
            uploadInProgress = false;

            // 5. Success UI
            const downloadURL = publicUrl;

            // UI Transition: Uploading -> Success
            switchUploadState('success');
            if (uploadBox) uploadBox.style.cursor = 'default';

            // CRITICAL: Update Text BEFORE Animations
            const shortCodeEl = document.getElementById('shortCode');
            if (shortCodeEl) shortCodeEl.innerText = secretCode;

            // Generate "Share Link" for the input box (keep this as website link for manual sharing)
            const shareUrl = `${window.location.origin}?code=${secretCode}`;

            const linkInput = stateSuccess.querySelector('input');
            if (linkInput) linkInput.value = shareUrl;

            // CRITICAL: Generate QR Code with DIRECT SUPABASE URL
            const qrContainer = document.getElementById("qrcode");
            if (qrContainer) {
                qrContainer.innerHTML = '';
                new QRCode(qrContainer, {
                    text: publicUrl,  // MUST BE publicUrl for direct download
                    width: 128,
                    height: 128
                });
            }

            // Confetti Animation (Constrained to Card) - SAFELY WRAPPED
            try {
                const confettiCanvas = document.getElementById('confettiCanvas');
                if (confettiCanvas && window.confetti) {
                    const myConfetti = confetti.create(confettiCanvas, {
                        resize: true,
                        useWorker: true
                    });

                    myConfetti({
                        particleCount: 180,
                        spread: 80,
                        origin: { y: 0.5 },
                        colors: ['#2dd4bf', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'], // Multicolor
                        disableForReducedMotion: true
                    });
                }
            } catch (animError) {
                console.warn("Confetti animation failed (non-critical):", animError);
            }

        } catch (error) {
            console.error("Upload error:", error);

            // Check if it was a user cancellation
            if (uploadAborted) {
                uploadAborted = false;
                showNotification('Upload Cancelled', 'File upload was cancelled by user.', 'info');
                switchUploadState('default');
                if (uploadBox) uploadBox.style.cursor = 'pointer';
                return;
            }

            // Provide specific error messages
            let errorTitle = "Upload Failed";
            let errorMsg = "";
            if (error.message) {
                if (error.message.includes('network')) {
                    errorMsg = "Please check your internet connection.";
                } else if (error.message.includes('storage')) {
                    errorMsg = "Storage service unavailable. Please try again later.";
                } else if (error.message.includes('size')) {
                    errorMsg = "File is too large.";
                } else {
                    errorMsg = error.message;
                }
            } else {
                errorMsg = "Please try again.";
            }

            showNotification(errorTitle, errorMsg, 'error');
            switchUploadState('default');

            // Reset upload box cursor and flag
            uploadInProgress = false;
            if (uploadBox) uploadBox.style.cursor = 'pointer';
        }
    }

    // Copy Link Logic
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const linkInput = stateSuccess.querySelector('input');
            linkInput.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.innerText = 'Copy Link';
            }, 2000);
        });
    }

    // Receive File Logic (Direct Supabase)
    const receiveBtn = document.getElementById('receiveBtn');
    const receiveCodeInput = document.getElementById('receiveCode');
    const receiveError = document.getElementById('receiveError');

    // Shared Download Logic with Client-Side Fallback
    async function handleDownload(code) {
        console.log('[RECEIVE] handleDownload called with code:', code);

        if (code.length !== 6 || isNaN(code)) {
            console.log('[RECEIVE] Invalid code format:', code);
            showNotification('Invalid Code', 'Please enter a valid 6-digit code', 'error');
            return;
        }

        console.log('[RECEIVE] Code validation passed');
        showReceiveLoading();

        try {
            console.log('[RECEIVE] Querying Supabase via Secure RPC');

            // Client-Side Only: Query Supabase RPC
            // RPC: get_file_metadata(p_search_code)
            const { data: fileData, error } = await supabase
                .rpc('get_file_metadata', { p_search_code: code })
                .single();

            console.log('[RECEIVE] RPC result:', { fileData, error });

            if (error) {
                console.error('[RECEIVE] RPC Error:', error);
                // PGRST116 is the error for .single() returning no rows (Not Found)
                if (error.code === 'PGRST116') {
                    throw new Error('File not found (Invalid Code)');
                }
                // Check for missing function error
                if (error.message && (error.message.includes('function') || error.code === '42883')) {
                    throw new Error('Database Setup Incomplete: Run secure_db.sql');
                }
                throw new Error(error.message || 'Database Error');
            }

            if (!fileData) {
                throw new Error('File not found');
            }

            // Map RPC result to app structure
            const data = {
                success: true,
                isProtected: fileData.is_protected,
                url: fileData.url, // Will be null if protected
                original_name: fileData.original_name,
                size: fileData.size,
                mimetype: fileData.mimetype,
                // password: null // Password is NEVER returned to client now
            };

            // Store data for password verification context
            currentFileData = { ...data, code: code };
            console.log('[RECEIVE] Current file data stored:', currentFileData);

            // Password check removed - Feature disabled
            /*
            if (data.isProtected) { ... }
            */

            // Success - No Password
            console.log('[RECEIVE] File URL:', data.url);
            if (data.url) {
                console.log('[RECEIVE] Opening file...');
                openFile(data.url);
            } else {
                console.error('[RECEIVE] No URL in data');
                showNotification('Error', 'Secure link missing', 'error');
                resetReceiveBtn();
            }

        } catch (err) {
            console.error('[RECEIVE] Error fetching file:', err);
            showNotification('Error', err.message || 'File not found or connection error', 'error');
            resetReceiveBtn();
        }
    }

    function showReceiveError(msg) {
        if (receiveBtn) {
            receiveBtn.innerHTML = `<span>Error</span>`;
            receiveBtn.classList.remove('loading-state');
            receiveBtn.classList.add('bg-red-500', 'text-white');
        }
        alert(msg);
        setTimeout(resetReceiveBtn, 3000);
    }

    function showReceiveLoading() {
        if (receiveBtn) {
            receiveBtn.innerText = 'Checking...';
            receiveBtn.classList.remove('bg-red-500', 'text-white');
            receiveBtn.classList.add('loading-state');
        }
    }

    function resetReceiveBtn() {
        if (receiveBtn) {
            receiveBtn.innerText = 'Download File';
            receiveBtn.classList.remove('loading-state', 'bg-red-500', 'text-white');
        }
    }

    function openFile(url) {
        if (receiveBtn) receiveBtn.innerText = 'Opening...';
        window.open(url, '_blank');
        if (receiveBtn) receiveBtn.innerText = 'Opened';
        setTimeout(resetReceiveBtn, 3000);
        if (receiveCodeInput) receiveCodeInput.value = '';
    }

    // --- Password Modal Logic (Server-Side Verify) ---
    const passwordModal = document.getElementById('passwordModal');
    let currentFileData = null;
    const modalPasswordInput = document.getElementById('modalPasswordInput');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

    function requestPassword(fileData) {
        // currentFileData is set in handleDownload
        if (passwordModal) {
            passwordModal.classList.remove('hidden');
            passwordModal.classList.add('flex'); // Ensure flex display
            // Smooth fade in
            setTimeout(() => {
                passwordModal.classList.remove('opacity-0');
                passwordModal.querySelector('div').classList.remove('scale-95');
                passwordModal.querySelector('div').classList.add('scale-100');
            }, 10);
            modalPasswordInput.value = '';
            modalPasswordInput.focus();
        }
    }

    function closePasswordModal() {
        if (passwordModal) {
            passwordModal.classList.add('opacity-0');
            passwordModal.querySelector('div').classList.remove('scale-100');
            passwordModal.querySelector('div').classList.add('scale-95');
            setTimeout(() => {
                passwordModal.classList.remove('flex');
                passwordModal.classList.add('hidden');
            }, 300);
            // currentFileData = null; // Keep currentFileData for potential re-attempts
            resetReceiveBtn();
        }
    }

    async function verifyPassword() {
        const password = modalPasswordInput.value.trim();
        if (password.length < 6) {
            showNotification('Incomplete Password', 'Please enter a complete 6-character password', 'warning');
            return;
        }

        modalConfirmBtn.innerHTML = 'Verifying...';

        try {
            let verified = false;
            let fileUrl = null;

            console.log('[VERIFY] Checking password locally (Netlify Mode)');

            // Client-side verification
            if (currentFileData && currentFileData.password) {
                // Simple equality check
                if (currentFileData.password === password) {
                    verified = true;

                    // We need to fetch the URL now if we hid it
                    if (!currentFileData.url) {
                        const { data: fileData, error } = await supabase
                            .from('files')
                            .select('url')
                            .eq('code', currentFileData.code)
                            .single();

                        if (!error && fileData) {
                            fileUrl = fileData.url;
                        }
                    } else {
                        fileUrl = currentFileData.url;
                    }
                } else {
                    console.log('[VERIFY] Password mismatch');
                }
            } else {
                console.error('[VERIFY] No file data context found');
            }

            if (verified && fileUrl) {
                closePasswordModal();
                openFile(fileUrl);
                modalConfirmBtn.innerHTML = 'Unlock File';
                showNotification('Success', 'Password verified! Opening file...', 'success');
            } else {
                modalConfirmBtn.innerHTML = 'Unlock File';
                showNotification('Error', 'Incorrect password', 'error');
                modalPasswordInput.value = '';
                modalPasswordInput.classList.add('animate-shake');
                setTimeout(() => modalPasswordInput.classList.remove('animate-shake'), 500);
            }

        } catch (err) {
            console.error('[VERIFY] Error:', err);
            modalConfirmBtn.innerHTML = 'Unlock File';
            showNotification('Error', 'Verification failed', 'error');
        }
    }

    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', verifyPassword);
    }

    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closePasswordModal);
    }

    // Allow 'Enter' key in modal
    if (modalPasswordInput) {
        modalPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyPassword();
        });
    }

    // Auto-download logic from URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');

    if (codeParam) {
        // Auto switch to Receive Mode
        switchMode('receive');

        if (receiveCodeInput) receiveCodeInput.value = codeParam;

        // Trigger auto-download
        handleDownload(codeParam);
    }

    // Manual Download Button Click
    if (receiveBtn) {
        receiveBtn.addEventListener('click', () => {
            const code = receiveCodeInput.value.trim();
            handleDownload(code);
        });
    }

    // Allow 'Enter' key in receive code input
    if (receiveCodeInput) {
        receiveCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const code = receiveCodeInput.value.trim();
                handleDownload(code);
            }
        });
    }

    // --- Mobile Sidebar Logic ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        if (mobileSidebar && sidebarOverlay) {
            mobileSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // --- Upload Control Buttons ---
    let uploadAborted = false;
    let uploadInProgress = false;

    const pauseUploadBtn = document.getElementById('pauseUploadBtn');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const statusText = document.getElementById('uploadStatusText');

    if (pauseUploadBtn) {
        pauseUploadBtn.addEventListener('click', () => {
            if (!uploadInProgress) return;

            // Toggle pause state
            const isPaused = pauseUploadBtn.classList.contains('paused');

            try {
                if (isPaused) {
                    // Resume
                    pauseUploadBtn.classList.remove('paused');
                    pauseUploadBtn.innerHTML = `<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`;
                    if (statusText) statusText.textContent = "Uploading...";
                    showNotification('Upload Resumed', 'File upload has been resumed.', 'info');
                } else {
                    // Pause
                    pauseUploadBtn.classList.add('paused');
                    pauseUploadBtn.innerHTML = `<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
                    if (statusText) statusText.textContent = "Paused";
                    showNotification('Upload Paused', 'File upload has been paused.', 'warning');
                }
            } catch (error) {
                console.error('Pause error:', error);
                showNotification('Error', 'Failed to pause upload.', 'error');
            }
        });
    }

    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', async () => {
            if (!uploadInProgress) return;

            // Use custom confirmation modal
            const confirmed = await showConfirm(
                'Cancel Upload?',
                'Are you sure you want to cancel this upload? This action cannot be undone.'
            );

            if (confirmed) {
                try {
                    uploadAborted = true;
                    uploadInProgress = false;
                    switchUploadState('default');
                    if (uploadBox) uploadBox.style.cursor = 'pointer';
                    if (fileInput) fileInput.value = ''; // Reset file input
                    showNotification('Upload Cancelled', 'File upload has been cancelled.', 'info');
                } catch (error) {
                    console.error('Cancel error:', error);
                    showNotification('Error', 'Failed to cancel upload.', 'error');
                }
            }
        });
    }

});
