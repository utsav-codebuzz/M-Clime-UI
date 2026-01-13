// components/load-components.js
class ComponentLoader {
    constructor() {
        this.components = {
            sidebar: 'components/sidebar/sidebar.html',
            header: 'components/header/header.html'
        };
    }

    async loadComponent(componentName, targetElementId) {
        try {
            const response = await fetch(this.components[componentName]);
            const html = await response.text();
            document.getElementById(targetElementId).innerHTML = html;

            if (componentName === 'sidebar') {
                this.initializeSidebar();
            } else if (componentName === 'header') {
                this.initializeHeader();
            }
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
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

    async loadAllComponents() {
        // Load sidebar if element exists
        if (document.getElementById('sidebar-container')) {
            await this.loadComponent('sidebar', 'sidebar-container');
        }

        // Load header if element exists
        if (document.getElementById('header-container')) {
            await this.loadComponent('header', 'header-container');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
    window.componentLoader.loadAllComponents();
});