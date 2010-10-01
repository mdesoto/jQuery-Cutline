// Prevent unstyled flash of content.
$('html').addClass('unstyled-content');

// Document has loaded.
$(document).ready(function() {

    // Apply cutline to photograph.
    $('#photo').cutline();

    $('html').removeClass('unstyled-content');

    // Initially display cutline.
    $('#photo').mouseover();
    $('#photo').mouseout();

    // Disable right click on photograph.
    $('#photo').bind('contextmenu', function(){
        return false;
    });

});