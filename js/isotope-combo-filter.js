$(function(){
  // initialize Isotope
  var $container = $('#filter-container');
  
  $container.isotope({
    itemSelector: '.item',
    layoutMode: 'fitRows'
  });

  // store filter values in respective arrays
  var vertFilters = [];
  var deviceFilters = [];
  var allFilters = [];

  // bind action on click
  $('.filter li a').click(function() {
    var $this = $(this);
    $('.all').removeClass('selected');
    var $optionSet = $('.option-set');
    $this.addClass('selected');
    // get each group value
    var $group = $this.closest('div').attr('data-filter-group');
    // get each filter value
    var $filterValue = $this.attr('data-filter-value');

    // use window.location.href to grab the URL and get filter values from there
    if ($filterValue == "*") {
      $optionSet.find('.selected').removeClass('selected');
      $('.all').addClass('selected');
      vertFilters = [];
      deviceFilters = [];
      comboFilters = [];
      $container.isotope({ filter: $filterValue });
    } else if ($group == "vertical")
        vertFilters.push($filterValue);
      else if ($group == "device") 
        deviceFilters.push($filterValue);

    if (deviceFilters.length == 0 && vertFilters.length > 0) 
      $container.isotope({ filter: vertFilters.join(', ') });
    else if (vertFilters.length == 0 && deviceFilters.length > 0) 
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
});