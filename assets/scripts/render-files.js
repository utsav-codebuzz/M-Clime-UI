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

                
            </div>
          </div>
          <div class="file-date">${file.date}</div>
        </div>
      </div>
    `;
  });

  filesGrid.innerHTML = fileCards.join("");


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
  renderFilesGrid();
});

window.initHomePage = function () {
  renderFilesGrid();
};

window.addEventListener("load", function () {

  const filesGrid = document.getElementById("filesGrid");
  if (filesGrid && filesGrid.innerHTML.trim() === "") {
    renderFilesGrid();
  }
});
