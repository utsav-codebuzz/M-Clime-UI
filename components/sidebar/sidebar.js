// components/sidebar/sidebar.js
class Sidebar {
  constructor() {
    this.sidebar = null;
    this.mainContent = null;
    this.toggleBtn = null;
    this.toggleIcon = null;
    this.mobileMenuToggle = null;
    this.mobileCloseBtn = null;
    this.overlay = null;
  }

  init() {
    const initSidebar = () => {
      this.sidebar = document.getElementById("sidebar");
      this.mainContent = document.getElementById("mainContent");
      this.toggleBtn = document.getElementById("toggleBtn");
      this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
      this.mobileCloseBtn = document.getElementById("mobileCloseBtn");

      // If sidebar is not loaded yet, wait a bit more
      if (!this.sidebar || !this.toggleBtn) {
        setTimeout(initSidebar, 50);
        return;
      }

      if (this.toggleBtn) {
        this.toggleIcon = this.toggleBtn.querySelector(".toggle-icon");
      }

      this.createOverlay();
      this.setupEventListeners();
      this.handleResize();
      this.restoreState();
      this.highlightCurrentPage();

      // Add fade-in animation
      setTimeout(() => {
        this.sidebar.classList.add("fade-in");
      }, 100);
    };

    // Start initialization
    setTimeout(initSidebar, 50);
  }

  createOverlay() {
    // Create overlay for mobile
    this.overlay = document.createElement("div");
    this.overlay.className = "mobile-sidebar-overlay";
    document.body.appendChild(this.overlay);
  }

  setupEventListeners() {
    // Desktop toggle button
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggleSidebar());
    }

    // Mobile menu toggle (hamburger)
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openMobileSidebar();
      });
    }

    // Mobile close button
    if (this.mobileCloseBtn) {
      this.mobileCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeMobileSidebar();
      });
    }

    // Close sidebar when clicking overlay
    if (this.overlay) {
      this.overlay.addEventListener("click", () => {
        this.closeMobileSidebar();
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        this.sidebar &&
        this.sidebar.classList.contains("mobile-open") &&
        !this.sidebar.contains(e.target) &&
        !e.target.closest(".mobile-menu-toggle")
      ) {
        this.closeMobileSidebar();
      }
    });

    // Close sidebar with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && window.innerWidth <= 768) {
        this.closeMobileSidebar();
      }
    });

    // Upgrade plan button
    const upgradePlanBtn = document.getElementById("upgradePlanBtn");
    if (upgradePlanBtn) {
      upgradePlanBtn.addEventListener("click", () => {
        window.location.href = "plan.html";
      });
    }
  }

  openMobileSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.add("mobile-open");

      // Show overlay
      if (this.overlay) {
        this.overlay.classList.add("active");
      }

      // Prevent body scrolling
      document.body.classList.add("sidebar-open");

      // Add fade-in effect
      this.sidebar.style.transform = "translateX(0)";
    }
  }

  closeMobileSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove("mobile-open");

      // Hide overlay
      if (this.overlay) {
        this.overlay.classList.remove("active");
      }

      // Restore body scrolling
      document.body.classList.remove("sidebar-open");

      // Add slide-out effect
      this.sidebar.style.transform = "translateX(-100%)";
    }
  }

  toggleSidebar() {
    // Only toggle on desktop
    if (window.innerWidth <= 768) return;

    if (!this.sidebar) return;

    this.sidebar.classList.toggle("collapsed");

    if (this.mainContent) {
      this.mainContent.classList.toggle("collapsed");
    }

    // Save state to localStorage
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
      if (this.mainContent) {
        this.mainContent.classList.add("collapsed");
      }
      this.updateToggleIcon();
    }
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      // On mobile, always ensure sidebar is hidden by default
      this.closeMobileSidebar();
      this.sidebar.classList.add("collapsed");

      if (this.mainContent) {
        this.mainContent.classList.add("collapsed");
      }

      // Make sure sidebar has proper mobile styles
      // this.sidebar.style.width = '250px';
      this.sidebar.style.transform = "translateX(-100%)";
    } else {
      // On desktop, restore state and close mobile-open class
      this.closeMobileSidebar();
      this.restoreState();

      // Ensure mobile-open class is removed
      this.sidebar.classList.remove("mobile-open");
      document.body.classList.remove("sidebar-open");

      // Hide overlay
      if (this.overlay) {
        this.overlay.classList.remove("active");
      }

      // Reset transform for desktop
      this.sidebar.style.transform = "translateX(0)";
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

  // Cleanup method
  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

// Initialize sidebar
function initSidebar() {
  window.sidebar = new Sidebar();
  window.sidebar.init();
}

// Listen for components loaded event
document.addEventListener("componentsLoaded", () => {
  initSidebar();
});

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("sidebar")) {
    initSidebar();
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.sidebar) window.sidebar.handleResize();
});

// Close sidebar when a navigation link is clicked on mobile
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 768 && e.target.closest(".nav-link")) {
    setTimeout(() => {
      if (window.sidebar) {
        window.sidebar.closeMobileSidebar();
      }
    }, 200); // Small delay to allow navigation to start
  }
});

// Export for module usage if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = Sidebar;
}
