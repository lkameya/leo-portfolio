
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


    // SCROLL LINKS ON WHEEL
    let delay = false;
    let i = 0;

    $(document).on('mousewheel DOMMouseScroll', function (event) {
        event.preventDefault();
        console.log('hey');
        if (delay) return;

        delay = true;

        setTimeout(function () { delay = false }, 1000);

        let wd = event.originalEvent.wheelDelta || -event.originalEvent.detail;

        let sections = document.getElementsByClassName('page');
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

    // SCROLL LINKS ON CLICK
    let links = document.querySelectorAll('.scrollClick');

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



    /**
     * requestAnimationFrame
     */
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();


    // Configs

    var Configs = {
        backgroundColor: '#fafafa',
        particleNum: 100,
        step: 3, // distance
        base: 1000,
        zInc: 0.0002 //spread
    };


    // Vars

    var canvas,
        context,
        screenWidth,
        screenHeight,
        centerX,
        centerY,
        particles = [],
        hueBase = 0,
        simplexNoise,
        zoff = 0,
        gui;


    // Initialize

    function init() {
        canvas = document.getElementById('c');

        window.addEventListener('resize', onWindowResize, false);
        onWindowResize(null);

        for (var i = 0; i < Configs.particleNum; i++) {
            initParticle((particles[i] = new Particle()));
        }

        simplexNoise = new SimplexNoise();

        canvas.addEventListener('click', onCanvasClick, false);
        update();
    }


    // Event listeners
    function onWindowResize(e) {
        screenWidth = canvas.width = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;

        centerX = screenWidth / 2;
        centerY = screenHeight / 2;

        context = canvas.getContext('2d');
        context.lineWidth = 0.3;
        context.lineCap = context.lineJoin = 'round';
    }

    function onCanvasClick(e) {
        context.save();
        context.globalAlpha = 0.10;
        context.fillStyle = Configs.backgroundColor;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();

        simplexNoise = new SimplexNoise();
    }


    // Functions

    function getNoise(x, y, z) {
        var octaves = 4,
            fallout = 0.5,
            amp = 1, f = 1, sum = 0,
            i;

        for (i = 0; i < octaves; ++i) {
            amp *= fallout;
            sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5;
            f *= 2;
        }

        return sum;
    }

    function initParticle(p) {
        p.x = p.pastX = screenWidth * Math.random();
        p.y = p.pastY = screenHeight * Math.random();
        p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI;
        p.color.s = 1;
        p.color.l = 0.5;
        p.color.a = 0;
    }


    // Update

    function update() {
        var step = Configs.step,
            base = Configs.base,
            i, p, angle;

        for (i = 0; i < particles.length; i++) {
            p = particles[i];

            p.pastX = p.x;
            p.pastY = p.y;

            angle = Math.PI * 6 * getNoise(p.x / base * 1.75, p.y / base * 1.75, zoff);
            p.x += Math.cos(angle) * step;
            p.y += Math.sin(angle) * step;

            if (p.color.a < 0.05) p.color.a += 0.002;

            context.beginPath();
            context.strokeStyle = p.color.toString();
            context.moveTo(p.pastX, p.pastY);
            context.lineTo(p.x, p.y);
            context.stroke();

            if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
                initParticle(p);
            }
        }

        hueBase += 0.1;
        zoff += Configs.zInc;

        requestAnimationFrame(update);
    }


    /**
     * HSLA
     */
    function HSLA(h, s, l, a) {
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
        this.a = a || 0;
    }

    HSLA.prototype.toString = function () {
        return 'hsla(' + this.h + ',' + (this.s * 100) + '%,' + (this.l * 100) + '%,' + this.a + ')';
    }

    /**
     * Particle
     */
    function Particle(x, y, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = color || new HSLA();
        this.pastX = this.x;
        this.pastY = this.y;
    }


    // Run

    init();

}

