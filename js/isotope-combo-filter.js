$(function(){
  // initialize Isotope
  var $container = $('#filter-container');
  
  $container.isotope({
    itemSelector: '.item',
    layoutMode: 'fitRows'
  });

  // store filter values in array
  var isoFilters = [];

  // bind action on click
  $('.filter li a').click(function() {
    var $this = $(this);

    $('.all').removeClass('selected');
    
    var $optionSet = $('.option-set');
    $this.addClass('selected');

    // get each filter value and add it to the array
    $filterValue = $this.attr('data-filter-value');
    if ($filterValue == "*") {
      $optionSet.find('.selected').removeClass('selected');
      $('.all').addClass('selected');
      isoFilters = [];
    } else {
      isoFilters.push($filterValue);
    }
    
    // concat filter values and pass them to isotope
    var selector = isoFilters.join('');
    $container.isotope({ filter: selector });
    return false;
  });
});