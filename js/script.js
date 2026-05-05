$(document).ready(function() {
    console.log("PORTFOLIO LOGIC LOADED");

    /* - 1. BACKGROUND CYCLER - */
    let currentBgIndex = 1;
    const totalBgs = 6;

    // Forces the first background to be visible immediately
    $('.bg-1').css('opacity', 1);

    $('.magic-trigger').on('mouseenter', function() {
        let nextBgIndex = (currentBgIndex % totalBgs) + 1;
        
        // Use jQuery's fade classes or direct CSS for the swap
        $(`.bg-${currentBgIndex}`).css('opacity', 0);
        $(`.bg-${nextBgIndex}`).css('opacity', 1);
        
        currentBgIndex = nextBgIndex;
    });

    /* - 2. IMAGE PRELOADER (CRITICAL FOR MOBILE) - */
    // This forces the browser to download thumbnails before you scroll to them
    $('.gallery-item').each(function() {
        const firstSrc = $(this).attr('data-src').split(',')[0].trim();
        $('<img/>')[0].src = firstSrc; 
    });

    /* - 3. LIGHTBOX LOGIC - */
    const $galleryItems = $('.gallery-item');
    let currentProjectIndex = 0;
    let currentImages = []; 
    let currentSubIndex = 0; 

    function openLightbox(projectIndex) {
        currentProjectIndex = projectIndex;
        const $item = $galleryItems.eq(projectIndex);
        currentImages = $item.attr('data-src').split(',').map(s => s.trim());
        currentSubIndex = 0;

        $('#project-title').text($item.attr('data-title'));
        $('#project-desc').text($item.attr('data-desc'));
        $('#lightbox-img').attr('src', currentImages[currentSubIndex]);
        $('#lightbox').fadeIn(200).css('display', 'flex');
    }

    $galleryItems.on('click', function() { openLightbox($galleryItems.index(this)); });

    $('.close-btn, #lightbox').on('click', function(e) {
        if ($(e.target).is('#lightbox') || $(e.target).is('.close-btn')) {
            $('#lightbox').fadeOut(200);
        }
    });
});