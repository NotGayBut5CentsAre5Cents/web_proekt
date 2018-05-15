var myFunc = [
    complementary,
    monochromatic,
    thriad,
    analogous,
    shades
];
var lumaTh = 125;
var bodyStyles = document.documentElement.style;
$( document ).ready(function() {
    r_out = document.querySelector('#r_out'),
    g_out = document.querySelector('#g_out'),
    b_out = document.querySelector('#b_out');
    $('a').on('click', function() {
        $(this).parent().find('a.active').removeClass('active');
        $(this).addClass('active');
    });
    
    $('.colors > input').on('keyup', function() {
        if(!$(this).siblings('button').hasClass('locked')) {
            var val = $(this).val().trim();
            console.log(val)
            $(this).parent().css('background-color', val);
            try {
                var rgb  = hex2Rgb(val[0] != "#" ? nameToHex(val) : val);
                updateColor($(this), rgb);
                var luma = calcLuma(rgb);
                if(luma <= lumaTh) {
                    $(this).parent().addClass('light');
                }else {
                    $(this).parent().removeClass('light');
                }
            }catch(TypeError) {
                console.log("bad hex");
            }
        }
    });

    $('.colors > input').on("change keyup paste input", function() {
        console.log("VCAHNEG");
        var val = $(this).val().trim();
        try {
            var rgb  = hex2Rgb(val[0] != "#" ? nameToHex(val) : val);
            updateColor($(this), rgb);
        }catch(TypeError) {
            console.log("bad hex");
        }
    });

    $('.colors > fieldset').find("input").on('input', function() {
        if(!$(this).parent().siblings('button').hasClass('locked')) {
            var r = $(this).parent().parent().find("#r")[0],
            g = $(this).parent().parent().find("#g")[0],
            b = $(this).parent().parent().find("#b")[0],
            r_out = $(this).parent().parent().find("#r_out")[0],
            g_out = $(this).parent().parent().find("#g_out")[0],
            b_out = $(this).parent().parent().find("#b_out")[0],
            r_hex = parseInt(r.value, 10).toString(16),
            g_hex = parseInt(g.value, 10).toString(16),
            b_hex = parseInt(b.value, 10).toString(16),
            hex = "#" + pad(r_hex) + pad(g_hex) + pad(b_hex);  
            r_out.value = r.value;
            g_out.value = g.value;
            b_out.value = b.value;
            console.log("input");
            $(this).parent().siblings('input').val(hex);
            $(this).parent().parent().css('background-color', hex);
            try {
                var rgb  = hex2Rgb(hex);
                var luma = calcLuma(rgb);
                if(luma <= lumaTh) {
                    $(this).parent().parent().addClass('light');
                }else {
                    $(this).parent().parent().removeClass('light');
                }
            }catch(TypeError) {
                console.log("bad hex");
            }
        }
    });
    $('.lock').on('click', function(){
        $(this).toggleClass('locked');
        $(this).siblings('input').prop('readonly', function(index, prop){
            return prop == true ? null : true;
        });
        $(this).find('i').toggleClass('fa-lock');
        $(this).find('i').toggleClass('fa-unlock-alt');
    });
    $('.random').on('click', function(){
        if(!$(this).siblings('button').hasClass('locked')) {
            var color = randomColor();
            var rgb  = hex2Rgb(color);
            $(this).parent().css('background-color', color);
            $(this).siblings('input').val(color).change();
            var luma = calcLuma(rgb);
            if(luma <= lumaTh) {
                $(this).parent().addClass('light');
            }else {
                $(this).parent().removeClass('light');
            }
            console.log(color);
        }
    });
    $('#generate').on('click', function(){
        var color = $('#color-1 :input').val().trim();
        console.log(color[0]);
        if(color[0] != "#") {
            color = nameToHex(color);
        }
        var colors = myFunc[$('#type-dropdown').prop('selectedIndex')](color);
        $('.colors').each(function(i) {
            if(!$(this).find('button').hasClass('locked')){
                var hex = rgb2Hex(colors[i]);
                $(this).css({'background-color': hex});
                var input = $(this).find('input');
                var luma = 0.2126 * colors[i].r + 0.7152 * colors[i].g + 0.0722 * colors[i].b;
                if(luma <= lumaTh) {
                    $(this).addClass('light');
                }else {
                    $(this).removeClass('light');
                }
                input.val(hex).change();
                console.log(hex);
                console.log(luma);
            }
        });
    });

    $('#apply').on( 'click', function(){
        apply($('.colors-container'));
    });
    $('#apply-perm').on('click', function(){
        apply($('.colors-container'));
        saveSessionCss();
    });
    $('#load-curr').on('click', function(){
        loadCurr();
    });
    $('.register').on('click', function(){
        $('#register').show();
        $('#logIn').hide();
        $('#register').find(".close").on( 'click', function(){
            $('#register').hide();
        });
    });
    $('.login').on('click', function(){
        $('#logIn').show();
        $('#register').hide();
        $('#logIn').find(".close").on( 'click', function(){
            $('#logIn').hide();
        });
    });
    console.log( 'ready!' );
    init();
});

function pad(n){
    return (n.length < 2) ? "0" + n : n;
}

function apply(parent) {
    var colors = [];
    $(parent).find('.colors').each(function(i) {
        var bgColor = $(this).css('background-color');
        console.log(bgColor);
        colors.push(bgColor);
        var rgb = bgColor.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
        console.log(rgb);
        var luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
        console.log(luma);
        if(luma <= lumaTh) {
            switch(i) {
                case 0: bodyStyles.setProperty('--text-color', 'white'); break;
                case 3: bodyStyles.setProperty('--active-text-color', 'white'); break;
                case 4: bodyStyles.setProperty('--active-hover-text-color', 'white'); break;
            }
        }else {
            switch(i) {
                case 0: bodyStyles.setProperty('--text-color', '#1F2D3D'); break;
                case 3: bodyStyles.setProperty('--active-text-color', '#1F2D3D'); break;
                case 4: bodyStyles.setProperty('--active-hover-text-color', '#1F2D3D'); break;
                }
        }
    });
    var properties = ['--base-color', '--site-background', '--extra-color', '--active-color', '--active-hover'];
    properties.forEach(function(item, index) {
        bodyStyles.setProperty(item, colors[index]);
    });
}

function init() {
    if(typeof(Storage) !== 'undefined'){
        if(sessionStorage.getItem('firstTime') === null){
            sessionStorage.setItem('firstTime', "yea");
            $('#tutorialModal').show();
            $('#tutorialModal').find(".close").on( 'click', function(){
                $('#tutorialModal').hide();
            });
        }
    }
    var rainbow= ['red', 'orange', 'yellow', 'blue', 'green']
    setInputs(rainbow);
    getCssFromStorage();
}

function setInputs(rainbow){
    $('.colors-container').each(function(row) {
        var colors_container = $(this);
        colors_container.children().each(function(index) {
            var rgb, inputText;
            if(!colors_container.hasClass('gallery')) {
                inputText = rainbow[index].trim();
                rgb = hex2Rgb(nameToHex(inputText));
                console.log(rgb);
                if(rgb == null) {
                    rgbArr = rainbow[index].replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',')
                    rgb = new Object();
                    rgb.r = parseInt(rgbArr[0]);
                    rgb.g = parseInt(rgbArr[1]);
                    rgb.b = parseInt(rgbArr[2])
                    console.log(rgbArr);
                    inputText = rgb2Hex(rgb);
                    console.log(inputText);
                }
                var luma = calcLuma(rgb);
                if(luma <= lumaTh) {
                    $(this).addClass('light');
                }else {
                    $(this).removeClass('light');
                }
                $(this).css({'background-color': inputText});
                $(this).find('input').val(inputText).change();
            }
        });
    });
}

function updateColor(parent, rgb) {
    var r = parent.parent().find("#r")[0],
    g = parent.parent().find("#g")[0],
    b = parent.parent().find("#b")[0],
    r_out = parent.parent().find("#r_out")[0],
    g_out = parent.parent().find("#g_out")[0],
    b_out = parent.parent().find("#b_out")[0];
    r.value = rgb.r;
    g.value = rgb.g;
    b.value = rgb.b
    r_out.value = r.value;
    g_out.value = g.value;
    b_out.value = b.value; 
}

function calcLuma(rgb) {
    return luma = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

function loadCurr(){
    var values = [];
    var properties = ['--base-color', '--site-background', '--extra-color', '--active-color', '--active-hover'];
    properties.forEach(function(item) {
        values.push(getComputedStyle(document.documentElement, null).getPropertyValue(item));
    });
    console.log(values);
    setInputs(values);
}

function saveSessionCss() {
    var properties = ['--base-color', '--site-background', '--active-color', '--active-hover', '--extra-color', '--text-color', '--active-text-color', '--active-hover-text-color'];
    if(typeof(Storage) !== 'undefined') {
        properties.forEach(function(item) {
            sessionStorage.setItem(item, bodyStyles.getPropertyValue(item));
        });
    }
}

function getCssFromStorage() {
    var properties = ['--base-color', '--site-background', '--active-color', '--active-hover', '--extra-color', '--text-color', '--active-text-color', '--active-hover-text-color'];
    if(typeof(Storage) !== 'undefined') {
        properties.forEach(function(item) {
            bodyStyles.setProperty(item, sessionStorage.getItem(item));
        });
    }
}

function randomInt(floor, ceiling) {
    return Math.floor(Math.random() * (ceiling - floor)) + floor;
}

function randomColor() {
    var golden_ratio_conjugate = 0.618033988749895;
    var hsv = new Object;
    hsv.hue = randomInt(0, 360);
    hsv.saturation = 100;
    hsv.value = randomInt(50, 100);
    var hex = rgb2Hex(hsv2rgb(hsv));
    return hex;
}

function complementary(colorHex) {
    var baseColorHex = colorHex;
    var baseColor = hex2Rgb(baseColorHex);
    var baseColorHsv = rgb2hsv(baseColor);
    var tmpHsv = jQuery.extend({}, baseColorHsv);
    var close1, close2, complRgb1, complRgb2;
    tmpHsv.hue = hueshift(tmpHsv.hue, 180);
    complRgb1 = hsv2rgb(tmpHsv);

    tmpHsv.value = putInRange(tmpHsv.value - 30, 100, 0);
    tmpHsv.saturation = putInRange(tmpHsv.saturation + 20, 100, 0);
    complRgb2 = hsv2rgb(tmpHsv);

    tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.saturation = putInRange(tmpHsv.saturation + 10, 100, 0);
    tmpHsv.value = putInRange(tmpHsv.value - 30, 100, 0);
    close1 = hsv2rgb(tmpHsv);
    

    tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.saturation = putInRange(tmpHsv.saturation - 10, 100, 0);
    close2 = hsv2rgb(tmpHsv); 

    colors = [baseColor, close1, close2, complRgb1, complRgb2];
    console.log(colors);
    return colors;
}

function monochromatic(colorHex) {
    var baseColorHex = colorHex;
    var baseColor = hex2Rgb(baseColorHex);
    var baseColorHsv = rgb2hsv(baseColor);
    var chrome1, chrome2, chrome3, chrome4;
    
    var tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.value = putInRange(tmpHsv.value - 50, 100, 0);
    chrome1= hsv2rgb(tmpHsv);

    tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.saturation = putInRange(tmpHsv.saturation - 30, 100, 0);
    chrome2= hsv2rgb(tmpHsv);

    tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.saturation = putInRange(tmpHsv.saturation - 30, 100, 0);
    tmpHsv.value = putInRange(tmpHsv.value - 50, 100, 0);
    chrome3= hsv2rgb(tmpHsv);

    var tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.value = putInRange(tmpHsv.value - 20, 100, 0);
    chrome4= hsv2rgb(tmpHsv);

    colors = [baseColor, chrome1, chrome3, chrome4, chrome2];
    console.log(colors);
    return colors;
}

function thriad(colorHex) {
    var baseColorHex = colorHex;
    var baseColor = hex2Rgb(baseColorHex);
    
    var close1, close2;

    var color1 = new Object;
    color1.r = baseColor.g;
    color1.g = baseColor.b;
    color1.b = baseColor.r;
    
    var color2 = new Object;
    color2.r = baseColor.b;
    color2.g = baseColor.r;
    color2.b = baseColor.g;
    
    var tmpHsv = rgb2hsv(baseColor);
    tmpHsv.value = putInRange(tmpHsv.value - 20, 100, 0);
    tmpHsv.saturation = putInRange(tmpHsv.saturation + 10, 100, 0);
    close = hsv2rgb(tmpHsv);

    tmpHsv = rgb2hsv(color1);
    tmpHsv.value = putInRange(tmpHsv.value - 10, 100, 0);
    tmpHsv.saturation = putInRange(tmpHsv.saturation - 5, 100, 0);
    close1 = hsv2rgb(tmpHsv);

    colors = [baseColor, close, color2, color1, close1];
    console.log(colors);
    return colors;
}

function analogous(colorHex) {
    var angle = 17;
    var baseColorHex = colorHex;
    var baseColor = hex2Rgb(baseColorHex);
    var baseColorHsv = rgb2hsv(baseColor);
    var tmpHsv = jQuery.extend({}, baseColorHsv);
    var positive1, positive2, negative1, negative2;
    tmpHsv.hue = hueshift(tmpHsv.hue, angle);
    positive1 = hsv2rgb(tmpHsv);

    tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.hue = hueshift(tmpHsv.hue, angle * 2);
    positive2 = hsv2rgb(tmpHsv);

    tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.hue = hueshift(tmpHsv.hue, 0.0 - angle);
    negative1 = hsv2rgb(tmpHsv);

    tmpHsv = jQuery.extend({}, baseColorHsv);
    tmpHsv.hue = hueshift(tmpHsv.hue, 0.0 - angle * 2);
    negative2 = hsv2rgb(tmpHsv);

    colors = [baseColor, negative2, negative1, positive2, positive1];
    console.log(colors);
    return colors;
}

function shades(colorHex) {
    var baseColorHex = colorHex;
    var baseColor = hex2Rgb(baseColorHex);
    var baseColorHsv = rgb2hsv(baseColor);
    var tmpHsv = jQuery.extend({}, baseColorHsv);
    var shade1, shade2, shade3, shade4;
    
    tmpHsv.value = putInRange(tmpHsv.value - 25, 100, 0);
    shade1 = hsv2rgb(tmpHsv);
    
    tmpHsv.value = putInRange(tmpHsv.value + 55, 100, 0);
    shade2 = hsv2rgb(tmpHsv);

    tmpHsv.value = putInRange(tmpHsv.value - 25, 100, 0);
    shade3 = hsv2rgb(tmpHsv);

    tmpHsv.value = putInRange(tmpHsv.value - 15, 100, 0);
    shade4 = hsv2rgb(tmpHsv);

    colors = [baseColor, shade1, shade3, shade2, shade4];
    console.log(colors);
    return colors;
}

function rgb2Hex(rgb) {
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hex2Rgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function hueshift(h, a) {
	h += a;
	while (h >= 360.0) h -= 360.0;
	while (h < 0.0) h += 360.0;
	return h;
}

function hsv2rgb(hsvO) {
    hsv = jQuery.extend({}, hsvO);
	var rgb = new Object();
	if (hsv.saturation == 0) {
		rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
	} else {
		hsv.hue /= 60;
		hsv.saturation /= 100;
		hsv.value /= 100;
		i = Math.floor(hsv.hue);
		f = hsv.hue - i;
		p = hsv.value * (1 - hsv.saturation);
		q = hsv.value * (1 - hsv.saturation * f);
		t = hsv.value * (1 - hsv.saturation * (1 - f));
		switch(i) {
            case 0: rgb.r = hsv.value; rgb.g = t; rgb.b = p; break;
            case 1: rgb.r = q; rgb.g = hsv.value; rgb.b = p; break;
            case 2: rgb.r = p; rgb.g = hsv.value; rgb.b = t; break;
            case 3: rgb.r = p; rgb.g = q; rgb.b = hsv.value; break;
            case 4: rgb.r = t; rgb.g = p; rgb.b = hsv.value; break;
            default: rgb.r = hsv.value; rgb.g = p; rgb.b = q;
        }
		rgb.r=Math.round(rgb.r * 255);
		rgb.g=Math.round(rgb.g * 255);
		rgb.b=Math.round(rgb.b * 255);
	}
	return rgb;
}

function min3(a, b, c) {return (a<b)?((a<c)?a:c):((b<c)?b:c);}
function max3(a, b, c) {return (a>b)?((a>c)?a:c):((b>c)?b:c);}

function rgb2hsv(rgbO) {
    rgb = jQuery.extend({}, rgbO); 
	hsv = new Object();
	max = max3(rgb.r, rgb.g, rgb.b);
	dif = max - min3(rgb.r, rgb.g, rgb.b);
	hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
	if (hsv.saturation == 0) hsv.hue = 0;
 	else if (rgb.r == max) hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
	else if (rgb.g == max) hsv.hue = 120.0 + 60.0 * (rgb.b-rgb.r) / dif;
	else if (rgb.b == max) hsv.hue = 240.0 + 60.0 * (rgb.r-rgb.g) / dif;
	if (hsv.hue < 0.0) hsv.hue += 360.0;
	hsv.value = Math.round(max * 100 / 255);
	hsv.hue = Math.round(hsv.hue);
	hsv.saturation = Math.round(hsv.saturation);
	return hsv;
}

function putInRange(value, rU, rD){
    return (value < rD) ? rD : ((value > rU) ? rU : value);
}

function responsiveNav() {
    var x = document.getElementById("topnav");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

function nameToHex(name) {
    var result =  {
      "aliceblue": "#f0f8ff",
      "antiquewhite": "#faebd7",
      "aqua": "#00ffff",
      "aquamarine": "#7fffd4",
      "azure": "#f0ffff",
      "beige": "#f5f5dc",
      "bisque": "#ffe4c4",
      "black": "#000000",
      "blanchedalmond": "#ffebcd",
      "blue": "#0000ff",
      "blueviolet": "#8a2be2",
      "brown": "#a52a2a",
      "burlywood": "#deb887",
      "cadetblue": "#5f9ea0",
      "chartreuse": "#7fff00",
      "chocolate": "#d2691e",
      "coral": "#ff7f50",
      "cornflowerblue": "#6495ed",
      "cornsilk": "#fff8dc",
      "crimson": "#dc143c",
      "cyan": "#00ffff",
      "darkblue": "#00008b",
      "darkcyan": "#008b8b",
      "darkgoldenrod": "#b8860b",
      "darkgray": "#a9a9a9",
      "darkgreen": "#006400",
      "darkkhaki": "#bdb76b",
      "darkmagenta": "#8b008b",
      "darkolivegreen": "#556b2f",
      "darkorange": "#ff8c00",
      "darkorchid": "#9932cc",
      "darkred": "#8b0000",
      "darksalmon": "#e9967a",
      "darkseagreen": "#8fbc8f",
      "darkslateblue": "#483d8b",
      "darkslategray": "#2f4f4f",
      "darkturquoise": "#00ced1",
      "darkviolet": "#9400d3",
      "deeppink": "#ff1493",
      "deepskyblue": "#00bfff",
      "dimgray": "#696969",
      "dodgerblue": "#1e90ff",
      "firebrick": "#b22222",
      "floralwhite": "#fffaf0",
      "forestgreen": "#228b22",
      "fuchsia": "#ff00ff",
      "gainsboro": "#dcdcdc",
      "ghostwhite": "#f8f8ff",
      "gold": "#ffd700",
      "goldenrod": "#daa520",
      "gray": "#808080",
      "green": "#008000",
      "greenyellow": "#adff2f",
      "honeydew": "#f0fff0",
      "hotpink": "#ff69b4",
      "indianred ": "#cd5c5c",
      "indigo": "#4b0082",
      "ivory": "#fffff0",
      "khaki": "#f0e68c",
      "lavender": "#e6e6fa",
      "lavenderblush": "#fff0f5",
      "lawngreen": "#7cfc00",
      "lemonchiffon": "#fffacd",
      "lightblue": "#add8e6",
      "lightcoral": "#f08080",
      "lightcyan": "#e0ffff",
      "lightgoldenrodyellow": "#fafad2",
      "lightgrey": "#d3d3d3",
      "lightgreen": "#90ee90",
      "lightpink": "#ffb6c1",
      "lightsalmon": "#ffa07a",
      "lightseagreen": "#20b2aa",
      "lightskyblue": "#87cefa",
      "lightslategray": "#778899",
      "lightsteelblue": "#b0c4de",
      "lightyellow": "#ffffe0",
      "lime": "#00ff00",
      "limegreen": "#32cd32",
      "linen": "#faf0e6",
      "magenta": "#ff00ff",
      "maroon": "#800000",
      "mediumaquamarine": "#66cdaa",
      "mediumblue": "#0000cd",
      "mediumorchid": "#ba55d3",
      "mediumpurple": "#9370d8",
      "mediumseagreen": "#3cb371",
      "mediumslateblue": "#7b68ee",
      "mediumspringgreen": "#00fa9a",
      "mediumturquoise": "#48d1cc",
      "mediumvioletred": "#c71585",
      "midnightblue": "#191970",
      "mintcream": "#f5fffa",
      "mistyrose": "#ffe4e1",
      "moccasin": "#ffe4b5",
      "navajowhite": "#ffdead",
      "navy": "#000080",
      "oldlace": "#fdf5e6",
      "olive": "#808000",
      "olivedrab": "#6b8e23",
      "orange": "#ffa500",
      "orangered": "#ff4500",
      "orchid": "#da70d6",
      "palegoldenrod": "#eee8aa",
      "palegreen": "#98fb98",
      "paleturquoise": "#afeeee",
      "palevioletred": "#d87093",
      "papayawhip": "#ffefd5",
      "peachpuff": "#ffdab9",
      "peru": "#cd853f",
      "pink": "#ffc0cb",
      "plum": "#dda0dd",
      "powderblue": "#b0e0e6",
      "purple": "#800080",
      "red": "#ff0000",
      "rosybrown": "#bc8f8f",
      "royalblue": "#4169e1",
      "saddlebrown": "#8b4513",
      "salmon": "#fa8072",
      "sandybrown": "#f4a460",
      "seagreen": "#2e8b57",
      "seashell": "#fff5ee",
      "sienna": "#a0522d",
      "silver": "#c0c0c0",
      "skyblue": "#87ceeb",
      "slateblue": "#6a5acd",
      "slategray": "#708090",
      "snow": "#fffafa",
      "springgreen": "#00ff7f",
      "steelblue": "#4682b4",
      "tan": "#d2b48c",
      "teal": "#008080",
      "thistle": "#d8bfd8",
      "tomato": "#ff6347",
      "turquoise": "#40e0d0",
      "violet": "#ee82ee",
      "wheat": "#f5deb3",
      "white": "#ffffff",
      "whitesmoke": "#f5f5f5",
      "yellow": "#ffff00",
      "yellowgreen": "#9acd32"
    }[name.toLowerCase()];
    return result ? result : name;
  }