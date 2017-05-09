'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TxtRotate = function () {
    function TxtRotate(element, data, period) {
        _classCallCheck(this, TxtRotate);

        this.toRotate = data;
        this.el = element;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 1000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }

    _createClass(TxtRotate, [{
        key: 'tick',
        value: function tick() {
            var i = this.loopNum % this.toRotate.length;
            var fullTxt = this.toRotate[i];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

            var that = this;
            var delta = 200 - Math.random() * 100;

            if (this.isDeleting) {
                delta /= 2;
            }

            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }

            setTimeout(function () {
                that.tick();
            }, delta);
        }
    }]);

    return TxtRotate;
}();

window.onload = function () {
    // TICK
    var elements = document.getElementsByClassName('txt-rotate');
    for (var _i = 0; _i < elements.length; _i++) {
        var toRotate = elements[_i].getAttribute('data-rotate');
        var period = elements[_i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[_i], JSON.parse(toRotate), period);
        }
    }

    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);

    // SCROLL LINKS ON WHEEL
    var delay = false;
    var i = 0;

    $(document).on('mousewheel DOMMouseScroll', function (event) {
        event.preventDefault();
        console.log('hey');
        if (delay) return;

        delay = true;

        setTimeout(function () {
            delay = false;
        }, 1000);

        var wd = event.originalEvent.wheelDelta || -event.originalEvent.detail;

        var sections = document.getElementsByClassName('page');
        console.log(wd);
        if (wd < 0 && i < sections.length) {
            i++;
        } else if (i > 0) {
            i--;
        }
        if (sections[i] !== undefined) {
            TweenMax.to(window, 2, {
                scrollTo: {
                    y: sections[i].offsetTop
                },
                ease: Power4.easeOut
            });
        }
    });
    /*
    // SCROLL LINKS ON CLICK
    let links = document.querySelectorAll('.scroll a');
     links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
             let href = link.getAttribute('href').substring(1);
            let rect = document.getElementById(href).getBoundingClientRect();
            let topY = rect.top + document.body.scrollTop;
             TweenMax.to(window, 1, {
                scrollTo: {
                    y: topY,
                    autoKill: true
                },
                ease: Power2.easeIn
            });
        });
    });
    */

    /*$('.scroll').on("click", "a", function () {
        var $this = $(this);
        var href = $this.attr("href");
        var topY = $(href).offset().top;
         TweenMax.to(window, 1, {
            scrollTo: {
                y: topY,
                autoKill: true
            },
            ease: Power2.easeOut
        });
         return false;
    }); */
};
