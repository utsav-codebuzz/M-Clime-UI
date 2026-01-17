class ComponentLoader {
  constructor() {
    this.components = {
      sidebar: "components/sidebar/sidebar.html",
      header: "components/header/header.html",
      changePictureModal:
        "components/change-picture-modal/change-picture-modal.html",
    };
    this.stylesheets = {
      changePictureModal:
        "components/change-picture-modal/change-picture-modal.css",
    };
  }

  async loadComponent(componentName, targetElementId) {
    try {
      const container = document.getElementById(targetElementId);
      if (!container) return;

      container.classList.add("component-loading");

      const response = await fetch(this.components[componentName]);
      const html = await response.text();
      container.innerHTML = html;

            requestAnimationFrame(() => {
                container.classList.remove('component-loading');
                container.classList.add('component-loaded');

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
            const container = document.getElementById(targetElementId);
            if (container) {
                container.classList.remove('component-loading');
            }
        }
    }

  initializeSidebar() {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  }

  initializeHeader() {}

  initializeChangePictureModal() {}

  async loadAllComponents() {
    if (document.getElementById("sidebar-container")) {
      await this.loadComponent("sidebar", "sidebar-container");
    }

    if (document.getElementById("header-container")) {
      await this.loadComponent("header", "header-container");
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
            throw new Error('Failed to load change picture modal');
        }

    document.dispatchEvent(new Event("componentsLoaded"));
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

document.addEventListener("DOMContentLoaded", () => {
  window.componentLoader = new ComponentLoader();
  window.componentLoader.loadAllComponents();
});
