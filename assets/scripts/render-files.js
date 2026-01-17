let modalInitialized = false;

function showFileInfoModal(fileId) {
  const file = window.filesData.find((f) => f.id == fileId);
  if (!file) {
    return;
  }

  const modalContent = `
    <table class="file-info-table">
      <tr>
        <td class="file-info-label">File Name</td>
        <td class="file-info-value">${file.name}</td>
      </tr>
      <tr>
        <td class="file-info-label">Category</td>
        <td class="file-info-value">${file.category || "File"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Type</td>
        <td class="file-info-value">${file.type || "Type"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Size</td>
        <td class="file-info-value">${file.size || "N/A"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Uploaded</td>
        <td class="file-info-value">${file.uploaded || "N/A"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Modified</td>
        <td class="file-info-value">${file.modified || "N/A"}</td>
      </tr>
    </table>
  `;

  const fileInfoContent = document.getElementById("fileInfoContent");
  if (fileInfoContent) {
    fileInfoContent.innerHTML = modalContent;
  } else {
    createModal();
    setTimeout(() => {
      const content = document.getElementById("fileInfoContent");
      if (content) {
        content.innerHTML = modalContent;
      }
    }, 10);
  }

  const modal = document.getElementById("fileInfoModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function showRenameModal(fileId) {
  const file = window.filesData.find((f) => f.id == fileId);
  if (!file) {
    return;
  }

  const fileName = file.name;
  const lastDotIndex = fileName.lastIndexOf(".");
  const nameWithoutExt =
    lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  const fileExt = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : "";

  const modalHTML = `
    <div id="renameModal" class="file-modal active">
      <div class="modal-overlay"></div>
      <div class="modal-content rename-modal">
        <div class="modal-header">
          <h3>Rename</h3>
          <span class="modal-close rename-close">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="rename-content">
            <div class="rename-input-group">
              <input 
                type="text" 
                id="renameInput" 
                class="rename-input" 
                value="${nameWithoutExt}" 
                autocomplete="off"
                spellcheck="false"
              />
              <span class="file-extension">${fileExt}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn-secondary cancel-btn">Cancel</button>
          <button type="button" class="btn-primary rename-submit-btn">OK</button>
        </div>
      </div>
    </div>
  `;

  const existingModal = document.getElementById("renameModal");
  if (existingModal) {
    existingModal.remove();
  }

  document.body.style.overflow = "hidden";

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  setTimeout(() => {
    const input = document.getElementById("renameInput");
    if (input) {
      input.focus();
      input.select();
    }
  }, 50);

  attachRenameModalEvents(fileId);
}

function showDeleteModal(fileId) {
  const file = window.filesData.find((f) => f.id == fileId);
  if (!file) {
    return;
  }

  const modalHTML = `
    <div id="deleteModal" class="file-modal active">
      <div class="modal-overlay"></div>
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h3>Move to Bin</h3>
          <span class="modal-close delete-close">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="delete-message">
            <p>Are you sure you want to move <strong>${file.name}</strong> file to Bin?</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn-secondary cancel-delete-btn">Cancel</button>
          <button type="button" class="btn-danger confirm-delete-btn">Move to Bin</button>
        </div>
      </div>
    </div>
  `;

  const existingModal = document.getElementById("deleteModal");
  if (existingModal) {
    existingModal.remove();
  }

  document.body.style.overflow = "hidden";

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  attachDeleteModalEvents(fileId);
}

function attachDeleteModalEvents(fileId) {
  const modal = document.getElementById("deleteModal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".delete-close");
  const cancelBtn = modal.querySelector(".cancel-delete-btn");
  const deleteBtn = modal.querySelector(".confirm-delete-btn");
  const overlay = modal.querySelector(".modal-overlay");

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.remove();
        }
        document.body.style.overflow = "auto";
      }, 300);
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  const escapeHandler = function (e) {
    if (e.key === "Escape" && modal) {
      closeModal();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      const file = window.filesData.find((f) => f.id == fileId);

      if (!file) {
        closeModal();
        return;
      }

      const fileIndex = window.filesData.findIndex((f) => f.id == fileId);
      if (fileIndex !== -1) {
        window.filesData.splice(fileIndex, 1);

        if (window.originalFilesData) {
          const originalIndex = window.originalFilesData.findIndex(
            (f) => f.id == fileId
          );
          if (originalIndex !== -1) {
            window.originalFilesData.splice(originalIndex, 1);
          }
        }
      }

      closeModal();
      renderFilesGrid();

      showToast("File deleted successfully");
    });
  }
}

function attachRenameModalEvents(fileId) {
  const modal = document.getElementById("renameModal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".rename-close");
  const cancelBtn = modal.querySelector(".cancel-btn");
  const submitBtn = modal.querySelector(".rename-submit-btn");
  const input = document.getElementById("renameInput");
  const overlay = modal.querySelector(".modal-overlay");

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.remove();
        }
        document.body.style.overflow = "auto";
      }, 300);
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  const escapeHandler = function (e) {
    if (e.key === "Escape" && modal) {
      closeModal();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  if (submitBtn && input) {
    submitBtn.addEventListener("click", function () {
      const newName = input.value.trim();
      const file = window.filesData.find((f) => f.id == fileId);

      if (!newName) {
        input.style.borderColor = "#dc2626";
        input.focus();
        return;
      }

      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf(".");
      const fileExt = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : "";
      const finalName = fileExt ? `${newName}${fileExt}` : newName;

      file.name = finalName;

      updateGridFileName(fileId, finalName);
      closeModal();

      showToast("File renamed successfully");
    });
  }

  if (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (submitBtn) submitBtn.click();
      }
    });

    input.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(220, 38, 38)") {
        this.style.borderColor = "#d1d5db";
      }
    });
  }
}

function updateGridFileName(fileId, newName) {
  const fileCard = document.querySelector(
    `.file-card[data-file-id="${fileId}"]`
  );
  if (fileCard) {
    const fileNameElement = fileCard.querySelector(".file-name");
    if (fileNameElement) {
      fileNameElement.textContent = newName;
    }
  }
}

function updateListFileName(fileId, newName) {
  const fileRow = document.querySelector(`.file-row[data-file-id="${fileId}"]`);
  if (fileRow) {
    const fileNameElement = fileRow.querySelector(".file-name-table");
    if (fileNameElement) {
      fileNameElement.textContent = newName;
    }
  }
}

function showToast(message) {
  const existingToast = document.getElementById("toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.id = "toast-notification";
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 3000);
}

// Flag to prevent duplicate event listeners
let fileActionHandlersAttached = false;

function attachFileActionHandlers() {
  // Use event delegation - only attach once
  if (fileActionHandlersAttached) return;
  fileActionHandlersAttached = true;

  // Single document-level click handler for all file actions
  document.addEventListener("click", function (e) {
    const threeDots = e.target.closest(".three-dots");
    const fileActions = e.target.closest(".file-actions");
    const menuItem = e.target.closest(".file-menu li");

    // Handle three dots click
    if (threeDots) {
      e.stopPropagation();
      e.preventDefault();

      const container = threeDots.closest(".file-actions");
      if (!container) return;

      const menu = threeDots.nextElementSibling;
      if (
        !menu ||
        !menu.classList.contains("dropdown-menu") ||
        !menu.classList.contains("file-menu")
      )
        return;

      // Check current state - handle both inline display and class-based
      const isOpen =
        menu.style.display === "block" ||
        container.classList.contains("active");

      if (isOpen) {
        menu.style.display = "none";
        container.classList.remove("active");
      } else {
        // Close all other menus first
        document.querySelectorAll(".file-menu").forEach((m) => {
          m.style.display = "none";
        });
        document.querySelectorAll(".file-actions").forEach((fa) => {
          fa.classList.remove("active");
        });

        // Open this menu
        menu.style.display = "block";
        menu.style.position = "absolute";
        menu.style.left = "auto";
        menu.style.right = "0";
        menu.style.top = "100%";
        menu.style.zIndex = "1000";
        container.classList.add("active");
      }
      return;
    }

    // Handle menu item clicks
    if (menuItem) {
      e.stopPropagation();
      e.preventDefault();

      const container = menuItem.closest(".file-actions");
      if (!container) return;

      const action = menuItem.dataset.action;
      const fileId = container.dataset.fileId;
      const menu = menuItem.closest(".dropdown-menu");

      // Close menu
      if (menu) {
        menu.style.display = "none";
        container.classList.remove("active");
      }

      switch (action) {
        case "file_info":
          const file = window.filesData.find((f) => f.id == fileId);
          if (file) {
            alert(
              `File Information:\n\nName: ${file.name}\nType: ${file.category || "File"
              }\nSize: ${file.size}\nDate: ${file.date}\nStarred: ${file.isStarred ? "Yes" : "No"
              }`
            );
          }
          break;
        case "rename":
          const newName = prompt("Enter new name for the file:");
          if (newName && newName.trim()) {
            const file = window.filesData.find((f) => f.id == fileId);
            if (file) {
              file.name = newName.trim();
              renderFilesGrid();
              alert("File renamed successfully!");
            }
          }
          break;
        case "download":
          alert(
            `Downloading file ${fileId}...\n(This would trigger actual download in production)`
          );
          break;
        case "delete":
          if (confirm("Are you sure you want to delete this file?")) {
            const index = window.filesData.findIndex((f) => f.id == fileId);
            if (index !== -1) {
              window.filesData.splice(index, 1);
              renderFilesGrid();
              alert("File deleted successfully!");
            }
          }
          break;
        default:
      }
      return;
    }

    // Close menus when clicking outside
    if (!fileActions && !threeDots && !menuItem) {
      document.querySelectorAll(".file-menu").forEach((menu) => {
        menu.style.display = "none";
      });
      document.querySelectorAll(".file-actions").forEach((fa) => {
        fa.classList.remove("active");
      });
    }
  });
}

function closeFileInfoModal() {
  const modal = document.getElementById("fileInfoModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function createModal() {
  if (document.getElementById("fileInfoModal")) {
    return;
  }

  const modalHTML = `
    <div id="fileInfoModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>File Information</h3>
          <span class="modal-close">&times;</span>
        </div>
        <div class="modal-body" id="fileInfoContent">
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  initModalEvents();
}

function initModalEvents() {
  if (modalInitialized) {
    return;
  }

  document.addEventListener("click", function (e) {
    const link = e.target.closest(".profile-menu a");

    if (link) {
      window.location.href = link.href;
    }

    if (e.target.classList.contains("modal-close")) {
      e.preventDefault();
      e.stopPropagation();
      closeFileInfoModal();
      return;
    }

    const modal = document.getElementById("fileInfoModal");
    if (modal && e.target === modal) {
      closeFileInfoModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const modal = document.getElementById("fileInfoModal");
      if (modal && modal.style.display === "flex") {
        closeFileInfoModal();
      }
    }
  });

  setTimeout(() => {
    const closeBtn = document.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeFileInfoModal();
      });
    }
  }, 100);

  modalInitialized = true;
}

function initFilterDropdowns() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      document
        .querySelectorAll(".custom-dropdown .dropdown-menu")
        .forEach((menu) => {
          menu.style.display = "none";
        });
    }
  });

  document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-btn");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (button && menu) {
      menu.style.display = "none";

      button.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();

        document
          .querySelectorAll(".custom-dropdown .dropdown-menu")
          .forEach((m) => {
            if (m !== menu) {
              m.style.display = "none";
            }
          });

        if (menu.style.display === "block") {
          menu.style.display = "block";
        } else {
          menu.style.display = "block";
          menu.style.top = "";
          menu.style.left = "";
          menu.style.position = "";
          menu.style.minWidth = "";
          menu.style.zIndex = "1000";
        }
      });

      menu.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", function (e) {
          e.stopPropagation();

          const value = this.getAttribute("data-value");
          const text = this.textContent;

          const buttonText = button.querySelector("span");
          if (buttonText) {
            buttonText.textContent = text;
          }

          menu.style.display = "none";

          const dropdownType =
            dropdown.getAttribute("data-filter") ||
            dropdown.getAttribute("data-type") ||
            "category";

          applyFilters(dropdownType, value);
        });
      });
    }
  });
}

// Flag to prevent duplicate event listeners for window version
let windowFileActionHandlersAttached = false;

window.attachFileActionHandlers = function () {
  // Use event delegation - only attach once
  if (windowFileActionHandlersAttached) return;
  windowFileActionHandlersAttached = true;

  // Single document-level click handler for all file actions
  document.addEventListener("click", function (e) {
    const threeDots = e.target.closest(".three-dots");
    const fileActions = e.target.closest(".file-actions");
    const menuItem = e.target.closest(".file-menu li");

    // Handle three dots click
    if (threeDots) {
      e.stopPropagation();
      e.preventDefault();

      const container = threeDots.closest(".file-actions");
      if (!container) return;

      const menu = threeDots.nextElementSibling;
      if (
        !menu ||
        !menu.classList.contains("dropdown-menu") ||
        !menu.classList.contains("file-menu")
      )
        return;

      // Check current state - handle both inline display and class-based
      const isOpen =
        menu.style.display === "block" ||
        container.classList.contains("active");

      if (isOpen) {
        menu.style.display = "none";
        container.classList.remove("active");
      } else {
        // Close all other menus first
        document.querySelectorAll(".file-menu").forEach((m) => {
          m.style.display = "none";
        });
        document.querySelectorAll(".file-actions").forEach((fa) => {
          fa.classList.remove("active");
        });

        // Open this menu
        menu.style.display = "block";
        menu.style.position = "absolute";
        menu.style.left = "auto";
        menu.style.right = "0";
        menu.style.top = "100%";
        menu.style.zIndex = "1000";
        container.classList.add("active");
      }
      return;
    }

    // Handle menu item clicks
    if (menuItem) {
      e.stopPropagation();
      e.preventDefault();

      const container = menuItem.closest(".file-actions");
      if (!container) return;

      const action = menuItem.dataset.action;
      const fileId = container.dataset.fileId;
      const menu = menuItem.closest(".dropdown-menu");

      // Close menu
      if (menu) {
        menu.style.display = "none";
        container.classList.remove("active");
      }

      switch (action) {
        case "file_info":
          showFileInfoModal(fileId);
          break;
        case "rename":
          showRenameModal(fileId);
          break;
        case "download":
          alert(`Download functionality for file ${fileId} would go here`);
          break;
        case "delete":
          showDeleteModal(fileId);
          break;
        default:
      }
      return;
    }

    // Close menus when clicking outside
    if (!fileActions && !threeDots && !menuItem) {
      document.querySelectorAll(".file-menu").forEach((menu) => {
        menu.style.display = "none";
      });
      document.querySelectorAll(".file-actions").forEach((fa) => {
        fa.classList.remove("active");
      });
    }
  });
};

function renderFilesGrid() {
  const filesGrid = document.getElementById("filesGrid");

  if (!filesGrid) {
    return;
  }

  if (
    !window.filesData ||
    !Array.isArray(window.filesData) ||
    window.filesData.length === 0
  ) {
    filesGrid.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  filesGrid.innerHTML = "";

  const fileCards = window.filesData.map((file) => {
    const starIcon = file.isStarred
      ? "assets/images/home/star.svg"
      : "assets/images/home/inactive_star.svg";

    const starClass = file.isStarred ? "star-icon" : "inactive-star-icon";

    return `
      <div class="file-card folder" data-file-id="${file.id}">
        <div class="file-thumbnail">
          <img src="${file.image}" alt="${file.name}" />
          <div class="file-rating">
            <img 
              src="${starIcon}" 
              alt="${file.isStarred ? "starred" : "not starred"}" 
              class="rating-icon ${starClass}"
            />
          </div>
        </div>
        <div class="file-info">
          <div class="file-name-wrapper">
            <div class="file-name">${file.name}</div>
            <div class="file-actions" data-file-id="${file.id}">
                <img src="assets/images/common/three_dot.svg" class="three-dots" />

                <ul class="dropdown-menu file-menu">
                  <li data-action="file_info"><img src="assets/images/common/action/info.svg" alt="info"/>File Information</li>
                  <li data-action="rename"><img src="assets/images/mydrive/rename.svg" alt="rename"/>Rename</li>
                  <li data-action="download"><img src="assets/images/common/action/download.svg" alt="download"/>Download</li>
                  <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Move to Bin</li>
                </ul>
            </div>
          </div>
          <div class="file-date">${file.date}</div>
        </div>
      </div>
    `;
  });

  filesGrid.innerHTML = fileCards.join("");

  attachFileActionHandlers();

  document.querySelectorAll(".file-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.closest(".file-actions") || e.target.closest(".three-dots"))
        return;
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("fileInfoModal")) {
    createModal();
  } else {
    initModalEvents();
  }

  renderFilesGrid();

  setTimeout(() => {
    initFilterDropdowns();
  }, 100);
});

window.initMyDrive = function () {
  if (!document.getElementById("fileInfoModal")) {
    createModal();
  } else {
    initModalEvents();
  }

  renderFilesGrid();

  setTimeout(() => {
    initFilterDropdowns();
  }, 100);
};

window.initHomePage = function () {
  renderFilesGrid();
};

window.addEventListener("load", function () {
  const filesGrid = document.getElementById("filesGrid");
  if (filesGrid && filesGrid.innerHTML.trim() === "") {
    renderFilesGrid();
  }
});

function addModalCSS() {
  if (document.getElementById("home-modal-css")) return;

  const css = `
    <style id="home-modal-css">
      /* Modal Styles */
      .modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #00000033;
        justify-content: center;
        align-items: center;
      }

      .modal-content {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: modalSlideIn 0.3s ease-out;
        position: relative;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 400;
        color: var(--text-base);
        font-family: var(--outfit);
      }

      .modal-close {
        font-size: 28px;
        cursor: pointer;
        color: #6b7280;
        line-height: 1;
        background: none;
        border: none;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
      }

      .modal-close:hover {
        color: #111827;
      }

      .modal-body {
        padding: 24px;
        padding-top: 0;
      }

      /* File info table styles */
      .file-info-table {
        width: 100%;
        border-collapse: collapse;
      }

      .file-info-table tbody {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .file-info-table tr {
        border-bottom: 0;
        display: flex;
        flex-direction: column;
      }

      .file-info-table tr:last-child {
        border-bottom: none;
      }

      .file-info-label {
        font-weight: 400;
        color: var(--text-base);
        padding: 0 0 5px;
        vertical-align: top;
        font-family: var(--outfit);
        font-size: 16px;
      }
        
        .file-info-value {
          color: #707070;
          font-weight: 400;
          font-family: var(--outfit);
          font-size: 14px;
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", css);
}

function addDropdownCSS() {
  if (document.getElementById("home-dropdown-css")) return;

  const css = `
    <style id="home-dropdown-css">
      /* Dropdown styles for filters */
      .custom-dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-btn {
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #333;
        min-width: 100px;
      }

      .dropdown-btn:hover {
        background: #f5f5f5;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: max-content;
        z-index: 1000;
        margin-top: 4px;
        list-style: none;
        padding: 8px 0;
        max-height: 300px;
        overflow-y: auto;
      }

      .dropdown-menu li {
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .dropdown-menu li:hover {
        background: #f0f0f0;
      }

      .dropdown-menu li img {
        width: 16px;
        height: 16px;
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", css);
}

function addRenameModalCSS() {
  if (document.getElementById("rename-modal-css")) return;

  const css = `
    <style id="rename-modal-css">
      /* Rename Modal Specific Styles */
      .file-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: none;
        align-items: center;
        justify-content: center;
      }
      
      .file-modal.active {
        display: flex;
      }
      
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #00000033;
      }
      
      .rename-modal {
        position: relative;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
        overflow: hidden;
        z-index: 10000;
        max-width: 450px;
        width: 90%;
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .modal-body {
        padding: 24px;
        padding-top: 0;
      }
    
      .file-icon-small {
        width: 40px;
        height: 40px;
        background: #f3f4f6;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .file-icon-small img {
        width: 24px;
        height: 24px;
      }
      
      .rename-input-group {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
      }
      
      .rename-input {
        width: 100%;
        padding: 12px 16px;
        padding-right: 60px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.2s ease;
      }
      
      .rename-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      .rename-input.error {
        border-color: #dc2626;
      }
      
      .file-extension {
        position: absolute;
        right: 12px;
        color: #6b7280;
        font-size: 14px;
        pointer-events: none;
        user-select: none;
      }
      
      .rename-info {
        background: #f9fafb;
        border-radius: 6px;
        padding: 12px 16px;
        font-size: 13px;
        color: #6b7280;
        border-left: 3px solid #3b82f6;
      }
      
      .rename-info p {
        margin: 0;
      }
      
      .rename-info strong {
        color: #111827;
      }
      
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 20px 24px;
        padding-top: 0;
      }
      
      .btn-primary, .btn-secondary {
        padding: 10px 20px;
        border-radius: 100px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        min-width: 80px;
      }
      
      .btn-primary {
        background: #0000FF;
        color: white;
          font-family: var(--outfit);

      }
      
      .btn-primary:hover {
        background: #2563eb;
      }
      
      .btn-secondary {
        background: transparent;
        color: var(--text-base);
      }
      
      /* Toast Notification */
      .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 99999;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        font-size: 14px;
        max-width: 300px;
      }
      
      .toast.show {
        transform: translateY(0);
        opacity: 1;
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .toast-content::before {
        content: "✓";
        font-weight: bold;
        font-size: 16px;
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", css);
}

function addDeleteModalCSS() {
  if (document.getElementById("delete-modal-css")) return;

  const css = `
    <style id="delete-modal-css">
      /* Delete Modal Specific Styles */
      .delete-modal {
        max-width: 450px;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 400;
        color: var(--text-base);
        font-family: var(--outfit);
      }
      
      .delete-message p {
        margin: 0 0 10px 0;
        color: #707070;
        font-size: 18px;
        line-height: 1.5;
        margin-bottom: 0;
        font-weight: 400;
        font-family: var(--outfit);
      }
      
      .delete-message strong {
        color: var(--text-base);
        font-weight: 400;
        font-family: var(--outfit);
        font-size: 18px;
      }
      
      .btn-danger {
        background: #F60000;
        color: white;
        padding: 10px 20px;
        border-radius: 100px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        min-width: 80px;
        font-family: var(--outfit);
      }

      .cancel-delete-btn {
        background: transparent;
        color: var(--text-base);
        font-family: var(--outfit);
        font-size: 14px;
        font-weight: 500;
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", css);
}

addModalCSS();
addDropdownCSS();
addRenameModalCSS();
addDeleteModalCSS();
