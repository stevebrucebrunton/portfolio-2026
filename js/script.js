$(document).ready(function() {
    console.log("READY");

    /* - 1. BACKGROUND TOGGLE - */
    let currentBg = 1;
    const totalBgs = 6;

    $('.magic-trigger').on('mouseenter', function() {
        let nextBg = (currentBg % totalBgs) + 1;
        $(`.bg-${currentBg}`).css('opacity', 0);
        $(`.bg-${nextBg}`).css('opacity', 1);
        currentBg = nextBg;
    });

    /* - 2. LIGHTBOX SLIDER - */
    const $items = $('.gallery-item');
    let images = [];
    let sIndex = 0;

    function update() {
        $('#lightbox-img').attr('src', images[sIndex]);
        if (images.length > 1) {
            $('#page-counter').text(`${sIndex + 1} / ${images.length}`).show();
        } else {
            $('#page-counter').hide();
        }
    }

    $items.on('click', function() {
        const data = $(this).attr('data-src');
        images = data.split(',').map(s => s.trim());
        sIndex = 0;
        $('#project-title').text($(this).attr('data-title'));
        $('#project-desc').text($(this).attr('data-desc'));
        update();
        $('#lightbox').fadeIn(200).css('display', 'flex');
    });

    $('.next-btn, #lightbox-img').on('click', function(e) {
        e.stopPropagation();
        sIndex = (sIndex + 1) % images.length;
        update();
    });

    $('.prev-btn').on('click', function(e) {
        e.stopPropagation();
        sIndex = (sIndex - 1 + images.length) % images.length;
        update();
    });

    $('.close-btn, #lightbox').on('click', function(e) {
        if ($(e.target).is('#lightbox') || $(e.target).is('.close-btn')) {
            $('#lightbox').fadeOut(200);
        }
    });

    $(document).on('keydown', function(e) {
        if ($('#lightbox').is(':visible')) {
            if (e.which === 37) $('.prev-btn').click();
            if (e.which === 39) $('.next-btn').click();
            if (e.which === 27) $('.close-btn').click();
        }
    });
});