class LoginManager {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.isLoading = false;
    }

    initializeElements() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.loginBtn = document.getElementById('loginBtn');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleLogin(e));

        // Password toggle
        this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());



        // Forgot password
        document.querySelector('.forgot-password').addEventListener('click', (e) => this.handleForgotPassword(e));

        // Input validation
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());

        // Enter key navigation
        this.emailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.passwordInput.focus();
            }
        });

        this.passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin(e);
            }
        });
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(this.emailInput, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            this.showFieldError(this.emailInput, 'Please enter a valid email address');
            return false;
        } else {
            this.clearFieldError(this.emailInput);
            return true;
        }
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showFieldError(this.passwordInput, 'Password is required');
            return false;
        } else if (password.length < 6) {
            this.showFieldError(this.passwordInput, 'Password must be at least 6 characters');
            return false;
        } else {
            this.clearFieldError(this.passwordInput);
            return true;
        }
    }

    showFieldError(input, message) {
        input.style.borderColor = 'var(--danger)';
        input.style.boxShadow = '0 0 0 3px rgba(204, 0, 0, 0.1)';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = 'var(--danger)';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.style.borderColor = 'var(--gray-200)';
        input.style.boxShadow = 'none';
        
        const errorDiv = input.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const icon = this.passwordToggle.querySelector('i');
        if (type === 'text') {
            icon.className = 'fas fa-eye-slash';
            this.passwordToggle.classList.add('active');
        } else {
            icon.className = 'fas fa-eye';
            this.passwordToggle.classList.remove('active');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        // Validate form
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            this.showError('Please fix the errors above');
            return;
        }
        
        // Start loading
        this.setLoading(true);
        
        try {
            // Simulate API call
            await this.simulateLogin();
            
            // Store remember me preference
            if (this.rememberMeCheckbox.checked) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('userEmail', this.emailInput.value.trim());
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('userEmail');
            }
            
            // Redirect to main application
            this.redirectToApp();
            
        } catch (error) {
            this.showError(error.message || 'Login failed. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async simulateLogin() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        // Demo credentials (in real app, this would be an API call)
        if (email === 'demo@genpact.com' && password === 'demo123') {
            return { success: true, user: { email, name: 'Demo User' } };
        } else if (email === 'admin@genpact.com' && password === 'admin123') {
            return { success: true, user: { email, name: 'Admin User' } };
        } else {
            throw new Error('Invalid email or password');
        }
    }



    handleForgotPassword(e) {
        e.preventDefault();
        this.showError('Password reset functionality is not implemented in this demo');
    }

    setLoading(loading) {
        this.isLoading = loading;
        
        const btnText = this.loginBtn.querySelector('.btn-text');
        const btnLoading = this.loginBtn.querySelector('.btn-loading');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            this.loginBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            this.loginBtn.disabled = false;
        }
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }

    redirectToApp() {
        // Store login state
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('loginTime', new Date().toISOString());
        
        // Redirect to main application
        window.location.href = 'index.html';
    }

    // Check for remembered email on page load
    checkRememberedEmail() {
        const rememberMe = localStorage.getItem('rememberMe');
        const rememberedEmail = localStorage.getItem('userEmail');
        
        if (rememberMe === 'true' && rememberedEmail) {
            this.emailInput.value = rememberedEmail;
            this.rememberMeCheckbox.checked = true;
        }
    }

    // Initialize the login manager
    init() {
        this.checkRememberedEmail();
        
        // Focus on email input
        this.emailInput.focus();
        
        // Add some demo credentials hint
        setTimeout(() => {
            console.log('Demo Credentials:');
            console.log('Email: demo@genpact.com, Password: demo123');
            console.log('Email: admin@genpact.com, Password: admin123');
        }, 1000);
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginManager = new LoginManager();
    loginManager.init();
});

// Add some additional CSS for field errors
const style = document.createElement('style');
style.textContent = `
    .field-error {
        color: var(--danger);
        font-size: 12px;
        margin-top: 4px;
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style); 