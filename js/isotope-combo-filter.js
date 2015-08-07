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
  var comboFilters = [];

  // bind action on click
  $('.filter li a').click(function() {
    var $this = $(this);

    $('.all').removeClass('selected');
    
    var $optionSet = $('.option-set');
    $this.addClass('selected');

    // get each group value
    $group = $this.closest('div').attr('data-filter-group');

    // get each filter value and add it to an array
    $filterValue = $this.attr('data-filter-value');
    if ($filterValue == "*") {
      $optionSet.find('.selected').removeClass('selected');
      $('.all').addClass('selected');
      vertFilters = [];
      deviceFilters = [];
      comboFilters = [];
    } else if ($group == "vertical") {
      vertFilters.push($filterValue);
    } else if ($group == "device") {
      deviceFilters.push($filterValue);
    }

    // iterate over each group's filter values and combine them
    if (deviceFilters.length > 0) {
      for (var i = 0; i < vertFilters.length; i++) {
        for (var j = 0; j < deviceFilters.length; j++) {
          comboFilters.push(vertFilters[i] + deviceFilters[j]);
        };
      };
      var selector = comboFilters.join(', ');
      $container.isotope({ filter: selector });
    } else {
      var selector = vertFilters.join(', ');
      $container.isotope({ filter: selector });
    }

    console.log(selector);
    
    // concat filter values and pass them to isotope
    // console.log(vertFilters);
    // console.log(deviceFilters);
    // var selector = comboFilters.join(', ');
    // console.log(selector);
   // $container.isotope({ filter: selector });
    return false;
  });
});