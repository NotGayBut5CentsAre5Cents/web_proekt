var myFunc = [
    complementary,
    monochromatic,
    thriad,
    analogous,
    shades
];
var lumaTh = 80;
var bodyStyles = document.documentElement.style;
$( document ).ready(function() {
    init();
    $('a').on('click', function() {
        $(this).parent().find('a.active').removeClass('active');
        $(this).addClass('active');
    });
    
    $('.colors > input').on('keyup', function() {
        if(!$(this).siblings("button").hasClass("locked")) {
            $(this).parent().css('background', $(this).val());
        }
    });
    $('.lock').on('click', function(){
        $(this).toggleClass("locked");
        $(this).siblings("input").prop("readonly", function(index, prop){
            return prop == true ? null : true;
        });
        $(this).find('i').toggleClass("fa-lock");
        $(this).find('i').toggleClass("fa-unlock-alt");
    });
    $('#generate').on('click', function(){
        var colors = myFunc[$("#type-dropdown").prop('selectedIndex')]();
        $(".colors").each(function(i) {
            if(!$(this).find("button").hasClass("locked")){
                var hex = rgb2Hex(colors[i]);
                $(this).css({"background-color": hex});
                var input = $(this).find("input");
                var luma = 0.2126 * colors[i].r + 0.7152 * colors[i].g + 0.0722 * colors[i].b;
                if(luma <= lumaTh) {
                    $(this).addClass("light");
                }else {
                    $(this).removeClass("light");
                }
                input.val(hex);
                console.log(hex);
                console.log(luma);
            }
        });
    });

    $('#apply').on( 'click', function(){
        var colors = [];
        $(".colors").each(function(i) {
            var bgColor = $(this).css("background-color");
            console.log(bgColor);
            colors.push(bgColor);
            var rgb = bgColor.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
            console.log(rgb);
            var luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
            console.log(luma);
            if(luma <= lumaTh) {
                switch(i) {
                   case 0: bodyStyles.setProperty("--text-color", "#b2c2d4"); break;
                   case 2: bodyStyles.setProperty("--active-text-color", "#b2c2d4"); break;
                   case 3: bodyStyles.setProperty("--active-hover-text-color", "#b2c2d4"); break;
                }
            }else {
                switch(i) {
                    case 0: bodyStyles.setProperty("--text-color", "#1F2D3D"); break;
                    case 2: bodyStyles.setProperty("--active-text-color", "#1F2D3D"); break;
                    case 3: bodyStyles.setProperty("--active-hover-text-color", "#1F2D3D"); break;
                 }
            }
        });
        var properties = ["--base-color", "--site-background", "--active-color", "--active-hover", "--extra-color"];
        properties.forEach(function(item, index) {
            bodyStyles.setProperty(item, colors[index]);
        });
        saveSessionCss();
    });
    console.log( "ready!" );
});
function init() {
    $(".colors").each(function(index) {
        var hex = "#00B2AD";
        $(this).css({"background-color": hex});
        $(this).find("input").val(hex)
    });
    getCssFromStorage();
}

function saveSessionCss() {
    var properties = ["--base-color", "--site-background", "--active-color", "--active-hover", "--extra-color"];
    if(typeof(Storage) !== "undefined") {
        properties.forEach(function(item) {
            sessionStorage.setItem(item, bodyStyles.getPropertyValue(item));
        });
    }
}

function getCssFromStorage() {
    var properties = ["--base-color", "--site-background", "--active-color", "--active-hover", "--extra-color"];
    if(typeof(Storage) !== "undefined") {
        properties.forEach(function(item) {
            bodyStyles.setProperty(item, sessionStorage.getItem(item));
        });
    }
}

function complementary() {
    var baseColorHex = $('#color-1 :input').val();
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

function monochromatic() {
    var baseColorHex = $('#color-1 :input').val();
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

    colors = [baseColor, chrome1, chrome2, chrome3, chrome4];
    console.log(colors);
    return colors;
}

function thriad() {
    var baseColorHex = $('#color-1 :input').val();
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
    tmpHsv.value = putInRange(tmpHsv.value - 30, 100, 0);
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

function analogous() {
    var angle = 10;
    var baseColorHex = $('#color-1 :input').val();
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

    colors = [baseColor, positive1, positive2, negative1, negative2];
    console.log(colors);
    return colors;
}

function shades() {
    var baseColorHex = $('#color-1 :input').val();
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

    colors = [baseColor, shade1, shade2, shade3, shade4];
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