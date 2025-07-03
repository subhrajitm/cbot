class ModernDRAssistant {
    constructor() {
        this.currentProcess = null;
        this.currentStep = null;
        this.processData = {};
        this.messages = [];
        
        this.initializeElements();
        this.bindEvents();
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

        // Navbar actions
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleNavAction(action, btn);
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
        const withinLimit = this.chatInput.value.length <= 1000;
        this.sendBtn.disabled = !hasText || !withinLimit;
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

    startProcess(processType) {
        this.currentProcess = processType;
        this.currentStep = 'start';
        this.processData = {};
        
        this.welcomeScreen.style.display = 'none';
        this.chatArea.style.display = 'flex';
        
        this.clearMessages();
        this.processFlow(processType, 'start');
    }

    async processFlow(process, step, userInput = null) {
        this.showTyping();
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        this.hideTyping();
        
        const flowMap = {
            feasibility: {
                start: () => {
                    this.addMessage('I\'ll help you with DR Feasibility Assessment. Let me gather information about your infrastructure.', 'ai');
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
                    this.setQuickActions(['Detailed Report', 'Cost Analysis', 'Next Steps', 'New Assessment']);
                }
            },
            
            assistance: {
                start: () => {
                    this.addMessage('DR Assistance - How can I help you?', 'ai');
                    this.setQuickActions(['SOP Procedures', 'Raise DR Ticket', 'General Help']);
                    this.currentStep = 'choice';
                },
                choice: (input) => {
                    if (input.toLowerCase().includes('sop')) {
                        this.addMessage('📋 **DR Standard Operating Procedures:**\n\n1. Incident Detection\n2. Team Activation\n3. Recovery Process\n4. Validation\n5. Documentation', 'ai');
                        this.setQuickActions(['Download SOP', 'Training', 'Contact Team']);
                    } else if (input.toLowerCase().includes('raise')) {
                        this.currentStep = 'raise_dr';
                        this.addMessage('Creating DR ticket. Please provide the below details \n 1. ESN \n 2. Part Name \n 3.Location \n 4.Damage', 'ai');
                        this.setQuickActions(['System Outage', 'Data Loss', 'Security Breach']);
                    } else {
                        this.addMessage('I\'m here to help with DR processes. What do you need?', 'ai');
                        this.setQuickActions(['Recovery Steps', 'Team Contacts', 'Escalation']);
                    }
                },
                raise_dr: (input) => {
                    const ticketId = `DR-${Date.now().toString().slice(-6)}`;
                    this.addMessage(`🎫 **Ticket Created: ${ticketId}**\n\nThe forms has been populated with the details you provided. Please review and submit the form.`, 'ai');
                    this.addMessageWithButton('View Ticket in CMS', '/cms/index.html');
                    this.setQuickActions(['Track Status', 'Update Details', 'Contact Team']);
                }
            },
            
            exception: {
                start: () => {
                    this.addMessage('Exception List Management - What do you need?', 'ai');
                    this.setQuickActions(['View Exceptions', 'Add New Exception']);
                    this.currentStep = 'choice';
                },
                choice: (input) => {
                    if (input.toLowerCase().includes('view')) {
                        this.addMessage('📋 **Current Exceptions:**\n\n• Total: 23\n• Active: 18\n• Critical: 3\n• Updated: Today', 'ai');
                        this.setQuickActions(['Filter Results', 'Export Data', 'Details']);
                    } else {
                        this.addMessage('Adding new exception. Please provide details:', 'ai');
                        this.setQuickActions(['System Exception', 'Process Exception', 'Security Exception']);
                    }
                }
            },
            
            esm: {
                start: () => {
                    this.addMessage('ESM Query - What information do you need?', 'ai');
                    this.setQuickActions(['Service Status', 'Incidents', 'Performance']);
                    this.currentStep = 'input';
                },
                input: (input) => {
                    this.addMessage(`🔍 **ESM Results:**\n\n• Availability: 99.8%\n• Active Issues: 2\n• Performance: 94%\n• Updated: ${new Date().toLocaleTimeString()}`, 'ai');
                    this.setQuickActions(['Detailed View', 'Export', 'Set Alerts']);
                }
            },
            
            historical: {
                start: () => {
                    this.addMessage('Historical DR Data - Specify your search:', 'ai');
                    this.setQuickActions(['Last 30 Days', 'By System', 'By Severity']);
                    this.currentStep = 'input';
                },
                input: (input) => {
                    this.addMessage(`📊 **Historical Analysis:**\n\n• Total DRs: 12\n• Success Rate: 92%\n• Avg Recovery: 2.5h\n• Trend: Improving`, 'ai');
                    this.setQuickActions(['Detailed Report', 'Trends', 'Export']);
                }
            }
        };

        if (flowMap[process] && flowMap[process][step]) {
            flowMap[process][step](userInput);
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // If we're on the home screen, start a general conversation
        if (this.welcomeScreen.style.display !== 'none') {
            this.welcomeScreen.style.display = 'none';
            this.chatArea.style.display = 'flex';
            this.clearMessages();
        }

        this.addMessage(message, 'user');
        this.chatInput.value = '';
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
            this.processFlow('assistance', 'start');
        } else if (lowerMessage.includes('no, i\'m done') || lowerMessage.includes('i\'m done')) {
            this.addMessage('Thank you for using the DR Assistant. Have a great day!', 'ai');
            this.setQuickActions(['Start New Session', 'Home']);
        } else if (lowerMessage.includes('start new session')) {
            this.resetApp();
        } else if (lowerMessage.includes('home')) {
            this.resetApp();
        } else if (lowerMessage.includes('feasibility') || lowerMessage.includes('assessment')) {
            this.currentProcess = 'feasibility';
            this.currentStep = 'start';
            this.processFlow('feasibility', 'start');
        } else if (lowerMessage.includes('assistance') || lowerMessage.includes('help') || lowerMessage.includes('sop')) {
            this.currentProcess = 'assistance';
            this.currentStep = 'start';
            this.processFlow('assistance', 'start');
        } else if (lowerMessage.includes('exception')) {
            this.currentProcess = 'exception';
            this.currentStep = 'start';
            this.processFlow('exception', 'start');
        } else if (lowerMessage.includes('esm')) {
            this.currentProcess = 'esm';
            this.currentStep = 'start';
            this.processFlow('esm', 'start');
        } else if (lowerMessage.includes('historical')) {
            this.currentProcess = 'historical';
            this.currentStep = 'start';
            this.processFlow('historical', 'start');
        } else {
            this.addMessage('I can help you with DR processes. Please choose from:\n\n• DR Feasibility Assessment\n• DR Assistance\n• Exception List Queries\n• ESM Queries\n• Historical DR Data\n\nWhat would you like to know about?', 'ai');
            this.setQuickActions(['Feasibility Assessment', 'DR Assistance', 'Exception List', 'ESM Query', 'Historical Data']);
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'J' : 'AI';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content.replace(/\n/g, '<br>');
        
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
            window.open(buttonUrl, '_blank');
        };
        
        messageContent.appendChild(button);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add delayed message after 10 seconds
        setTimeout(() => {
            this.addMessage('Would you like to create another DR ticket?', 'ai');
            this.setQuickActions(['Yes, Create New DR', 'No, I\'m Done']);
        }, 5000);
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
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    clearMessages() {
        this.messagesContainer.innerHTML = '<div class="typing-indicator" id="typing-indicator"><div class="message-avatar">AI</div><div>Processing...<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div></div>';
        this.typingIndicator = document.getElementById('typing-indicator');
    }

    resetApp() {
        this.currentProcess = null;
        this.currentStep = null;
        this.processData = {};
        this.chatArea.style.display = 'none';
        this.welcomeScreen.style.display = 'flex';
        this.chatInput.value = '';
        this.quickActions.innerHTML = '';
        this.updateCharCounter();
        this.updateSendButton();
    }
}

// Initialize the application
const app = new ModernDRAssistant();