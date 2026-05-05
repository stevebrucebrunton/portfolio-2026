$(document).ready(function() {
    console.log("PORTFOLIO LOGIC LOADED");

    /* - 1. BACKGROUND CYCLER - */
    // Logic: Toggle the opacity of the 6 layers pre-defined in HTML/CSS
    let currentBgIndex = 1;
    const totalBgs = 6;

    $('.magic-trigger').on('mouseenter', function() {
        // Identify the next layer to show
        let nextBgIndex = (currentBgIndex % totalBgs) + 1;
        
        // Instant opacity swap (Double-Buffer)
        $(`.bg-${currentBgIndex}`).css('opacity', 0);
        $(`.bg-${nextBgIndex}`).css('opacity', 1);
        
        currentBgIndex = nextBgIndex;
    });

    /* - PRELOAD GALLERY IMAGES - */
    let galleryImagesToPreload = [];
    $('.gallery-item').each(function() {
        const srcs = $(this).attr('data-src').split(',');
        srcs.forEach(src => galleryImagesToPreload.push(src.trim()));
    });
    $(galleryImagesToPreload).each(function() { 
        $('<img/>')[0].src = this; 
    });

    /* - 2. LIGHTBOX SEAMLESS SLIDER - */
    const $galleryItems = $('.gallery-item');
    let currentProjectIndex = 0;
    let currentImages = []; 
    let currentSubIndex = 0; 

    function updateLightboxContent() {
        $('#lightbox-img').attr('src', currentImages[currentSubIndex]);
        if (currentImages.length > 1) {
            $('#page-counter').text(`${currentSubIndex + 1} / ${currentImages.length}`).css('visibility', 'visible');
        } else {
            $('#page-counter').css('visibility', 'hidden');
        }
    }

    function openLightbox(projectIndex, subIndex = 0) {
        currentProjectIndex = projectIndex;
        const $item = $galleryItems.eq(projectIndex);
        const srcData = $item.attr('data-src');
        currentImages = srcData.split(',').map(s => s.trim());
        currentSubIndex = subIndex;
        $('#project-title').text($item.attr('data-title'));
        $('#project-desc').text($item.attr('data-desc'));
        updateLightboxContent();
        if (!$('#lightbox').is(':visible')) {
            $('#lightbox').css('display', 'flex').hide().fadeIn(200);
        }
    }

    function nextMedia() {
        if (currentSubIndex < currentImages.length - 1) {
            currentSubIndex++;
            updateLightboxContent();
        } else {
            let newIndex = (currentProjectIndex + 1) % $galleryItems.length;
            openLightbox(newIndex, 0);
        }
    }

    function prevMedia() {
        if (currentSubIndex > 0) {
            currentSubIndex--;
            updateLightboxContent();
        } else {
            let newIndex = (currentProjectIndex - 1 + $galleryItems.length) % $galleryItems.length;
            const prevItemSrc = $galleryItems.eq(newIndex).attr('data-src');
            const prevImages = prevItemSrc.split(',').map(s => s.trim());
            openLightbox(newIndex, prevImages.length - 1);
        }
    }

    $galleryItems.on('click', function() { openLightbox($galleryItems.index(this)); });
    $('.next-btn, #lightbox-img').on('click', function(e) { e.stopPropagation(); nextMedia(); });
    $('.prev-btn').on('click', function(e) { e.stopPropagation(); prevMedia(); });
    $('.close-btn, #lightbox').on('click', function(e) {
        if (!$(e.target).closest('.lightbox-content').length || $(e.target).is('.close-btn')) {
            $('#lightbox').fadeOut(200);
        }
    });

    $(document).on('keydown', function(e) {
        if ($('#lightbox').is(':visible')) {
            if (e.which === 37) prevMedia();
            if (e.which === 39) nextMedia();
            if (e.which === 27) $('.close-btn').trigger('click');
        }
    });

    /* - 3. CONTACT FORM SUBMISSION - */
    $('#contact-form').on('submit', function(e) {
        e.preventDefault(); 
        const $form = $(this);
        const $message = $('#success-message');
        $.ajax({
            type: "POST",
            url: "/",
            data: $form.serialize() + "&form-name=contact",
            success: function() {
                $form.fadeOut(300, function() {
                    $message.fadeIn(300);
                    setTimeout(function() {
                        $message.fadeOut(300, function() { 
                            $form[0].reset(); 
                            $form.fadeIn(300); 
                        });
                    }, 3000); 
                });
            },
            error: function() {
                alert("Oops! There was a problem submitting your form. Please try again.");
            }
        });
    });
});