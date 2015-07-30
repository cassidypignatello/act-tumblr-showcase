$(function(){
  // initialize Isotope
  var $container = $('#filter-container');
  $container.isotope({
    itemSelector: '.item',
    layoutMode: 'fitRows'
  });

  // bind action on click
  $('.filter li a').click(function() {
    var filterValue = $(this).attr('data-filter-value');
    $container.isotope({ filter: filterValue });
  });
});


/*var $container = $('#filter-container');
var filters = {};
var comboFilter = getComboFilter(filters);
$container.isotope({
  //itemSelector: '.item',
  filter: comboFilter
});

// This targets all the possbile filter items

$('.filter li a').click(function() {
    // don't need to use this unless we change li elements to buttons
    // exit directly if filter already disabled
    if ($(this).hasClass('disabled') ){
        return false;
    }

  var $this = $(this);
  var $optionSet = $(this).parents('.option-set');
  group = $optionSet.attr('data-filter-group');
  // store filter value in an object
  var filterGroup = filters[group];
  if (!filterGroup) {
    filterGroup = filters[group] = [];
  }
  var comboFilter = getComboFilter(filters);
  $container.isotope({
    //itemSelector: '.item',
    filter: comboFilter
  });
});

function getComboFilter(filters) {
  var i = 0;
  var comboFilters = [];
  var message = [];
  for (var prop in filters) {
    message.push(filters[prop].join(' '));
    var filterGroup = filters[prop];
    // skip to next filter groups if it doesn't have any values
    if (!filterGroup.length) {
      continue;
    }
    if (i === 0) {
      //copy to a new array
      comboFilters = filterGroup.slice(0);
    } else {
      var filterSelectors = [];
      // copy to a fresh array
      var groupCombo = comboFilters.slice(0);
      // merge filter groups
      for (var k = 0, len3 = filterGroup.length; k < len3; k++) {
        for (var j = 0, len2 = groupCombo.length; j < len2; j++) {
          filterSelectors.push(groupCombo[j] + filterGroup[k]);
        }
      }
      // apply filter selectors to combo filters for next group
      comboFilters = filterSelectors;
    }
    i++;
  }
  comboFilters.sort();
  var comboFilter = comboFilters.join(', ');
  return comboFilter;
} */