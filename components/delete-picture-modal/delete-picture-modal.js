function initDeletePictureModal() {

    const modal = document.getElementById('deletePictureModal');
    const openBtn = document.getElementById('deletePictureBtn');
    const closeBtn = document.getElementById('closeDeletePictureModal');
    const cancelBtn = document.getElementById('cancelDeletePicture');
    const confirmBtn = document.getElementById('confirmDeletePicture');

    const profileImage = document.querySelector('.edit-profile');
    const defaultImage = 'assets/images/header/profile.svg';

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        if (feather) feather.replace();
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    confirmBtn?.addEventListener('click', () => {

        if (profileImage) {
            profileImage.src = defaultImage;
        }

        closeModal();
    });
}

document.addEventListener('componentsLoaded', initDeletePictureModal);
