class LogoutModal {
    constructor() {
        this.modal = null;
        this.logoutLinks = [];
        this.eventListenersSetup = false;
        this.globalHandlerSetup = false;
        this.initialize();
    }

    initialize() {
        const init = () => {
            this.setupModal();
            if (this.modal) {
                this.setupEventListeners();
            }
            this.setupGlobalLogoutHandler();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        // Re-initialize after components are loaded
        document.addEventListener('componentsLoaded', () => {
            this.setupModal(); // Ensure modal exists
            if (this.modal && !this.eventListenersSetup) {
                this.setupEventListeners();
            }
            this.setupGlobalLogoutHandler();
        });
    }

    setupModal() {
        this.modal = document.getElementById('logoutModal');

        if (!this.modal) {
            this.createModal();
            this.modal = document.getElementById('logoutModal');
        }
    }

    createModal() {
        const modalHTML = `
            <div class="logout-modal-overlay" id="logoutModal" style="display: none;">
                <div class="logout-modal">
                    <div class="logout-modal-header">
                        <h3>Log Out</h3>
                        <p>Are you sure want to logout this account ?</p>
                    </div>
                    
                    <div class="logout-modal-actions">
                        <button class="logout-modal-btn cancel-btn" id="cancelLogout">Cancel</button>
                        <button class="logout-modal-btn confirm-btn" id="confirmLogout">Yes</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    setupEventListeners() {
        if (!this.modal || this.eventListenersSetup) {
            return; // Modal doesn't exist or listeners already setup
        }

        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Escape key to close (only one listener needed, use capture phase)
        this.escapeHandler = (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.style.display === 'flex') {
                this.hideModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);

        // Button event listeners
        const cancelBtn = document.getElementById('cancelLogout');
        if (cancelBtn) {
            this.cancelHandler = () => this.hideModal();
            cancelBtn.addEventListener('click', this.cancelHandler);
        }

        const confirmBtn = document.getElementById('confirmLogout');
        if (confirmBtn) {
            this.confirmHandler = () => this.performLogout();
            confirmBtn.addEventListener('click', this.confirmHandler);
        }

        this.eventListenersSetup = true;
    }

    setupGlobalLogoutHandler() {
        // Use event delegation to handle dynamically loaded logout links
        // Only set up once to avoid duplicate listeners
        if (!this.globalHandlerSetup) {
            this.globalClickHandler = (e) => {
                const logoutLink = e.target.closest('[data-logout]');
                if (logoutLink) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close any open dropdowns
                    const dropdown = logoutLink.closest(".custom-dropdown");
                    if (dropdown) {
                        dropdown.classList.remove("active");
                        const menu = dropdown.querySelector(".dropdown-menu");
                        if (menu) {
                            menu.style.display = "";
                        }
                    }
                    
                    this.showModal();
                }
            };
            document.addEventListener('click', this.globalClickHandler, true);
            this.globalHandlerSetup = true;
        }
    }

    showModal() {
        // Ensure modal exists before showing
        if (!this.modal) {
            this.setupModal();
        }
        
        // Ensure event listeners are set up
        if (this.modal && !this.eventListenersSetup) {
            this.setupEventListeners();
        }
        
        if (this.modal) {
            this.modal.style.display = 'flex';
            setTimeout(() => {
                const cancelBtn = document.getElementById('cancelLogout');
                if (cancelBtn) {
                    cancelBtn.focus();
                }
            }, 100);
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    performLogout() {
        this.clearAuthData();

        const confirmBtn = document.getElementById('confirmLogout');
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = 'Logging out...';
        confirmBtn.disabled = true;
        localStorage.clear();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    clearAuthData() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userPreferences');

        sessionStorage.clear();

        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    triggerLogout() {
        this.showModal();
    }
}

window.LogoutModal = new LogoutModal();