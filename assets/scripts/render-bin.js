let starredCurrentView = "grid";
let modalInitialized = false;

function initFilterDropdowns() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      document
        .querySelectorAll(".custom-dropdown .dropdown-menu")
        .forEach((menu) => (menu.style.display = "none"));
    }
  });

  document.querySelectorAll(".custom-dropdown:not(#sortDropdown)").forEach((dropdown) => {
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

  // Special handling for sort dropdown
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

    // Sort items click
    const sortItems = sortMenu.querySelectorAll(".sort-item");
    sortItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        // Remove active class from all sort items
        sortItems.forEach((i) => i.classList.remove("active"));

        // Add active class to clicked item
        this.classList.add("active");

        const value = this.getAttribute("data-value");

        if (value === "custom") {
          sortMenu.classList.add("show-custom");
        } else {
          sortMenu.classList.remove("show-custom");

          // Update button text
          const buttonText = sortButton.querySelector("span");
          if (buttonText) {
            buttonText.textContent = this.textContent.replace("›", "").trim();
          }

          // Close dropdown and apply filter
          sortDropdown.classList.remove("active");
          applyFilters("sort", value);
        }
      });
    });

    // Apply custom date
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

        // Update button text
        const buttonText = sortButton.querySelector("span");
        if (buttonText) {
          buttonText.textContent = "Custom Date";
        }

        // Close dropdown and apply filter
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

        filteredFiles.sort((a, b) => new Date(b.uploaded || b.date) - new Date(a.uploaded || a.date));
      } else if (value === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        filteredFiles = filteredFiles.filter(
          (file) => {
            const fileDate = new Date(file.uploaded || file.date);
            return fileDate.toISOString().split("T")[0] === yesterdayStr;
          }
        );
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
        filteredFiles.sort((a, b) => getSizeValue(b.size) - getSizeValue(a.size));
      } else if (value === "all") {
        // Show all files, sorted by date (newest first)
        filteredFiles.sort((a, b) => new Date(b.uploaded || b.date) - new Date(a.uploaded || a.date));
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
                <li data-action="restore"><img src="assets/images/common/action/info.svg" alt="restore"/>Restore</li>
                <li data-action="delete" class="danger"><img src="assets/images/common/action/delete.svg" alt="delete"/>Delete Permanently</li>
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
                    <li data-action="restore"><img src="assets/images/common/action/info.svg" alt="restore"/>Restore</li>
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

function initializeBin() {
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
  if (document.getElementById("sidebar-container") || document.getElementById("header-container")) {
    document.addEventListener("componentsLoaded", initializeBin, { once: true });
    setTimeout(initializeBin, 500);
  } else {
    initializeBin();
  }
});

window.initStarred = function () {
  initializeBin();
};

function addDropdownCSS() {
  if (document.getElementById("bin-dropdown-css")) return;

  const css = `
    <style id="bin-dropdown-css">
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

addDropdownCSS();
