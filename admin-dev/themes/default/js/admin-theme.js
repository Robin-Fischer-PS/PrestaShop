/**
 * 2007-2018 PrestaShop
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2018 PrestaShop SA
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

//build confirmation modal
function confirm_modal(heading, question, left_button_txt, right_button_txt, left_button_callback, right_button_callback) {
  var confirmModal =
    $('<div class="bootstrap modal hide fade">' +
      '<div class="modal-dialog">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<a class="close" data-dismiss="modal" >&times;</a>' +
      '<h3>' + heading + '</h3>' +
      '</div>' +
      '<div class="modal-body">' +
      '<p>' + question + '</p>' +
      '</div>' +
      '<div class="modal-footer">' +
      '<a href="#" id="confirm_modal_left_button" class="btn btn-primary">' +
      left_button_txt +
      '</a>' +
      '<a href="#" id="confirm_modal_right_button" class="btn btn-primary">' +
      right_button_txt +
      '</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>');
  confirmModal.find('#confirm_modal_left_button').click(function () {
    left_button_callback();
    confirmModal.modal('hide');
  });
  confirmModal.find('#confirm_modal_right_button').click(function () {
    right_button_callback();
    confirmModal.modal('hide');
  });
  confirmModal.modal('show');
}

//build error modal
/* global error_continue_msg */
function error_modal(heading, msg) {
  var errorModal =
    $('<div class="bootstrap modal hide fade">' +
      '<div class="modal-dialog">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<a class="close" data-dismiss="modal" >&times;</a>' +
      '<h4>' + heading + '</h4>' +
      '</div>' +
      '<div class="modal-body">' +
      '<p>' + msg + '</p>' +
      '</div>' +
      '<div class="modal-footer">' +
      '<a href="#" id="error_modal_right_button" class="btn btn-default">' +
      error_continue_msg +
      '</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>');
  errorModal.find('#error_modal_right_button').click(function () {
    errorModal.modal('hide');
  });
  errorModal.modal('show');
}

//move to hash after clicking on anchored links
function scroll_if_anchor(href) {
  href = typeof(href) === "string" ? href : $(this).attr("href");
  var fromTop = 120;
  if(href.indexOf("#") === 0) {
    var $target = $(href);
    if($target.length) {
      $('html, body').animate({ scrollTop: $target.offset().top - fromTop });
      if(history && "pushState" in history) {
        history.pushState({}, document.title, window.location.href + href);
        return false;
      }
    }
  }
}

$(document).ready(function() {
  //set main navigation aside
  /* global employee_token */
  function navSidebar(){
    var sidebar = $('#nav-sidebar');
    sidebar.off();
    $('.expanded').removeClass('expanded');
    $('.maintab').not('.active').closest('.submenu').hide();
    sidebar.on('click','.submenu_expand', function(){
      var $navId = $(this).parent();
      $('.submenu-collapse').remove();
      if($('.expanded').length ){
        $('.expanded > ul').slideUp('fast', function(){
          var $target = $('.expanded');
          $target.removeClass('expanded');
          $($navId).not($target).not('.active').addClass('expanded');
          $($navId).not($target).not('.active').children('ul:first').hide().slideDown();
        });
      }
      else {
        $($navId).not('.active').addClass('expanded');
        $($navId).not('.active').children('ul:first').hide().slideDown();
      }
    });
    //sidebar menu collapse
    sidebar.find('.menu-collapse').on('click', function(e) {
      $(this).toggleClass('icon-rotate-180');
      jQuery('#nav-sidebar ul.menu > li')
          .removeClass('open')
          .find('a > i.material-icons.sub-tabs-arrow').text('keyboard_arrow_down');

      if ($(this).hasClass('icon-rotate-180')) {
        $(this).css('margin-left', '5px');
        $('.page-head .page-title').css('padding-left', '70px');
        $('.page-head .breadcrumb').css('left', '70px');
        $('.page-head .page-subtitle').css('left', '70px');
      } else {
        $('.page-head .page-title').css('padding-left', '230px');
        $('.page-head .breadcrumb').css('left', '230px');
        $('.page-head .page-subtitle').css('left', '230px');
        jQuery('#nav-sidebar ul.menu > li.active').addClass('open');
      }
      $('body').toggleClass('page-sidebar-closed');
      $('.expanded').removeClass('expanded');
      $.ajax({
        url: "index.php",
        cache: false,
        data: "token="+employee_token+'&ajax=1&action=toggleMenu&tab=AdminEmployees&collapse='+Number($('body').hasClass('page-sidebar-closed'))
      });
    });

    var menuCollapse = sidebar.find('.menu-collapse');

    if ($('body').hasClass('page-sidebar-closed')) {
      menuCollapse.addClass('icon-rotate-180');
      menuCollapse.css('margin-left', '5px');
      $('.page-head .page-title').css('padding-left', '70px');
      $('.page-head .breadcrumb').css('left', '70px');
      $('.page-head .page-subtitle').css('left', '70px');

    }
  }

  function navTopbarReset() {
    ellipsed = [];
    $('#ellipsistab').remove();
    $('#nav-topbar ul.menu').find('li.maintab').each(function(){
      $(this).removeClass('hide');
    });
  }

  //agregate out of bounds items from top menu into ellipsis dropdown
  function navTopbarEllipsis() {
    navTopbarReset();
    $('#nav-topbar ul.menu').find('li.maintab').each(function(){
      if ($(this).position().top > 0) {
        ellipsed.push($(this).html());
        $(this).addClass('hide');
      }
    });
    if (ellipsed.length > 0) {
      $('#nav-topbar ul.menu').append('<li id="ellipsistab" class="subtab has_submenu"><a href="#"><i class="icon-ellipsis-horizontal"></i></a><ul id="ellipsis_submenu" class="submenu"></ul></li>');
      for (var i = 0; i < ellipsed.length; i++) {
        $('#ellipsis_submenu').append('<li class="subtab has_submenu">' + ellipsed[i] + '</li>');
      }
    }
  }

  //set main navigation on top
  function navTopbar() {
    navTopbarReset();
    $('#nav-sidebar').attr('id','nav-topbar');
    var topbar = $('#nav-topbar');
    topbar.off();
    $('span.submenu_expand').remove();
    $('.expanded').removeClass('expanded');
    // expand elements with submenu
    topbar.on('mouseenter', 'li.has_submenu', function(){
      $(this).addClass('expanded');
    });
    topbar.on('mouseleave', 'li.has_submenu', function(){
      $(this).removeClass('expanded');
    });
    // hide element over menu width on load
    navTopbarEllipsis();
    //hide element over menu width on resize
    $(window).on('resize', function() {
      navTopbarEllipsis();
    });
  }

  function buildMobileMenu(build) {

    $($('[data-mobile]').get().reverse()).each(function(index, item) {
      var target = '.' + $(item).data('target');
      var from = '#' + $(item).data('from');
      var after = $(item).data('after');
      if(after) {
        build ? $(target).append($(item).addClass('maintab')): $(from).append($(item).removeClass('maintab'));
      }
      else {
        build ? $(target).prepend($(item)): $(from).prepend($(item));
      }
    });

    if(build) {
      var adminLink = $('.admin-link').attr('href');
      var notificationOffsetLeft = $('#notification').offset().left;
      var shopText = $('#header_shop a.dropdown-toggle').html();

      $('#header_shop a.dropdown-toggle').remove();
      $('.username').contents().wrap('<a href="' + adminLink + '"></a>');
      $('.employee_avatar img').wrap('<a href="' + adminLink + '"></a>');
      $('.panel-collapse').addClass('collapse');
      $('.notifs_dropdown').css({
        'top' : $('.navbar-header').height() + 10,
        'left' : - window.innerWidth + (window.innerWidth - notificationOffsetLeft),
        'height' : window.innerHeight,
        'width' : window.innerWidth
      }).addClass('mobile-notifs').on('click', function(e) {
        if($(e.target).is('.mobile-notifs')){
          $('#notification').toggleClass('open');
        }
      });
      $('.nav-item .nav-link span').text('');
      $('#header_shop .dropdown-menu').attr('id','shop-list-collapse').removeClass('dropdown-menu');

      $('#header_shop li:first').addClass('shop-list-title').prepend('<a href="#shop-list-collapse" data-toggle="collapse" aria-expanded="true">'+shopText+'</a>');
      $('#shop-list-collapse').collapse({
        toggle: true
      });
    }
    else {
      $('.username a').contents().unwrap();
      $('.employee_avatar img').unwrap();
      $('.panel-collapse').removeClass('collapse');
      $('.notifs_dropdown').removeAttr('style').removeClass('mobile-notifs').off();
    }
  }

  //set main navigation for mobile devices
  function mobileNav() {
    navTopbarReset();
    // clean actual menu type
    // get it in navigation whatever type it is
    var navigation = $('#nav-sidebar,#nav-topbar');
    var submenu = "";

    // clean trigger
    navigation.find('.menu').hide();
    navigation.off().attr('id','nav-mobile');
    navigation.on('click.collapse','span.menu-collapse', expand);

    $('span.menu-collapse').off();
	  $('.menu-collapse').removeClass('icon-rotate-180');

    buildMobileMenu(true);

    function expand(event) {
      if ($(event.target).is('#nav-mobile.expanded') || $(event.target).is('span.menu-collapse.expanded i')){
        navigation.find('ul.menu').hide();
        navigation.removeClass('expanded');
        $('span.menu-collapse').removeClass('expanded');
        //remove submenu when closing nav
        $('#nav-mobile-submenu').remove();
      }
      else {
        navigation.find('ul.menu').removeClass('menu-close').show();
        navigation.addClass('expanded');
        $('span.menu-collapse').addClass('expanded');
        $('#nav-mobile.expanded').off().on('click',expand);
      }
    };

    $('.title.has_submenu').each(function(index, el) {
      $(el).attr('href', '#'+$(el).parent().find('.collapse').attr('id')).attr('data-toggle','collapse');
    });

    $('.collapse').collapse({
      toggle: false
    });
  }

  //unset mobile nav
  function removeMobileNav(){
    var navigation = $('#nav-mobile');
    buildMobileMenu(false);
    $('#nav-mobile-submenu').remove();
    $('span.menu-collapse').html('<i class="icon-align-justify"></i>');
    navigation.off();
    if ($('body').hasClass('page-sidebar')){
      navigation.attr('id',"nav-sidebar");
      navSidebar();
    } else if ($('body').hasClass('page-topbar')){
      navigation.attr('id',"nav-topbar");
      navTopbar();
    }
    navigation.find('.menu').show();
  }

  //init main navigation
  function initNav(){
    if ($('body').hasClass('page-sidebar')){
      navSidebar();
    }
    else if ($('body').hasClass('page-topbar')) {
      navTopbar();
    }
  }

  //show footer when reach bottom
  function animateFooter(){
    if($(window).scrollTop() + $(window).height() === $(document).height()) {
      $('div.onboarding-navbar').animate({
        bottom: "+=50"
      }, 500, function() {
      });
      $('#footer:hidden').removeClass('hide');
    } else {
      $('#footer').addClass('hide');
      $('div.onboarding-navbar').css('bottom', '0px');
    }
  }

  //scroll top
  function animateGoTop() {
    if ($(window).scrollTop()) {
      $('#go-top:hidden').stop(true, true).fadeIn();
      $('#go-top:hidden').removeClass('hide');
    } else {
      $('#go-top').stop(true, true).fadeOut();
    }
  }

  var ellipsed = [];
  initNav();

  // prevent mouseout + direct path to submenu on sidebar uncollapsed navigation + avoid out of bounds
  jQuery('li.maintab.has_submenu > a').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (jQuery('body').hasClass('page-sidebar-closed')) {
        return;
      }
      var $submenu = jQuery(this).parent();

      if (!$submenu.hasClass('open')) {
          jQuery('li.maintab').find('a > i.material-icons.sub-tabs-arrow').text('keyboard_arrow_down');
          jQuery('li.maintab').removeClass('open');
          $submenu.addClass('open');
          jQuery($submenu).find('a > i.material-icons.sub-tabs-arrow').text('keyboard_arrow_up');
      } else {
          $submenu.removeClass('open');
          $submenu.find('a > i.material-icons.sub-tabs-arrow').text('keyboard_arrow_down');
      }
  });

  jQuery('#nav-sidebar ul.menu > li').on('hover', function() {
      var $li = jQuery(this);

      if (jQuery('body').hasClass('page-sidebar-closed')) {
          $li.toggleClass('open');
      }
  });

  //media queries - depends of enquire.js
  /*global enquire*/
  enquire.register('screen and (max-width: 1200px)', {
    match : function() {
      if( $('#main').hasClass('helpOpen')) {
        $('.toolbarBox a.btn-help').trigger('click');
      }
    },
    unmatch : function() {

    }
  });
  enquire.register('screen and (max-width: 768px)', {
    match : function() {

      $('body.page-sidebar').addClass('page-sidebar-closed');
    },
    unmatch : function() {
      $('body.page-sidebar').removeClass('page-sidebar-closed');
    }
  });
  enquire.register('screen and (max-width: 570px)', {
    match : function() {
      $('body').addClass('mobile-nav');
      mobileNav();
    },
    unmatch : function() {
      $('body').removeClass('mobile-nav');
      removeMobileNav();
    }
  });

  //bootstrap components init
  $('.dropdown-toggle').dropdown();
  $('.label-tooltip, .help-tooltip').tooltip();
  $('#error-modal').modal('show');

  //init footer
  animateFooter();

  // go on top of the page
  $('#go-top').on('click',function() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  });

  var timer;
  $(window).scroll(function() {
    if(timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(function() {
      animateGoTop();
      animateFooter();
    }, 100);
  });

  // search with nav sidebar closed
  $(document).on('click', '.page-sidebar-closed .searchtab' ,function() {
    $(this).addClass('search-expanded');
    $(this).find('#bo_query').focus();
  });

  $('.page-sidebar-closed').click(function() {
    $('.searchtab').removeClass('search-expanded');
  });

  $('#header_search button').on('click', function(e){
    e.stopPropagation();
  });

  //erase button search input
  if ($('#bo_query').val() !== '') {
    $('.clear_search').removeClass('hide');
  }

  $('.clear_search').on('click', function(e){
    e.stopPropagation();
    e.preventDefault();
    var id = $(this).closest('form').attr('id');
    $('#'+id+' #bo_query').val('').focus();
    $('#'+id+' .clear_search').addClass('hide');
  });
  $('#bo_query').on('keydown', function(){
    if ($('#bo_query').val() !== ''){
      $('.clear_search').removeClass('hide');
    }
  });

  //search with nav sidebar opened
  $('.page-sidebar').click(function() {
    $('#header_search .form-group').removeClass('focus-search');
  });

  $('#header_search #bo_query').on('click', function(e){
    e.stopPropagation();
    e.preventDefault();
    if($('body').hasClass('mobile-nav')){
      return false;
    }
    $('#header_search .form-group').addClass('focus-search');
  });

  //select list for search type
  $('#header_search_options').on('click','li a', function(e){
    e.preventDefault();
    $('#header_search_options .search-option').removeClass('active');
    $(this).closest('li').addClass('active');
    $('#bo_search_type').val($(this).data('value'));
    $('#search_type_icon').removeAttr("class").addClass($(this).data('icon'));
    $('#bo_query').attr("placeholder",$(this).data('placeholder'));
    $('#bo_query').focus();
  });

  // reset form
  /* global header_confirm_reset, body_confirm_reset, left_button_confirm_reset, right_button_confirm_reset */
  $(".reset_ready").click(function () {
    var href = $(this).attr('href');
    confirm_modal( header_confirm_reset, body_confirm_reset, left_button_confirm_reset, right_button_confirm_reset,
      function () {
        window.location.href = href + '&keep_data=1';
      },
      function () {
        window.location.href = href + '&keep_data=0';
    });
    return false;
  });

  //scroll_if_anchor(window.location.hash);
  $("body").on("click", "a.anchor", scroll_if_anchor);

  //manage curency status switcher
  $('#currencyStatus input').change(function(){
    var parentZone = $(this).parent().parent().parent().parent();
    parentZone.find('.status').addClass('hide');

    if($(this).attr('checked') == 'checked'){
      parentZone.find('.enabled').removeClass('hide');
      $('#currency_form #active').val(1);
    }else{
      parentZone.find('.disabled').removeClass('hide');
      $('#currency_form #active').val(0);
    }
  });


  $('#currencyCronjobLiveExchangeRate input').change(function(){
    var enable = 0;
    var parentZone = $(this).parent().parent().parent().parent();
    parentZone.find('.status').addClass('hide');

    if($(this).attr('checked') == 'checked'){
      enable = 1;
      parentZone.find('.enabled').removeClass('hide');
    }else{
      enable = 0;
      parentZone.find('.disabled').removeClass('hide');
    }

    $.ajax({
      url: "index.php?controller=AdminCurrencies&token="+token,
      cache: false,
      data: "ajax=1&action=cronjobLiveExchangeRate&tab=AdminCurrencies&enable="+enable
    });
  });

  // Order details: show modal to update shipping details
  $(document).on('click', '.edit_shipping_link', function(e) {
    e.preventDefault();

    $('#id_order_carrier').val($(this).data('id-order-carrier'));
    $('#shipping_tracking_number').val($(this).data('tracking-number'));
    $('#shipping_carrier option[value='+$(this).data('id-carrier')+']').prop('selected', true);

    $('#modal-shipping').modal();
  });

}); //end dom ready
