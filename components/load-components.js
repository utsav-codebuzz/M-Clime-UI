// components/load-components.js
class ComponentLoader {
    constructor() {
        this.components = {
            sidebar: 'components/sidebar/sidebar.html',
            header: 'components/header/header.html',
            changePictureModal: 'components/change-picture-modal/change-picture-modal.html'
        };
        this.stylesheets = {
            changePictureModal: 'components/change-picture-modal/change-picture-modal.css'
        };
    }

    async loadComponent(componentName, targetElementId) {
        try {
            const container = document.getElementById(targetElementId);
            if (!container) return;

            // Add loading class for animation
            container.classList.add('component-loading');

            const response = await fetch(this.components[componentName]);
            const html = await response.text();
            container.innerHTML = html;

            // Add loaded class and trigger animation
            requestAnimationFrame(() => {
                container.classList.remove('component-loading');
                container.classList.add('component-loaded');
                
                // Trigger fade-in animation with slight delay for smooth effect
                setTimeout(() => {
                    if (componentName === 'sidebar') {
                        const sidebar = document.getElementById('sidebar');
                        if (sidebar) {
                            sidebar.classList.add('fade-in');
                        }
                    } else if (componentName === 'header') {
                        const header = container.querySelector('header');
                        if (header) {
                            header.classList.add('fade-in');
                        }
                    }
                }, 50);
            });

            if (componentName === 'sidebar') {
                this.initializeSidebar();
            } else if (componentName === 'header') {
                this.initializeHeader();
            } else if (componentName === 'changePictureModal') {
                this.initializeChangePictureModal();
            }
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            const container = document.getElementById(targetElementId);
            if (container) {
                container.classList.remove('component-loading');
            }
        }
    }

    initializeSidebar() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    initializeHeader() {
        // Header dropdown initialization will be handled by dropdown.js
        // This is just a placeholder for any header-specific initialization
    }

    initializeChangePictureModal() {
        // This will be initialized by the modal's own script
        // We just ensure the modal exists in the DOM
    }

    async loadAllComponents() {
        // Load sidebar if element exists
        if (document.getElementById('sidebar-container')) {
            await this.loadComponent('sidebar', 'sidebar-container');
        }

        // Load header if element exists
        if (document.getElementById('header-container')) {
            await this.loadComponent('header', 'header-container');
        }

        try {
            const response = await fetch(this.components.changePictureModal);
            const html = await response.text();
            
            const tempContainer = document.createElement('div');
            tempContainer.style.display = 'none';
            tempContainer.innerHTML = html;
            
            const modal = tempContainer.querySelector('.modal-overlay');
            if (modal) {
                document.body.appendChild(modal);
            }
            
            this.loadModalStylesheet('changePictureModal');
            
        } catch (error) {
            console.error('Error loading change picture modal:', error);
        }

        document.dispatchEvent(new Event('componentsLoaded'));
    }

    loadModalStylesheet(modalName) {
        if (!this.stylesheets[modalName]) return;
        
        const linkId = `${modalName}-stylesheet`;
        if (document.getElementById(linkId)) return;
        
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = this.stylesheets[modalName];
        document.head.appendChild(link);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
    window.componentLoader.loadAllComponents();
});