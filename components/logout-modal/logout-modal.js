class LogoutModal {
    constructor() {
        this.modal = null;
        this.logoutLinks = [];
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupModal();
            this.setupEventListeners();
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
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.hideModal();
            }
        });

        const cancelBtn = document.getElementById('cancelLogout');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideModal());
        }

        const confirmBtn = document.getElementById('confirmLogout');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.performLogout());
        }
    }

    setupGlobalLogoutHandler() {
        this.logoutLinks = document.querySelectorAll('[data-logout]');

        this.logoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal();
            });
        });
    }

    showModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            setTimeout(() => {
                document.getElementById('cancelLogout')?.focus();
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