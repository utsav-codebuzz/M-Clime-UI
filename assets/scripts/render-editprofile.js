function initFilterDropdowns() {
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

                const text = this.textContent;

                const buttonText = button.querySelector("span");
                if (buttonText) buttonText.textContent = text;

                menu.style.display = "none";
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        initFilterDropdowns();
    }, 100);
});

window.initStarred = function () {
    setTimeout(() => {
        initFilterDropdowns();
    }, 100);
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
    </style>
  `;

    document.head.insertAdjacentHTML("beforeend", css);
}

addDropdownCSS();