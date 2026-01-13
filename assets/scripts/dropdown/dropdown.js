document.addEventListener("click", function (e) {
  const dropdownBtn = e.target.closest(".dropdown-btn");
  const dropdownItem = e.target.closest(".dropdown-menu li");
  const sortItem = e.target.closest(".sort-item");
  const threeDots = e.target.closest(".three-dots");

  /* ===========================
     OPEN DROPDOWN
  ============================ */
  if (dropdownBtn) {
    e.stopPropagation();

    document.querySelectorAll(".custom-dropdown").forEach((el) => {
      el.classList.remove("active");
    });

    dropdownBtn.closest(".custom-dropdown").classList.add("active");
    return;
  }

  /* ===========================
     NORMAL DROPDOWN ITEMS (li)
  ============================ */
  if (dropdownItem && dropdownItem.closest(".custom-dropdown")) {
    e.stopPropagation();

    const dropdown = dropdownItem.closest(".custom-dropdown");
    const label = dropdown.querySelector(".dropdown-btn span");

    label.textContent = dropdownItem.textContent;
    dropdown.classList.remove("active");

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
  ============================ */
  if (threeDots) {
    e.stopPropagation();

    document.querySelectorAll(".file-actions").forEach((el) => {
      el.classList.remove("active");
      const m = el.querySelector(".file-menu");
      if (m) m.classList.remove("open-left");
    });

    const container = threeDots.closest(".file-actions");
    container.classList.add("active");

    const menu = container.querySelector(".file-menu");
    if (menu) {
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

  /* ===========================
     CLICK OUTSIDE → CLOSE ALL
  ============================ */
  document.querySelectorAll(".custom-dropdown, .file-actions").forEach((el) => {
    el.classList.remove("active");
  });
});
