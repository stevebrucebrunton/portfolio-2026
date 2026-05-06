$(document).ready(function() {
    console.log("PORTFOLIO LOGIC LOADED");

    /* - 1. TRAFFIC CONTROLLER: VIP PRELOAD & GRID REVEAL - */
    // Instantly preload the very next two backgrounds so immediate hovering is seamless
    $('<img/>')[0].src = 'images/bg2.avif';
    $('<img/>')[0].src = 'images/bg3.avif';

    const $grid = $('.gallery-grid');
    let thumbnails = [];
    
    // Extract thumbnail URLs from the inline CSS backgrounds
    $('.gallery-item').each(function() {
        let bgUrl = $(this).css('background-image');
        bgUrl = bgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        if (bgUrl && bgUrl !== 'none') {
            thumbnails.push(bgUrl);
        }
    });

    function revealGrid() {
        $grid.addClass('loaded');
        preloadHeavyMedia(); // Fire the heavy stuff ONLY after grid is visible
    }

    if (thumbnails.length > 0) {
        let loadedCount = 0;
        $.each(thumbnails, function(i, src) {
            let img = new Image();
            img.onload = img.onerror = function() {
                loadedCount++;
                if (loadedCount === thumbnails.length) {
                    revealGrid(); // Snap them all onto the screen at once
                }
            };
            img.src = src;
        });
        
        // Failsafe: if a connection lags for more than 2.5 seconds, force the reveal anyway
        setTimeout(function() {
            if (!$grid.hasClass('loaded')) revealGrid();
        }, 2500);
    } else {
        revealGrid();
    }

    /* - 2. HEAVY MEDIA PRELOADER (Deferred until thumbnails are loaded) - */
    function preloadHeavyMedia() {
        // bg2 and bg3 are already loaded, so we just grab the rest
        const remainingBgs = [
            'images/bg4.avif', 
            'images/bg5.avif', 
            'images/bg6.avif'
        ];
        $(remainingBgs).each(function() { $('<img/>')[0].src = this; });

        let galleryImagesToPreload = [];
        $('.gallery-item').each(function() {
            const srcs = $(this).attr('data-src').split(',');
            srcs.forEach(src => galleryImagesToPreload.push(src.trim()));
        });
        $(galleryImagesToPreload).each(function() { 
            $('<img/>')[0].src = this; 
        });
    }

    /* - 3. BACKGROUND CYCLER - */
    let currentBgIndex = 1;
    const totalBgs = 6;

    $('.magic-trigger').on('mouseenter', function() {
        let nextBgIndex = (currentBgIndex % totalBgs) + 1;
        $(`.bg-${currentBgIndex}`).css('opacity', 0);
        $(`.bg-${nextBgIndex}`).css('opacity', 1);
        currentBgIndex = nextBgIndex;
    });

    /* - 4. LIGHTBOX SEAMLESS SLIDER - */
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
            let newIndex = currentProjectIndex + 1;
            if (newIndex >= $galleryItems.length) newIndex = 0;
            openLightbox(newIndex, 0);
        }
    }

    function prevMedia() {
        if (currentSubIndex > 0) {
            currentSubIndex--;
            updateLightboxContent();
        } else {
            let newIndex = currentProjectIndex - 1;
            if (newIndex < 0) newIndex = $galleryItems.length - 1;
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
            if (e.which === 37) { prevMedia(); }
            if (e.which === 39) { nextMedia(); }
            if (e.which === 27) { $('.close-btn').trigger('click'); }
        }
    });

    /* - 5. CONTACT FORM SUBMISSION (SEAMLESS AJAX METHOD) - */
    $('#contact-form').on('submit', function(e) {
        e.preventDefault(); 
        const $form = $(this);
        const $message = $('#success-message');
        const $submitBtn = $form.find('.submit-btn');
        
        $submitBtn.prop('disabled', true).text('SENDING...');
        
        $.ajax({
            method: "POST",
            url: "https://formsubmit.co/ajax/stevebrucebrunton@gmail.com",
            dataType: "json",
            accepts: "application/json",
            data: $form.serialize(),
            success: function() {
                $form.fadeOut(300, function() {
                    $message.fadeIn(300);
                    $submitBtn.prop('disabled', false).text('SEND');
                    setTimeout(function() {
                        $message.fadeOut(300, function() { 
                            $form[0].reset(); 
                            $form.fadeIn(300); 
                        });
                    }, 3000); 
                });
            },
            error: function(err) {
                alert("If this is your first test, please check your email to activate the form! Otherwise, something went wrong.");
                console.log(err);
                $submitBtn.prop('disabled', false).text('SEND');
            }
        });
    });
});