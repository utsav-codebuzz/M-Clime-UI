window.storageConfig = {
  totalBytes: 100 * 1024 * 1024 * 1024,
};

if (!window.storageFilesData) {
  window.storageFilesData = [
    {
      name: "Project Proposal.pdf",
      size: "2.5 MB",
      date: "2025-01-10",
      icon: "assets/images/file-icons/pdf.svg",
      category: "Documents",
    },
    {
      name: "Vacation Photos.zip",
      size: "150 MB",
      date: "2025-01-08",
      icon: "assets/images/file-icons/zip.svg",
      category: "Images",
    },
    {
      name: "Quarterly Report.xlsx",
      size: "8.7 MB",
      date: "2025-01-05",
      icon: "assets/images/file-icons/excel.svg",
      category: "Documents",
    },
    {
      name: "Meeting Recording.mp4",
      size: "450 MB",
      date: "2025-01-03",
      icon: "assets/images/file-icons/video.svg",
      category: "Videos",
    },
    {
      name: "Design Assets.sketch",
      size: "75 MB",
      date: "2024-12-28",
      icon: "assets/images/file-icons/sketch.svg",
      category: "Documents",
    },
  ];
  window.originalFilesData = [...window.storageFilesData];
}

function parseSizeToBytes(sizeStr) {
  if (!sizeStr) return 0;
  const parts = sizeStr.trim().split(" ");
  const value = parseFloat(parts[0]);
  const unit = parts[1] ? parts[1].toUpperCase() : "B";
  switch (unit) {
    case "GB":
      return value * 1024 * 1024 * 1024;
    case "MB":
      return value * 1024 * 1024;
    case "KB":
      return value * 1024;
    default:
      return value;
  }
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderFilesList() {
  const container = document.querySelector(".storage-files");
  if (!container || !window.storageFilesData) {
    return;
  }

  const header = document.createElement("div");
  header.className = "files-header";
  header.innerHTML = `
    <div class="col-left">
      <div class="col-title">File Name</div>
    </div>
    <div class="col-right">Storage Used</div>
  `;

  const list = document.createElement("div");
  list.className = "file-list";

  let totalBytes = 0;
  window.storageFilesData.forEach((item) => {
    const bytes = parseSizeToBytes(item.size);
    totalBytes += bytes;

    const formattedDate = formatDate(item.date);
    const dateLabel = `<span class="date-label">${formattedDate}</span>`;

    const row = document.createElement("div");
    row.className = "file-row";
    row.innerHTML = `
      <div class="file-left">
        <div class="file-icon"><img src="${
          item.icon || "assets/images/file-icons/default.svg"
        }" alt="icon" width="24" height="24"/></div>
        <div class="file-meta">
          <div class="file-name">${item.name}</div>
          <div class="file-sub">
            <span>${item.size}</span>
            <span>•</span>
            <span>${item.date}</span>
            ${dateLabel}
          </div>
        </div>
      </div>
      <div class="file-size-col">${item.size}</div>
    `;

    list.appendChild(row);
  });

  container.innerHTML = "";
  container.appendChild(header);
  container.appendChild(list);

  updateStorageUsage(totalBytes);
}

function updateStorageUsage(usedBytes) {
  const config = window.storageConfig;
  const percentRaw = (usedBytes / config.totalBytes) * 100;
  const percent = Math.min(100, Math.round(percentRaw * 10) / 10);

  const headerStorageEls = document.querySelectorAll(
    ".header-storage, .header-storage-local, .cta-sub"
  );
  headerStorageEls.forEach(
    (el) =>
      (el.textContent = `${formatBytes(usedBytes)} / ${formatBytes(
        config.totalBytes
      )}`)
  );

  const progressEls = document.querySelectorAll(
    ".storage-progress, .storage-progress-local, .storage-cta-progress"
  );
  progressEls.forEach((el) => {
    if (el) el.style.width = percent + "%";
  });

  const ctaTitle = document.querySelector(".cta-title");
  if (ctaTitle) {
    ctaTitle.setAttribute("data-percent", percent + "%");
  }
}

function initDropdowns() {

  function closeAllDropdowns(except = null) {
    document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
      if (dropdown !== except && dropdown.classList.contains("open")) {
        dropdown.classList.remove("open");
      }
    });
  }

  document.addEventListener("click", function (e) {
    const isDropdownClick = e.target.closest(".custom-dropdown");
    if (!isDropdownClick) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });

  document
    .querySelectorAll(".custom-dropdown:not(#sortDropdown)")
    .forEach((dropdown) => {
      const button = dropdown.querySelector(".dropdown-btn");
      const menu = dropdown.querySelector(".dropdown-menu");

      if (!button || !menu) return;

      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = dropdown.classList.contains("open");

        closeAllDropdowns(dropdown);

        if (isOpen) {
          dropdown.classList.remove("open");
        } else {
          dropdown.classList.add("open");
        }
      });

      menu.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", function (e) {
          e.stopPropagation();

          const value = this.getAttribute("data-value");
          const text = this.textContent;

          const buttonText = button.querySelector("span");
          if (buttonText) buttonText.textContent = text;

          dropdown.classList.remove("open");

          const dropdownType =
            dropdown.getAttribute("data-filter") ||
            dropdown.getAttribute("data-type");

          if (dropdownType) {
            applyFilters(dropdownType, value);
          }
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

    sortButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = sortDropdown.classList.contains("open");

      closeAllDropdowns(sortDropdown);

      if (isOpen) {
        sortDropdown.classList.remove("open");
        sortMenu.classList.remove("show-custom");
      } else {
        sortDropdown.classList.add("open");
      }
    });

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

          sortDropdown.classList.remove("open");
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

        sortDropdown.classList.remove("open");
        sortMenu.classList.remove("show-custom");

        applyFilters("sort", "custom", { startDate, endDate });
      });
    }
  }
}

function applyFilters(filterType, value, customData = null) {
  if (!window.storageFilesData || !window.originalFilesData) {
    return;
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
          const fileDate = new Date(file.date);
          return fileDate >= startDate && fileDate <= endDate;
        });

        filteredFiles.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (value === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        filteredFiles = filteredFiles.filter(
          (file) => file.date === yesterdayStr
        );
      } else if (value === "7days") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        filteredFiles = filteredFiles.filter((file) => {
          const fileDate = new Date(file.date);
          return fileDate >= weekAgo;
        });
      } else if (value === "30days") {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);

        filteredFiles = filteredFiles.filter((file) => {
          const fileDate = new Date(file.date);
          return fileDate >= monthAgo;
        });
      } else if (value === "thisyear") {
        const currentYear = new Date().getFullYear();
        filteredFiles = filteredFiles.filter((file) => {
          const fileYear = new Date(file.date).getFullYear();
          return fileYear === currentYear;
        });
      } else if (value === "lastyear") {
        const lastYear = new Date().getFullYear() - 1;
        filteredFiles = filteredFiles.filter((file) => {
          const fileYear = new Date(file.date).getFullYear();
          return fileYear === lastYear;
        });
      } else if (value === "name") {
        filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
      } else if (value === "size") {
        filteredFiles.sort((a, b) => {
          const sizeA = parseSizeToBytes(a.size);
          const sizeB = parseSizeToBytes(b.size);
          return sizeB - sizeA;
        });
      }
      break;
  }

  window.storageFilesData = filteredFiles;
  renderFilesList();
}

function initStoragePage() {
  renderFilesList();
  initDropdowns();
}

window.initStoragePage = initStoragePage;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStoragePage);
} else {
  initStoragePage();
}

window.initStorage = function () {
  initStoragePage();
};

function addDropdownCSS() {
  if (document.getElementById("storage-dropdown-css")) return;

  const css = `
    <style id="storage-dropdown-css">
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

      .dropdown-menu.sort-dropdown {
        display: none;
        min-width: max-content;
        padding: 8px;
        max-height: 350px;
        flex-direction: row;
      }

      .custom-dropdown.open .dropdown-menu {
        display: block;
      }

      .custom-dropdown.active .dropdown-menu.sort-dropdown {
        display: flex !important;
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

      /* Sort dropdown specific */
      .sort-left {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-right: 10px;
        min-width: 180px;
        max-width: 180px;
      }

      .sort-right {
        flex: 1;
        padding-inline: 10px;
        display: none;
        border-left: 1px solid #f3f4f6;
      }

      .sort-dropdown.show-custom .sort-right {
        display: block;
      }

      .sort-item {
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 14px;
        color: #374151;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sort-item:hover {
        background-color: #f9fafb;
      }

      .sort-item.active {
        background-color: #f0f9ff;
        color: #3a81e4;
        font-weight: 500;
      }

      .sort-item.custom-trigger {
        margin-top: 8px;
        border-top: 1px solid #f3f4f6;
        padding-top: 12px;
      }

      @media (max-width: 768px) {
        .dropdown-menu.sort-dropdown {
          flex-direction: column;
          min-width: 280px;
        }
        
        .sort-left {
          border-right: none;
          border-bottom: 1px solid #f3f4f6;
          padding-right: 0;
          padding-bottom: 16px;
          min-width: auto;
        }
        
        .sort-right {
          padding-left: 0;
          padding-top: 16px;
        }
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", css);
}

addDropdownCSS();
