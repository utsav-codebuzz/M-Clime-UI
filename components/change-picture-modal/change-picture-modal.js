let isFilePickerOpen = false;

function initChangePictureModal() {
    const modal = document.getElementById('changePictureModal');
    if (!modal) {
        console.error('Change picture modal not found in DOM');
        return;
    }

    const closeBtn = document.getElementById('closeChangePictureModal');
    const cameraOption = document.getElementById('cameraOption');
    const galleryOption = document.getElementById('galleryOption');
    const avatarOption = document.getElementById('avatarOption');
    const imageUpload = document.getElementById('imageUpload');
    const profileImagePreview = document.getElementById('profileImagePreview');
    const mainProfileImage = document.querySelector('.edit-profile');
    const changePictureBtn = document.getElementById('changePictureBtn');

    if (changePictureBtn) {
        changePictureBtn.addEventListener('click', openChangePictureModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeChangePictureModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeChangePictureModal();
        }
    });

    if (cameraOption) {
        cameraOption.addEventListener('click', () => {
            alert('Camera access can be implemented using capture attribute.');
        });
    }

    if (galleryOption) {
        galleryOption.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!imageUpload || isFilePickerOpen) return;

            isFilePickerOpen = true;

            closeChangePictureModal();

            setTimeout(() => {
                imageUpload.value = '';
                imageUpload.click();
            }, 150);
        });
    }

    if (avatarOption) {
        avatarOption.addEventListener('click', () => {
            alert('Avatar selection UI can be added here.');
        });
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }

    function handleImageUpload(e) {
        isFilePickerOpen = false;

        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be under 5MB');
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
            imageUpload.value = '';
        }
    }
}

function openChangePictureModal() {
    const modal = document.getElementById('changePictureModal');
    if (!modal) return;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (feather) {
        feather.replace();
    }
}

function closeChangePictureModal() {
    const modal = document.getElementById('changePictureModal');
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.initChangePictureModal = initChangePictureModal;
window.openChangePictureModal = openChangePictureModal;
window.closeChangePictureModal = closeChangePictureModal;

document.addEventListener('componentsLoaded', initChangePictureModal);
