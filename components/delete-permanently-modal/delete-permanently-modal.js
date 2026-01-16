class DeletePermanentlyModal {
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
    if (document.getElementById("delete-permanently-toast-styles")) return;

    const css = `
            <style id="delete-permanently-toast-styles">
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

  initialize() {
    const init = () => {
      this.setupModal();
      if (this.modal) {
        this.setupEventListeners();
      }
      this.setupGlobalDeleteHandler();
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
      this.setupGlobalDeleteHandler();
    });
  }

  setupModal() {
    this.modal = document.getElementById("deletePermanentlyModal");

    if (!this.modal) {
      this.createModal();
      this.modal = document.getElementById("deletePermanentlyModal");
    }
  }

  createModal() {
    const modalHTML = `
            <div class="delete-permanently-modal-overlay" id="deletePermanentlyModal" style="display: none;">
                <div class="delete-permanently-modal">
                    <div class="delete-permanently-modal-header-top">
                        <h3>Delete Permanently</h3>
                        <button class="close-modal-btn" id="closeDeletePermanentlyModal">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <div class="delete-permanently-modal-header">
                        <p>Are you sure you want to delete this file permanently? This action cannot be undone.</p>
                    </div>
                    
                    <div class="delete-permanently-modal-actions">
                        <button class="delete-permanently-modal-btn cancel-btn" id="cancelDeletePermanently">Cancel</button>
                        <button class="delete-permanently-modal-btn confirm-btn" id="confirmDeletePermanently">Delete Permanently</button>
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

    const closeBtn = document.getElementById("closeDeletePermanentlyModal");
    if (closeBtn) {
      this.closeHandler = () => this.hideModal();
      closeBtn.addEventListener("click", this.closeHandler);
    }

    const cancelBtn = document.getElementById("cancelDeletePermanently");
    if (cancelBtn) {
      this.cancelHandler = () => this.hideModal();
      cancelBtn.addEventListener("click", this.cancelHandler);
    }

    const confirmBtn = document.getElementById("confirmDeletePermanently");
    if (confirmBtn) {
      this.confirmHandler = () => this.performDelete();
      confirmBtn.addEventListener("click", this.confirmHandler);
    }

    this.eventListenersSetup = true;
  }

  setupGlobalDeleteHandler() {
    if (!this.globalHandlerSetup) {
      this.globalClickHandler = (e) => {
        const menuItem = e.target.closest(
          '.file-menu li[data-action="delete"]'
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
        const cancelBtn = document.getElementById("cancelDeletePermanently");
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

  performDelete() {
    if (!this.currentFileId) {
      this.hideModal();
      return;
    }

    const fileId = this.currentFileId;

    if (window.binFilesData && Array.isArray(window.binFilesData)) {
      const fileIndex = window.binFilesData.findIndex((f) => f.id == fileId);
      if (fileIndex !== -1) {
        const fileName = window.binFilesData[fileIndex].name;
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

        this.showToast(`File permanently deleted.`);
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

  triggerDelete(fileId) {
    this.currentFileId = fileId;
    this.showModal();
  }
}

window.DeletePermanentlyModal = new DeletePermanentlyModal();
