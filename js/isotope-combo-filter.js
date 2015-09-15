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
  var totalLength = 0;
  //var result = [];

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

    // put all of this into a function
    // use window.location.href to grab the URL and get filter values from there
    if ($filterValue == "*") {
      $optionSet.find('.selected').removeClass('selected');
      $('.all').addClass('selected');
      vertFilters = [];
      deviceFilters = [];
      comboFilters = [];
    } else if ($group == "vertical") {
        vertFilters.push($filterValue);
        totalLength++;
    } else if ($group == "device") {
        deviceFilters.push($filterValue);
        totalLength++;
    }

    // TODO: Write a way to compensate for deviceFilters not being selected
    console.log(vertFilters.length);

    var allFilters = getComboFilters(vertFilters);

    selectFilters(allFilters);

    // console.log(result);
    // return false;
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

  function selectFilters(filterElems) {
    var result = [];
    for (var i = 0; i < totalLength; i++) {
      var combined = _.reduce(filterElems[i], function(memo, num) {
        return memo + num;
      });
      result.push(combined);
    }
    console.log(result.join(', '));
    var selector = result.join(', ');
    $container.isotope({ filter: selector });
  }
});