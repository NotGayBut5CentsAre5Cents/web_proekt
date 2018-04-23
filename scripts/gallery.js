var json = {
    "Colors": [ ["red", "#3454ff", "green", "yellow", "white"],
                ["red", "blue", "green", "yellow", "white"],
                ["red", "blue", "green", "yellow", "white"],
                ["red", "blue", "green", "yellow", "white"],
                ["red", "blue", "green", "yellow", "white"],
                ["red", "blue", "green", "yellow", "white"]]
};
$( document ).ready(function() {
    initGallery();  
});


function initGallery() {
    for(var i  = 0; i < json["Colors"].length; i++){
        $(".content").append($("<div class=\"colors-container gallery\">\
        <div class=\"colors edit-hex\" id=\"color-1\">\
            <input type=\"text\" readonly>\
            <div id=\"base-color\">Base color</div>\
        </div>\
        <div class=\"colors edit-hex\" id=\"color-2\">\
            <input type=\"text\" readonly>\
            <div id=\"background-color\">Background color</div>\
        </div>\
        <div class=\"colors edit-hex\" id=\"color-3\">\
            <input type=\"text\" readonly>\
            <div id=\"extras-color\">Extras color</div>\
        </div>\
        <div class=\"colors edit-hex\" id=\"color-4\">\
            <input type=\"text\" readonly>\
            <div id=\"active-color\">Active color</div>\
        </div>\
        <div class=\"colors edit-hex\" id=\"color-5\">\
            <input type=\"text\" readonly>\
            <div id=\"active-hover\">Active hover color</div>\
        </div>\
        <textarea class=\"copy-area\"></textarea>\
        <button class=\"gen-button\" id=\"copy\">Copy</button>\
        </div>"));
    }
    
    $('.colors-container').each(function(row) {
        var colors_container = $(this);
        var copy_text = ' ';
        colors_container.children('.colors').each(function(index) {
            var rgb;
            if(colors_container.hasClass('gallery')) {
                rgb = hex2Rgb(nameToHex(json['Colors'][row][index]))
                var luma = calcLuma(rgb);
                if(luma <= lumaTh) {
                    $(this).addClass('light');
                }else {
                    $(this).removeClass('light');
                }
                $(this).css({'background-color': json['Colors'][row][index]});
                $(this).find('input').val(json['Colors'][row][index]);
                copy_text += json['Colors'][row][index];
                if(index < json['Colors'][row].length - 1) {
                    copy_text += ', '
                }
                if(index == 0) {
                    $(this).css({'border-left': "black 1px solid"});
                }
                if(index == json['Colors'][row].length - 1) {
                    $(this).css({'border-right': "black 1px solid"});
                }
            }
        });
        $(this).children('.copy-area').text(copy_text);
    });
    getCssFromStorage();
}