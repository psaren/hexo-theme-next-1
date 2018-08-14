function toggleCode(options) {
  var defaultOptions = {
    toggleCodeClassName: 'toggle-code',
    showCodeName: 'show-code',
    hideCodeName: 'hide-code',
    maxHeight: 300,
    showCodeText: 'show code',
    hideCodeText: 'hide code'
  };
  var optionsType = Object.prototype.toString.call(options).slice(8, -1);
  if(optionsType !== 'Undefined' && optionsType !== 'Object') {
    console.log('toggleCode argument should be an object, replace with defaultOptions!');
  }
  options = options || defaultOptions;
  var o = $.extend(true, {}, defaultOptions, options);

  o.toggleCodeClass = '.' + o.toggleCodeClassName;
  o.showCodeClass   = '.' + o.showCodeName;
  o.hideCodeClass   = '.' + o.hideCodeName;

  // add style for toggle-code
  var $toggleCodeStyle = $('<style></style>')
    .html(o.hideCodeClass  + ', ' + o.showCodeClass + ' {cursor:pointer;}' + o.toggleCodeClass + ' table, ' + o.hideCodeClass  + ' {display: none;}');
  $('head').append($toggleCodeStyle);

  // when code block is heighter than maxHeight, show toggle button
  $('figure.highlight').each(function () {
    var isToggleCode = $(this).parents(o.toggleCodeClass).length > 0;
    if(!isToggleCode) {
      var h = $(this).height();
      if(h > o.maxHeight) {
        var $toggleCode = $('<div class="'+o.toggleCodeClassName+'"></div>').html($(this).clone());
        $toggleCode.insertBefore($(this));
        $(this).remove();
      }
    }
  });

  // add toggle button 
  $('<div class="' + o.showCodeName + '">▼' + o.showCodeText + '</div><div class="' + o.hideCodeName + '">▲' + o.hideCodeText + '</div>')
    .insertBefore(o.toggleCodeClass + ' figure.highlight table');

  // delete extra br
  $(o.toggleCodeClass + ' > br').remove();

  // detect toggle button init status
  $(o.toggleCodeClass).each(function () {
    if($(this).attr('init') === 'open') {
      $(this).find(o.hideCodeClass)  .show();
      $(this).find(o.showCodeClass)  .hide();
      $(this).find('table').show();
    } 
  })

  $(o.toggleCodeClass + ' figure').find(o.showCodeClass)  .click(function () {
    $(this).hide();
    $(this).parents(o.toggleCodeClass).find(o.hideCodeClass)  .show();
    $(this).parents(o.toggleCodeClass).find('table').slideToggle();
  })
  
  $(o.toggleCodeClass + ' figure').find(o.hideCodeClass)  .click(function () {
    $(this).hide();
    $(this).parents(o.toggleCodeClass).find(o.showCodeClass)  .show();
    $(this).parents(o.toggleCodeClass).find('table').slideToggle();
  })
}