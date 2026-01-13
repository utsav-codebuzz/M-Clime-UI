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

function initSortDropdown() {
  const sortDropdown = document.getElementById("sortDropdown");
  const sortButton = document.getElementById("sortButton");
  const sortMenu = document.getElementById("sortMenu");
  const customDateSection = document.getElementById("customDateSection");
  const applyCustomDateBtn = document.getElementById("applyCustomDate");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  if (!sortDropdown || !sortButton || !sortMenu) {
    console.error("Sort dropdown elements not found");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStr = lastWeek.toISOString().split("T")[0];

  if (endDateInput) {
    endDateInput.value = today;
    endDateInput.max = today;
  }

  if (startDateInput) {
    startDateInput.value = lastWeekStr;
    startDateInput.max = today;
  }

  sortButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    document.querySelectorAll(".custom-dropdown").forEach((dd) => {
      if (dd !== sortDropdown) {
        dd.classList.remove("open");
      }
    });

    sortDropdown.classList.toggle("open");

    if (customDateSection && sortDropdown.classList.contains("open")) {
      customDateSection.classList.remove("show");
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
        if (customDateSection) {
          customDateSection.classList.add("show");
        }
      } else {
        if (customDateSection) {
          customDateSection.classList.remove("show");
        }

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

      if (!startDateInput || !endDateInput) {
        console.error("Date inputs not found");
        return;
      }

      const startDate = startDateInput.value;
      const endDate = endDateInput.value;

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

      applyFilters("sort", "custom", { startDate, endDate });
    });
  }

  document.addEventListener("click", function (e) {
    if (!sortDropdown.contains(e.target)) {
      sortDropdown.classList.remove("open");
      if (customDateSection) {
        customDateSection.classList.remove("show");
      }
    }
  });
}

function initFilterDropdowns() {
  console.log("Initializing filter dropdowns...");

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      document
        .querySelectorAll(".custom-dropdown .dropdown-menu")
        .forEach((menu) => (menu.style.display = "none"));
    }
  });

  document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
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
}

function applyFilters(filterType, value, customData = null) {
  if (!window.storageFilesData || !window.originalFilesData) {
    console.error("Storage data not available");
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
  initFilterDropdowns();
  initSortDropdown();
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

// Add CSS for dropdowns if not already in stylesheet
function addDropdownCSS() {
  if (document.getElementById("storage-dropdown-css")) return;

  const css = `
    <style id="storage-dropdown-css">
      /* Dropdown styles for filters */
      .custom-dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-btn {
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
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
        border-radius: 4px;
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
  console.log("Dropdown CSS added");
}

addDropdownCSS();
