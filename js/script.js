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

    /* - 2. LIGHTBOX - */
    const $items = $('.gallery-item');
    let pIndex = 0;
    let images = [];
    let sIndex = 0;

    function update() {
        $('#lightbox-img').attr('src', images[sIndex]);
        $('#page-counter').text(`${sIndex + 1} / ${images.length}`);
    }

    $items.on('click', function() {
        pIndex = $items.index(this);
        const data = $(this).attr('data-src');
        images = data.split(',').map(s => s.trim());
        sIndex = 0;
        $('#project-title').text($(this).attr('data-title'));
        $('#project-desc').text($(this).attr('data-desc'));
        update();
        $('#lightbox').fadeIn(200).css('display', 'flex');
    });

    $('.close-btn, #lightbox').on('click', function(e) {
        if ($(e.target).is('#lightbox') || $(e.target).is('.close-btn')) {
            $('#lightbox').fadeOut(200);
        }
    });
});