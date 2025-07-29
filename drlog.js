// Initialize Bootstrap tabs
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality with smooth transitions
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and content
            document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const target = this.getAttribute('data-bs-target');
            const targetPane = document.querySelector(target);
            targetPane.classList.add('show', 'active');
        });
    });

    // Row click functionality
    document.querySelectorAll('.case-table tbody tr').forEach(row => {
        row.addEventListener('click', function() {
            // Remove highlight from all rows
            document.querySelectorAll('.case-table tbody tr').forEach(r => {
                r.classList.remove('highlighted');
            });
            
            // Add highlight to clicked row
            this.classList.add('highlighted');
            
            // Update timeline info
            const caseId = this.cells[0].textContent;
            const esn = this.cells[1].textContent;
            const currentStage = this.cells[8].textContent;
            
            document.querySelector('.case-details').textContent = 
                `Case: ${caseId}, ESN: ${esn}, Current State: ${currentStage}`;
            
            // Update progress bar based on current stage
            updateProgressBar(currentStage);
        });
    });

    // Progress bar update function
    function updateProgressBar(currentStage) {
        const progressBar = document.getElementById('timeline-progress');
        const stageMap = {
            'Requester': 12.5,
            'Categorization': 25,
            'Design Engineer': 37.5,
            'Design Approver': 50,
            'Engineer Reviewer': 62.5,
            'Engineer Approver': 75,
            'DR Approver': 87.5,
            'Customer': 100,
            'Shop': 100
        };
        
        const progress = stageMap[currentStage] || 0;
        progressBar.style.width = progress + '%';
        
        // Update timeline stage states
        updateTimelineStates(currentStage);
    }

    // Update timeline stage states
    function updateTimelineStates(currentStage) {
        const stages = document.querySelectorAll('.timeline-stage');
        const stageNames = ['Requester', 'Categorization', 'Design', 'DR', 'Reviewer', 'Approver', 'Customer', 'Shop'];
        
        stages.forEach((stage, index) => {
            const stageName = stageNames[index];
            
            // Remove all states
            stage.classList.remove('completed', 'current');
            
            // Determine state based on current stage
            if (currentStage === stageName) {
                stage.classList.add('current');
            } else if (stageNames.indexOf(stageName) < stageNames.indexOf(currentStage)) {
                stage.classList.add('completed');
            }
        });

        // Update date states
        updateDateStates(currentStage);
    }

    // Update date states
    function updateDateStates(currentStage) {
        const dates = document.querySelectorAll('.timeline-date');
        const dateMap = {
            'Requester': 0,
            'Categorization': 1,
            'Design': 2,
            'DR': 3,
            'Reviewer': 4,
            'Approver': 5,
            'Customer': 6,
            'Shop': 7
        };

        const currentIndex = dateMap[currentStage] || 0;
        
        dates.forEach((date, index) => {
            date.classList.remove('completed', 'current');
            
            if (index < currentIndex) {
                date.classList.add('completed');
            } else if (index === currentIndex) {
                date.classList.add('current');
            }
        });
    }

    // Timeline stage interactions
    document.querySelectorAll('.timeline-stage').forEach(stage => {
        const stageTitle = stage.querySelector('.stage-title');
        
        stage.addEventListener('click', function() {
            const stageName = stageTitle.textContent;
            showStageInfo(stageName);
        });
    });

    // Show stage information
    function showStageInfo(stageName) {
        const stageInfo = {
            'Requester': { description: 'Initial request submission', duration: '1-2 days' },
            'Categorization': { description: 'Request classification and routing', duration: '1 day' },
            'Design': { description: 'Engineering design and analysis', duration: '3-5 days' },
            'DR': { description: 'Design review and approval', duration: '2-3 days' },
            'Reviewer': { description: 'Technical review process', duration: '2-3 days' },
            'Approver': { description: 'Final approval stage', duration: '1-2 days' },
            'Customer': { description: 'Customer review and feedback', duration: '2-4 days' },
            'Shop': { description: 'Implementation and execution', duration: '5-10 days' }
        };

        const info = stageInfo[stageName];
        if (info) {
            alert(`${stageName}\n${info.description}\nDuration: ${info.duration}`);
        }
    }

    // Initialize with first case selected
    const firstRow = document.querySelector('.case-table tbody tr');
    if (firstRow) {
        firstRow.classList.add('highlighted');
        updateProgressBar('DR Approver');
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const highlightedRow = document.querySelector('.case-table tbody tr.highlighted');
        if (!highlightedRow) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextRow = highlightedRow.nextElementSibling;
            if (nextRow) {
                nextRow.click();
                nextRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevRow = highlightedRow.previousElementSibling;
            if (prevRow) {
                prevRow.click();
                prevRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}); 