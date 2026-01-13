// components/sidebar/sidebar.js
class Sidebar {
  constructor() {
    this.sidebar = null;
    this.mainContent = null;
    this.toggleBtn = null;
    this.toggleIcon = null;
    this.mobileMenuToggle = null;
  }

  init() {
    // Wait for sidebar to be loaded
    const initSidebar = () => {
      this.sidebar = document.getElementById("sidebar");
      this.mainContent = document.getElementById("mainContent");
      this.toggleBtn = document.getElementById("toggleBtn");
      this.mobileMenuToggle = document.getElementById("mobileMenuToggle");

      // If sidebar is not loaded yet, wait a bit more
      if (!this.sidebar || !this.toggleBtn) {
        setTimeout(initSidebar, 50);
        return;
      }

      if (this.toggleBtn) {
        this.toggleIcon = this.toggleBtn.querySelector(".toggle-icon");
      }

      this.setupEventListeners();
      this.handleResize();
      this.restoreState();
      this.highlightCurrentPage();
    };

    // Start initialization
    setTimeout(initSidebar, 50);
  }

  setupEventListeners() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggleSidebar());
    }

    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener("click", () => {
        this.sidebar.classList.toggle("mobile-open");
      });
    }

    const upgradePlanBtn = document.getElementById("upgradePlanBtn");
    if (upgradePlanBtn) {
      upgradePlanBtn.addEventListener("click", () => {
        window.location.href = "plan.html";
      });
    }
  }

  toggleSidebar() {
    if (window.innerWidth <= 768) return;
    
    if (!this.sidebar) return;

    this.sidebar.classList.toggle("collapsed");
    
    if (this.mainContent) {
      this.mainContent.classList.toggle("collapsed");
    }

    localStorage.setItem(
      "sidebarCollapsed",
      this.sidebar.classList.contains("collapsed")
    );

    this.updateToggleIcon();
  }

  updateToggleIcon() {
    if (!this.toggleIcon) return;

    if (this.sidebar.classList.contains("collapsed")) {
      this.toggleIcon.style.transform = "rotate(180deg)";
    } else {
      this.toggleIcon.style.transform = "rotate(0deg)";
    }
  }

  restoreState() {
    const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

    if (isCollapsed && window.innerWidth > 768) {
      this.sidebar.classList.add("collapsed");
      this.mainContent.classList.add("collapsed");
      this.updateToggleIcon();
    }
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      this.sidebar.classList.add("collapsed");
      this.mainContent.classList.add("collapsed");
    } else {
      this.restoreState();
    }
  }

  highlightCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  }
}

// Initialize sidebar after components are loaded
function initSidebar() {
  window.sidebar = new Sidebar();
  window.sidebar.init();
}

// Listen for components loaded event
document.addEventListener('componentsLoaded', () => {
  initSidebar();
});

// Also initialize when DOM is loaded (for backward compatibility)
document.addEventListener("DOMContentLoaded", () => {
  // Check if sidebar exists
  if (document.getElementById("sidebar")) {
    initSidebar();
  }
});

window.addEventListener("resize", () => {
  if (window.sidebar) window.sidebar.handleResize();
});