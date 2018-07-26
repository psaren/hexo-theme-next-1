/* global NexT: true */

$(document).ready(function () {

  initScrollSpy();

  function initScrollSpy () {
    var tocSelector = '.post-toc';
    var $tocElement = $(tocSelector);
    var activeCurrentSelector = '.active-current';

    $tocElement
      .on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();

        removeCurrentActiveClass();
        $currentActiveElement.addClass('active-current');

        // Scrolling to center active TOC element if TOC content is taller then viewport.
        $tocElement.scrollTop($currentActiveElement.offset().top - $tocElement.offset().top + $tocElement.scrollTop() - ($tocElement.height() / 2));
      })
      .on('clear.bs.scrollspy', removeCurrentActiveClass);

    $('body').scrollspy({ target: tocSelector });

    function removeCurrentActiveClass () {
      $(tocSelector + ' ' + activeCurrentSelector)
        .removeClass(activeCurrentSelector.substring(1));
    }
  }

});

$(document).ready(function () {
  var html = $('html');
  var TAB_ANIMATE_DURATION = 200;
  var hasVelocity = $.isFunction(html.velocity);

  $('.sidebar-nav li').on('click', function () {
    var item = $(this);
    var activeTabClassName = 'sidebar-nav-active';
    var activePanelClassName = 'sidebar-panel-active';
    if (item.hasClass(activeTabClassName)) {
      return;
    }

    var currentTarget = $('.' + activePanelClassName);
    var target = $('.' + item.data('target'));

    hasVelocity ?
      currentTarget.velocity('transition.slideUpOut', TAB_ANIMATE_DURATION, function () {
        target
          .velocity('stop')
          .velocity('transition.slideDownIn', TAB_ANIMATE_DURATION)
          .addClass(activePanelClassName);
      }) :
      currentTarget.animate({ opacity: 0 }, TAB_ANIMATE_DURATION, function () {
        currentTarget.hide();
        target
          .stop()
          .css({'opacity': 0, 'display': 'block'})
          .animate({ opacity: 1 }, TAB_ANIMATE_DURATION, function () {
            currentTarget.removeClass(activePanelClassName);
            target.addClass(activePanelClassName);
          });
      });

    item.siblings().removeClass(activeTabClassName);
    item.addClass(activeTabClassName);
  });

  // TOC item animation navigate & prevent #item selector in adress bar.
  $('.post-toc a').on('click', function (e) {
    e.preventDefault();
    var targetSelector = NexT.utils.escapeSelector(this.getAttribute('href'));
    var offset = $(targetSelector).offset().top;

    hasVelocity ?
      html.velocity('stop').velocity('scroll', {
        offset: offset  + 'px',
        mobileHA: false
      }) :
      $('html, body').stop().animate({
        scrollTop: offset
      }, 500);
  });

  // Expand sidebar on post detail page by default, when post has a toc.
  var $tocContent = $('.post-toc-content');
  var display = CONFIG.page.sidebar;
  if (typeof display !== 'boolean') {
    // There's no definition sidebar in the page front-matter
    var isSidebarCouldDisplay = CONFIG.sidebar.display === 'post' ||
      CONFIG.sidebar.display === 'always';
    var hasTOC = $tocContent.length > 0 && $tocContent.html().trim().length > 0;
    display = isSidebarCouldDisplay && hasTOC;
  }
  if (display) {
    CONFIG.motion.enable ?
      (NexT.motion.middleWares.sidebar = function () {
          NexT.utils.displaySidebar();
      }) : NexT.utils.displaySidebar();
  }
});

$(document).ready(function () {
  var hasVelocity = $.isFunction($('html').velocity);
  var ANIMATE_DURATION = 200;
  if(hasVelocity) {
    var toggleCodeClassName = 'toggle-code';
    var toggleCodeClass = '.' + toggleCodeClassName;
    var openCodeClassName = 'open-code';
    var openCodeClass = '.' + openCodeClassName;
    var closeCodeClassName = 'close-code';
    var closeCodeClass = '.' + closeCodeClassName;

    var $toggleCodeFigure = $(toggleCodeClass + ' figure');
    $('<div class="' + openCodeClassName + '">▼展开代码</div><div class="' + closeCodeClassName + '">▲收起代码</div>')
      .insertBefore(toggleCodeClass + ' figure.highlight table');

    // click open-code 
    $toggleCodeFigure.find(openCodeClass)
      .on('click', function () {
        var $thisToggleCode = $(this).parents(toggleCodeClass);
        $(this).hide();
        $thisToggleCode
          .find(closeCodeClass)
          .show();
        $thisToggleCode
          .find('table')
          .velocity("fadeIn", { duration: ANIMATE_DURATION });
      })

    // click close-code 
    $toggleCodeFigure.find(closeCodeClass)
      .on('click', function () {
        var $thisToggleCode = $(this).parents(toggleCodeClass);
        $(this).hide();
        $thisToggleCode
          .find(openCodeClass)
          .show();
        $thisToggleCode
          .find('table')
          .velocity("fadeOut", { duration: ANIMATE_DURATION });
      })
  }
})