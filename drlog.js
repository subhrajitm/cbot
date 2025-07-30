// Global variables
let casesData = [];
let filteredData = {
    'all': [],
    'categorization': [],
    'design-engineer': [],
    'engineer-reviewer': [],
    'engineer-approver': [],
    'customer': [],
    'work-stoppage': []
};

// Pagination functionality
const defaultItemsPerPage = 5;
const paginationState = {
    'all': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'categorization': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'design-engineer': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'engineer-reviewer': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'engineer-approver': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'customer': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage },
    'work-stoppage': { currentPage: 1, totalItems: 0, itemsPerPage: defaultItemsPerPage }
};

// Load data from JSON file
async function loadCasesData() {
    try {
        const response = await fetch('data/cases.json');
        const data = await response.json();
        casesData = data.cases;
        
        // Filter data for each tab
        filterDataByStage();
        
        // Initialize pagination for all tabs
        Object.keys(paginationState).forEach(tabId => {
            paginationState[tabId].totalItems = filteredData[tabId].length;
            initializePagination(tabId);
        });
        
        // Update tab badges
        updateTabBadges();
        
        // Initialize timeline for first case
        if (casesData.length > 0) {
            updateTimelineForCase(casesData[0]);
        }
        
        // Initialize rows per page dropdowns
        initializeRowsPerPageDropdowns();
        
    } catch (error) {
        console.error('Error loading cases data:', error);
    }
}

// Initialize rows per page dropdowns
function initializeRowsPerPageDropdowns() {
    Object.keys(paginationState).forEach(tabId => {
        const select = document.getElementById(`${tabId}-rows-per-page`);
        if (select) {
            // Set the current value
            select.value = paginationState[tabId].itemsPerPage;
            
            // Add change event listener
            select.addEventListener('change', function() {
                const newItemsPerPage = parseInt(this.value);
                paginationState[tabId].itemsPerPage = newItemsPerPage;
                paginationState[tabId].currentPage = 1; // Reset to first page
                initializePagination(tabId);
            });
        }
    });
}

// Filter data by current stage
function filterDataByStage() {
    filteredData['all'] = casesData;
    filteredData['categorization'] = casesData.filter(caseItem => caseItem.currentStage === 'Categorization');
    filteredData['design-engineer'] = casesData.filter(caseItem => caseItem.currentStage === 'Design Engineer');
    filteredData['engineer-reviewer'] = casesData.filter(caseItem => caseItem.currentStage === 'Engineer Reviewer');
    filteredData['engineer-approver'] = casesData.filter(caseItem => caseItem.currentStage === 'Engineer Approver');
    filteredData['customer'] = casesData.filter(caseItem => caseItem.currentStage === 'Customer Approval');
    filteredData['work-stoppage'] = casesData.filter(caseItem => caseItem.priority === 'Work Stoppage');
}

// Update tab badges with counts
function updateTabBadges() {
    const tabBadges = {
        'all': filteredData['all'].length,
        'categorization': filteredData['categorization'].length,
        'design-engineer': filteredData['design-engineer'].length,
        'engineer-reviewer': filteredData['engineer-reviewer'].length,
        'engineer-approver': filteredData['engineer-approver'].length,
        'customer': filteredData['customer'].length,
        'work-stoppage': filteredData['work-stoppage'].length
    };
    
    Object.keys(tabBadges).forEach(tabId => {
        const badge = document.querySelector(`#${tabId}-tab .badge`);
        if (badge) {
            badge.textContent = tabBadges[tabId];
        }
    });
}

// Create table row from case data
function createTableRow(caseItem) {
    const row = document.createElement('tr');
    
    // Add click event to highlight row and update timeline
    row.addEventListener('click', () => {
            // Remove highlight from all rows
        document.querySelectorAll('.case-table tbody tr').forEach(r => r.classList.remove('highlighted'));
        // Add highlight to clicked row
        row.classList.add('highlighted');
        // Update timeline for this case
        updateTimelineForCase(caseItem);
    });
    
    // Create priority badge class
    const priorityClass = caseItem.priority === 'Work Stoppage' ? 'priority-work-stoppage' : 'priority-routine';
    
    row.innerHTML = `
        <td>${caseItem.caseNumber}</td>
        <td>${caseItem.esn}</td>
        <td>${caseItem.type}</td>
        <td><span class="priority-badge ${priorityClass}">${caseItem.priority}</span></td>
        <td>${caseItem.engineModel}</td>
        <td>${caseItem.ata}</td>
        <td>${caseItem.partName}</td>
        <td>${caseItem.title}</td>
        <td>${caseItem.currentStage}</td>
        <td>${caseItem.openDate}</td>
        <td>${caseItem.categorization || ''}</td>
        <td>${caseItem.designEngineer || ''}</td>
        <td>${caseItem.engineerReviewer || ''}</td>
        <td>${caseItem.engineerApprover || ''}</td>
        <td>${caseItem.customerApproval || ''}</td>
    `;
    
    return row;
}

// Populate table with data
function populateTable(tabId, data) {
    const tbody = document.getElementById(`${tabId}-tbody`);
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add new rows
    data.forEach(caseItem => {
        const row = createTableRow(caseItem);
        tbody.appendChild(row);
    });
}

// Initialize pagination for a tab
function initializePagination(tabId) {
    const currentPage = paginationState[tabId].currentPage;
    const totalItems = paginationState[tabId].totalItems;
    const itemsPerPage = paginationState[tabId].itemsPerPage;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Update pagination info
    updatePaginationInfo(tabId, currentPage, totalPages);
    
    // Update page buttons
    updatePageButtons(tabId, currentPage, totalPages);
    
    // Update navigation buttons
    updateNavigationButtons(tabId, currentPage, totalPages);
    
    // Update table rows
    updateTableRows(tabId, currentPage);
}

// Update pagination info text
function updatePaginationInfo(tabId, currentPage, totalPages) {
    const itemsPerPage = paginationState[tabId].itemsPerPage;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, paginationState[tabId].totalItems);
    const total = paginationState[tabId].totalItems;
    
    const startSpan = document.getElementById(`${tabId}-start`);
    const endSpan = document.getElementById(`${tabId}-end`);
    const totalSpan = document.getElementById(`${tabId}-total`);
    
    if (startSpan) startSpan.textContent = start;
    if (endSpan) endSpan.textContent = end;
    if (totalSpan) totalSpan.textContent = total;
}

// Update page number buttons
function updatePageButtons(tabId, currentPage, totalPages) {
    const pagesContainer = document.getElementById(`${tabId}-pages`);
    if (!pagesContainer) return;
    
    pagesContainer.innerHTML = '';
    
    // Show max 5 page buttons at a time
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page button if not visible
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.setAttribute('data-page', 1);
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => goToPage(tabId, 1));
        pagesContainer.appendChild(firstBtn);
        
        // Add ellipsis if there's a gap
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pagesContainer.appendChild(ellipsis);
        }
    }
    
    // Add visible page buttons
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        button.setAttribute('data-page', i);
        button.textContent = i;
        button.addEventListener('click', () => goToPage(tabId, i));
        pagesContainer.appendChild(button);
    }
    
    // Add last page button if not visible
    if (endPage < totalPages) {
        // Add ellipsis if there's a gap
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pagesContainer.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.setAttribute('data-page', totalPages);
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => goToPage(tabId, totalPages));
        pagesContainer.appendChild(lastBtn);
    }
}

// Update navigation buttons (Previous/Next)
function updateNavigationButtons(tabId, currentPage, totalPages) {
    const prevBtn = document.getElementById(`${tabId}-prev`);
    const nextBtn = document.getElementById(`${tabId}-next`);
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        // Remove existing event listeners
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        const newPrevBtn = document.getElementById(`${tabId}-prev`);
        newPrevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(tabId, currentPage - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        // Remove existing event listeners
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        const newNextBtn = document.getElementById(`${tabId}-next`);
        newNextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                goToPage(tabId, currentPage + 1);
            }
        });
    }
}

// Update table rows for current page
function updateTableRows(tabId, currentPage) {
    const itemsPerPage = paginationState[tabId].itemsPerPage;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData[tabId].slice(startIndex, endIndex);
    
    populateTable(tabId, pageData);
}

// Go to specific page
function goToPage(tabId, page) {
    paginationState[tabId].currentPage = page;
    initializePagination(tabId);
}

// Update timeline for a specific case
function updateTimelineForCase(caseItem) {
    // Update case info
    const caseInfo = document.querySelector('.case-details');
    if (caseInfo) {
        caseInfo.textContent = `Case: ${caseItem.caseNumber}, ESN: ${caseItem.esn}, Current State: ${caseItem.currentStage}`;
    }
    
    // Update progress bar
    updateProgressBar(caseItem.currentStage);
    
    // Update timeline states
    updateTimelineStates(caseItem.currentStage);
}

// Update progress bar based on current stage
function updateProgressBar(currentStage) {
    const progressBar = document.getElementById('timeline-progress');
    const stageMap = {
        'Requester': 16.67,
        'Categorization': 33.33,
        'Design Engineer': 50,
        'Engineer Reviewer': 66.67,
        'Engineer Approver': 83.33,
        'Customer Approval': 100
    };
    
    const progress = stageMap[currentStage] || 0;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Update timeline stage states
function updateTimelineStates(currentStage) {
    const stages = document.querySelectorAll('.timeline-stage');
    const stageNames = ['Requester', 'Categorization', 'Design Engineer', 'Engineer Reviewer', 'Engineer Approver', 'Customer Approval'];
    
    stages.forEach((stage, index) => {
        const stageName = stageNames[index];
        const stageNode = stage.querySelector('.stage-node i');
        
        // Remove all classes
        stage.classList.remove('completed', 'current', 'pending');
        stageNode.className = '';
        
        if (index < stageNames.indexOf(currentStage)) {
            // Completed stages
            stage.classList.add('completed');
            stageNode.className = 'fas fa-check';
        } else if (index === stageNames.indexOf(currentStage)) {
            // Current stage
            stage.classList.add('current');
            stageNode.className = 'fas fa-clock';
        } else {
            // Pending stages
            stage.classList.add('pending');
            stageNode.className = 'fas fa-circle';
        }
    });
}

// Show stage info on hover
    function showStageInfo(stageName) {
        const stageInfo = {
        'Requester': { description: 'Initial request submission and validation', duration: '1-2 days' },
            'Categorization': { description: 'Request classification and routing', duration: '1 day' },
        'Design Engineer': { description: 'Engineering design and analysis', duration: '3-5 days' },
        'Engineer Reviewer': { description: 'Technical review process', duration: '2-3 days' },
        'Engineer Approver': { description: 'Final approval stage', duration: '1-2 days' },
        'Customer Approval': { description: 'Customer review and feedback', duration: '2-4 days' }
        };

        const info = stageInfo[stageName];
        if (info) {
        // You can implement tooltip or modal to show this info
        console.log(`${stageName}: ${info.description} (${info.duration})`);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, checking for floating chatbot...');
    
    // Test if floating chatbot exists
    const floatingChatbot = document.getElementById('floating-chatbot');
    if (floatingChatbot) {
        console.log('✅ Floating chatbot found!');
        console.log('Floating chatbot styles:', window.getComputedStyle(floatingChatbot));
    } else {
        console.error('❌ Floating chatbot not found!');
    }
    
    // Load data when page loads
    loadCasesData();
    
    // Tab change event to reset pagination
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target').substring(1);
            if (paginationState[targetId]) {
                // Reset to first page when switching tabs
                paginationState[targetId].currentPage = 1;
                initializePagination(targetId);
            }
        });
    });
    
    // Add hover events for timeline stages
    document.querySelectorAll('.timeline-stage').forEach(stage => {
        stage.addEventListener('mouseenter', function() {
            const stageTitle = this.querySelector('.stage-title').textContent;
            showStageInfo(stageTitle);
        });
    });

    // Initialize chatbot functionality
    initializeChatbot();
});

// Chatbot functionality
function initializeChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const floatingChatbot = document.getElementById('floating-chatbot');
    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Debug: Check if maximize button is found
    console.log('Maximize button found:', !!maximizeBtn);
    if (maximizeBtn) {
        console.log('Maximize button styles:', window.getComputedStyle(maximizeBtn));
    }

    let isMaximized = false;

    // Ensure floating chatbot is visible by default
    if (floatingChatbot) {
        floatingChatbot.style.display = 'flex';
        console.log('Floating chatbot should be visible now');
        
        // Test click functionality
        floatingChatbot.addEventListener('click', function() {
            console.log('Floating chatbot clicked!');
        });
    } else {
        console.error('Floating chatbot element not found!');
    }

    // Show chatbot when floating icon is clicked
    floatingChatbot.addEventListener('click', function() {
        chatbotContainer.style.display = 'flex';
        floatingChatbot.style.display = 'none';
        chatInput.focus();
    });

    // Minimize chatbot (return to floating icon)
    minimizeBtn.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
        floatingChatbot.style.display = 'flex';
    });

    // Toggle maximize/minimize size
    function toggleMaximize() {
        console.log('Toggle maximize called, current state:', isMaximized);
        if (isMaximized) {
            chatbotContainer.classList.remove('maximized');
            minimizeBtn.style.display = 'block';
            maximizeBtn.style.display = 'block';
            isMaximized = false;
            console.log('Chatbot minimized');
        } else {
            chatbotContainer.classList.add('maximized');
            minimizeBtn.style.display = 'none';
            maximizeBtn.style.display = 'block';
            isMaximized = true;
            console.log('Chatbot maximized');
        }
    }

    // Maximize button click
    maximizeBtn.addEventListener('click', toggleMaximize);

    // Double click header to toggle maximize
    document.getElementById('chatbot-header').addEventListener('dblclick', toggleMaximize);

    // Close chatbot (return to floating icon)
    closeBtn.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
        floatingChatbot.style.display = 'flex';
    });

    // Send message functionality
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            sendBtn.disabled = true;
            
            // Simulate bot response
            setTimeout(() => {
                addBotMessage(getBotResponse(message));
            }, 1000);
        }
    }

    // Send button click
    sendBtn.addEventListener('click', sendMessage);

    // Enter key to send
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Enable/disable send button based on input
    chatInput.addEventListener('input', function() {
        sendBtn.disabled = !this.value.trim();
    });

    // Add user message to chat
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Bot response logic
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm here to help you with DR-related questions. How can I assist you today?";
        } else if (lowerMessage.includes('dr') && lowerMessage.includes('assessment')) {
            return "I can help you with DR assessment. Please provide the case number or ESN for the specific DR you'd like me to assess.";
        } else if (lowerMessage.includes('esm') || lowerMessage.includes('engine')) {
            return "For ESM queries, I can help you find information about engine models, specifications, and related data. What specific ESM information do you need?";
        } else if (lowerMessage.includes('exception') || lowerMessage.includes('list')) {
            return "I can help you check the exception list. Please provide the part number or case details you'd like me to verify.";
        } else if (lowerMessage.includes('history') || lowerMessage.includes('previous')) {
            return "I can help you find historical DR data. Please specify the time period or case criteria you're looking for.";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            return "I'm here to help! You can ask me about:\n• DR assessments and status\n• ESM queries\n• Exception list checks\n• Historical DR data\n• General DR process questions";
        } else {
            return "I understand you're asking about: '" + message + "'. Let me help you with that. Could you provide more specific details about what you need assistance with?";
        }
    }

    // Initialize send button state
    sendBtn.disabled = true;
} 