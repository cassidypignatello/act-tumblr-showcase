var domain = "";
var start = 0;
var allTags = [];
var tags = {};
var types = ["text", "custom", "photo", "photoset", "quote", "link", "chat", "video", "audio", "question"];
var vidLength, $posts, flashCount, photoSetLength, sortedTags, newPosts;
var firstLoad = true;
var emptyNav = false;
var firstPhoto = true;
var $container = $('#posts');
var vertFilters = [];
var deviceFilters = [];
var allFilters = [];

function isotopeShitUp() {
    firstLoad = false;
    $("#posts .post").find("img").imagesLoaded(function() {
        $posts.isotope({
            itemSelector: ".post"
        });
        $posts.css({
            opacity: 0,
            visibility: "visible"
        }).animate({
            opacity: 1
        });
        $("#initialLoader").fadeOut();
        if (!emptyNav) {
            $(".more").show();
        }
    });
}

function addIsotopeShit(a) {
    $(a).find("img").imagesLoaded(function() {
        $posts.isotope("insert", $(a));
        $(a).css({
            opacity: 0,
            visibility: "visible"
        }).animate({
            opacity: 1
        });
        $("#infscr-loading").fadeOut();
    });
}

function fixVideo(c, k) {
    if (c.indexOf("youtube5container") >= 0) {
        var o = $(".youtube5container .youtube5waiting").length;
        if (o >= 1) {
            var n = $(".youtube5container .youtube5waiting").css("background-image").replace(/^url|[\(\)]/g, "");
            $("#" + k + " .postInner .videoPlayer").remove();
            $("#" + k + " .postInner .thumb").prepend('<div class="videoImage"><img src="' + n + '" /></div>');
        } else {
            $("#" + k + " .postInner .videoPlayer").remove();
            $("#" + k + " .postInner .videoWatch").show();
        }
        flashCount--;
        checkThumbsAreCreated();
    } else {
        if (c.indexOf("youtube") >= 0) {
            var e = c.indexOf("embed/");
            var d = c.indexOf("auto");
            var h = $(".videoPlayer iframe").attr("src").match(/[\w\-]{11,}/)[0];
            var n = "http://i.ytimg.com/vi/" + h + "/0.jpg";
            $("#" + k + " .postInner .videoPlayer").remove();
            $("#" + k + " .postInner .thumb").prepend('<div class="videoImage"><img src="' + n + '" /></div>');
            flashCount--;
            checkThumbsAreCreated();
        } else {
            if (c.indexOf("vimeo") >= 0 && c.indexOf("iframe") >= 0) {
                var a = $(c).find("iframe").attr("src");
                var i = a.match(/player\.vimeo\.com\/video\/([0-9]*)/);
                var f = i[1];
                $("#" + k + " .postInner .videoPlayer").remove();
                var b = "http://www.vimeo.com/api/v2/video/" + f + ".json?callback=?";
                var m = $.ajax({
                    url: b,
                    dataType: "json",
                    timeout: 10000
                });
                m.success(function(q) {
                    $("#" + k + " .postInner .thumb").prepend('<div class="videoImage"><img src="' + q[0].thumbnail_large + '" /></div>');
                    flashCount--;
                    checkThumbsAreCreated();
                });
                m.error(function() {
                    $("#" + k + " .postInner .videoPlayer").remove();
                    $("#" + k + " .postInner .videoWatch").show();
                    flashCount--;
                    checkThumbsAreCreated();
                });
            } else {
                if (c.indexOf("tumblr.com/video") >= 0) {
                    var j = $("#" + k + " .postInner .videoPlayer").html();
                    j.replace(/\s/g, "");
                    var e = j.indexOf("posters");
                    var d = j.indexOf("_frame1.jpg");
                    var p = j.substring((e + 11), (d + 11));
                    var l = p.indexOf("22");
                    var p = p.substring((l + 2), (d + 11));
                    var g = decodeURIComponent(p);
                    $("#" + k + " .postInner .videoPlayer").remove();
                    $("#" + k + " .postInner .thumb").prepend('<div class="videoImage"><img src="' + g + '" /></div>');
                    flashCount--;
                    checkThumbsAreCreated();
                } else {
                    $("#" + k + " .postInner .thumb").hide();
                    $("#" + k + " .postInner .videoPlayer").remove();
                    $("#" + k + " .postInner .videoWatch").show();
                    flashCount--;
                    checkThumbsAreCreated();
                }
            }
        }
    }
}

function checkThumbsAreCreated() {
    if (flashCount === 0) {
        if (firstLoad) {
            isotopeShitUp();
        } else {
            addIsotopeShit(newPosts);
        }
    }
}

function postEvergreening() {
    $("#posts .post:not(.video, .photoset) iframe, #posts .post:not(.video, .photoset) object").each(function() {
        var a = $(this).parents(".postInner").find(".permaLink a").attr("href");
        $(this).replaceWith('<a class="flash-content" href="' + a + '">Watch</a>');
    });
    $(".video, .audio, .photo, .photoset").each(function() {
        var a = $(this).find(".caption").length;
        if (a === 0) {
            $(this).addClass("noCaption");
        }
    });
    $(".audio").each(function() {
        if ($(this).find("a.albumArt").length === 0) {
            $(this).find(".audioListen").show();
        }
    });
}

function getTags() {
    var a = domain + "/api/read/json?callback=?&num=50&start=" + start;
    $.getJSON(a, function(b) {
        $(b.posts).each(function(d, c) {
            $(c.tags).each(function(f, e) {
                tagLowercased = e.toLowerCase();
                allTags.push(tagLowercased);
            });
        });
        if (start + 50 < b["posts-total"]) {
            start = start + 50;
            getTags();
        } else {
            clearTags();
        }
    });
}

function sortTags(a, b) {
    return a.sort(function(d, c) {
        return b[d] - b[c];
    });
}

function getProps(c) {
    var a = [];
    var b;
    for (b in c) {
        if (c.hasOwnProperty(b)) {
            a.push(b);
        }
    }
    return a;
}

function convertToSlug(a) {
    return a.toLowerCase().replace(/ /g, "_").replace(/[^\w-]+/g, "");
}

function clearTags() {
    $(allTags).each(function(c, b) {
        tags[b] = (tags[b] ? tags[b] + 1 : 1);
    });
    for (prop in tags) {
        tagFrequency = tags[prop];
        if (tagFrequency === 1) {
            delete tags[prop];
        }
    }
    var a = getProps(tags);
    sortedTags = sortTags(a, tags).reverse();
    listTags();
}

function listTags() {
    $(".filters.tag").empty();
    $(".filters.tag").append('<li><a data-filter=".posttap" class="all-tag">all</a></li>');
   // $(".filters.tag").append('<li><a data-filter=".autos.photo">autos</a></li>');
    $(".filters.tag").append('<li><a data-filter=".autos">autos</a></li>');

    $(".filters.tag").append('<li><a data-filter=".entertainment">entertainment</a></li>');
    $(".filters.tag").append('<li><a data-filter=".finance">finance</a></li>');
    $(".filters.tag").append('<li><a data-filter=".pharma-health">pharma/health</a></li>');
    $(".filters.tag").append('<li><a data-filter=".retail-cpg">retail/cpg</a></li>');
    $(".filters.tag").append('<li><a data-filter=".tech-telco">tech/telco</a></li>');
    $(sortedTags).each(function(b, a) {
        tagSlug = convertToSlug(a);
        if ($(".post").hasClass(tagSlug)) {
            $(".filters.tag").append('<li><a data-filter=".' + tagSlug + '">' + a + "</a></li>");
        }
    });
    $(".filter .tag").show();
}

function listTypes() {
    $(".filters.type").empty();
    $(".filters.type").append('<li><a data-filter="*" class="active all-type">all</a></li>');
    $(types).each(function(a, b) {
        if ($(".post").hasClass(b)) {
            if (b === "photo" || b === "photoset") {
                if (firstPhoto) {
                    $(".filters.type").append('<li><a data-filter=".photopost">photo</a></li>');
                    firstPhoto = false;
                }
            } else {
                $(".filters.type").append('<li><a data-filter=".' + b + '">' + b + "</a></li>");
            }
        }
    });
}

$("body").append('<div class="credit"><a href="http://purifytheme.tumblr.com">Purify Theme</a><span> by </span><a target="_blank" href="http://william.rainbird.me">Rainerbird</a></div>');
$(window).scroll(function() {
    var b = $(window).scrollTop();
    if (b > 200) {
        $("#backtotop").fadeIn("slow");
    }
    if (b < 200) {
        $("#backtotop").fadeOut("slow");
    }
});
$("#backtotop").hover(function() {
    $(this).addClass("hover");
}, function() {
    $(this).removeClass("hover");
});
$(".meta div ").hover(function() {
    $(this).addClass("hover");
}, function() {
    $(this).removeClass("hover");
});
$("#backtotop").click(function() {
    $.scrollTo(0, {
        duration: 700,
        axis: "y"
    });
});
postEvergreening();
if ($.client.browser === "Chrome") {
    $("body").addClass("chrome");
}
var a = $(".navigation").html();
if (a.indexOf("page") <= 0) {
    emptyNav = true;
}
$posts = $("#posts");
vidLength = $(".video").length;
flashCount = vidLength;
if (flashCount > 0) {
    if (vidLength > 0) {
        $(".video").each(function() {
            $(this).addClass("loaded");
            var c = $(this).html();
            var b = $(this).attr("id");
            fixVideo(c, b);
        });
    }
} else {
    isotopeShitUp();
}
$posts.infinitescroll({
    navSelector: ".navigation",
    nextSelector: ".navigation .nextPage",
    itemSelector: ".post",
    loadingText: "",
    loadingImg: "http://i.imgur.com/JpjDi.gif",
    loadingMsg: "Loading",
    animate: true,
    debug: false,
    errorCallback: function() {
        $("#infscr-loading").fadeOut();
        $(".more").show();
        $(".more").html("No more posts").animate({
            opacity: 0.8
        }, 2000).fadeOut("normal");
    }
}, function(b) {
    firstPhoto = true;
    listTags();
    listTypes();
    postEvergreening();
    $(b).css("visibility", "hidden");
    vidLength = $(".video:not(.loaded)").length;
    flashCount = vidLength;
    newPosts = b;
    if (flashCount > 0) {
        if (vidLength > 0) {
            $(".video:not(.loaded)").each(function() {
                $(this).addClass("loaded");
                var d = $(this).html();
                var c = $(this).attr("id");
                fixVideo(d, c);
            });
        }
    } else {
        addIsotopeShit(b);
    }
});
$posts.infinitescroll("binding", "unbind");
$(".more").click(function(b) {
    $(".resetNote").hide();
    if ($(".all-tag").hasClass("active") || $(".all-type").hasClass("active")) {
        $posts.infinitescroll("retrieve");
        $(this).css("display", "block");
    } else {
        $("#posts").isotope({
            filter: "*"
        });
        $(".filter li a").removeClass("active");
        $(".all-type").addClass("active");
        $.scrollTo($(document).height(), {
            duration: 700,
            axis: "y",
            onAfter: function() {
                $posts.infinitescroll("retrieve");
                $(this).css("display", "block");
            }
        });
    }
});
$(".more").hover(function() {
    if ($(".all-tag").hasClass("active") || $(".all-type").hasClass("active")) {} else {
        $(".resetNote").show();
    }
}, function() {
    $(".resetNote").hide();
});
$(document).ajaxError(function(c, d, b) {
    if (d.status == 404) {
        $(".more").remove();
    }
});
$(".filter li").click(function() {
    var $this = $(this);
    var $optionSet = $('.option-set');
    var $group = $this.closest('div').attr('data-filter-group');
    var $filterValue = $this.children().attr('data-filter-value');

    $this.addClass('active');
    $('.select-all').removeClass('active');

    if ($filterValue === "*") {
        vertFilters = [];
        deviceFilters = [];
        comboFilters = [];
        $container.isotope({ filter: $filterValue });
    } else if ($group === "vertical")
        vertFilters.push($filterValue);
      else if ($group === "device")
        deviceFilters.push($filterValue);

    if (deviceFilters.length === 0 && vertFilters.length > 0) 
        $container.isotope({ filter: vertFilters.join(', ') });
    else if (vertFilters.length === 0 && deviceFilters.length > 0)
        $container.isotope({ filter: deviceFilters.join(', ') });
    else if (vertFilters.length > 0 && deviceFilters.length > 0) {
        allFilters = getComboFilters(vertFilters, deviceFilters);
        selectFilters(allFilters, allFilters.length);
    }
});

function getComboFilters() {
    return _.reduce(arguments, function(a, b) {
        return _.flatten(_.map(a, function(x) {
            return _.map(b, function(y) {
                return x.concat([y]);
            });
        }), true);
    }, [ [] ]);
}

function selectFilters(filterElems, totalLength) {
    var result = [];
    for (var i = 0; i < totalLength; i++) {
        var combined = _.reduce(filterElems[i], function(memo, num) {
            return memo + num;
        });
        result.push(combined);
    }
    var selector = result.join(', ');
    $container.isotope({ filter: selector });
}

domain = window.location.protocol + "//" + window.location.hostname;
getTags();
listTypes();