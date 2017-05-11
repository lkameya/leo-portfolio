
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

    let elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-rotate');
        let period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);


    // SCROLL LINKS ON WHEEL
    let delay = false;
    let i = 0;
    var numberPages = 4;
    

    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {

        $(document).on('mousewheel DOMMouseScroll', function (event) {
            event.preventDefault();

            if (delay) return;

            delay = true;
            setTimeout(function () { delay = false }, 800);

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
                    ease: Power2.easeOut
                });


            }

        });
        // some code..
    }



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

    //  Intro Background Canvas
    window.requestAnimationFrame = (() => {
        const returned = (callback) => {
            window.setTimeout(callback, 1000 / 60);
        };

        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            returned
    })();


    // Configs
    let Configs = {
        backgroundColor: '#fafafa',
        particleNum: 200,
        step: 3, // distance
        base: 1000,
        zInc: 0.0002 //spread
    };
    // Vars
    let canvas,
        context,
        screenWidth,
        screenHeight,
        centerX,
        centerY,
        particles = [],
        hueBase = 0,
        simplexNoise,
        zoff = 0;


    // Initialize
    const init = () => {

        canvas = document.getElementById('c');

        window.addEventListener('resize', onWindowResize, false);
        onWindowResize(null);

        for (var i = 0; i < Configs.particleNum; i++) {
            initParticle(particles[i] = new Particle());
        }

        simplexNoise = new SimplexNoise();

        canvas.addEventListener('click', onCanvasClick, false);
        update();
    }


    // Event listeners
    const onWindowResize = (e) => {
        screenWidth = canvas.width = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;

        centerX = screenWidth / 2;
        centerY = screenHeight / 2;

        context = canvas.getContext('2d');
        context.lineWidth = 0.3;
        context.lineCap = context.lineJoin = 'round';
    }

    const onCanvasClick = (e) => {
        context.save();
        context.globalAlpha = 0.10;
        context.fillStyle = Configs.backgroundColor;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();

        simplexNoise = new SimplexNoise();
    }


    // Functions
    const getNoise = (x, y, z) => {
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

    const initParticle = (p) => {
        console.log(screenHeight * numberPages);
        p.x = p.pastX = screenWidth * Math.random();
        p.y = p.pastY = (screenHeight) * Math.random();
        p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI;
        p.color.s = 1;
        p.color.l = 0.5;
        p.color.a = 0;
    }


    // Update
    const update = () => {
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

    let ww = $(window).width();
    let wh = $(window).height();
    let aboutCanvas = document.getElementById("hero-canvas");
    let workCanvas = document.getElementById("work-canvas");
    let contactCanvas = document.getElementById("contact-canvas");
    aboutCanvas.setAttribute("width", ww);
    aboutCanvas.setAttribute("height", wh);
    workCanvas.setAttribute("width", ww);
    workCanvas.setAttribute("height", wh);
    contactCanvas.setAttribute("width", ww);
    contactCanvas.setAttribute("height", wh);

    // pure javascrip random function ============
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function init2() { } //end init

    function animate() {
        requestAnimFrame(animate);

        const color1 = "rgba(60,32,230,0.03)";
        const color2 = "rgba(80,25,240,0.2)";

        const color3 = "rgba(195,55,100,0.03)";
        const color4 = "rgba(195,55,100,0.2)";

        const color5 = "rgba(28,38,113,0.03)";
        const color6 = "rgba(27,30,100,0.2)";

        let canvas = document.getElementById("hero-canvas");
        let workCanvas = document.getElementById("work-canvas");
        let contactCanvas = document.getElementById("contact-canvas");
        let ctx = document.getElementById("hero-canvas").getContext("2d");
        let ctx2 = document.getElementById("work-canvas").getContext("2d");
        let ctx3 = document.getElementById("contact-canvas").getContext("2d");


        draw(color1, color2, canvas, ctx);
        draw(color3, color4, workCanvas, ctx2);
        drawFooter(color5, color6, contactCanvas, ctx3);
    }

    const draw = (color1, color2, canvas, ctx) => {
        //setup canvas enviroment
        let time = new Date().getTime() * 0.002;
        //console.log(time);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // random float to be used in the sin & cos
        let randomX = random(.2, .9);
        let randomY = random(.1, .2);

        // sin & cos for the movement of the triangles in the canvas
        let rectX = Math.cos(time * 1) * 1.5 + randomX;
        let rectY = Math.sin(time * 1) * 1.5 + randomY;
        let rectX2 = Math.cos(time * .7) * 3 + randomX;
        let rectY2 = Math.sin(time * .7) * 3 + randomY;
        let rectX3 = Math.cos(time * 1.4) * 4 + randomX;
        let rectY3 = Math.sin(time * 1.4) * 4 + randomY;

        //console.log(rectX + '-' + rectY + '-' + rectX2 + '-' + rectY2 + '-' + rectX3 + '-' + rectY3);

        //triangle gradiente ==========================================
        var triangle_gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        triangle_gradient.addColorStop(0, color1);
        triangle_gradient.addColorStop(1, color2);


        //triangle group 1 ===========================================
        // triangle 1.1
        ctx.beginPath();
        ctx.moveTo(rectX2 + 120, rectY2 - 100);
        ctx.lineTo(rectX2 + 460, rectY2 + 80);
        ctx.lineTo(rectX2 + 26, rectY2 + 185);
        ctx.fillStyle = triangle_gradient;
        ctx.fill();

        //triangle 1.2
        ctx.beginPath();
        ctx.moveTo(rectX - 50, rectY - 25);
        ctx.lineTo(rectX + 270, rectY + 25);
        ctx.lineTo(rectX - 50, rectY + 195);
        ctx.fillStyle = triangle_gradient;
        ctx.fill();

        //triangle 1.3
        ctx.beginPath();
        ctx.moveTo(rectX3 - 140, rectY3 - 150);
        ctx.lineTo(rectX3 + 180, rectY3 + 210);
        ctx.lineTo(rectX3 - 225, rectY3 - 50);
        ctx.fillStyle = triangle_gradient;
        ctx.fill();

        if (canvas.width > 600) {
            //triangle group 2 ===========================================
            // triangle 2.1
            ctx.beginPath();
            ctx.moveTo(rectX + (canvas.width - 40), rectY - 30);
            ctx.lineTo(rectX + (canvas.width + 40), rectY + 190);
            ctx.lineTo(rectX + (canvas.width - 450), rectY + 120);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // triangle 2.2
            ctx.beginPath();
            ctx.moveTo(rectX3 + (canvas.width - 200), rectY3 - 240);
            ctx.lineTo(rectX3 + (canvas.width + 80), rectY3 - 240);
            ctx.lineTo(rectX3 + (canvas.width - 50), rectY3 + 460);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // triangle 2.3
            ctx.beginPath();
            ctx.moveTo(rectX2 + (canvas.width - 400), rectY2 + 140);
            ctx.lineTo(rectX2 + (canvas.width + 20), rectY2 + 200);
            ctx.lineTo(rectX2 + (canvas.width - 350), rectY2 + 370);
            ctx.fillStyle = triangle_gradient;
            ctx.fill();


            //triangle group 3 ===========================================
            // triangle 3.1
            ctx.beginPath();
            ctx.moveTo(rectX3 - 50, rectY3 + (canvas.height - 350));
            ctx.lineTo(rectX3 + 350, rectY3 + (canvas.height - 220));
            ctx.lineTo(rectX3 - 100, rectY3 + (canvas.height - 120));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // triangle 3.2
            ctx.beginPath();
            ctx.moveTo(rectX + 100, rectY + (canvas.height - 380));
            ctx.lineTo(rectX + 320, rectY + (canvas.height - 180));
            ctx.lineTo(rectX - 275, rectY + (canvas.height + 150));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // triangle 3.3
            ctx.beginPath();
            ctx.moveTo(rectX2 - 230, rectY2 + (canvas.height - 50));
            ctx.lineTo(rectX2 + 215, rectY2 + (canvas.height - 110));
            ctx.lineTo(rectX2 + 250, rectY2 + (canvas.height + 130));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
        }
        //triangle group 4 ===========================================
        // triangle 4.1
        ctx.beginPath();
        ctx.moveTo(rectX3 + (canvas.width - 80), rectY3 + (canvas.height - 320));
        ctx.lineTo(rectX3 + (canvas.width + 250), rectY3 + (canvas.height + 220));
        ctx.lineTo(rectX3 + (canvas.width - 200), rectY3 + (canvas.height + 140));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();

        // triangle 4.2
        ctx.beginPath();
        ctx.moveTo(rectX + (canvas.width - 100), rectY + (canvas.height - 160));
        ctx.lineTo(rectX + (canvas.width - 30), rectY + (canvas.height + 90));
        ctx.lineTo(rectX + (canvas.width - 420), rectY + (canvas.height + 60));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();

        // triangle 4.3
        ctx.beginPath();
        ctx.moveTo(rectX2 + (canvas.width - 320), rectY2 + (canvas.height - 200));
        ctx.lineTo(rectX2 + (canvas.width - 50), rectY2 + (canvas.height - 20));
        ctx.lineTo(rectX2 + (canvas.width - 420), rectY2 + (canvas.height + 120));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();


        ctx.restore();



    } //end function draw


    const drawFooter = (color1, color2, canvas, ctx) => {
        //setup canvas enviroment
        let time = new Date().getTime() * 0.002;
        //console.log(time);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // random float to be used in the sin & cos
        let randomX = random(.2, .9);
        let randomY = random(.1, .2);

        // sin & cos for the movement of the triangles in the canvas
        let rectX = Math.cos(time * 1) * 1.5 + randomX;
        let rectY = Math.sin(time * 1) * 1.5 + randomY;
        let rectX2 = Math.cos(time * .7) * 3 + randomX;
        let rectY2 = Math.sin(time * .7) * 3 + randomY;
        let rectX3 = Math.cos(time * 1.4) * 4 + randomX;
        let rectY3 = Math.sin(time * 1.4) * 4 + randomY;
        let rectX4 = Math.cos(time * 2.1) * 4 + randomX;
        let rectY4 = Math.sin(time * 2.1) * 4 + randomY;
        let rectX5 = Math.cos(time * 2.5) * 4 + randomX;
        let rectY5 = Math.sin(time * 2.5) * 4 + randomY;
        let rectX6 = Math.cos(time * 2.9) * 4 + randomX;
        let rectY6 = Math.sin(time * 2.9) * 4 + randomY;
        let rectX7 = Math.cos(time * 3.2) * 4 + randomX;
        let rectY7 = Math.sin(time * 3.2) * 4 + randomY;
        let rectX8 = Math.cos(time * 3.9) * 4 + randomX;
        let rectY8 = Math.sin(time * 3.9) * 4 + randomY;
        let rectX9 = Math.cos(time * 4.0) * 4 + randomX;
        let rectY9 = Math.sin(time * 4.2) * 4 + randomY;


        //console.log(rectX + '-' + rectY + '-' + rectX2 + '-' + rectY2 + '-' + rectX3 + '-' + rectY3);

        //triangle gradiente ==========================================
        var triangle_gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        triangle_gradient.addColorStop(0, color1);
        triangle_gradient.addColorStop(1, color2);

        //triangle group 4 ===========================================

        // triangle 4.1
        ctx.beginPath();
        ctx.moveTo(rectX3 + (canvas.width - 80), rectY3 + (canvas.height - 460));
        ctx.lineTo(rectX3 + (canvas.width + 250), rectY3 + (canvas.height + 200));
        ctx.lineTo(rectX3 + (canvas.width - 200), rectY3 + (canvas.height + 140));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();

        if (canvas.width > 600) {
            // triangle 4.2
            ctx.beginPath();
            ctx.moveTo(rectX + (canvas.width - 100), rectY + (canvas.height - 160));
            ctx.lineTo(rectX + (canvas.width - 30), rectY + (canvas.height + 90));
            ctx.lineTo(rectX + (canvas.width - 420), rectY + (canvas.height + 60));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            // triangle 4.3
            ctx.beginPath();
            ctx.moveTo(rectX2 + (canvas.width - 320), rectY2 + (canvas.height - 200));
            ctx.lineTo(rectX2 + (canvas.width - 50), rectY2 + (canvas.height - 20));
            ctx.lineTo(rectX2 + (canvas.width - 420), rectY2 + (canvas.height + 120));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();


            // triangle 4.4
            ctx.beginPath();
            ctx.moveTo(rectX4 + (canvas.width - 500), rectY4 + (canvas.height - 220));
            ctx.lineTo(rectX4 + (canvas.width - 150), rectY4 + (canvas.height - 50));
            ctx.lineTo(rectX4 + (canvas.width - 720), rectY4 + (canvas.height + 90));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(rectX5 + (canvas.width - (canvas.width * 0.46)), rectY5 + (canvas.height - (canvas.height * 0.27)));
            ctx.lineTo(rectX5 + (canvas.width - (canvas.width * 0.57)), rectY5 + (canvas.height + (canvas.height * 0.2)));
            ctx.lineTo(rectX5 + (canvas.width - (canvas.width * 0.09)), rectY5 + (canvas.height + (canvas.height * 0.4)));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            //5
            ctx.beginPath();
            ctx.moveTo(rectX5 + (canvas.width - (canvas.width * 0.40)), rectY5 + (canvas.height - (canvas.height * 0.27)));
            ctx.lineTo(rectX5 + (canvas.width - (canvas.width * 0.63)), rectY5 + (canvas.height + (canvas.height * 0)));
            ctx.lineTo(rectX5 + (canvas.width - (canvas.width * 0.38)), rectY5 + (canvas.height + (canvas.height * 0)));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            //6
            ctx.beginPath();
            ctx.moveTo(rectX6 + (canvas.width - (canvas.width * 0.55)), rectY6 + (canvas.height - (canvas.height * 0.25)));
            ctx.lineTo(rectX6 + (canvas.width - (canvas.width * 0.72)), rectY6 + (canvas.height + (canvas.height * 0)));
            ctx.lineTo(rectX6 + (canvas.width - (canvas.width * 0.43)), rectY6 + (canvas.height + (canvas.height * 0.15)));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

            //7
            ctx.beginPath();
            ctx.moveTo(rectX7 + (canvas.width - (canvas.width * 0.70)), rectY7 + (canvas.height - (canvas.height * 0.35)));
            ctx.lineTo(rectX7 + (canvas.width - (canvas.width * 0.88)), rectY7 + (canvas.height - (canvas.height * 0.06)));
            ctx.lineTo(rectX7 + (canvas.width - (canvas.width * 0.65)), rectY7 + (canvas.height + (canvas.height * 0.35)));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();

        }

        //8
        ctx.beginPath();
        ctx.moveTo(rectX8 + (canvas.width - (canvas.width * 0.85)), rectY8 + (canvas.height - (canvas.height * 0.35)));
        ctx.lineTo(rectX8 + (canvas.width - (canvas.width * 0.92)), rectY8 + (canvas.height - (canvas.height * 0)));
        ctx.lineTo(rectX8 + (canvas.width - (canvas.width * 0.70)), rectY8 + (canvas.height + (canvas.height * 0.35)));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();


        // triangle 4.7
        ctx.beginPath();
        ctx.moveTo(rectX9 + (canvas.width - (canvas.width * 0.95)), rectY9 + (canvas.height - (canvas.height * 0.6)));
        ctx.lineTo(rectX9 + (canvas.width - (canvas.width * 1.2)), rectY9 + (canvas.height - (canvas.height * 0.02)));
        ctx.lineTo(rectX9 + (canvas.width - (canvas.width * 0.70)), rectY9 + (canvas.height - (canvas.height * 0.01)));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();

        ctx.restore();



    }

    //call init
    init2();
    animate();

}

