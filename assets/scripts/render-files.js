let modalInitialized = false;

function showFileInfoModal(fileId) {
  const file = window.filesData.find((f) => f.id == fileId);
  if (!file) {
    console.error("File not found:", fileId);
    return;
  }

  const modalContent = `
    <table class="file-info-table">
      <tr>
        <td class="file-info-label">Name:</td>
        <td class="file-info-value">${file.name}</td>
      </tr>
      <tr>
        <td class="file-info-label">Type:</td>
        <td class="file-info-value">${file.category || "File"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Size:</td>
        <td class="file-info-value">${file.size || "N/A"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Uploaded:</td>
        <td class="file-info-value">${file.date || file.uploaded || "N/A"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Starred:</td>
        <td class="file-info-value">${file.isStarred ? "Yes" : "No"}</td>
      </tr>
      <tr>
        <td class="file-info-label">Shared:</td>
        <td class="file-info-value">Yes</td>
      </tr>
      <tr>
        <td class="file-info-label">Location:</td>
        <td class="file-info-value">My Drive</td>
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
    console.error("File not found:", fileId);
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
    console.error("File not found:", fileId);
    return;
  }

  const modalHTML = `
    <div id="deleteModal" class="file-modal active">
      <div class="modal-overlay"></div>
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h3>Delete File</h3>
          <span class="modal-close delete-close">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="delete-warning-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <div class="delete-message">
            <p>Are you sure you want to delete <strong>"${file.name
    }"</strong>?</p>
            <p class="delete-subtext">This action cannot be undone. The file will be permanently removed from your drive.</p>
          </div>
          
          <div class="file-delete-info">
            <div class="delete-info-row">
              <span class="delete-info-label">Type:</span>
              <span class="delete-info-value">${file.category || "File"}</span>
            </div>
            <div class="delete-info-row">
              <span class="delete-info-label">Size:</span>
              <span class="delete-info-value">${file.size || "N/A"}</span>
            </div>
            <div class="delete-info-row">
              <span class="delete-info-label">Uploaded:</span>
              <span class="delete-info-value">${file.date || file.uploaded || "N/A"
    }</span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn-secondary cancel-delete-btn">Cancel</button>
          <button type="button" class="btn-danger confirm-delete-btn">Delete</button>
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
        console.error("File not found for deletion:", fileId);
        closeModal();
        return;
      }

      const fileIndex = window.filesData.findIndex(
        (f) => f.id == fileId
      );
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

function attachFileActionHandlers() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".file-actions") && !e.target.closest(".three-dots")) {
      document.querySelectorAll(".file-menu").forEach((menu) => {
        menu.style.display = "none";
      });
    }
  });

  document.querySelectorAll(".three-dots").forEach((dots) => {
    dots.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      const fileActions = this.closest(".file-actions");
      if (!fileActions) return;

      const menu = this.nextElementSibling;

      if (!menu || !menu.classList.contains("dropdown-menu")) return;

      if (menu.style.display === "block") {
        menu.style.display = "none";
      } else {
        document.querySelectorAll(".dropdown-menu").forEach((m) => {
          m.style.display = "none";
        });

        menu.style.display = "block";
        menu.style.position = "absolute";
        menu.style.left = "auto";
        menu.style.right = "0";
        menu.style.top = "100%";
        menu.style.zIndex = "1000";
      }
    });
  });

  document.querySelectorAll(".file-menu li").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      const action = this.dataset.action;
      const fileActions = this.closest(".file-actions");
      if (!fileActions) return;

      const fileId = fileActions.dataset.fileId;

      const menu = this.closest(".dropdown-menu");
      if (menu) {
        menu.style.display = "none";
      }

      switch (action) {
        case "file_info":
          const file = window.filesData.find((f) => f.id == fileId);
          if (file) {
            alert(`File Information:\n\nName: ${file.name}\nType: ${file.category || "File"}\nSize: ${file.size}\nDate: ${file.date}\nStarred: ${file.isStarred ? "Yes" : "No"}`);
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
          alert(`Downloading file ${fileId}...\n(This would trigger actual download in production)`);
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
    });
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

window.attachFileActionHandlers = function () {
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".file-actions") &&
      !e.target.closest(".three-dots")
    ) {
      document.querySelectorAll(".file-menu").forEach((menu) => {
        menu.style.display = "none";
      });
    }
  });

  document.querySelectorAll(".three-dots").forEach((dots) => {
    dots.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      const fileActions = this.closest(".file-actions");
      if (!fileActions) return;

      const fileId = fileActions.dataset.fileId;
      const menu = this.nextElementSibling;

      if (!menu || !menu.classList.contains("dropdown-menu")) return;

      if (menu.style.display === "block") {
        menu.style.display = "none";
      } else {
        document.querySelectorAll(".dropdown-menu").forEach((m) => {
          m.style.display = "none";
        });

        menu.style.display = "block";
        menu.style.position = "absolute";
        menu.style.left = "auto";
        menu.style.right = "0";
        menu.style.top = `100%`;
        menu.style.zIndex = "1000";
      }
    });
  });

  document.querySelectorAll(".file-menu li").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      const action = this.dataset.action;
      const fileActions = this.closest(".file-actions");
      if (!fileActions) return;

      const fileId = fileActions.dataset.fileId;

      const menu = this.closest(".dropdown-menu");
      if (menu) {
        menu.style.display = "none";
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
    });
  });
};

function renderFilesGrid() {
  const filesGrid = document.getElementById("filesGrid");

  if (!filesGrid) {
    console.error("Files grid element not found!");
    return;
  }

  if (
    !window.filesData ||
    !Array.isArray(window.filesData) ||
    window.filesData.length === 0
  ) {
    console.error("filesData is not defined or empty!");
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
                  <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Delete</li>
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
      const fileId = this.getAttribute("data-file-id");
      const file = window.filesData.find((f) => f.id == fileId);
      if (file) {

        alert(
          `Opening file: ${file.name}\nType: ${file.type}\nSize: ${file.size}`
        );
      }
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
  if (document.getElementById("mydrive-modal-css")) return;

  const css = `
    <style id="mydrive-modal-css">
      /* Modal Styles */
      .modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
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
        border-bottom: 1px solid #e5e7eb;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #111827;
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
      }

      /* File info table styles */
      .file-info-table {
        width: 100%;
        border-collapse: collapse;
      }

      .file-info-table tr {
        border-bottom: 1px solid #f3f4f6;
      }

      .file-info-table tr:last-child {
        border-bottom: none;
      }

      .file-info-table td {
        padding: 12px 0;
        vertical-align: top;
      }

      .file-info-label {
        font-weight: 500;
        color: #374151;
        width: 120px;
        padding-right: 16px;
      }

      .file-info-value {
        color: #111827;
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", css);
}

function addDropdownCSS() {
  if (document.getElementById("mydrive-dropdown-css")) return;

  const css = `
    <style id="mydrive-dropdown-css">
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
        min-width: 120px;
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

      .dropdown-menu li.danger {
        color: #dc2626;
      }

      .dropdown-menu li.danger:hover {
        background: #fee2e2;
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
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
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
        border-top: 1px solid #e5e7eb;
      }
      
      .btn-primary, .btn-secondary {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        min-width: 80px;
      }
      
      .btn-primary {
        background: #3b82f6;
        color: white;
      }
      
      .btn-primary:hover {
        background: #2563eb;
      }
      
      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }
      
      .btn-secondary:hover {
        background: #e5e7eb;
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
      
      .delete-warning-icon {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }
      
      .delete-message {
        text-align: center;
        margin-bottom: 24px;
      }
      
      .delete-message p {
        margin: 0 0 10px 0;
        color: #374151;
        font-size: 15px;
        line-height: 1.5;
      }
      
      .delete-message strong {
        color: #111827;
      }
      
      .delete-subtext {
        color: #6b7280 !important;
        font-size: 13px !important;
        margin-top: 8px !important;
      }
      
      .file-delete-info {
        background: #f9fafb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 10px;
      }
      
      .delete-info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .delete-info-row:last-child {
        border-bottom: none;
      }
      
      .delete-info-label {
        color: #6b7280;
        font-size: 13px;
        font-weight: 500;
      }
      
      .delete-info-value {
        color: #111827;
        font-weight: 500;
        font-size: 13px;
      }
      
      .btn-danger {
        background: #dc2626;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        min-width: 80px;
      }
      
      .btn-danger:hover {
        background: #b91c1c;
      }
      
      .btn-danger:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", css);
}

addModalCSS();
addDropdownCSS();
addRenameModalCSS();
addDeleteModalCSS();
