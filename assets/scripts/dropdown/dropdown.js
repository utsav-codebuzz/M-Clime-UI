// Use capture phase to ensure this runs before other click handlers
document.addEventListener("click", function (e) {
  // Check for logout links first - don't interfere with them
  const logoutLink = e.target.closest('[data-logout]');
  if (logoutLink) {
    // Close any open dropdowns
    const dropdown = logoutLink.closest(".custom-dropdown");
    if (dropdown) {
      dropdown.classList.remove("active");
      const menu = dropdown.querySelector(".dropdown-menu");
      if (menu) {
        menu.style.display = "";
      }
    }
    // Let the logout modal handle the click - don't stop propagation
    // The logout modal will handle preventDefault and showModal
    return;
  }

  // Handle clicks on buttons or any elements inside dropdown buttons (including images)
  const dropdownBtn = e.target.closest(".dropdown-btn");
  const dropdownItem = e.target.closest(".dropdown-menu li");
  const sortItem = e.target.closest(".sort-item");
  const threeDots = e.target.closest(".three-dots");
  
  // Check if clicking inside an active dropdown menu
  const activeDropdown = e.target.closest(".custom-dropdown.active");
  const isClickInsideDropdown = activeDropdown && e.target.closest(".dropdown-menu");

  /* ===========================
     OPEN DROPDOWN
  ============================ */
  if (dropdownBtn) {
    e.stopPropagation();
    e.preventDefault();
    
    const targetDropdown = dropdownBtn.closest(".custom-dropdown");
    
    if (targetDropdown) {
      const isCurrentlyActive = targetDropdown.classList.contains("active");
      const menu = targetDropdown.querySelector(".dropdown-menu");
      
      // Close all other dropdowns first and remove any inline styles
      document.querySelectorAll(".custom-dropdown").forEach((el) => {
        if (el !== targetDropdown) {
          el.classList.remove("active");
          const otherMenu = el.querySelector(".dropdown-menu");
          if (otherMenu) {
            otherMenu.style.display = "";
          }
        }
      });

      // Toggle the clicked dropdown
      if (isCurrentlyActive) {
        targetDropdown.classList.remove("active");
        if (menu) {
          menu.style.display = "";
        }
      } else {
        targetDropdown.classList.add("active");
        // Ensure inline styles don't override CSS
        if (menu) {
          menu.style.display = "";
        }
      }
    }
    return;
  }

  /* ===========================
     NORMAL DROPDOWN ITEMS (li)
  ============================ */
  if (dropdownItem && dropdownItem.closest(".custom-dropdown")) {
    e.stopPropagation();

    const dropdown = dropdownItem.closest(".custom-dropdown");
    const menu = dropdown.querySelector(".dropdown-menu");
    const label = dropdown.querySelector(".dropdown-btn span");

    // Only update label if it exists (header dropdowns don't have span labels)
    if (label) {
      label.textContent = dropdownItem.textContent;
    }
    
    dropdown.classList.remove("active");
    // Remove inline styles to let CSS handle it
    if (menu) {
      menu.style.display = "";
    }

    if (typeof handleFilterChange === "function") {
      handleFilterChange(
        dropdown.dataset.filter || dropdown.dataset.type,
        dropdownItem.dataset.value
      );
    }
    return;
  }

  /* ===========================
     SORT BY (CUSTOM DESIGN)
  ============================ */
  if (sortItem) {
    e.stopPropagation();

    const dropdown = sortItem.closest(".custom-dropdown");
    const menu = sortItem.closest(".sort-dropdown");

    menu
      .querySelectorAll(".sort-item")
      .forEach((i) => i.classList.remove("active"));

    sortItem.classList.add("active");

    if (sortItem.classList.contains("custom-trigger")) {
      menu.classList.add("show-custom");
    } else {
      menu.classList.remove("show-custom");

      const label = dropdown.querySelector(".dropdown-btn span");
      label.textContent = sortItem.textContent.trim();

      dropdown.classList.remove("active");
    }
    return;
  }

  /* ===========================
     FILE THREE DOTS MENU
     Only handle if not already handled by page-specific handlers
  ============================ */
  if (threeDots) {
    const container = threeDots.closest(".file-actions");
    if (!container) return;
    
    const menu = container.querySelector(".file-menu");
    // Only handle if this is a file-menu and it's not using inline display style
    // (render-files.js and render-starred.js use inline styles, so skip those)
    if (menu && !menu.style.display) {
      e.stopPropagation();
      e.preventDefault();

      const isCurrentlyActive = container.classList.contains("active");

      // Close all other file menus first
      document.querySelectorAll(".file-actions").forEach((el) => {
        el.classList.remove("active");
        const m = el.querySelector(".file-menu");
        if (m) m.classList.remove("open-left");
      });

      // Toggle the clicked file menu
      if (isCurrentlyActive) {
        container.classList.remove("active");
      } else {
        container.classList.add("active");

        // Check if menu needs to open on the left (if it would overflow)
        requestAnimationFrame(() => {
          const rect = menu.getBoundingClientRect();
          if (rect.right > window.innerWidth - 8) {
            menu.classList.add("open-left");
          } else {
            menu.classList.remove("open-left");
          }
        });
      }
      return;
    }
  }

  /* ===========================
     CLICK OUTSIDE → CLOSE ALL
     Only close if not clicking inside an active dropdown menu
  ============================ */
  if (!isClickInsideDropdown && !dropdownBtn && !dropdownItem && !sortItem && !threeDots) {
    document.querySelectorAll(".custom-dropdown, .file-actions").forEach((el) => {
      el.classList.remove("active");
      // Remove inline styles to let CSS handle it
      const menu = el.querySelector(".dropdown-menu");
      if (menu) {
        // Only reset display if it's not a file-menu using inline styles
        // (file-menus in render-files.js and render-starred.js manage their own display)
        if (!menu.classList.contains("file-menu") || !menu.style.display) {
          menu.style.display = "";
        }
      }
    });
  }
}, true); // Use capture phase to run before other handlers

// Function to clean up inline styles on dropdown menus
function cleanupDropdownStyles() {
  document.querySelectorAll('.custom-dropdown .dropdown-menu').forEach((menu) => {
    // Only remove inline display if it's not from file-menu (which uses different system)
    if (!menu.classList.contains('file-menu')) {
      const dropdown = menu.closest('.custom-dropdown');
      if (dropdown) {
        // Remove inline display style - let CSS handle visibility via .active class
        menu.style.display = '';
      }
    }
  });
}

// Clean up when components load
document.addEventListener('componentsLoaded', () => {
  setTimeout(cleanupDropdownStyles, 100);
});

// Also clean up on DOMContentLoaded (for pages that don't use component loader)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(cleanupDropdownStyles, 200);
  });
} else {
  setTimeout(cleanupDropdownStyles, 200);
}
