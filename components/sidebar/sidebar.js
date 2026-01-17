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

      setTimeout(() => {
        this.sidebar.classList.add("fade-in");
      }, 100);
    };

    setTimeout(initSidebar, 50);
  }

  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "mobile-sidebar-overlay";
    document.body.appendChild(this.overlay);
  }

  setupEventListeners() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggleSidebar());
    }

    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openMobileSidebar();
      });
    }

    if (this.mobileCloseBtn) {
      this.mobileCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeMobileSidebar();
      });
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", () => {
        this.closeMobileSidebar();
      });
    }

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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && window.innerWidth <= 768) {
        this.closeMobileSidebar();
      }
    });

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

      if (this.overlay) {
        this.overlay.classList.add("active");
      }

      document.body.classList.add("sidebar-open");

      this.sidebar.style.transform = "translateX(0)";
    }
  }

  closeMobileSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove("mobile-open");

      if (this.overlay) {
        this.overlay.classList.remove("active");
      }

      document.body.classList.remove("sidebar-open");

      this.sidebar.style.transform = "translateX(-100%)";
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
      if (this.mainContent) {
        this.mainContent.classList.add("collapsed");
      }
      this.updateToggleIcon();
    }
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      this.closeMobileSidebar();
      this.sidebar.classList.add("collapsed");

      if (this.mainContent) {
        this.mainContent.classList.add("collapsed");
      }

      this.sidebar.style.transform = "translateX(-100%)";
    } else {
      this.closeMobileSidebar();
      this.restoreState();

      this.sidebar.classList.remove("mobile-open");
      document.body.classList.remove("sidebar-open");

      if (this.overlay) {
        this.overlay.classList.remove("active");
      }

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

  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

function initSidebar() {
  window.sidebar = new Sidebar();
  window.sidebar.init();
}

document.addEventListener("componentsLoaded", () => {
  initSidebar();
});

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("sidebar")) {
    initSidebar();
  }
});

window.addEventListener("resize", () => {
  if (window.sidebar) window.sidebar.handleResize();
});

document.addEventListener("click", (e) => {
  if (window.innerWidth <= 768 && e.target.closest(".nav-link")) {
    setTimeout(() => {
      if (window.sidebar) {
        window.sidebar.closeMobileSidebar();
      }
    }, 200);
  }
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = Sidebar;
}
