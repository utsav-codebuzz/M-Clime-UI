let isFilePickerOpen = false;
let changePictureHandler = null;

function initChangePictureModal() {
  const modal = document.getElementById("changePictureModal");
  if (!modal) {
    return;
  }

  const closeBtn = document.getElementById("closeChangePictureModal");
  const cameraOption = document.getElementById("cameraOption");
  const galleryOption = document.getElementById("galleryOption");
  const avatarOption = document.getElementById("avatarOption");
  const imageUpload = document.getElementById("imageUpload");
  const profileImagePreview = document.getElementById("profileImagePreview");
  const mainProfileImage = document.querySelector(".edit-profile");
  const changePictureBtn = document.getElementById("changePictureBtn");

  if (!changePictureHandler) {
    changePictureHandler = (e) => {
      if (
        e.target.id === "changePictureBtn" ||
        e.target.closest("#changePictureBtn")
      ) {
        e.preventDefault();
        e.stopPropagation();
        openChangePictureModal();
      }
    };
    document.addEventListener("click", changePictureHandler, true);
  }

  if (changePictureBtn) {
    changePictureBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openChangePictureModal();
    });
  }

  if (closeBtn && !closeBtn.dataset.listenerAttached) {
    closeBtn.addEventListener("click", closeChangePictureModal);
    closeBtn.dataset.listenerAttached = "true";
  }

  if (!modal.dataset.listenerAttached) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeChangePictureModal();
      }
    });
    modal.dataset.listenerAttached = "true";
  }

  if (cameraOption && !cameraOption.dataset.listenerAttached) {
    cameraOption.addEventListener("click", () => {
      alert("Camera access can be implemented using capture attribute.");
    });
    cameraOption.dataset.listenerAttached = "true";
  }

  if (galleryOption && !galleryOption.dataset.listenerAttached) {
    galleryOption.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!imageUpload || isFilePickerOpen) return;

      isFilePickerOpen = true;

      closeChangePictureModal();

      setTimeout(() => {
        imageUpload.value = "";
        imageUpload.click();
      }, 150);
    });
    galleryOption.dataset.listenerAttached = "true";
  }

  if (avatarOption && !avatarOption.dataset.listenerAttached) {
    avatarOption.addEventListener("click", () => {
      alert("Avatar selection UI can be added here.");
    });
    avatarOption.dataset.listenerAttached = "true";
  }

  if (imageUpload && !imageUpload.dataset.listenerAttached) {
    imageUpload.addEventListener("change", handleImageUpload);
    imageUpload.dataset.listenerAttached = "true";
  }

  function handleImageUpload(e) {
    isFilePickerOpen = false;

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateProfileImage(event.target.result);
    };

    reader.readAsDataURL(file);
  }

  function updateProfileImage(imageUrl) {
    if (profileImagePreview) {
      profileImagePreview.src = imageUrl;
    }

    if (mainProfileImage) {
      mainProfileImage.src = imageUrl;
    }

    if (imageUpload) {
      imageUpload.value = "";
    }
  }
}

function openChangePictureModal() {
  const modal = document.getElementById("changePictureModal");
  if (!modal) return;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  if (feather) {
    feather.replace();
  }
}

function closeChangePictureModal() {
  const modal = document.getElementById("changePictureModal");
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

window.initChangePictureModal = initChangePictureModal;
window.openChangePictureModal = openChangePictureModal;
window.closeChangePictureModal = closeChangePictureModal;

document.addEventListener("componentsLoaded", initChangePictureModal);
