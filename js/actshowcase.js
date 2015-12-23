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
var $filterItems = $('.filter li');
var vertFilters = [], deviceFilters = [], formatFilters = [], featureFilters = [];
var allFilters, vertSelected, deviceSelected, formatSelected, featureSelected, selector;
var filters = {};

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
    $("#posts .caption .y-tag-container iframe").remove();
    $(".index .post .postInner").mouseover(function(){
      $(this).find(".thumb-hover").css('display', 'none');
    });
    $(".index .post .postInner").mouseout(function(){
      $(".thumb-hover").css('display', 'block');
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
    // $(this).replaceWith('<a class="flash-content" href="' + a + '">Watch</a>');
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
  // for (prop in tags) {
  //   tagFrequency = tags[prop];
  //   if (tagFrequency === 1) {
  //     delete tags[prop];
  //   }
  // }
  var a = getProps(tags);
  sortedTags = sortTags(a, tags).reverse().sort();
  listTags();
}

function listTags() {
  var featureTags = [
    "App Install - Static", "App Install - Video",
    "Carousel", "Cascading", "Custom", "Custom Homepage", "Expandable", "Floating",
    "Full Page Video", "Interactive", "Post-Tap - Custom", "Post-Tap - Static", 
    "Post-Tap - Map", "Post-Tap - Video", "Post-Tap - Gyro", "Motion", "Standard", 
    "Static", "Tumblr Sponsored Day", "Tumblr Sponsored Post", "Tumblr Sponsored Video Post", 
    "Tumblr Campaign Page", "Video", "Ad Bar", "Ad Engage", "Bumper", "Canvas", "Clickable", 
    "Control Bar", "Extender", "Filmstrip", "Full Player", "Ad Selector", "Time Sync", 
    "Smartview Skippable", "Standard Pre-Roll With Companion Banner"
  ];

  $("#features-filters").empty();
  $("#features-filters").append('<li class="active select-all"><a href="#" class="ad-features all" data-filter-value="*">all</a></li>');
  $(sortedTags).each(function(b, a) {
    tagSlug = convertToSlug(a);
    for (var i = 0; i < featureTags.length; i++) {
      if (tagSlug === featureTags[i].toLowerCase().replace(/\s|\-/g, "") && $('.post').hasClass(tagSlug)) {
        $("#features-filters").append('<li><a href="#" class="ad-features ' + tagSlug + '"' + ' data-filter-value=".' + tagSlug + '">' + featureTags[i].toLowerCase() + '</a></li>');
      }
    }
  });
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
$posts.infinitescroll("pause");
$(".more").click(function(b) {
  $(".resetNote").hide();
  if ($(".select-all").hasClass("active")) {
    $posts.infinitescroll("retrieve");
    $(this).css("display", "block");
  } else {
    $("#posts").isotope({ filter: "*" });
    $filterItems.removeClass("active");
    $(".select-all").addClass("active");
    sortFilters($filterValue);
    $.scrollTo($(document).height(), {
      duration: 700,
      axis: "y",
      onAfter: function() {
        $posts.infinitescroll("retrieve");
        $(this).css("display", "block");
      }
    });
  }
  clearTags();
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

$(document).on('mouseenter', '.filter li', function() {
  var $hasActiveClass = $(this).hasClass('active');
  var $selectAll = $('.select-all, .select-all > a');
  if (!$hasActiveClass) {
    $(this).addClass('active-hover');
    $selectAll.css('cursor', 'pointer');
  }
  else if ($hasActiveClass && $(this).hasClass('select-all'))
    $selectAll.css('cursor', 'default');
}).on('mouseleave', '.filter li', function() {
  $(this).removeClass('active-hover');
}).on('click', '.filter li', function() {
  var $this = $(this);
  var $group = $this.closest('div').attr('data-filter-group');
  var $filterValue = $this.children().attr('data-filter-value');
  var selected;
  var deleted;

  if (!$this.hasClass('select-all') && $this.hasClass('active')) {
    $this.removeClass('active active-hover');
    delete filters[$filterValue];
    deleted = true;
    sortFilters($filterValue, deleted);
  } else {
    $('.select-all').removeClass('active');
    $this.addClass('active');
    if (!filters.hasOwnProperty($filterValue)) {
      filters[$filterValue] = $group;
      sortFilters($filterValue);
    }
  }
});

$(".nav-section h3").click(function(){
  var $navList = $(this).closest('.nav-section').children('ul');
  var $navArrow = $(this).children('img.section-arrow');
  if (!$navList.hasClass('nav-section-active')) {
    $navList.addClass('nav-section-active');
    $navArrow.addClass('section-arrow-active');
  } else {
    $navList.removeClass('nav-section-active');
    $navArrow.removeClass('section-arrow-active');
  }
});

function resetFilters() {
  vertFilters = [], deviceFilters = [], formatFilters = [], featureFilters = [], allFilters = [];
  vertSelected = false, deviceSelected = false, formatSelected = false, featureSelected = false;
}

function sortFilters(value, isDeleted) {
  if (value === "*" || Object.keys(filters).length === 0) {
    resetFilters();
    filters = {};
    $('.option-set').find('.active').removeClass('active');
    $('.select-all, .select-all > a').addClass('active').css('cursor', 'default');
    $container.isotope({ filter: '*' });
  } else {
    if (isDeleted)
      resetFilters();
    for (var prop in filters) {
      if (filters[prop] === "vertical") {
        vertFilters.push(prop);
        vertSelected = true;
      } else if (filters[prop] === "device") {
        deviceFilters.push(prop);
        deviceSelected = true;
      } else if (filters[prop] === "ad-format") {
        formatFilters.push(prop);
        formatSelected = true;
      } else if (filters[prop] === "ad-features") {
        featureFilters.push(prop);
        featureSelected = true;
      }
    }
    combineOrNot(vertSelected, deviceSelected, formatSelected, featureSelected);
  }
}

function combineOrNot(vert, device, format, features) {
  var truthyFilters = 0;
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i]) { truthyFilters++; }
  }
  if (truthyFilters > 1) {
    selected = selectFilters();
    combineFilters(allFilters, allFilters.length);
  } 
  else if (vert && !device && !format && !features) { selector = vertFilters.join(', '); } 
  else if (device && !vert && !format && !features) { selector = deviceFilters.join(', '); } 
  else if (format && !vert && !device && !features) { selector = formatFilters.join(', '); }
  else if (features && !vert && !device && !format) { selector = featureFilters.join(', '); }
  if (truthyFilters === 1) {
    $container.isotope({ filter: selector });
    resetFilters();
  }
}

function selectFilters() {
  var args = [];
  if (vertSelected) { args.push(_.uniq(vertFilters)); }
  if (deviceSelected) { args.push(_.uniq(deviceFilters)); }
  if (formatSelected) { args.push(_.uniq(formatFilters)); }
  if (featureSelected) { args.push(_.uniq(featureFilters)); }
  allFilters = getComboFilters.apply(null, args);
}

function getComboFilters() {
  return _.reduce(arguments, function(a, b) {
    return _.flatten(_.map(a, function(x) {
      return _.map(b, function(y) {
        return x.concat([y]);
      });
    }), true);
  }, [ [] ]);
}

function combineFilters(filterElems, totalLength) {
  var result = [];
  for (var i = 0; i < totalLength; i++) {
    var combined = _.reduce(filterElems[i], function(memo, num) {
      return memo + num;
    });
    result.push(combined);
  }
  selector = result.join(', ');
  $container.isotope({ filter: selector });
}

domain = window.location.protocol + "//" + window.location.hostname;
getTags();
listTypes();