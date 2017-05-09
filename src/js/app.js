
class TxtRotate {
    constructor(element, data, period) {
        this.toRotate = data;
        this.el = element;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 1000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }

    tick() {
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

        if (this.isDeleting) { delta /= 2; }

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
}

window.onload = () => {
    // TICK
    let elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-rotate');
        let period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    // INJECT CSS
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);


    // SCROLL LINKS
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
}

