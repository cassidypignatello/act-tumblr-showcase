var domain = "";
var start = 0;
var allTags = [];
var tags = {};
var types = ["text", "photo", "photoset", "quote", "link", "chat", "video", "audio", "question"];
var vidLength, $posts, flashCount, photoSetLength, sortedTags, newPosts;
var firstLoad = true;
var emptyNav = false;
var firstPhoto = true;

function isotopeShitUp() {
    firstLoad = false;
    // find any image tags within any element with a 'posts' ID or 'post' class
    // and call the function once all images have been loaded 
    $("#posts .post").find("img").imagesLoaded(function() {
        // initialize isotope, any image with a 'post' class is available for selection
        $posts.isotope({
            itemSelector: ".post"
        });
        // set the posts animation and opacity once selected
        $posts.css({
            opacity: 0,
            visibility: "visible"
        }).animate({
            opacity: 1
        });
        $("#initialLoader").fadeOut();
        // if emptyNav is false (which it will be the first time around)
        // make any elements with the 'more' class visible
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
    // concat the domain name (actshowcase.tumblr.com) and API call, store in var a
    var a = domain + "/api/read/json?callback=?&num=50&start=" + start;
    // Load JSON using API URL
    $.getJSON(a, function(b) {
        // Take the array of post objects (b)
        $(b.posts).each(function(d, c) {
            // Take each tag (e) from the tags array within each individual post object (c)
            $(c.tags).each(function(f, e) {
                // Make it lowercase and push into the allTags array
                tagLowercased = e.toLowerCase();
                allTags.push(tagLowercased);
            });
        });
        // if 50 is less than the total number of post objects
        if (start + 50 < b["posts-total"]) {
            // make start equal to 50
            start = start + 50;
            // call getTags
            getTags();
        } else {
            // otherwise call clearTags
            clearTags();
        }
    });
}

// takes in array of tag names (a) and tags object from clearTags
function sortTags(a, b) {
    // sort the array of tag names in ascending order
    // based on that tag name being a property in the tags object
    return a.sort(function(d, c) {
        return b[d] - b[c];
    });
}

// takes in tags object from clearTags
function getProps(c) {
    var a = [];
    var b;
    for (b in c) {
    // loop over the tags object and if the tag name exists
    // push it into an array set to var a
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
    // iterate over each tag in the array
    $(allTags).each(function(c, b) {
        // if the current tag isn't found in the tags object, set it as a property and its value to 1
        // if the current tag is found, increase its value by 1
        tags[b] = (tags[b] ? tags[b] + 1 : 1);
    });
    for (prop in tags) {
        // set each prop value in the tags object to tagFrequency
        tagFrequency = tags[prop];
        // if tagFrequency is equal to 1, remove that property from tags
        if (tagFrequency === 1) {
            delete tags[prop];
        }
    }
    // call getProps with the current tags and set the return value to var a
    var a = getProps(tags);
    // call sortTags with the tags processed by getProps and the current tags object
    // reverse the sorted array that's returned, set it to sortedTags
    // put the sorted tags into descending order and set to sortedTags
    sortedTags = sortTags(a, tags).reverse();
    // call listTags
    listTags();
}

function listTags() {
    // clear out any child nodes with classes of both .filters and .tag
    $(".filters.tag").empty();
    var c = 0;
    // set var b to pathname - "/" if on homepage
    var b = window.location.pathname;
    var a = false;
    // iterate over each tag in the array
    $(sortedTags).each(function(g, d) {
        // if c is greater than or equal to 25, stop here
        if (c >= 25) {
            return false;
        }
        // increment by one for each tag
        c++;
        // call convertToSlug with each tag and set to tagSlug
        tagSlug = convertToSlug(d);
        var f = "/" + tagSlug;
        // grab the current href and split it into an array
        // http://actshowcase.tumblr.com/ becomes ["http:", "", "actshowcase.tumblr.com", ""]
        var e = window.location.href.split("/");
        // concat a slash with the last item in the array and set it to currentTag
        currentTag = "/" + e[e.length - 1];
        // if you find a question mark or a hash, as well as any periods, replace them with an empty string
        currentTag = currentTag.replace(/(\?|\#).*/, "");
        // if the currentTag matches var f make currentTag equal to true, otherwise make it equal to false
        currentTag == f ? currentTag = true : currentTag = false;
        // if currentTag is true, set a to true
        // then append a link within a line item with the name of the current tag
        if (currentTag) {
            a = true;
            $(".filters.tag").append('<li><a class="active currTag">' + d + "</a></li>");
        } else {
            // otherwise, append a link within a line item with the name of the current tag
            // and an href of /tagged followed by the tagSlug name
            $(".filters.tag").append('<li><a href="/tagged/' + tagSlug + '">' + d + "</a></li>");
        }
    });
    // if a isn't true, prepend a link to All within a line item to the element with a class of both filters and tag
    if (!a) {
        $(".filters.tag").prepend('<li><a class="active currTag">All</a></li>');
    } else {
        // otherwise, prepend a link to All with an href back to the homepage within a line item
        $(".filters.tag").prepend('<li><a href="/">All</a></li>');
    }
    // display any elements with a class of filter or tag
    $(".filter .tag").show();
}
// then, once the document is ready..
$(function() {
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
        $posts.infinitescroll("retrieve");
    });
    $(document).ajaxError(function(c, d, b) {
        if (d.status == 404) {
            $(".more").remove();
        }
    });
    $(".filter a:not(.currTag)").live("hover", function() {
        $(this).toggleClass("active");
    });
    domain = window.location.protocol + "//" + window.location.hostname;
    getTags();
});
