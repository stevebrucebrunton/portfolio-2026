document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const projectTitle = document.getElementById('project-title');
    const projectDesc = document.getElementById('project-desc');
    const pageCounter = document.getElementById('page-counter');
    
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    const cards = document.querySelectorAll('.project-card');
    let currentIndex = 0;

    // Open lightbox
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
        });
    });

    // Update lightbox content
    function updateLightbox() {
        const activeCard = cards[currentIndex];
        const imgElement = activeCard.querySelector('img');
        
        lightboxImg.src = imgElement.getAttribute('data-full') || imgElement.src;
        projectTitle.textContent = activeCard.getAttribute('data-title');
        projectDesc.textContent = activeCard.getAttribute('data-desc');
        pageCounter.textContent = `${currentIndex + 1} / ${cards.length}`;
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Navigate projects
    function showNext() {
        currentIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;
        updateLightbox();
    }

    function showPrev() {
        currentIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
        updateLightbox();
    }

    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});