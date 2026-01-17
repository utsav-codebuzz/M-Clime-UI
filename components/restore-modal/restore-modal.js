class RestoreModal {
  constructor() {
    this.modal = null;
    this.currentFileId = null;
    this.eventListenersSetup = false;
    this.globalHandlerSetup = false;
    this.toastStylesAdded = false;
    this.initialize();
  }

  showToast(message) {
    if (!this.toastStylesAdded) {
      this.addToastStyles();
      this.toastStylesAdded = true;
    }

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

  addToastStyles() {
    if (document.getElementById("restore-toast-styles")) return;

    const css = `
            <style id="restore-toast-styles">
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

  initialize() {
    const init = () => {
      this.setupModal();
      if (this.modal) {
        this.setupEventListeners();
      }
      this.setupGlobalRestoreHandler();
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }

    document.addEventListener("componentsLoaded", () => {
      this.setupModal();
      if (this.modal && !this.eventListenersSetup) {
        this.setupEventListeners();
      }
      this.setupGlobalRestoreHandler();
    });
  }

  setupModal() {
    this.modal = document.getElementById("restoreModal");

    if (!this.modal) {
      this.createModal();
      this.modal = document.getElementById("restoreModal");
    }
  }

  createModal() {
    const modalHTML = `
            <div class="restore-modal-overlay" id="restoreModal" style="display: none;">
                <div class="restore-modal">
                    <div class="restore-modal-header-top">
                        <h3>Restore File</h3>
                        <button class="close-modal-btn" id="closeRestoreModal">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <div class="restore-modal-header">
                        <p>Are you sure you want to restore this file? It will be moved back to your drive.</p>
                    </div>
                    
                    <div class="restore-modal-actions">
                        <button class="restore-modal-btn cancel-btn" id="cancelRestore">Cancel</button>
                        <button class="restore-modal-btn confirm-btn" id="confirmRestore">Restore</button>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    if (typeof feather !== "undefined") {
      feather.replace();
    }
  }

  setupEventListeners() {
    if (!this.modal || this.eventListenersSetup) {
      return;
    }

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });

    this.escapeHandler = (e) => {
      if (
        e.key === "Escape" &&
        this.modal &&
        this.modal.style.display === "flex"
      ) {
        this.hideModal();
      }
    };
    document.addEventListener("keydown", this.escapeHandler);

    const closeBtn = document.getElementById("closeRestoreModal");
    if (closeBtn) {
      this.closeHandler = () => this.hideModal();
      closeBtn.addEventListener("click", this.closeHandler);
    }

    const cancelBtn = document.getElementById("cancelRestore");
    if (cancelBtn) {
      this.cancelHandler = () => this.hideModal();
      cancelBtn.addEventListener("click", this.cancelHandler);
    }

    const confirmBtn = document.getElementById("confirmRestore");
    if (confirmBtn) {
      this.confirmHandler = () => this.performRestore();
      confirmBtn.addEventListener("click", this.confirmHandler);
    }

    this.eventListenersSetup = true;
  }

  setupGlobalRestoreHandler() {
    if (!this.globalHandlerSetup) {
      this.globalClickHandler = (e) => {
        const menuItem = e.target.closest(
          '.file-menu li[data-action="restore"]'
        );
        if (menuItem) {
          const isBinPage =
            window.location.pathname.includes("bin.html") ||
            document.querySelector(".page-title")?.textContent.trim() ===
              "Bin" ||
            document.body.contains(document.querySelector("#filesContainer"));

          if (isBinPage) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const fileActions = menuItem.closest(".file-actions");
            if (fileActions) {
              const fileId = fileActions.getAttribute("data-file-id");

              if (fileId) {
                const menu = fileActions.querySelector(".file-menu");
                if (menu) {
                  menu.style.display = "none";
                }
                fileActions.classList.remove("active");

                this.currentFileId = fileId;
                this.showModal();
              }
            }
          }
        }
      };
      document.addEventListener("click", this.globalClickHandler, true);
      this.globalHandlerSetup = true;
    }
  }

  showModal() {
    if (!this.modal) {
      this.setupModal();
    }

    if (this.modal && !this.eventListenersSetup) {
      this.setupEventListeners();
    }

    if (this.modal) {
      this.modal.style.display = "flex";
      document.body.style.overflow = "hidden";

      if (typeof feather !== "undefined") {
        feather.replace();
      }

      setTimeout(() => {
        const cancelBtn = document.getElementById("cancelRestore");
        if (cancelBtn) {
          cancelBtn.focus();
        }
      }, 100);
    }
  }

  hideModal() {
    if (this.modal) {
      this.modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    this.currentFileId = null;
  }

  performRestore() {
    if (!this.currentFileId) {
      this.hideModal();
      return;
    }

    const fileId = this.currentFileId;

    if (window.binFilesData && Array.isArray(window.binFilesData)) {
      const fileIndex = window.binFilesData.findIndex((f) => f.id == fileId);
      if (fileIndex !== -1) {
        const fileName = window.binFilesData[fileIndex].name;
        const fileToRestore = window.binFilesData[fileIndex];

        window.binFilesData.splice(fileIndex, 1);

        if (window.originalFilesData) {
          const originalIndex = window.originalFilesData.findIndex(
            (f) => f.id == fileId
          );
          if (originalIndex !== -1) {
            window.originalFilesData.splice(originalIndex, 1);
          }
        }

        this.removeFileFromUI(fileId);

        const currentView = window.starredCurrentView || "grid";
        if (
          currentView === "grid" &&
          typeof renderGridViewStarred === "function"
        ) {
          renderGridViewStarred();
        } else if (
          currentView === "list" &&
          typeof renderListViewStarred === "function"
        ) {
          renderListViewStarred();
        }

        this.showToast(`File has been restored.`);
      }
    }

    this.hideModal();
  }

  removeFileFromUI(fileId) {
    const gridCard = document.querySelector(
      `.file-card[data-file-id="${fileId}"]`
    );
    if (gridCard) {
      gridCard.remove();
    }

    const listRow = document.querySelector(
      `.file-row[data-file-id="${fileId}"]`
    );
    if (listRow) {
      listRow.remove();
    }
  }

  triggerRestore(fileId) {
    this.currentFileId = fileId;
    this.showModal();
  }
}

window.RestoreModal = new RestoreModal();
