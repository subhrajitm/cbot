// Form submission and modal functionality for static form only

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.static-case-form');
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.querySelector('.close');

    if (form && modal && closeBtn) {
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showModal();
        });

        // Close modal when clicking the X button
        closeBtn.addEventListener('click', function() {
            closeModal();
        });

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }

    window.closeModal = function() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    function showModal() {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
}); 