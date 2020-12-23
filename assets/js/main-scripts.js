(function ($) {
    "use strict";
    var NUXT = {};

    /*====== Preloader ======*/
    NUXT.Preloader = function () {
        var preloader = $(".preloader");
        var preloaderFadeOutTime = 500;
        preloader.fadeOut(preloaderFadeOutTime);
    }

    /*====== Sidenav - Side Navigation Menu ======*/
    NUXT.Sidenav = function () {
        var header = $(".site-header");
        var sidenav = $(".site-sidenav");
        header.on("click", ".button-open-sidenav", function () {
            sidenav.addClass("active");
        });
        sidenav.on("click", ".button-close-sidenav, .sidenav-close, .sidenav-menu a", function () {
            sidenav.removeClass("active");
        });
    };

    /*====== Data Filters Setting ======*/
    NUXT.DataFilters = function () {
        var links = $(".data-filters-links");
        links.on("click", "li", function () {
            var links = $(".data-filters-links li");
            var items = $(".data-filters-items li");
            var filter = $(this).attr("data-filter");
            links.removeClass("active");
            $(this).addClass("active");
            if (filter == "all") {
                items.show(600);
            } else {
                items.hide();
                $(".data-filters-items li[data-filter=" + filter + "]").show(600);
            }
        });
    };

    /*====== Magnigic Popup Js  ======*/
    NUXT.Portfolio = function () {
        var portfolio = $(".portfolio-gallery");
        portfolio.magnificPopup({
            type: "image",
            delegate: ".portfolio-zoom a",
            closeBtnInside: false,
            closeOnContentClick: true,
            gallery: {
                enabled: true
            }
        });
    };

    /*====== PagePiling ======*/
    NUXT.PageScrollEffect = function () {
        var pagepiling = $("#site-wrapper");
        //var menu_horizontal;
        pagepiling.pagepiling({
            menu: ".site-header .header-nav, .site-sidenav .sidenav-nav",
            anchors: ["intro", "blog", "services",  "about",  "contact"],
            direction: "horizontal",
            css3: false,
            navigation: true,
            keyboardScrolling: true,
            sectionSelector: ".section",
            animateAnchor: true,
            afterRender: function () {
            },
            onLeave: function (index, nextIndex, direction) {
                $('.section').eq(index - 1).find('h1, p').fadeOut(700, 'easeInQuart');
                $('.section').eq(nextIndex - 1).find('h1, p').fadeIn(700, 'easeInQuart');
                // menu_horizontal = $(".active").text('').attr('data-menuanchor');
               // $('#principal_title').text($(".active").text('').attr('data-menuanchor'));
                
            }
        });
        $.fn.pagepiling.setAllowScrolling(true);
        // Disable Keyboard Scrolling
        $.fn.pagepiling.setKeyboardScrolling(true);
        // Disable Mouse Wheel Scrolling
        $.fn.pagepiling.setMouseWheelScrolling(true);
    };

    /*====== Owl Carousel ======*/
    NUXT.SliderHero1 = function () {
        var rtl = $("body").attr("data-nuxt-rtl");
        var slider = $(".carousel-hero-1");
        slider.owlCarousel({
            rtl: rtl,
            nav: true,
            dots: false,
            loop: true,
            autoplay: false,
            autoplayTimeout: 6000,
            smartSpeed: 1200,
            items: 1,
            margin: 0,
            lazyLoad: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        });
    };

    NUXT.SliderPosts = function () {
        var rtl = $("body").attr("data-nuxt-rtl");
        var slider = $(".carousel-blog-1");
        slider.owlCarousel({
            rtl: rtl,
            nav: false,
            loop: true,
            dots: true,
            items: 3,
            margin: 30,
            responsive: {
                0: {
                    items: 1
                },
                992: {
                    items: 2
                },
                1500: {
                    items: 3
                }
            }
        });
    };

    NUXT.SliderServices = function () {
        var rtl = $("body").attr("data-nuxt-rtl");
        var slider = $(".carousel-services-1");
        slider.owlCarousel({
            rtl: rtl,
            nav: true,
            loop: false,
            dots: false,
            items: 5,
            margin: 0,
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 2
                },
                900: {
                    items: 3
                },
                1200: {
                    items: 4
                },
                1500: {
                    items: 5
                }
            },
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        });
    };

    $(window).on("load", function () {
        NUXT.Preloader();
    });

    $(document).ready(function () {
        NUXT.PageScrollEffect(), NUXT.Sidenav(), NUXT.Portfolio(), NUXT.DataFilters(), NUXT.SliderHero1(), NUXT.SliderServices(), NUXT.SliderPosts();
    });

})(jQuery);