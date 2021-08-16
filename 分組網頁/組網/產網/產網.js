
(function($) {

    var pluginName = 'flipclock';

    var methods = {
        pad: function(n) {
            return (n < 10) ? '0' + n : n;
        },
        time: function(date) {
            if (date) {
                var e = new Date(date);
                var b = new Date();
                var d = new Date(e.getTime() - b.getTime());
            } else
                var d = new Date();
            var t = methods.pad(date ? d.getFullYear() - 70 : d.getFullYear())
                    + '' + methods.pad(date ? d.getMonth() : d.getMonth() + 1)
                    + '' + methods.pad(date ? d.getDate() - 1 : d.getDate())
                    + '' + methods.pad(d.getHours())
                    + '' + methods.pad(d.getMinutes())
                    + '' + methods.pad(d.getSeconds());
            return {
                'Y': {'d2': t.charAt(2), 'd1': t.charAt(3)},
                'M': {'d2': t.charAt(4), 'd1': t.charAt(5)},
                'D': {'d2': t.charAt(6), 'd1': t.charAt(7)},
                'h': {'d2': t.charAt(8), 'd1': t.charAt(9)},
                'm': {'d2': t.charAt(10), 'd1': t.charAt(11)},
                's': {'d2': t.charAt(12), 'd1': t.charAt(13)}
            };
        },
        play: function(c) {
            $('body').removeClass('play');
            var a = $('ul' + c + ' section.active');
            if (a.html() == undefined) {
                a = $('ul' + c + ' section').eq(0);
                a.addClass('ready')
                        .removeClass('active')
                        .next('section')
                        .addClass('active')
                        .closest('body')
                        .addClass('play');

            }
            else if (a.is(':last-child')) {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready').removeClass('active');
                a = $('ul' + c + ' section').eq(0);
                a.addClass('active')
                        .closest('body')
                        .addClass('play');
            }
            else {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready')
                        .removeClass('active')
                        .next('section')
                        .addClass('active')
                        .closest('body')
                        .addClass('play');
            }
        },
        // d1 is first digit and d2 is second digit
        ul: function(c, d2, d1) {
            return '<ul class="flip ' + c + '">' + this.li('d2', d2) + this.li('d1', d1) + '</ul>';
        },
        li: function(c, n) {
            //
            return '<li class="' + c + '"><section class="ready"><div class="up">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn"></div></div>'
                    + '<div class="down">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn"></div></div>'
                    + '</section><section class="active"><div class="up">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn">' + n + '</div></div>'
                    + '<div class="down">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn">' + n + '</div></div>'
                    + '</section></li>';
        }
    };
    // var defaults = {};
    function Plugin(element, options) {
        this.element = element;
        this.options = options;
        // this.options = $.extend({}, defaults, options);
        // this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            var t, full = false;

            if (!this.options || this.options == 'clock') {

                t = methods.time();

            } else if (this.options == 'date') {

                t = methods.time();
                full = true;

            } else {

                t = methods.time(this.options);
                full = true;

            }

            $(this.element)
                    .addClass('flipclock')
                    .html(
                    (full ?
                            methods.ul('year', t.Y.d2, t.Y.d1)
                            + methods.ul('month', t.M.d2, t.M.d1)
                            + methods.ul('day', t.D.d2, t.D.d1)
                            : '')
                    + methods.ul('hour', t.h.d2, t.h.d1)
                    + methods.ul('minute', t.m.d2, t.m.d1)
                    + methods.ul('second', t.s.d2, t.s.d1)
                    + '<audio id="flipclick">'
                    + '<source src="https://github.com/gokercebeci/flipclock/blob/master/js/plugins/flipclock/click.mp3?raw=true" type="audio/mpeg"/>'
                    + '</audio>');

            setInterval($.proxy(this.refresh, this), 1000);

        },
        refresh: function() {
            var el = $(this.element);
            var t;
            if (this.options
                    && this.options != 'clock'
                    && this.options != 'date') {

                t = methods.time(this.options);

            } else
                t = methods.time()

            // second sound
            setTimeout(function() {
                document.getElementById('flipclick').play()
            }, 500);

            // second first digit
            el.find(".second .d1 .ready .inn").html(t.s.d1);
            methods.play('.second .d1');
            // second second digit
            if ((t.s.d1 === '0')) {
                el.find(".second .d2 .ready .inn").html(t.s.d2);
                methods.play('.second .d2');
                // minute first digit
                if ((t.s.d2 === '0')) {
                    el.find(".minute .d1 .ready .inn").html(t.m.d1);
                    methods.play('.minute .d1');
                    // minute second digit
                    if ((t.m.d1 === '0')) {
                        el.find(".minute .d2 .ready .inn").html(t.m.d2);
                        methods.play('.minute .d2');
                        // hour first digit
                        if ((t.m.d2 === '0')) {
                            el.find(".hour .d1 .ready .inn").html(t.h.d1);
                            methods.play('.hour .d1');
                            // hour second digit
                            if ((t.h.d1 === '0')) {
                                el.find(".hour .d2 .ready .inn").html(t.h.d2);
                                methods.play('.hour .d2');
                                // day first digit
                                if ((t.h.d2 === '0')) {
                                    el.find(".day .d1 .ready .inn").html(t.D.d1);
                                    methods.play('.day .d1');
                                    // day second digit
                                    if ((t.D.d1 === '0')) {
                                        el.find(".day .d2 .ready .inn").html(t.D.d2);
                                        methods.play('.day .d2');
                                        // month first digit
                                        if ((t.D.d2 === '0')) {
                                            el.find(".month .d1 .ready .inn").html(t.M.d1);
                                            methods.play('.month .d1');
                                            // month second digit
                                            if ((t.M.d1 === '0')) {
                                                el.find(".month .d2 .ready .inn").html(t.M.d2);
                                                methods.play('.month .d2');
                                                // year first digit
                                                if ((t.M.d2 === '0')) {
                                                    el.find(".year .d1 .ready .inn").html(t.Y.d1);
                                                    methods.play('.year .d1');
                                                    // year second digit
                                                    if ((t.Y.d1 === '0')) {
                                                        el.find(".year .d2 .ready .inn").html(t.Y.d2);
                                                        methods.play('.year .d2');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        },
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$(this).data('plugin_' + pluginName)) {
                $(this).data('plugin_' + pluginName,
                        new Plugin(this, options));
            }
        });
    };

})(typeof jQuery !== 'undefined' ? jQuery : Zepto);


// RUN
$('#container').flipclock();
$('.slider').each(function() {
    var $this = $(this);
    var $group = $this.find('.slide_group');
    var $slides = $this.find('.slide');
    var bulletArray = [];
    var currentIndex = 0;
    var timeout;
    
    function move(newIndex) {
      var animateLeft, slideLeft;
      
      advance();
      
      if ($group.is(':animated') || currentIndex === newIndex) {
        return;
      }
      
      bulletArray[currentIndex].removeClass('active');
      bulletArray[newIndex].addClass('active');
      
      if (newIndex > currentIndex) {
        slideLeft = '100%';
        animateLeft = '-100%';
      } else {
        slideLeft = '-100%';
        animateLeft = '100%';
      }
      
      $slides.eq(newIndex).css({
        display: 'block',
        left: slideLeft
      });
      $group.animate({
        left: animateLeft
      }, function() {
        $slides.eq(currentIndex).css({
          display: 'none'
        });
        $slides.eq(newIndex).css({
          left: 0
        });
        $group.css({
          left: 0
        });
        currentIndex = newIndex;
      });
    }
    
    function advance() {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        if (currentIndex < ($slides.length - 1)) {
          move(currentIndex + 1);
        } else {
          move(0);
        }
      }, 4000);
    }
    
    $('.next_btn').on('click', function() {
      if (currentIndex < ($slides.length - 1)) {
        move(currentIndex + 1);
      } else {
        move(0);
      }
    });
    
    $('.previous_btn').on('click', function() {
      if (currentIndex !== 0) {
        move(currentIndex - 1);
      } else {
        move(3);
      }
    });
    
    $.each($slides, function(index) {
      var $button = $('<a class="slide_btn">&bull;</a>');
      
      if (index === currentIndex) {
        $button.addClass('active');
      }
      $button.on('click', function() {
        move(index);
      }).appendTo('.slide_buttons');
      bulletArray.push($button);
    });
    
    advance();
  });



  $test = setInterval(function(){ drawKhaos(2, 2); }, 50);
$x = 1;
$rgb = 0;
$opacity = 1;

var ctx = $('.logo')[0].getContext("2d");

function drawKhaos($startCoordX, $startCoordY){
  ctx.beginPath();
  switch($x){
    case 1:
      ctx.rect($startCoordX, $startCoordY, 8, 8);
      break;
    case 2:
      ctx.rect($startCoordX, $startCoordY+10, 8, 8);
      break;
    case 3:
      ctx.rect($startCoordX, $startCoordY+20, 8, 8);
      break;
    case 4:
      ctx.rect($startCoordX, $startCoordY+30, 8, 8);
      break;
    case 6:
      ctx.rect($startCoordX, $startCoordY+40, 8, 8);
      break;
    case 7:
      ctx.rect($startCoordX+30, $startCoordY, 8, 8);
      break;
    case 8:
      ctx.rect($startCoordX+20, $startCoordY+10, 8, 8);
      break;
    case 9:
      ctx.rect($startCoordX+10, $startCoordY+20, 8, 8);
      break;
    case 10:
      ctx.rect($startCoordX+20, $startCoordY+30, 8, 8);
      break;
    case 11:
      ctx.rect($startCoordX+30, $startCoordY+40, 8, 8);
      break;
    case 12:
      ctx.rect($startCoordX+30, $startCoordY, 8, 8);
      break;
      /* end k */
    case 13:
      ctx.rect($startCoordX+50, $startCoordY, 8, 8);
      break;
    case 14:
      ctx.rect($startCoordX+50, $startCoordY+10, 8, 8);
      break;
    case 15:
      ctx.rect($startCoordX+50, $startCoordY+20, 8, 8);
      break;
    case 16:
      ctx.rect($startCoordX+50, $startCoordY+30, 8, 8);
      break;
    case 17:
      ctx.rect($startCoordX+50, $startCoordY+40, 8, 8);
      break;
    case 18:
      ctx.rect($startCoordX+60, $startCoordY+20, 8, 8);
      break;
    case 19:
      ctx.rect($startCoordX+70, $startCoordY+20, 8, 8);
      break;
    case 20:
      ctx.rect($startCoordX+80, $startCoordY, 8, 8);
      break;
    case 21:
      ctx.rect($startCoordX+80, $startCoordY+10, 8, 8);
      break;
    case 22:
      ctx.rect($startCoordX+80, $startCoordY+20, 8, 8);
      break;
    case 23:
      ctx.rect($startCoordX+80, $startCoordY+30, 8, 8);
      break;
    case 24:
      ctx.rect($startCoordX+80, $startCoordY+40, 8, 8);
      break;
      /* end h */
    case 25:
      ctx.rect($startCoordX+100, $startCoordY+40, 8, 8);
      break;
    case 26:
      ctx.rect($startCoordX+100, $startCoordY+30, 8, 8);
      break;
    case 27:
      ctx.rect($startCoordX+100, $startCoordY+20, 8, 8);
      break;
    case 28:
      ctx.rect($startCoordX+100, $startCoordY+10, 8, 8);
      break;
    case 29:
      ctx.rect($startCoordX+110, $startCoordY, 8, 8);
      break;
    case 30:
      ctx.rect($startCoordX+120, $startCoordY, 8, 8);
      break;
    case 31:
      ctx.rect($startCoordX+130, $startCoordY+10, 8, 8);
      break;
    case 32:
      ctx.rect($startCoordX+130, $startCoordY+20, 8, 8);
      break;
    case 33:
      ctx.rect($startCoordX+130, $startCoordY+30, 8, 8);
      break;
    case 34:
      ctx.rect($startCoordX+130, $startCoordY+40, 8, 8);
      break;
    case 35:
      ctx.rect($startCoordX+130, $startCoordY+40, 8, 8);
      break;
    case 36:
      ctx.rect($startCoordX+110, $startCoordY+20, 8, 8);
      break;
    case 37:
      ctx.rect($startCoordX+120, $startCoordY+20, 8, 8);
      break;
      /* end a */
    case 38:
      ctx.rect($startCoordX+150, $startCoordY+10, 8, 8);
      break;
    case 39:
      ctx.rect($startCoordX+150, $startCoordY+20, 8, 8);
      break;
    case 40:
      ctx.rect($startCoordX+150, $startCoordY+30, 8, 8);
      break;
    case 41:
      ctx.rect($startCoordX+160, $startCoordY+40, 8, 8);
      break;
    case 42:
      ctx.rect($startCoordX+170, $startCoordY+40, 8, 8);
      break;
    case 43:
      ctx.rect($startCoordX+180, $startCoordY+30, 8, 8);
      break;
    case 44:
      ctx.rect($startCoordX+180, $startCoordY+20, 8, 8);
      break;
    case 45:
      ctx.rect($startCoordX+180, $startCoordY+10, 8, 8);
      break;
    case 46:
      ctx.rect($startCoordX+170, $startCoordY, 8, 8);
      break;
    case 47:
      ctx.rect($startCoordX+160, $startCoordY, 8, 8);
      break;
      /* end o */
    case 48:
      ctx.rect($startCoordX+200, $startCoordY+40, 8, 8);
      break;
    case 49:
      ctx.rect($startCoordX+210, $startCoordY+40, 8, 8);
      break;
    case 50:
      ctx.rect($startCoordX+220, $startCoordY+40, 8, 8);
      break;
    case 51:
      ctx.rect($startCoordX+230, $startCoordY+30, 8, 8);
      break;
    case 52:
      ctx.rect($startCoordX+220, $startCoordY+20, 8, 8);
      break;
    case 53:
      ctx.rect($startCoordX+210, $startCoordY+20, 8, 8);
      break;
    case 54:
      ctx.rect($startCoordX+200, $startCoordY+10, 8, 8);
      break;
    case 55:
      ctx.rect($startCoordX+210, $startCoordY, 8, 8);
      break;
    case 56:
      ctx.rect($startCoordX+220, $startCoordY, 8, 8);
      break;
    case 57:
      ctx.rect($startCoordX+230, $startCoordY, 8, 8);
      break;
    
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba('+$rgb+','+$rgb+','+$rgb+','+$opacity+')';
  $opacity /= 1.05;
  ctx.fill();
  $x++;
  if ($x > 57){
    clearInterval($test);
  }
}