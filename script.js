class ModernDRAssistant {
    constructor() {
        this.currentProcess = null;
        this.currentStep = null;
        this.processData = {};
        this.messages = [];
        
        this.initializeElements();
        this.bindEvents();
        // Hide input section on initial load
        document.querySelector('.input-section').style.display = 'none';
    }

    initializeElements() {
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.chatArea = document.getElementById('chat-area');
        this.messagesContainer = document.getElementById('messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.charCounter = document.getElementById('char-counter');
        this.quickActions = document.getElementById('quick-actions');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.attachBtn = document.getElementById('attach-btn');
        this.imageBtn = document.getElementById('image-btn');
        this.micBtn = document.getElementById('mic-btn');
        this.secondaryMenu = document.getElementById('secondary-menu');
        
        // Create hidden file input for attachments
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.multiple = true;
        this.fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.csv';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);
        
        // Create hidden image input
        this.imageInput = document.createElement('input');
        this.imageInput.type = 'file';
        this.imageInput.accept = 'image/*';
        this.imageInput.style.display = 'none';
        document.body.appendChild(this.imageInput);
        
        this.attachments = [];

        // Voice recognition setup
        this.recognition = null;
        this.isRecognizing = false;
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'en-US';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
        }
    }

    bindEvents() {
        // Process card clicks
        document.querySelectorAll('.prompt-card').forEach(card => {
            card.addEventListener('click', () => {
                const process = card.getAttribute('data-process');
                this.startProcess(process);
            });
        });

        // Send button and enter key
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input validation and auto-resize
        this.chatInput.addEventListener('input', () => {
            this.updateCharCounter();
            this.updateSendButton();
            this.autoResize();
        });

        // Attachment buttons
        this.attachBtn.addEventListener('click', () => this.fileInput.click());
        this.imageBtn.addEventListener('click', () => this.imageInput.click());
        
        // File input change events
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.imageInput.addEventListener('change', (e) => this.handleImageSelect(e));

        // Mic button
        if (this.micBtn && this.recognition) {
            this.micBtn.addEventListener('click', () => this.toggleVoiceInput());
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.chatInput.value = this.chatInput.value
                    ? this.chatInput.value + ' ' + transcript
                    : transcript;
                this.updateCharCounter();
                this.updateSendButton();
                this.autoResize();
            };
            this.recognition.onstart = () => {
                this.isRecognizing = true;
                this.micBtn.classList.add('active');
            };
            this.recognition.onend = () => {
                this.isRecognizing = false;
                this.micBtn.classList.remove('active');
            };
            this.recognition.onerror = () => {
                this.isRecognizing = false;
                this.micBtn.classList.remove('active');
            };
        } else if (this.micBtn) {
            this.micBtn.disabled = true;
            this.micBtn.title = 'Voice input not supported in this browser';
        }

        // Navbar actions
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleNavAction(action, btn);
            });
        });

        // Secondary menu actions
        document.querySelectorAll('.secondary-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleSecondaryAction(action);
            });
        });
    }

    autoResize() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    }

    updateCharCounter() {
        const length = this.chatInput.value.length;
        this.charCounter.textContent = `${length}/1000`;
    }

    updateSendButton() {
        const hasText = this.chatInput.value.trim().length > 0;
        const hasAttachments = this.attachments.length > 0;
        const withinLimit = this.chatInput.value.length <= 1000;
        this.sendBtn.disabled = (!hasText && !hasAttachments) || !withinLimit;
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            if (this.validateFile(file)) {
                this.addAttachment(file);
            }
        });
        event.target.value = ''; // Reset input
    }

    handleImageSelect(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            if (this.validateFile(file)) {
                this.addAttachment(file);
            }
        });
        event.target.value = ''; // Reset input
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];

        if (file.size > maxSize) {
            this.showError('File size must be less than 10MB');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showError('File type not supported');
            return false;
        }

        return true;
    }

    addAttachment(file) {
        const attachment = {
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: this.formatFileSize(file.size),
            type: file.type
        };

        this.attachments.push(attachment);
        this.displayAttachments();
        this.updateSendButton();
    }

    removeAttachment(id) {
        this.attachments = this.attachments.filter(att => att.id !== id);
        this.displayAttachments();
        this.updateSendButton();
    }

    displayAttachments() {
        // Remove existing attachment display
        const existingDisplay = document.querySelector('.attachment-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }

        if (this.attachments.length === 0) return;

        // Create attachment display
        const attachmentDisplay = document.createElement('div');
        attachmentDisplay.className = 'attachment-display';
        
        this.attachments.forEach(attachment => {
            const attachmentItem = document.createElement('div');
            attachmentItem.className = 'attachment-item';
            
            const icon = this.getFileIcon(attachment.type);
            const preview = this.createFilePreview(attachment);
            
            attachmentItem.innerHTML = `
                <div class="attachment-preview">${preview}</div>
                <div class="attachment-info">
                    <div class="attachment-name">${attachment.name}</div>
                    <div class="attachment-size">${attachment.size}</div>
                </div>
                <button class="remove-attachment" data-attachment-id="${attachment.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add event listener for remove button
            const removeBtn = attachmentItem.querySelector('.remove-attachment');
            removeBtn.addEventListener('click', () => this.removeAttachment(attachment.id));
            
            attachmentDisplay.appendChild(attachmentItem);
        });

        // Insert before input container
        const inputContainer = document.querySelector('.input-container');
        inputContainer.parentNode.insertBefore(attachmentDisplay, inputContainer);
    }

    createFilePreview(attachment) {
        if (attachment.type.startsWith('image/')) {
            return `<img src="${URL.createObjectURL(attachment.file)}" alt="${attachment.name}" class="file-preview-image">`;
        } else {
            const icon = this.getFileIcon(attachment.type);
            return `<div class="file-preview-icon">${icon}</div>`;
        }
    }

    getFileIcon(type) {
        const iconMap = {
            'application/pdf': '<i class="fas fa-file-pdf"></i>',
            'application/msword': '<i class="fas fa-file-word"></i>',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '<i class="fas fa-file-word"></i>',
            'text/plain': '<i class="fas fa-file-alt"></i>',
            'image/jpeg': '<i class="fas fa-file-image"></i>',
            'image/jpg': '<i class="fas fa-file-image"></i>',
            'image/png': '<i class="fas fa-file-image"></i>',
            'image/gif': '<i class="fas fa-file-image"></i>',
            'application/vnd.ms-excel': '<i class="fas fa-file-excel"></i>',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '<i class="fas fa-file-excel"></i>',
            'text/csv': '<i class="fas fa-file-csv"></i>'
        };
        return iconMap[type] || '<i class="fas fa-file"></i>';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    handleNavAction(action, btn) {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        if (action === 'home') {
            this.resetApp();
        }
        // Add other nav actions as needed
    }

    handleSecondaryAction(action) {
        // Set the action as the chat input value
        this.chatInput.value = action;
        this.updateSendButton();
        
        // If we're not in assistance process, switch to it first
        if (this.currentProcess !== 'assistance') {
            this.currentProcess = 'assistance';
            this.currentStep = 'choice';
            // Show the secondary menu if it's not visible
            if (this.secondaryMenu.style.display !== 'block') {
                this.secondaryMenu.style.display = 'block';
            }
        }
        
        // Send the message
        this.sendMessage();
    }

    startProcess(processType) {
        this.currentProcess = processType;
        this.currentStep = 'start';
        this.processData = {};
        
        // Handle DR Log navigation
        if (processType === 'drlog') {
            window.location.href = 'drlog.html';
            return;
        }
        
        this.welcomeScreen.style.display = 'none';
        this.chatArea.style.display = 'flex';
        
        // Show/hide secondary menu based on process type
        if (processType === 'assistance') {
            this.secondaryMenu.style.display = 'block';
        } else {
            this.secondaryMenu.style.display = 'none';
        }
        
        this.clearMessages();
        this.processFlow(processType, 'start');
        
        // Show/hide input section based on process type
        if (processType === 'controltower') {
            document.querySelector('.input-section').style.display = 'none';
        } else {
            document.querySelector('.input-section').style.display = '';
        }
    }

    async processFlow(process, step, userInput = null) {
        this.showTyping();
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        this.hideTyping();
        
        const flowMap = {
            feasibility: {
                start: () => {
                    this.addMessage('I\'ll help you with DR Assistance. Let me gather information about your infrastructure.', 'ai');
                    this.currentStep = 'input';
                    this.setQuickActions(['Infrastructure Details', 'Recovery Requirements', 'Budget Info']);
                    this.addMessage('Please provide details about your current infrastructure:', 'ai');
                },
                input: (input) => {
                    this.processData.infrastructure = input;
                    this.addMessage('Analyzing your infrastructure...', 'ai');
                    this.currentStep = 'analysis';
                    setTimeout(() => this.processFlow(process, 'analysis'), 1200);
                },
                analysis: () => {
                    this.addMessage('📊 **Assessment Complete!**\n\n• Feasibility Score: 85%\n• RTO: 4 hours\n• RPO: 1 hour\n• Est. Cost: $50K-75K', 'ai');
                    this.setQuickActions(['Detailed Report', 'Cost Analysis', 'Next Steps', 'New Assessment', 'Back to Main Menu']);
                }
            },
            
            assistance: {
                start: () => {
                    this.addMessage('DR Assistance - How can I help you today?', 'ai');
                    this.setQuickActions(['What is DR Assessment?', 'How do I check ESM status?', 'What are the current exceptions?', 'Show me recent DR history', 'How do I raise a DR ticket?']);
                    this.currentStep = 'choice';
                },
                choice: (input) => {
                    const lowerInput = input.toLowerCase();
                    
                    if (lowerInput.includes('assessment') || lowerInput.includes('feasibility') || lowerInput.includes('what is dr assessment')) {
                        this.currentProcess = 'feasibility';
                        this.currentStep = 'start';
                        this.processFlow('feasibility', 'start');
                    } else if (lowerInput.includes('esm') || lowerInput.includes('query esm') || lowerInput.includes('check esm status')) {
                        this.currentProcess = 'esm';
                        this.currentStep = 'start';
                        this.processFlow('esm', 'start');
                    } else if (lowerInput.includes('exception') || lowerInput.includes('exception list') || lowerInput.includes('current exceptions')) {
                        this.currentProcess = 'exception';
                        this.currentStep = 'start';
                        this.processFlow('exception', 'start');
                    } else if (lowerInput.includes('historical') || lowerInput.includes('history') || lowerInput.includes('recent dr history')) {
                        this.currentProcess = 'historical';
                        this.currentStep = 'start';
                        this.processFlow('historical', 'start');
                    } else if (lowerInput.includes('raise') || lowerInput.includes('ticket') || lowerInput.includes('help in raising dr') || lowerInput.includes('raise a dr ticket')) {
                        this.currentStep = 'raise_dr';
                        this.addMessage('Creating DR ticket. Please provide the below details \n 1. ESN \n 2. Part Name \n 3.Location \n 4.Damage', 'ai');
                        this.setQuickActions(['System Outage', 'Data Loss', 'Security Breach', 'Back to Main Menu']);
                    } else if (lowerInput.includes('sop')) {
                        this.addMessage('📋 **DR Standard Operating Procedures:**\n\n1. Incident Detection\n2. Team Activation\n3. Recovery Process\n4. Validation\n5. Documentation', 'ai');
                        this.setQuickActions(['Download SOP', 'Training', 'Contact Team', 'Back to Main Menu']);
                    } else {
                        this.addMessage('I\'m here to help with DR processes. What do you need?', 'ai');
                        this.setQuickActions(['What is DR Assessment?', 'How do I check ESM status?', 'What are the current exceptions?', 'Show me recent DR history', 'How do I raise a DR ticket?']);
                    }
                },
                raise_dr: (input) => {
                    const ticketId = `DR-${Date.now().toString().slice(-6)}`;
                    this.addMessage(`🎫 **Ticket Created: ${ticketId}**\n\nThe forms has been populated with the details you provided. Please review and submit the form.`, 'ai');
                    this.addMessageWithButton('View Ticket in CMS', '/cms/index.html');
                    this.setQuickActions(['Track Status', 'Update Details', 'Contact Team']);
                    
                    // Add follow-up message after 5 seconds
                    setTimeout(() => {
                        this.addMessage('Would you like to create another DR ticket?', 'ai');
                        this.setQuickActions(['Yes, Create Another', 'No, I\'m Done', 'Track Current Ticket']);
                    }, 5000);
                }
            },
            
            exception: {
                start: () => {
                    this.addMessage('Exception List Management - What do you need?', 'ai');
                    this.setQuickActions(['View Exceptions', 'Add New Exception']);
                    this.currentStep = 'choice';
                },
                choice: (input) => {
                    const lowerInput = input.toLowerCase();
                    if (lowerInput.includes('view')) {
                        this.addMessage('📋 **Current Exceptions:**\n\n• Total: 23\n• Active: 18\n• Critical: 3\n• Updated: Today', 'ai');
                        this.setQuickActions(['Filter Results', 'Export Data', 'Details', 'Back to Main Menu']);
                    } else {
                        this.addMessage('Adding new exception. Please provide details:', 'ai');
                        this.setQuickActions(['System Exception', 'Process Exception', 'Security Exception', 'Back to Main Menu']);
                    }
                }
            },
            
            esm: {
                start: () => {
                    this.addMessage('Please provide the ESM# or Part Name and Engine Model', 'ai');
                    this.setQuickActions(['Service Status', 'Incidents', 'Performance']);
                    this.currentStep = 'input';
                },
                input: (input) => {
                    this.addMessage(`🔍 **Quick Summary of the ESM:**\n\n This Procedure gives instructions to do a visual examination and servicability/repairability of the forward outer seal focusing on the following areas: \n <b>Inducer Holes, Inducer Pad, Impeller Vanes, Seal wire groove, Seal teeth, Rabbets, Bore Hub etc  </b>`, 'ai');
                    this.setQuickActions(['Detailed View', 'Export', 'Set Alerts', 'Back to Main Menu']);
                }
            },
            
            historical: {
                start: () => {
                    this.addMessage('Historical DR Data - Specify your search:', 'ai');
                    this.setQuickActions(['Last 30 Days', 'By System', 'By Severity']);
                    this.currentStep = 'input';
                },
                input: (input) => {
                    // Historical Analysis message
                    // Create a container div for message-content
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message ai';
                    const avatar = document.createElement('div');
                    avatar.className = 'message-avatar';
                    avatar.textContent = 'AI';
                    const messageContent = document.createElement('div');
                    messageContent.className = 'message-content';
                    // Add the analysis text
                    const textDiv = document.createElement('div');
                    textDiv.innerHTML = `📊 <b>Historical Analysis:</b><br><ul style=\"margin:0 0 0 1em;padding:0;\">
<li><b>Total DR:</b> 72</li>
<li><b>Priority Type:</b> Work Stoppage - 20, Routine - 52</li>
<li><b>Record Type:</b> SDR - 54, CDR - 18</li>
<li><b>Monthly DRs (Jan–May):</b> Jan 7, Feb 15, Mar 18, Apr 17, May 15</li>
</ul>`;
                    messageContent.appendChild(textDiv);
                    // Add the chart container
                    const chartContainer = document.createElement('div');
                    chartContainer.className = 'historical-charts';
                    chartContainer.innerHTML = `
                        <div style=\"display:flex;flex-wrap:wrap;gap:24px;margin-top:16px;justify-content:center;\">
                            <canvas id=\"priorityChart\" width=\"220\" height=\"180\"></canvas>
                            <canvas id=\"recordChart\" width=\"220\" height=\"180\"></canvas>
                            <canvas id=\"monthlyChart\" width=\"340\" height=\"180\"></canvas>
                        </div>
                    `;
                    messageContent.appendChild(chartContainer);
                    messageDiv.appendChild(avatar);
                    messageDiv.appendChild(messageContent);
                    this.messagesContainer.appendChild(messageDiv);
                    this.scrollToBottom();
                    setTimeout(() => this.renderHistoricalCharts(), 0);
                    this.setQuickActions(['Detailed Report', 'Trends', 'Export', 'Back to Main Menu']);
                }
            },
            
            raising: {
                start: () => {
                    this.addMessage('Raising DR - How can I help you?', 'ai');
                    this.setQuickActions(['SOP', 'Help In Raising DR']);
                    this.currentStep = 'choice';
                },
                choice: (input) => {
                    const lowerInput = input.toLowerCase();
                    
                    if (lowerInput.includes('sop')) {
                        this.addMessage('📋 **DR Standard Operating Procedures:**\n\n1. Incident Detection\n2. Team Activation\n3. Recovery Process\n4. Validation\n5. Documentation', 'ai');
                        this.setQuickActions(['Download SOP', 'Training', 'Contact Team', 'Back to Main Menu']);
                    } else if (lowerInput.includes('help') || lowerInput.includes('raising')) {
                        this.currentStep = 'raise_dr';
                        this.addMessage('Creating DR ticket. Please provide the below details \n 1. ESN \n 2. Part Name \n 3.Location \n 4.Damage', 'ai');
                        this.setQuickActions(['System Outage', 'Data Loss', 'Security Breach', 'Back to Main Menu']);
                    } else {
                        this.addMessage('I\'m here to help with raising DR tickets. What do you need?', 'ai');
                        this.setQuickActions(['SOP', 'Help In Raising DR', 'Back to Main Menu']);
                    }
                },
                raise_dr: (input) => {
                    const ticketId = `DR-${Date.now().toString().slice(-6)}`;
                    this.addMessage(`🎫 **Ticket Created: ${ticketId}**\n\nThe forms has been populated with the details you provided. Please review and submit the form.`, 'ai');
                    this.addMessageWithButton('View Ticket in CMS', '/cms/index.html');
                    this.setQuickActions(['Track Status', 'Update Details', 'Contact Team', 'Back to Main Menu']);
                    
                    // Add follow-up message after 5 seconds
                    setTimeout(() => {
                        this.addMessage('Would you like to create another DR ticket?', 'ai');
                        this.setQuickActions(['Yes, Create Another', 'No, I\'m Done', 'Track Current Ticket', 'Back to Main Menu']);
                    }, 5000);
                }
            },
            
            drlog: {
                start: () => {
                    this.addMessage('DR Log - What would you like to view?', 'ai');
                    this.setQuickActions(['My Queue', 'Overall Queue', 'Specific DR']);
                    this.currentStep = 'choice';
                },
                choice: (input) => {
                    const lowerInput = input.toLowerCase();
                    
                    if (lowerInput.includes('my queue')) {
                        this.addMessage('📋 **My Queue:**\n\n• Total DRs: 5\n• High Priority: 2\n• Medium Priority: 2\n• Low Priority: 1\n• Average Age: 2.3 days', 'ai');
                        this.setQuickActions(['View Details', 'Update Status', 'Export', 'Back to Main Menu']);
                    } else if (lowerInput.includes('overall queue')) {
                        this.addMessage('📊 **Overall Queue Status:**\n\n• Total Active DRs: 47\n• Open: 32\n• In Progress: 12\n• Pending Review: 3\n• Average Resolution Time: 4.2 days', 'ai');
                        this.setQuickActions(['Filter by Priority', 'Filter by System', 'Export Report', 'Back to Main Menu']);
                    } else if (lowerInput.includes('specific dr')) {
                        this.addMessage('Please provide the DR number or ticket ID:', 'ai');
                        this.setQuickActions(['DR-2024-001', 'DR-2024-002', 'DR-2024-003', 'Back to Main Menu']);
                        this.currentStep = 'search';
                    } else {
                        this.addMessage('I can help you view DR logs. What would you like to see?', 'ai');
                        this.setQuickActions(['My Queue', 'Overall Queue', 'Specific DR', 'Back to Main Menu']);
                    }
                },
                search: (input) => {
                    this.addMessage(`🔍 **DR Details for ${input}:**\n\n• Status: In Progress\n• Priority: High\n• Created: 2024-01-15\n• Assigned To: John Smith\n• Description: System outage affecting production\n• Last Updated: 2024-01-16 14:30`, 'ai');
                    this.setQuickActions(['Update Status', 'Add Comment', 'View History', 'Back to Main Menu']);
                }
            },
            
            controltower: {
                start: () => {
                    this.addMessage('Control Tower - DR Overview Dashboard', 'ai');
                    this.setQuickActions(['All DRs Overview', 'Open DRs', 'Closed DRs', 'Delayed DRs']);
                    this.currentStep = 'choice';
                },
                choice: (input) => {
                    const lowerInput = input.toLowerCase();
                    
                    if (lowerInput.includes('all drs') || lowerInput.includes('overview')) {
                        this.addMessage('📊 **All DRs Overview:**\n\n• Total DRs: 156\n• Open: 47\n• Closed: 109\n• Delayed: 8\n• Average Resolution: 3.8 days\n• SLA Compliance: 94%', 'ai');
                        this.setQuickActions(['Detailed Report', 'Export Data', 'Filter Options', 'Back to Main Menu']);
                    } else if (lowerInput.includes('open drs')) {
                        this.addMessage('🔴 **Open DRs (47 total):**\n\n• High Priority: 12\n• Medium Priority: 23\n• Low Priority: 12\n• Critical: 3\n• Average Age: 2.1 days', 'ai');
                        this.setQuickActions(['View Details', 'Assign Resources', 'Update Status', 'Back to Main Menu']);
                    } else if (lowerInput.includes('closed drs')) {
                        this.addMessage('🟢 **Closed DRs (109 total):**\n\n• This Month: 23\n• Last Month: 31\n• Average Resolution: 3.2 days\n• SLA Met: 98%', 'ai');
                        this.setQuickActions(['View Report', 'Export Data', 'Trends Analysis', 'Back to Main Menu']);
                    } else if (lowerInput.includes('delayed drs')) {
                        this.addMessage('⚠️ **Delayed DRs (8 total):**\n\n• DR-2024-015: Resource constraints (2 days overdue)\n• DR-2024-023: Vendor dependency (1 day overdue)\n• DR-2024-031: Technical complexity (3 days overdue)\n• DR-2024-042: Approval pending (1 day overdue)', 'ai');
                        this.setQuickActions(['View Details', 'Escalate', 'Update Timeline', 'Back to Main Menu']);
                    } else {
                        this.addMessage('I can provide an overview of all DRs. What would you like to see?', 'ai');
                        this.setQuickActions(['All DRs Overview', 'Open DRs', 'Closed DRs', 'Delayed DRs', 'Back to Main Menu']);
                    }
                }
            }
        };

        if (flowMap[process] && flowMap[process][step]) {
            flowMap[process][step](userInput);
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        const hasAttachments = this.attachments.length > 0;
        
        if (!message && !hasAttachments) return;

        // If we're on the home screen, start a general conversation
        if (this.welcomeScreen.style.display !== 'none') {
            this.welcomeScreen.style.display = 'none';
            this.chatArea.style.display = 'flex';
            this.clearMessages();
        }

        this.addMessage(message, 'user', this.attachments);
        this.chatInput.value = '';
        this.attachments = [];
        this.displayAttachments();
        this.sendBtn.disabled = true;
        this.updateCharCounter();
        this.autoResize();

        // Process the message
        if (this.currentProcess && this.currentStep) {
            await this.processFlow(this.currentProcess, this.currentStep, message);
        } else {
            // Handle general queries when no specific process is active
            await this.handleGeneralQuery(message);
        }
    }

    async handleGeneralQuery(message) {
        this.showTyping();
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.hideTyping();

        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('yes, create new dr') || lowerMessage.includes('create new dr')) {
            this.currentProcess = 'assistance';
            this.currentStep = 'start';
            this.secondaryMenu.style.display = 'block';
            this.processFlow('assistance', 'start');
        } else if (lowerMessage.includes('no, i\'m done') || lowerMessage.includes('i\'m done')) {
            this.addMessage('Thank you for using the DR Assistant. Have a great day!', 'ai');
            this.setQuickActions(['Start New Session', 'Home']);
        } else if (lowerMessage.includes('start new session')) {
            this.resetApp();
        } else if (lowerMessage.includes('home')) {
            this.resetApp();
        } else if (lowerMessage.includes('back to main menu') || lowerMessage.includes('main menu')) {
            this.currentProcess = 'assistance';
            this.currentStep = 'start';
            this.secondaryMenu.style.display = 'block';
            this.processFlow('assistance', 'start');
        } else if (lowerMessage.includes('feasibility') || lowerMessage.includes('assessment') || lowerMessage.includes('esm') || lowerMessage.includes('exception') || lowerMessage.includes('historical') || lowerMessage.includes('history') || lowerMessage.includes('assistance') || lowerMessage.includes('help') || lowerMessage.includes('sop')) {
            this.currentProcess = 'assistance';
            this.currentStep = 'start';
            this.secondaryMenu.style.display = 'block';
            this.processFlow('assistance', 'start');
        } else if (lowerMessage.includes('raising') || lowerMessage.includes('raise dr') || lowerMessage.includes('sop')) {
            this.currentProcess = 'raising';
            this.currentStep = 'start';
            this.processFlow('raising', 'start');
        } else if (lowerMessage.includes('dr log') || lowerMessage.includes('queue') || lowerMessage.includes('my queue') || lowerMessage.includes('overall queue') || lowerMessage.includes('specific dr')) {
            this.currentProcess = 'drlog';
            this.currentStep = 'start';
            this.processFlow('drlog', 'start');
        } else if (lowerMessage.includes('control tower') || lowerMessage.includes('overview') || lowerMessage.includes('open drs') || lowerMessage.includes('closed drs') || lowerMessage.includes('delayed drs')) {
            this.currentProcess = 'controltower';
            this.currentStep = 'start';
            this.processFlow('controltower', 'start');
        } else {
            this.addMessage('I can help you with DR processes. Please choose from:\n\n• DR Assistance\n• Raising DR\n• DR Log\n• Control Tower\n\nWhat would you like to know about?', 'ai');
            this.setQuickActions(['DR Assistance', 'Raising DR', 'DR Log', 'Control Tower']);
        }
    }

    addMessage(content, sender, attachments = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'J' : 'AI';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Add text content
        if (content) {
            const textDiv = document.createElement('div');
            textDiv.innerHTML = content.replace(/\n/g, '<br>');
            messageContent.appendChild(textDiv);
        }
        
        // Add attachments if any
        if (attachments && attachments.length > 0) {
            const attachmentsDiv = document.createElement('div');
            attachmentsDiv.className = 'message-attachments';
            
            attachments.forEach(attachment => {
                const attachmentDiv = document.createElement('div');
                attachmentDiv.className = 'message-attachment';
                
                if (attachment.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(attachment.file);
                    img.alt = attachment.name;
                    img.className = 'attachment-image';
                    attachmentDiv.appendChild(img);
                } else {
                    const fileIcon = document.createElement('div');
                    fileIcon.className = 'attachment-file-icon';
                    fileIcon.innerHTML = this.getFileIcon(attachment.type);
                    attachmentDiv.appendChild(fileIcon);
                }
                
                const fileInfo = document.createElement('div');
                fileInfo.className = 'attachment-file-info';
                fileInfo.innerHTML = `
                    <div class="attachment-file-name">${attachment.name}</div>
                    <div class="attachment-file-size">${attachment.size}</div>
                `;
                attachmentDiv.appendChild(fileInfo);
                
                attachmentsDiv.appendChild(attachmentDiv);
            });
            
            messageContent.appendChild(attachmentsDiv);
        }
        
        // Add speaker button for AI messages
        // if (sender === 'ai' && content) {
        //     const speakBtn = document.createElement('button');
        //     speakBtn.className = 'speak-btn';
        //     speakBtn.title = 'Read aloud';
        //     speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        //     speakBtn.onclick = () => this.speakText(this.stripHtml(content));
        //     messageContent.appendChild(speakBtn);
        // }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addMessageWithButton(buttonText, buttonUrl) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'AI';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const button = document.createElement('button');
        button.className = 'cms-redirect-btn';
        button.textContent = buttonText;
        button.onclick = () => {
            // Fix the path for local file system
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            const fullUrl = basePath + buttonUrl;
            window.open(fullUrl, '_blank');
        };
        
        messageContent.appendChild(button);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    setQuickActions(actions) {
        this.quickActions.innerHTML = '';
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'quick-btn';
            btn.textContent = action;
            btn.onclick = () => {
                this.chatInput.value = action;
                this.updateSendButton();
                this.sendMessage();
            };
            this.quickActions.appendChild(btn);
        });
    }

    showTyping() {
        // Remove any existing typing indicator
        this.hideTyping();
        // Create a typing-indicator message bubble
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">AI</div>
            <div>
                Processing...
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingDiv = this.messagesContainer.querySelector('.typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    clearMessages() {
        this.messagesContainer.innerHTML = '';
    }

    resetApp() {
        this.currentProcess = null;
        this.currentStep = null;
        this.processData = {};
        this.attachments = [];
        this.displayAttachments();
        this.chatArea.style.display = 'none';
        this.welcomeScreen.style.display = 'flex';
        this.secondaryMenu.style.display = 'none';
        this.chatInput.value = '';
        this.quickActions.innerHTML = '';
        this.updateCharCounter();
        this.updateSendButton();
        // Hide input section on homepage
        document.querySelector('.input-section').style.display = 'none';
    }

    toggleVoiceInput() {
        if (!this.recognition) return;
        if (this.isRecognizing) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    speakText(text) {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in this browser.');
            return;
        }
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }

    stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    renderHistoricalCharts() {
        // Priority Type Pie Chart
        new Chart(document.getElementById('priorityChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Routine', 'Work Stoppage'],
                datasets: [{
                    label: 'Cases',
                    data: [52, 20],
                    backgroundColor: ['#0066cc', '#ff6600']
                }]
            },
            options: {
                plugins: {
                    legend: { display: true, position: 'bottom' },
                    title: { display: true, text: 'Priority Type (2025)', font: { size: 16 } },
                    tooltip: { enabled: true, callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } }
                },
                responsive: false
            }
        });
        // Record Type Bar Chart
        new Chart(document.getElementById('recordChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['SDR', 'CDR'],
                datasets: [{
                    label: 'Cases',
                    data: [54, 18],
                    backgroundColor: ['#0099ff', '#ff9900']
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Record Type (2025)', font: { size: 16 } },
                    tooltip: { enabled: true, callbacks: { label: ctx => `Cases: ${ctx.parsed.y}` } }
                },
                scales: {
                    x: { title: { display: true, text: 'Type' } },
                    y: { beginAtZero: true, title: { display: true, text: 'Cases' }, ticks: { stepSize: 5 } }
                },
                responsive: false
            }
        });
        // Monthly DRs Line Chart
        new Chart(document.getElementById('monthlyChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'DRs',
                    data: [7, 15, 18, 17, 15],
                    backgroundColor: 'rgba(16,185,129,0.15)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    pointBackgroundColor: '#10b981',
                    pointRadius: 4,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Monthly DRs (2025)', font: { size: 16 } },
                    tooltip: { enabled: true, callbacks: { label: ctx => `DRs: ${ctx.parsed.y}` } }
                },
                scales: {
                    x: { title: { display: true, text: 'Month' } },
                    y: { beginAtZero: true, title: { display: true, text: 'DRs' }, ticks: { stepSize: 5 } }
                },
                responsive: false
            }
        });
    }
}

// Initialize the application
const app = new ModernDRAssistant();