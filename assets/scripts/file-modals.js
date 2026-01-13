window.FileModals = {
  currentFile: null,
  fileData: null,

  init: function () {
    this.fileData = window.mydriveFilesData || [];
    this.bindModalEvents();
  },

  bindModalEvents: function () {
    document
      .querySelectorAll(
        ".modal-overlay, .modal-close, .btn-secondary[data-modal]"
      )
      .forEach((el) => {
        el.addEventListener("click", (e) => {
          const modalId = e.target.getAttribute("data-modal");
          this.closeModal(modalId);
        });
      });

    const confirmRenameBtn = document.getElementById("confirmRenameBtn");
    if (confirmRenameBtn) {
      confirmRenameBtn.addEventListener("click", () => {
        this.handleRenameConfirm();
      });
    }

    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener("click", () => {
        this.handleDeleteConfirm();
      });
    }

    const renameInput = document.getElementById("renameInput");
    if (renameInput) {
      renameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleRenameConfirm();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
      }
    });
  },

  openModal: function (modalId, fileId) {
    this.currentFile = this.fileData.find((f) => f.id == fileId);

    if (!this.currentFile) {
      console.error("File not found:", fileId);
      return;
    }

    switch (modalId) {
      case "fileInfoModal":
        this.prepareFileInfoModal();
        break;
      case "renameModal":
        this.prepareRenameModal();
        break;
      case "deleteModal":
        this.prepareDeleteModal();
        break;
    }

    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const input = modal.querySelector("input");
        if (input) {
          input.focus();
          input.select();
        }
      }, 100);
    }
  },

  closeModal: function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
    }

    if (!document.querySelector(".file-modal.active")) {
      document.body.style.overflow = "";
    }

    this.currentFile = null;
  },

  closeAllModals: function () {
    document.querySelectorAll(".file-modal").forEach((modal) => {
      modal.classList.remove("active");
    });
    document.body.style.overflow = "";
    this.currentFile = null;
  },

  prepareFileInfoModal: function () {
    const file = this.currentFile;

    const modalIcon = document.getElementById("modalFileIcon");
    const modalName = document.getElementById("modalFileName");
    const modalCategory = document.getElementById("modalFileCategory");
    const modalType = document.getElementById("modalFileType");
    const modalSize = document.getElementById("modalFileSize");
    const modalUploaded = document.getElementById("modalFileUploaded");
    const modalModified = document.getElementById("modalFileModified");

    if (modalIcon) modalIcon.src = file.icon;
    if (modalName) modalName.textContent = file.name;
    if (modalCategory) modalCategory.textContent = file.category;
    if (modalType)
      modalType.textContent = this.getFileType(file.format || file.type);
    if (modalSize) modalSize.textContent = file.size;
    if (modalUploaded) modalUploaded.textContent = file.uploaded;
    if (modalModified)
      modalModified.textContent = this.getModifiedDate(file.date);
  },

  prepareRenameModal: function () {
    const file = this.currentFile;

    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf(".");
    const nameWithoutExt =
      lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : "";

    const renameIcon = document.getElementById("renameFileIcon");
    const renameInput = document.getElementById("renameInput");
    const renameExtension = document.getElementById("renameExtension");

    if (renameIcon) renameIcon.src = file.icon;
    if (renameInput) renameInput.value = nameWithoutExt;
    if (renameExtension) renameExtension.textContent = extension;
  },

  prepareDeleteModal: function () {
    const file = this.currentFile;
    const deleteFileName = document.getElementById("deleteFileName");
    if (deleteFileName) deleteFileName.textContent = file.name;
  },

  handleRenameConfirm: function () {
    const renameInput = document.getElementById("renameInput");
    const renameExtension = document.getElementById("renameExtension");

    if (!renameInput || !renameExtension) return;

    const newName = renameInput.value.trim();
    const extension = renameExtension.textContent;

    if (!newName) {
      alert("Please enter a file name");
      return;
    }

    const fullName = newName + extension;

    const fileIndex = this.fileData.findIndex(
      (f) => f.id === this.currentFile.id
    );
    if (fileIndex !== -1) {
      this.fileData[fileIndex].name = fullName;

      this.updateFileInUI(this.currentFile.id, fullName);

    }

    this.closeModal("renameModal");
  },

  handleDeleteConfirm: function () {
    const fileId = this.currentFile.id;
    const fileName = this.currentFile.name;


    const fileIndex = this.fileData.findIndex((f) => f.id === fileId);
    if (fileIndex !== -1) {
      this.fileData.splice(fileIndex, 1);

      this.removeFileFromUI(fileId);

      alert(`File "${fileName}" has been deleted.`);
    }

    this.closeModal("deleteModal");
  },

  updateFileInUI: function (fileId, newName) {
    const gridCard = document.querySelector(
      `.file-card[data-file-id="${fileId}"] .file-name`
    );
    if (gridCard) {
      gridCard.textContent = newName;
    }

    const listRow = document.querySelector(
      `.file-row[data-file-id="${fileId}"] .file-name-table`
    );
    if (listRow) {
      listRow.textContent = newName;
    }
  },

  removeFileFromUI: function (fileId) {
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
  },

  getFileType: function (format) {
    const typeMap = {
      fig: "Design",
      pdf: "Document",
      zip: "Archive",
      docx: "Document",
      xlsx: "Spreadsheet",
      ppt: "Presentation",
    };
    return typeMap[format] || format;
  },

  getModifiedDate: function (date) {
    try {
      const originalDate = new Date(date);
      const modifiedDate = new Date(originalDate);
      modifiedDate.setDate(modifiedDate.getDate() + 2);
      return modifiedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return date;
    }
  },

  downloadFile: function (fileId) {
    const file = this.fileData.find((f) => f.id == fileId);
    if (file) {

      alert(`Downloading "${file.name}"...`);
    }
  },
};

window.attachFileActionHandlers = function () {
  document.querySelectorAll(".file-actions").forEach((actionsEl) => {
    const fileId = actionsEl.getAttribute("data-file-id");
    if (!fileId) return;

    const threeDots = actionsEl.querySelector(".three-dots");
    const menu = actionsEl.querySelector(".file-menu");

    if (!threeDots || !menu) return;

    const newThreeDots = threeDots.cloneNode(true);
    const newMenu = menu.cloneNode(true);

    threeDots.parentNode.replaceChild(newThreeDots, threeDots);
    menu.parentNode.replaceChild(newMenu, menu);

    newThreeDots.addEventListener("click", function (e) {
      e.stopPropagation();

      document.querySelectorAll(".file-actions.active").forEach((el) => {
        if (el !== actionsEl) {
          el.classList.remove("active");
        }
      });

      actionsEl.classList.toggle("active");

      positionMenuProperly(newMenu, actionsEl);
    });

    newMenu.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        const action = this.getAttribute("data-action");

        actionsEl.classList.remove("active");

        switch (action) {
          case "file_info":
            if (window.FileModals && window.FileModals.openModal) {
              window.FileModals.openModal("fileInfoModal", fileId);
            }
            break;
          case "rename":
            if (window.FileModals && window.FileModals.openModal) {
              window.FileModals.openModal("renameModal", fileId);
            }
            break;
          case "delete":
            if (window.FileModals && window.FileModals.openModal) {
              window.FileModals.openModal("deleteModal", fileId);
            }
            break;
          case "download":
            if (window.FileModals && window.FileModals.downloadFile) {
              window.FileModals.downloadFile(fileId);
            }
            break;
        }
      });
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".file-actions")) {
      document.querySelectorAll(".file-actions.active").forEach((el) => {
        el.classList.remove("active");
      });
    }
  });
};

function positionMenuProperly(menu, actionsEl) {
  menu.style.left = "";
  menu.style.right = "";
  menu.classList.remove("open-left");

  const viewportWidth = window.innerWidth;
  const menuRect = menu.getBoundingClientRect();
  const triggerRect = actionsEl.getBoundingClientRect();

  if (triggerRect.right + menuRect.width > viewportWidth) {
    menu.style.left = "0";
    menu.style.right = "auto";
    menu.classList.add("open-left");
  } else {
    menu.style.left = "auto";
    menu.style.right = "0";
  }
}
