
// polict

$(document).ready(function(){
  $("#policyA").click(function(){
    $("#policy").css("display", "block");
        $("#displayJS").css("display", "none");

 
  });
});

        // Sample policy data for SSH with file information
        const policies = [
            { 
                title: "Abandonment of Post", 
                letter: "A", 
                area: "admin", 
                chapter: "2", 
                subChapter: "a", 
                page: "1",
                fileType: "DOCX",
                fileSize: "125.50 KB"
            },
            { 
                title: "Accountability System Policy", 
                letter: "A", 
                area: "admin", 
                chapter: "2", 
                subChapter: "b", 
                page: "3",
                fileType: "DOCX",
                fileSize: "717.05 KB"
            },
            { 
                title: "Accounts Payable", 
                letter: "A", 
                area: "admin", 
                chapter: "3", 
                subChapter: "c", 
                page: "2",
                fileType: "PDF",
                fileSize: "342.80 KB"
            },
            { 
                title: "Budget Approval Process", 
                letter: "B", 
                area: "admin", 
                chapter: "3", 
                subChapter: "a", 
                page: "1",
                fileType: "DOCX",
                fileSize: "89.30 KB"
            },
            { 
                title: "Code of Conduct", 
                letter: "C", 
                area: "admin", 
                chapter: "1", 
                subChapter: "a", 
                page: "1",
                fileType: "PDF",
                fileSize: "256.45 KB"
            },
            { 
                title: "Data Protection Policy", 
                letter: "D", 
                area: "admin", 
                chapter: "4", 
                subChapter: "b", 
                page: "3",
                fileType: "DOCX",
                fileSize: "512.20 KB"
            }
        ];
        
        // Store for uploaded files
        let uploadedFiles = [];
        
        // Current user state
        let currentUser = null;
        
        // Demo user credentials (only admin has upload access)
        const demoUsers = {
            'admin': { password: 'admin123', name: 'System Administrator', role: 'admin' },
            'editor': { password: 'editor123', name: 'Policy Editor', role: 'editor' },
            'viewer': { password: 'viewer123', name: 'Policy Viewer', role: 'viewer' }
        };
        
        // Set current date in footer
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
        
        // Initialize variables
        let currentActiveNav = document.querySelector('.nav-link.active');
        let indexBadge = document.querySelector('#index-nav-item .nav-badge');
        let currentPage = 'home';
        
        // Show login modal
        document.getElementById('showLogin').addEventListener('click', function() {
            document.getElementById('loginModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close login modal
        document.getElementById('closeLogin').addEventListener('click', function() {
            document.getElementById('loginModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Handle login form submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            // Validate credentials
            if (demoUsers[username] && demoUsers[username].password === password) {
                // Login successful
                currentUser = {
                    username: username,
                    name: demoUsers[username].name,
                    role: demoUsers[username].role
                };
                
                // Update UI for logged in user
                updateUIForUser(currentUser);
                
                // Close login modal
                document.getElementById('loginModal').classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Show success message
                alert(`Login successful! Welcome ${currentUser.name}.`);
                
                // Reset form
                document.getElementById('loginForm').reset();
            } else {
                alert('Invalid username or password. Please try again.\n\nDemo credentials:\n- admin / admin123\n- editor / editor123\n- viewer / viewer123');
            }
        });
        
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                currentUser = null;
                document.getElementById('adminControls').classList.remove('active');
                document.getElementById('uploadBtn').disabled = true;
                document.getElementById('fileUploadSection').classList.remove('active');
                
                // Show login button again
                document.getElementById('showLogin').style.display = 'flex';
                
                alert('You have been logged out successfully.');
            }
        });
        
        // Update UI based on user role
        function updateUIForUser(user) {
            // Show admin controls
            document.getElementById('adminControls').classList.add('active');
            
            // Update user info
            document.getElementById('adminAvatar').textContent = user.name.charAt(0);
            document.getElementById('adminName').textContent = user.name;
            document.getElementById('adminRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
            
            // Update permission badge
            const badge = document.getElementById('permissionBadge');
            
            if (user.role === 'admin') {
                badge.textContent = 'UPLOAD ACCESS';
                badge.style.backgroundColor = '#9b59b6';
                
                // Show file upload section
                document.getElementById('fileUploadSection').classList.add('active');
                document.getElementById('uploadBtn').disabled = false;
            } else {
                badge.textContent = 'VIEW ONLY';
                badge.style.backgroundColor = '#f39c12';
                
                // Hide file upload section for non-admins
                document.getElementById('fileUploadSection').classList.remove('active');
            }
            
            // Hide login button
            document.getElementById('showLogin').style.display = 'none';
        }
        
        // Generate alphabet navigation
        function generateAlphabetNav() {
            const alphabetNav = document.getElementById('alphabetNav');
            alphabetNav.innerHTML = '';
            
            // Create A-Z buttons
            for (let i = 65; i <= 90; i++) {
                const letter = String.fromCharCode(i);
                const letterButton = document.createElement('div');
                letterButton.className = 'alphabet-letter';
                letterButton.textContent = letter;
                letterButton.dataset.letter = letter;
                
                letterButton.addEventListener('click', function() {
                    // Remove active class from all letters
                    document.querySelectorAll('.alphabet-letter').forEach(l => l.classList.remove('active'));
                    // Add active class to clicked letter
                    this.classList.add('active');
                    // Filter policies by letter
                    filterPolicies();
                });
                
                alphabetNav.appendChild(letterButton);
            }
        }
        
        // Format file size
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        // Filter and display policies
        function filterPolicies() {
            const searchTerm = document.getElementById('policySearch').value.toLowerCase();
            const selectedArea = document.getElementById('policyArea').value;
            const selectedChapter = document.getElementById('policyChapter').value;
            const selectedSubChapter = document.getElementById('policySubChapter').value;
            const selectedPage = document.getElementById('policyPage').value;
            const selectedLetter = document.querySelector('.alphabet-letter.active')?.dataset.letter;
            
            // Filter policies
            const filteredPolicies = policies.filter(policy => {
                // Search term filter
                if (searchTerm && !policy.title.toLowerCase().includes(searchTerm)) return false;
                
                // Letter filter
                if (selectedLetter && policy.letter !== selectedLetter) return false;
                
                // Area filter
                if (selectedArea && policy.area !== selectedArea) return false;
                
                // Chapter filter
                if (selectedChapter && policy.chapter !== selectedChapter) return false;
                
                // Sub-chapter filter
                if (selectedSubChapter && policy.subChapter !== selectedSubChapter) return false;
                
                // Page filter
                if (selectedPage && policy.page !== selectedPage) return false;
                
                return true;
            });
            
            // Group by letter
            const groupedPolicies = {};
            filteredPolicies.forEach(policy => {
                if (!groupedPolicies[policy.letter]) {
                    groupedPolicies[policy.letter] = [];
                }
                groupedPolicies[policy.letter].push(policy);
            });
            
            // Display policies
            const policyList = document.getElementById('policyList');
            policyList.innerHTML = '';
            
            if (filteredPolicies.length === 0) {
                policyList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 20px;">No policies found matching your criteria.</p>';
                return;
            }
            
            // Sort letters
            const sortedLetters = Object.keys(groupedPolicies).sort();
            
            sortedLetters.forEach(letter => {
                const letterGroup = document.createElement('div');
                letterGroup.className = 'policy-letter-group';
                
                const letterHeader = document.createElement('div');
                letterHeader.className = 'policy-letter';
                letterHeader.innerHTML = `<i class="fas fa-font"></i> ${letter}`;
                
                letterGroup.appendChild(letterHeader);
                
                groupedPolicies[letter].forEach(policy => {
                    const policyItem = document.createElement('div');
                    policyItem.className = 'policy-item';
                    
                    const areaLabels = {
                        'admin': 'Administration',
                        'livelihood': 'Livelihood',
                        'water': 'Water',
                        'education': 'Education',
                        'power': 'Power',
                        'health': 'Health',
                        'environment': 'Environment'
                    };
                    
                    const fileIcon = policy.fileType === 'PDF' ? 'fas fa-file-pdf' : 'fas fa-file-word';
                    const fileColor = policy.fileType === 'PDF' ? '#e74c3c' : '#2c5aa0';
                    
                    // ALWAYS show download button (no permissions required)
                    const downloadBtnHtml = `
                        <button class="policy-download-btn" data-policy="${policy.title}">
                            <i class="fas fa-download"></i> DOWNLOAD
                        </button>`;
                    
                    policyItem.innerHTML = `
                        <div class="policy-item-title">${policy.title}</div>
                        <div class="policy-item-meta">
                            <span class="policy-item-area">${areaLabels[policy.area] || policy.area}</span>
                            <div class="policy-file-info">
                                <div class="policy-file-type">
                                    <i class="${fileIcon}" style="color: ${fileColor};"></i> ${policy.fileType} (${policy.fileSize})
                                </div>
                                ${downloadBtnHtml}
                            </div>
                        </div>
                    `;
                    
                    // Add download functionality (available to everyone)
                    const downloadBtn = policyItem.querySelector('.policy-download-btn');
                    downloadBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        downloadPolicy(policy);
                    });
                    
                    // Add click to view policy
                    policyItem.addEventListener('click', function() {
                        viewPolicy(policy);
                    });
                    
                    letterGroup.appendChild(policyItem);
                });
                
                policyList.appendChild(letterGroup);
            });
        }
        
        // Download policy file (available to everyone)
        function downloadPolicy(policy) {
            // In a real application, this would initiate a file download
            // For this demo, we'll show a confirmation message
            const fileExt = policy.fileType.toLowerCase();
            const fileName = `${policy.title.replace(/\s+/g, '_')}.${fileExt}`;
            
            alert(`Downloading: ${fileName}\n\nFile: ${policy.fileType} (${policy.fileSize})\n\nIn a real implementation, this would download the file.`);
            
            // Add to recent downloads (for demo purposes)
            addToUploadedFiles({
                name: fileName,
                size: policy.fileSize,
                type: policy.fileType,
                action: 'downloaded'
            });
        }
        
        // View policy
        function viewPolicy(policy) {
            alert(`Opening policy: ${policy.title}\n\nFile: ${policy.fileType} (${policy.fileSize})\nArea: ${policy.area}\nChapter: ${policy.chapter}\n\nIn a real implementation, this would open the policy document in a viewer.`);
        }
        
        // Initialize index page
        function initIndexPage() {
            generateAlphabetNav();
            filterPolicies();
            renderUploadedFiles();
            
            // Add event listeners for filters
            document.getElementById('policySearch').addEventListener('input', filterPolicies);
            document.getElementById('policyArea').addEventListener('change', filterPolicies);
            document.getElementById('policyChapter').addEventListener('change', filterPolicies);
            document.getElementById('policySubChapter').addEventListener('change', filterPolicies);
            document.getElementById('policyPage').addEventListener('change', filterPolicies);
            
            // Initialize file upload functionality (only for admins)
            initFileUpload();
        }
        
        // Initialize file upload
        function initFileUpload() {
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            const uploadBtn = document.getElementById('uploadBtn');
            
            // Click on upload area to trigger file input
            uploadArea.addEventListener('click', function() {
                if (!currentUser || currentUser.role !== 'admin') {
                    alert('You need to login as an administrator to upload files.');
                    document.getElementById('showLogin').click();
                    return;
                }
                fileInput.click();
            });
            
            // Handle file selection
            fileInput.addEventListener('change', function(e) {
                if (!currentUser || currentUser.role !== 'admin') {
                    alert('You need administrator privileges to upload files.');
                    return;
                }
                
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    // Show file names in upload area
                    const fileNames = files.map(f => f.name).join(', ');
                    uploadArea.innerHTML = `
                        <i class="fas fa-file-check"></i>
                        <div class="upload-text">${files.length} file(s) selected</div>
                        <div class="upload-subtext">${fileNames}</div>
                    `;
                    uploadArea.style.borderColor = '#2ecc71';
                    uploadArea.style.backgroundColor = '#f8fff8';
                }
            });
            
            // Handle upload button click
            uploadBtn.addEventListener('click', function() {
                if (!currentUser || currentUser.role !== 'admin') {
                    alert('You need administrator privileges to upload files.');
                    return;
                }
                
                const files = fileInput.files;
                if (files.length === 0) {
                    alert('Please select files to upload first.');
                    return;
                }
                
                // Process each file
                Array.from(files).forEach(file => {
                    // Check file type
                    const fileType = file.name.endsWith('.pdf') ? 'PDF' : 
                                   file.name.endsWith('.docx') ? 'DOCX' : 'Unknown';
                    
                    if (fileType === 'Unknown') {
                        alert(`File "${file.name}" is not a supported format. Please upload .docx or .pdf files.`);
                        return;
                    }
                    
                    // Check file size (10MB limit)
                    if (file.size > 10 * 1024 * 1024) {
                        alert(`File "${file.name}" is too large. Maximum file size is 10MB.`);
                        return;
                    }
                    
                    // Extract policy title from filename (remove extension)
                    const policyTitle = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
                    
                    // Add to uploaded files
                    const newFile = {
                        name: file.name,
                        size: formatFileSize(file.size),
                        type: fileType,
                        date: new Date().toLocaleDateString(),
                        id: Date.now() + Math.random(),
                        uploadedBy: currentUser.name,
                        action: 'uploaded'
                    };
                    
                    uploadedFiles.unshift(newFile); // Add to beginning
                    
                    // Also add to policies list for demo purposes
                    const firstLetter = policyTitle.charAt(0).toUpperCase();
                    policies.push({
                        title: policyTitle,
                        letter: firstLetter,
                        area: "admin",
                        chapter: "4",
                        subChapter: "a",
                        page: "1",
                        fileType: fileType,
                        fileSize: formatFileSize(file.size)
                    });
                });
                
                // Reset file input
                fileInput.value = '';
                uploadArea.innerHTML = `
                    <i class="fas fa-file-upload"></i>
                    <div class="upload-text">Drag & drop files here or click to browse</div>
                    <div class="upload-subtext">Supports .docx and .pdf files up to 10MB</div>
                `;
                uploadArea.style.borderColor = '#0a4d0a';
                uploadArea.style.backgroundColor = 'white';
                
                // Update displayed files and policies
                renderUploadedFiles();
                filterPolicies();
                
                // Show success message
                alert(`Successfully uploaded ${files.length} file(s). They are now available in the "Recently Uploaded Files" section and policy list.`);
            });
            
            // Drag and drop functionality
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                uploadArea.style.borderColor = '#1e7e1e';
                uploadArea.style.backgroundColor = '#f8fff8';
            });
            
            uploadArea.addEventListener('dragleave', function(e) {
                e.preventDefault();
                uploadArea.style.borderColor = '#0a4d0a';
                uploadArea.style.backgroundColor = 'white';
            });
            
            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                
                if (!currentUser || currentUser.role !== 'admin') {
                    alert('You need administrator privileges to upload files.');
                    return;
                }
                
                fileInput.files = e.dataTransfer.files;
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
                
                uploadArea.style.borderColor = '#0a4d0a';
                uploadArea.style.backgroundColor = 'white';
            });
        }
        
        // Render uploaded files
        function renderUploadedFiles() {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            
            if (uploadedFiles.length === 0) {
                fileList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 10px;">No files uploaded yet.</p>';
                return;
            }
            
            // Show only the 5 most recent files
            const recentFiles = uploadedFiles.slice(0, 5);
            
            recentFiles.forEach(file => {
                const fileItem = document.createElement('li');
                fileItem.className = 'file-item';
                
                const fileIcon = file.type === 'PDF' ? 'fas fa-file-pdf' : 'fas fa-file-word';
                const fileColor = file.type === 'PDF' ? '#e74c3c' : '#2c5aa0';
                const actionText = file.action === 'uploaded' ? 'Uploaded by' : 'Downloaded by';
                
                fileItem.innerHTML = `
                    <div class="file-info">
                        <div class="file-icon">
                            <i class="${fileIcon}" style="color: ${fileColor};"></i>
                        </div>
                        <div class="file-details">
                            <h5>${file.name}</h5>
                            <div class="file-size">${file.type} • ${file.size} • ${actionText} ${file.uploadedBy} on ${file.date}</div>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="download-btn" data-id="${file.id}">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                `;
                
                // Add download functionality (available to everyone)
                const downloadBtn = fileItem.querySelector('.download-btn');
                downloadBtn.addEventListener('click', function() {
                    alert(`Downloading: ${file.name}\n\nIn a real implementation, this would download the file.`);
                    
                    // Add to recent downloads
                    addToUploadedFiles({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        action: 'downloaded',
                        uploadedBy: currentUser ? currentUser.name : 'Guest'
                    });
                });
                
                fileList.appendChild(fileItem);
            });
        }
        
        // Add to uploaded files (for demo)
        function addToUploadedFiles(file) {
            const newFile = {
                name: file.name,
                size: file.size,
                type: file.type,
                date: new Date().toLocaleDateString(),
                id: Date.now() + Math.random(),
                uploadedBy: file.uploadedBy || (currentUser ? currentUser.name : 'Guest'),
                action: file.action || 'uploaded'
            };
            
            uploadedFiles.unshift(newFile);
            renderUploadedFiles();
        }
        
        // Show page content
        function showPage(pageId) {
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the selected content section
            const contentSection = document.getElementById(`${pageId}-content`);
            if (contentSection) {
                contentSection.classList.add('active');
            }
            
            // Update breadcrumb
            updateBreadcrumb(pageId);
            
            // If showing index page, initialize it
            if (pageId === 'index') {
                initIndexPage();
            }
        }
        
        // Update breadcrumb
        function updateBreadcrumb(pageId) {
            const breadcrumb = document.getElementById('breadcrumb');
            const pageNames = {
                'home': 'HOME',
                'index': 'POLICY INDEX',
                'accountability': 'ACCOUNTABILITY',
                'policies': 'POLICIES & PROCEDURES',
                'policy-areas': 'POLICY AREAS',
                'glossary': 'GLOSSARY'
            };
            
            if (pageId === 'home') {
                breadcrumb.innerHTML = '<a href="#" data-page="home">HOME</a> / <span>ACCOUNTABILITY SYSTEM POLICY</span>';
            } else {
                breadcrumb.innerHTML = `<a href="#" data-page="home">HOME</a> / <span>${pageNames[pageId] || pageId.toUpperCase()}</span>`;
            }
        }
        
        // Navigation click functionality with badges
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const pageId = this.dataset.page;
                
                // Check if this is the index link
                if (pageId === 'index') {
                    // Set index badge
                    indexBadge.classList.add('index');
                    indexBadge.textContent = 'Index';
                    indexBadge.style.display = 'inline-block';
                }
                
                // Remove active class from all nav items
                document.querySelectorAll('.nav-link').forEach(item => {
                    item.classList.remove('active');
                    const itemBadge = item.querySelector('.nav-badge');
                    if (itemBadge.classList.contains('active') && item !== this) {
                        itemBadge.classList.remove('active');
                        itemBadge.textContent = itemBadge.textContent === 'Active' ? '' : itemBadge.textContent;
                    }
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Set the badge for active page
                const badge = this.querySelector('.nav-badge');
                badge.classList.add('active');
                badge.textContent = 'Active';
                
                // Show the corresponding page content
                showPage(pageId);
                
                // Update current page
                currentPage = pageId;
                
                // Update badge counter
                updateBadgeCount();
            });
        });
        
        // Update badge counter
        function updateBadgeCount() {
            const activeBadges = document.querySelectorAll('.nav-badge:not(:empty)').length;
            document.getElementById('badge-count').textContent = activeBadges;
        }
        
        // Add badges to all items
        document.getElementById('add-badges').addEventListener('click', function() {
            document.querySelectorAll('.nav-badge').forEach((badge, index) => {
                if (!badge.classList.contains('active') && !badge.classList.contains('index')) {
                    badge.textContent = index + 1;
                    badge.style.display = 'inline-block';
                    badge.classList.remove('notification');
                }
            });
            updateBadgeCount();
        });
        
        // Clear all badges except active and index
        document.getElementById('clear-badges').addEventListener('click', function() {
            document.querySelectorAll('.nav-badge').forEach(badge => {
                if (!badge.classList.contains('active') && !badge.classList.contains('index')) {
                    badge.textContent = '';
                    badge.style.display = 'none';
                    badge.classList.remove('notification');
                }
            });
            updateBadgeCount();
        });
        
        // Add random notification badges
        document.getElementById('random-badges').addEventListener('click', function() {
            const notifications = ['New', 'Updated', '!', '3', '5+', 'Alert', 'Hot'];
            document.querySelectorAll('.nav-badge').forEach(badge => {
                if (!badge.classList.contains('active') && !badge.classList.contains('index') && Math.random() > 0.5) {
                    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
                    badge.textContent = randomNotification;
                    badge.style.display = 'inline-block';
                    badge.classList.add('notification');
                }
            });
            updateBadgeCount();
        });
        
        // Open index from button
        document.getElementById('open-index').addEventListener('click', function() {
            // Simulate clicking the index nav item
            document.querySelector('.nav-link[data-page="index"]').click();
        });
        
        // Simple search functionality in header
        document.querySelector('.search-box input').addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    // Navigate to index and search
                    document.querySelector('.nav-link[data-page="index"]').click();
                    setTimeout(() => {
                        document.getElementById('policySearch').value = searchTerm;
                        document.getElementById('policySearch').focus();
                        filterPolicies();
                    }, 100);
                }
            }
        });
        
        // Donate button functionality
        document.querySelector('.donate-btn').addEventListener('click', function() {
            alert('Thank you for your interest in supporting Sudan Sustainability Hub!\n\nIn a real implementation, this would redirect to a donation page.');
        });
        
        // Top navigation functionality
        document.querySelectorAll('.nav-item-top').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const area = this.textContent;
                alert(`Navigating to SSH ${area} section\n\nIn a real implementation, this would show content related to ${area}.`);
            });
        });
        
        // Breadcrumb navigation
        document.querySelectorAll('.breadcrumb a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.dataset.page;
                if (pageId) {
                    // Find and click the corresponding nav link
                    const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
                    if (navLink) {
                        navLink.click();
                    }
                }
            });
        });
        
        // Close modal when clicking outside
        document.getElementById('loginModal').addEventListener('click', function(e) {
            if (e.target === this) {
                document.getElementById('closeLogin').click();
            }
        });
        
        // Initialize badge count
        updateBadgeCount();
