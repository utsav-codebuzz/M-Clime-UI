let starredCurrentView = "grid";
let modalInitialized = false;

function showFileInfoModal(fileId) {
  const file = window.binFilesData.find((f) => f.id == fileId);
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

function initFilterDropdowns() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      document
        .querySelectorAll(".custom-dropdown .dropdown-menu")
        .forEach((menu) => (menu.style.display = "none"));
    }
  });

  document
    .querySelectorAll(".custom-dropdown:not(#sortDropdown)")
    .forEach((dropdown) => {
      const button = dropdown.querySelector(".dropdown-btn");
      const menu = dropdown.querySelector(".dropdown-menu");

      if (!button || !menu) return;

      menu.style.display = "none";

      button.addEventListener("click", function (e) {
        e.stopPropagation();

        document
          .querySelectorAll(".custom-dropdown .dropdown-menu")
          .forEach((m) => {
            if (m !== menu) m.style.display = "none";
          });

        menu.style.display = menu.style.display === "block" ? "none" : "block";

        menu.style.zIndex = "1000";
      });

      menu.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", function (e) {
          e.stopPropagation();

          if (
            !dropdown.hasAttribute("data-filter") &&
            !dropdown.hasAttribute("data-type")
          ) {
            return;
          }

          const value = this.getAttribute("data-value");
          const text = this.textContent;

          const buttonText = button.querySelector("span");
          if (buttonText) buttonText.textContent = text;

          menu.style.display = "none";

          const dropdownType =
            dropdown.getAttribute("data-filter") ||
            dropdown.getAttribute("data-type");

          applyFilters(dropdownType, value);
        });
      });
    });

  const sortDropdown = document.getElementById("sortDropdown");
  if (sortDropdown) {
    const sortButton = document.getElementById("sortButton");
    const sortMenu = document.getElementById("sortMenu");
    const applyCustomDateBtn = document.getElementById("applyCustomDate");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    const today = new Date().toISOString().split("T")[0];
    if (startDateInput) startDateInput.max = today;
    if (endDateInput) endDateInput.max = today;

    const sortItems = sortMenu.querySelectorAll(".sort-item");
    sortItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        sortItems.forEach((i) => i.classList.remove("active"));

        this.classList.add("active");

        const value = this.getAttribute("data-value");

        if (value === "custom") {
          sortMenu.classList.add("show-custom");
        } else {
          sortMenu.classList.remove("show-custom");

          const buttonText = sortButton.querySelector("span");
          if (buttonText) {
            buttonText.textContent = this.textContent.replace("›", "").trim();
          }

          sortDropdown.classList.remove("active");
          applyFilters("sort", value);
        }
      });
    });

    if (applyCustomDateBtn) {
      applyCustomDateBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const startDate = startDateInput?.value;
        const endDate = endDateInput?.value;

        if (!startDate || !endDate) {
          alert("Please select both start and end dates");
          return;
        }

        if (new Date(startDate) > new Date(endDate)) {
          alert("Start date cannot be after end date");
          return;
        }

        const buttonText = sortButton.querySelector("span");
        if (buttonText) {
          buttonText.textContent = "Custom Date";
        }

        sortDropdown.classList.remove("active");
        sortMenu.classList.remove("show-custom");

        applyFilters("sort", "custom", { startDate, endDate });
      });
    }
  }
}

function applyFilters(filterType, value, customData = null) {
  if (!window.binFilesData) return;

  if (!window.originalFilesData) {
    window.originalFilesData = [...window.binFilesData];
  }

  let filteredFiles = [...window.originalFilesData];

  switch (filterType) {
    case "category":
      if (value !== "all") {
        filteredFiles = filteredFiles.filter((file) => file.category === value);
      }
      break;

    case "sort":
      if (value === "custom" && customData) {
        const startDate = new Date(customData.startDate);
        const endDate = new Date(customData.endDate);
        endDate.setHours(23, 59, 59, 999);

        filteredFiles = filteredFiles.filter((file) => {
          const fileDate = new Date(file.uploaded || file.date);
          return fileDate >= startDate && fileDate <= endDate;
        });

        filteredFiles.sort(
          (a, b) =>
            new Date(b.uploaded || b.date) - new Date(a.uploaded || a.date)
        );
      } else if (value === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        filteredFiles = filteredFiles.filter((file) => {
          const fileDate = new Date(file.uploaded || file.date);
          return fileDate.toISOString().split("T")[0] === yesterdayStr;
        });
      } else if (value === "7days") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        filteredFiles = filteredFiles.filter((file) => {
          const fileDate = new Date(file.uploaded || file.date);
          return fileDate >= weekAgo;
        });
      } else if (value === "30days") {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);

        filteredFiles = filteredFiles.filter((file) => {
          const fileDate = new Date(file.uploaded || file.date);
          return fileDate >= monthAgo;
        });
      } else if (value === "thisyear") {
        const currentYear = new Date().getFullYear();
        filteredFiles = filteredFiles.filter((file) => {
          const fileYear = new Date(file.uploaded || file.date).getFullYear();
          return fileYear === currentYear;
        });
      } else if (value === "lastyear") {
        const lastYear = new Date().getFullYear() - 1;
        filteredFiles = filteredFiles.filter((file) => {
          const fileYear = new Date(file.uploaded || file.date).getFullYear();
          return fileYear === lastYear;
        });
      } else if (value === "name") {
        filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
      } else if (value === "size") {
        const getSizeValue = (sizeStr) => {
          if (!sizeStr) return 0;
          const num = parseFloat(sizeStr);
          if (sizeStr.includes("GB")) return num * 1000;
          if (sizeStr.includes("MB")) return num;
          return num;
        };
        filteredFiles.sort(
          (a, b) => getSizeValue(b.size) - getSizeValue(a.size)
        );
      } else if (value === "all") {
        filteredFiles.sort(
          (a, b) =>
            new Date(b.uploaded || b.date) - new Date(a.uploaded || a.date)
        );
      }
      break;

    default:
      break;
  }

  window.binFilesData = filteredFiles;

  if (currentView === "grid") {
    renderGridView();
  } else {
    renderListView();
  }
}

let starredFileActionHandlersAttached = false;

window.attachFileActionHandlers = function () {
  if (starredFileActionHandlersAttached) return;
  starredFileActionHandlersAttached = true;

  document.addEventListener("click", function (e) {
    const threeDots = e.target.closest(".three-dots");
    const fileActions = e.target.closest(".file-actions");
    const menuItem = e.target.closest(".file-menu li");

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

      const isOpen =
        menu.style.display === "block" ||
        container.classList.contains("active");

      if (isOpen) {
        menu.style.display = "none";
        container.classList.remove("active");
      } else {
        document.querySelectorAll(".file-menu").forEach((m) => {
          m.style.display = "none";
        });
        document.querySelectorAll(".file-actions").forEach((fa) => {
          fa.classList.remove("active");
        });

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

    if (menuItem) {
      e.stopPropagation();
      e.preventDefault();

      const container = menuItem.closest(".file-actions");
      if (!container) return;

      const action = menuItem.dataset.action;
      const fileId = container.dataset.fileId;
      const menu = menuItem.closest(".dropdown-menu");

      if (menu) {
        menu.style.display = "none";
        container.classList.remove("active");
      }

      switch (action) {
        case "file_info":
          showFileInfoModal(fileId);
          break;
        default:
      }
      return;
    }

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

function renderGridViewStarred() {
  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    return;
  }

  if (!window.binFilesData || !Array.isArray(window.binFilesData)) {
    filesContainer.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  filesContainer.className = "files-grid";

  const fileCards = window.binFilesData.map((file) => {
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
              <img
                src="assets/images/common/three_dot.svg"
                class="three-dots"
                alt="options"
              />

              <ul class="dropdown-menu file-menu">
                <li data-action="file_info"><img src="assets/images/common/action/info.svg" alt="info"/>File Information</li>
                <li data-action="restore"><img src="assets/images/common/action/restore.svg" alt="restore"/>Restore</li>
                <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Permanent Delete</li>
              </ul>
            </div>
          </div>
          <div class="file-date">${file.date}</div>
        </div>
      </div>
    `;
  });

  filesContainer.innerHTML = fileCards.join("");

  if (window.attachFileActionHandlers) {
    window.attachFileActionHandlers();
  }
}

function renderListViewStarred() {
  const filesContainer = document.getElementById("filesContainer");
  if (!filesContainer) {
    return;
  }

  if (!window.binFilesData || !Array.isArray(window.binFilesData)) {
    filesContainer.innerHTML = '<p class="no-files">No files available</p>';
    return;
  }

  filesContainer.className = "files-grid list-view";

  const tableHTML = `
    <table class="files-table">
      <thead style="background: #2152910A">

        <tr>
          <th class="th-name">
            <div class="table-header-cell">
              <span>File Name</span>
            </div>
          </th>
          <th class="th-category">
            <div class="table-header-cell">
              <span>Category</span>
            </div>
          </th>
          <th class="th-date">
            <div class="table-header-cell">
              <span>Uploaded Date</span>
            </div>
          </th>
          <th class="th-size">
            <div class="table-header-cell">
              <span>File Size</span>
              </div>
              </th>
              <th class="th-actions">
              <div class="table-header-cell">
              <span></span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        ${window.binFilesData
      .map(
        (file) => `
          <tr class="file-row" data-file-id="${file.id}">
            <td class="td-name">
              <div class="file-info-cell">
                <div class="file-icon-wrapper">
                  <img src="${file.icon}" alt="${file.name}" class="file-icon">
                </div>
                <div class="file-details">
                  <div class="file-name-table">${file.name}</div>
                  <div class="file-format">Deleted <img src="assets/images/mydrive/shared.svg" alt="deleted"/></div>
                </div>
              </div>
            </td>
            <td class="td-category">
              <span class="">${file.category}</span>
            </td>
            <td class="td-date">${file.uploaded}</td>
            <td class="td-size">${file.size}</td>
            <td class="td-actions">
              <div class="action-buttons">
               ${file.isStarred
            ? `
<button class="action-btn info-btn" title="Info">
                  <img src="assets/images/home/star.svg" alt="info" width="16" height="16">
                </button>                  `
            : `<button class="action-btn info-btn" title="Info">
                  <img src="assets/images/home/inactive_star.svg" alt="info" width="16" height="16">
                </button>`
          }
                
                <div class="file-actions" data-file-id="${file.id}">
                  <img
                    src="assets/images/common/three_dot.svg"
                    class="three-dots"
                    alt="options"
                  />

                  <ul class="dropdown-menu file-menu">
                    <li data-action="file_info"><img src="assets/images/common/action/info.svg" alt="info"/>File Information</li>
                    <li data-action="restore"><img src="assets/images/common/action/restore.svg" alt="restore"/>Restore</li>
                    <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Delete Permanently</li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        `
      )
      .join("")}
      </tbody>
    </table>
  `;

  filesContainer.innerHTML = tableHTML;

  if (window.attachFileActionHandlers) {
    window.attachFileActionHandlers();
  }
}

function switchViewStarred(viewType) {
  starredCurrentView = viewType;

  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (viewType === "grid") {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    renderGridViewStarred();
  } else {
    gridBtn.classList.remove("active");
    listBtn.classList.add("active");
    renderListViewStarred();
  }
}

function initViewToggleStarred() {
  const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
  const listBtn = document.querySelector('.view-btn[data-view="list"]');

  if (gridBtn && listBtn) {
    gridBtn.addEventListener("click", () => switchViewStarred("grid"));
    listBtn.addEventListener("click", () => switchViewStarred("list"));
  }
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

function initializeBin() {
  if (!document.getElementById("fileInfoModal")) {
    createModal();
  } else {
    initModalEvents();
  }

  initViewToggleStarred();

  const filesContainer = document.getElementById("filesContainer");
  if (filesContainer) {
    renderGridViewStarred();
  } else {
    setTimeout(() => {
      if (document.getElementById("filesContainer")) {
        renderGridViewStarred();
      }
    }, 100);
  }

  setTimeout(() => {
    initFilterDropdowns();
  }, 100);
}

document.addEventListener("DOMContentLoaded", function () {
  if (
    document.getElementById("sidebar-container") ||
    document.getElementById("header-container")
  ) {
    document.addEventListener("componentsLoaded", initializeBin, {
      once: true,
    });
    setTimeout(initializeBin, 500);
  } else {
    initializeBin();
  }
});

window.initStarred = function () {
  initializeBin();
};

function addModalCSS() {
  if (document.getElementById("bin-modal-css")) return;

  const css = `
    <style id="bin-modal-css">
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
  if (document.getElementById("bin-dropdown-css")) return;

  const css = `
    <style id="bin-dropdown-css">
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

addDropdownCSS();
addModalCSS();
