"use strict";

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var TxtRotate = function() {
    function TxtRotate(element, data, period) {
        _classCallCheck(this, TxtRotate);
        this.toRotate = data;
        this.el = element;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 1e3;
        this.txt = "";
        this.isDeleting = false;
        this.tick();
    }
    _createClass(TxtRotate, [ {
        key: "tick",
        value: function tick() {
            var i = this.loopNum % this.toRotate.length;
            var fullTxt = this.toRotate[i];
            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }
            this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";
            var that = this;
            var delta = 200 - Math.random() * 100;
            if (this.isDeleting) {
                delta /= 2;
            }
            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === "") {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }
            setTimeout(function() {
                that.tick();
            }, delta);
        }
    } ]);
    return TxtRotate;
}();

window.onload = function() {
    var elements = document.getElementsByClassName("txt-rotate");
    for (var _i = 0; _i < elements.length; _i++) {
        var toRotate = elements[_i].getAttribute("data-rotate");
        var period = elements[_i].getAttribute("data-period");
        if (toRotate) {
            new TxtRotate(elements[_i], JSON.parse(toRotate), period);
        }
    }
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
    var delay = false;
    var i = 0;
    var numberPages = 4;
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $(document).on("mousewheel DOMMouseScroll", function(event) {
            event.preventDefault();
            if (delay) return;
            delay = true;
            setTimeout(function() {
                delay = false;
            }, 1800);
            var wd = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            var sections = document.getElementsByClassName("page");
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
    }
    var links = document.querySelectorAll(".scrollClick");
    links.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            var href = link.getAttribute("href").substring(1);
            var rect = document.getElementById(href).getBoundingClientRect();
            var topY = rect.top + document.body.scrollTop;
            TweenMax.to(window, 1, {
                scrollTo: {
                    y: topY,
                    autoKill: true
                },
                ease: Power2.easeIn
            });
        });
    });
    window.requestAnimationFrame = function() {
        var returned = function returned(callback) {
            window.setTimeout(callback, 1e3 / 60);
        };
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || returned;
    }();
    var Configs = {
        backgroundColor: "#fafafa",
        particleNum: 200,
        step: 3,
        base: 1e3,
        zInc: 2e-4
    };
    var canvas = void 0, context = void 0, screenWidth = void 0, screenHeight = void 0, centerX = void 0, centerY = void 0, particles = [], hueBase = 0, simplexNoise = void 0, zoff = 0;
    var init = function init() {
        canvas = document.getElementById("c");
        window.addEventListener("resize", onWindowResize, false);
        onWindowResize(null);
        for (var i = 0; i < Configs.particleNum; i++) {
            initParticle(particles[i] = new Particle());
        }
        simplexNoise = new SimplexNoise();
        canvas.addEventListener("click", onCanvasClick, false);
        update();
    };
    var onWindowResize = function onWindowResize(e) {
        screenWidth = canvas.width = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;
        centerX = screenWidth / 2;
        centerY = screenHeight / 2;
        context = canvas.getContext("2d");
        context.lineWidth = .3;
        context.lineCap = context.lineJoin = "round";
    };
    var onCanvasClick = function onCanvasClick(e) {
        context.save();
        context.globalAlpha = .1;
        context.fillStyle = Configs.backgroundColor;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();
        simplexNoise = new SimplexNoise();
    };
    var getNoise = function getNoise(x, y, z) {
        var octaves = 4, fallout = .5, amp = 1, f = 1, sum = 0, i;
        for (i = 0; i < octaves; ++i) {
            amp *= fallout;
            sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * .5;
            f *= 2;
        }
        return sum;
    };
    var initParticle = function initParticle(p) {
        console.log(screenHeight * numberPages);
        p.x = p.pastX = screenWidth * Math.random();
        p.y = p.pastY = screenHeight * Math.random();
        p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI;
        p.color.s = 1;
        p.color.l = .5;
        p.color.a = 0;
    };
    var update = function update() {
        var step = Configs.step, base = Configs.base, i, p, angle;
        for (i = 0; i < particles.length; i++) {
            p = particles[i];
            p.pastX = p.x;
            p.pastY = p.y;
            angle = Math.PI * 6 * getNoise(p.x / base * 1.75, p.y / base * 1.75, zoff);
            p.x += Math.cos(angle) * step;
            p.y += Math.sin(angle) * step;
            if (p.color.a < .05) p.color.a += .002;
            context.beginPath();
            context.strokeStyle = p.color.toString();
            context.moveTo(p.pastX, p.pastY);
            context.lineTo(p.x, p.y);
            context.stroke();
            if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
                initParticle(p);
            }
        }
        hueBase += .1;
        zoff += Configs.zInc;
        requestAnimationFrame(update);
    };
    function HSLA(h, s, l, a) {
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
        this.a = a || 0;
    }
    HSLA.prototype.toString = function() {
        return "hsla(" + this.h + "," + this.s * 100 + "%," + this.l * 100 + "%," + this.a + ")";
    };
    function Particle(x, y, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = color || new HSLA();
        this.pastX = this.x;
        this.pastY = this.y;
    }
    init();
    var ww = $(window).width();
    var wh = $(window).height();
    var aboutCanvas = document.getElementById("hero-canvas");
    var workCanvas = document.getElementById("work-canvas");
    var contactCanvas = document.getElementById("contact-canvas");
    aboutCanvas.setAttribute("width", ww);
    aboutCanvas.setAttribute("height", wh);
    workCanvas.setAttribute("width", ww);
    workCanvas.setAttribute("height", wh);
    contactCanvas.setAttribute("width", ww);
    contactCanvas.setAttribute("height", wh);
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    window.requestAnimFrame = function() {
        return window.requestAnimationFrame || function(callback, element) {
            window.setTimeout(callback, 1e3 / 60);
        };
    }();
    function init2() {}
    function animate() {
        requestAnimFrame(animate);
        var color1 = "rgba(60,32,230,0.03)";
        var color2 = "rgba(80,25,240,0.2)";
        var color3 = "rgba(195,55,100,0.03)";
        var color4 = "rgba(195,55,100,0.2)";
        var color5 = "rgba(28,38,113,0.03)";
        var color6 = "rgba(27,30,100,0.2)";
        var canvas = document.getElementById("hero-canvas");
        var workCanvas = document.getElementById("work-canvas");
        var contactCanvas = document.getElementById("contact-canvas");
        var ctx = document.getElementById("hero-canvas").getContext("2d");
        var ctx2 = document.getElementById("work-canvas").getContext("2d");
        var ctx3 = document.getElementById("contact-canvas").getContext("2d");
        draw(color1, color2, canvas, ctx);
        draw(color3, color4, workCanvas, ctx2);
        drawFooter(color5, color6, contactCanvas, ctx3);
    }
    var draw = function draw(color1, color2, canvas, ctx) {
        var time = new Date().getTime() * .002;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        var randomX = random(.2, .9);
        var randomY = random(.1, .2);
        var rectX = Math.cos(time * 1) * 1.5 + randomX;
        var rectY = Math.sin(time * 1) * 1.5 + randomY;
        var rectX2 = Math.cos(time * .7) * 3 + randomX;
        var rectY2 = Math.sin(time * .7) * 3 + randomY;
        var rectX3 = Math.cos(time * 1.4) * 4 + randomX;
        var rectY3 = Math.sin(time * 1.4) * 4 + randomY;
        var triangle_gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        triangle_gradient.addColorStop(0, color1);
        triangle_gradient.addColorStop(1, color2);
        if (canvas.width > 600) {
            ctx.beginPath();
            ctx.moveTo(rectX3 - 50, rectY3 + (canvas.height - 350));
            ctx.lineTo(rectX3 + 350, rectY3 + (canvas.height - 220));
            ctx.lineTo(rectX3 - 100, rectY3 + (canvas.height - 120));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX + 100, rectY + (canvas.height - 380));
            ctx.lineTo(rectX + 320, rectY + (canvas.height - 180));
            ctx.lineTo(rectX - 275, rectY + (canvas.height + 150));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX2 - 230, rectY2 + (canvas.height - 50));
            ctx.lineTo(rectX2 + 215, rectY2 + (canvas.height - 110));
            ctx.lineTo(rectX2 + 250, rectY2 + (canvas.height + 130));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX + (canvas.width - 100), rectY + (canvas.height - 160));
            ctx.lineTo(rectX + (canvas.width - 30), rectY + (canvas.height + 90));
            ctx.lineTo(rectX + (canvas.width - 420), rectY + (canvas.height + 60));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(rectX2 + (canvas.width - 320), rectY2 + (canvas.height - 200));
        ctx.lineTo(rectX2 + (canvas.width - 50), rectY2 + (canvas.height - 20));
        ctx.lineTo(rectX2 + (canvas.width - 420), rectY2 + (canvas.height + 120));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(rectX3 + (canvas.width - 80), rectY3 + (canvas.height - 320));
        ctx.lineTo(rectX3 + (canvas.width + 250), rectY3 + (canvas.height + 220));
        ctx.lineTo(rectX3 + (canvas.width - 200), rectY3 + (canvas.height + 140));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();
        ctx.restore();
    };
    var drawFooter = function drawFooter(color1, color2, canvas, ctx) {
        var time = new Date().getTime() * .002;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        var randomX = random(.2, .9);
        var randomY = random(.1, .2);
        var rectX = Math.cos(time * 1) * 1.5 + randomX;
        var rectY = Math.sin(time * 1) * 1.5 + randomY;
        var rectX2 = Math.cos(time * .7) * 3 + randomX;
        var rectY2 = Math.sin(time * .7) * 3 + randomY;
        var rectX3 = Math.cos(time * 1.4) * 4 + randomX;
        var rectY3 = Math.sin(time * 1.4) * 4 + randomY;
        var rectX4 = Math.cos(time * 2.1) * 4 + randomX;
        var rectY4 = Math.sin(time * 2.1) * 4 + randomY;
        var rectX5 = Math.cos(time * 2.5) * 4 + randomX;
        var rectY5 = Math.sin(time * 2.5) * 4 + randomY;
        var rectX6 = Math.cos(time * 2.9) * 4 + randomX;
        var rectY6 = Math.sin(time * 2.9) * 4 + randomY;
        var rectX7 = Math.cos(time * 3.2) * 4 + randomX;
        var rectY7 = Math.sin(time * 3.2) * 4 + randomY;
        var rectX8 = Math.cos(time * 3.9) * 4 + randomX;
        var rectY8 = Math.sin(time * 3.9) * 4 + randomY;
        var rectX9 = Math.cos(time * 4) * 4 + randomX;
        var rectY9 = Math.sin(time * 4.2) * 4 + randomY;
        var triangle_gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        triangle_gradient.addColorStop(0, color1);
        triangle_gradient.addColorStop(1, color2);
        ctx.beginPath();
        ctx.moveTo(rectX3 + (canvas.width - 80), rectY3 + (canvas.height - 460));
        ctx.lineTo(rectX3 + (canvas.width + 250), rectY3 + (canvas.height + 200));
        ctx.lineTo(rectX3 + (canvas.width - 200), rectY3 + (canvas.height + 140));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();
        if (canvas.width > 600) {
            ctx.beginPath();
            ctx.moveTo(rectX + (canvas.width - 100), rectY + (canvas.height - 160));
            ctx.lineTo(rectX + (canvas.width - 30), rectY + (canvas.height + 90));
            ctx.lineTo(rectX + (canvas.width - 420), rectY + (canvas.height + 60));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX2 + (canvas.width - 320), rectY2 + (canvas.height - 200));
            ctx.lineTo(rectX2 + (canvas.width - 50), rectY2 + (canvas.height - 20));
            ctx.lineTo(rectX2 + (canvas.width - 420), rectY2 + (canvas.height + 120));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX4 + (canvas.width - 500), rectY4 + (canvas.height - 220));
            ctx.lineTo(rectX4 + (canvas.width - 150), rectY4 + (canvas.height - 50));
            ctx.lineTo(rectX4 + (canvas.width - 720), rectY4 + (canvas.height + 90));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX5 + (canvas.width - canvas.width * .46), rectY5 + (canvas.height - canvas.height * .27));
            ctx.lineTo(rectX5 + (canvas.width - canvas.width * .57), rectY5 + (canvas.height + canvas.height * .2));
            ctx.lineTo(rectX5 + (canvas.width - canvas.width * .09), rectY5 + (canvas.height + canvas.height * .4));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX5 + (canvas.width - canvas.width * .4), rectY5 + (canvas.height - canvas.height * .27));
            ctx.lineTo(rectX5 + (canvas.width - canvas.width * .63), rectY5 + (canvas.height + canvas.height * 0));
            ctx.lineTo(rectX5 + (canvas.width - canvas.width * .38), rectY5 + (canvas.height + canvas.height * 0));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX6 + (canvas.width - canvas.width * .55), rectY6 + (canvas.height - canvas.height * .25));
            ctx.lineTo(rectX6 + (canvas.width - canvas.width * .72), rectY6 + (canvas.height + canvas.height * 0));
            ctx.lineTo(rectX6 + (canvas.width - canvas.width * .43), rectY6 + (canvas.height + canvas.height * .15));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rectX7 + (canvas.width - canvas.width * .7), rectY7 + (canvas.height - canvas.height * .35));
            ctx.lineTo(rectX7 + (canvas.width - canvas.width * .88), rectY7 + (canvas.height - canvas.height * .06));
            ctx.lineTo(rectX7 + (canvas.width - canvas.width * .65), rectY7 + (canvas.height + canvas.height * .35));
            ctx.fillStyle = triangle_gradient;
            ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(rectX8 + (canvas.width - canvas.width * .85), rectY8 + (canvas.height - canvas.height * .35));
        ctx.lineTo(rectX8 + (canvas.width - canvas.width * .92), rectY8 + (canvas.height - canvas.height * 0));
        ctx.lineTo(rectX8 + (canvas.width - canvas.width * .7), rectY8 + (canvas.height + canvas.height * .35));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(rectX9 + (canvas.width - canvas.width * .95), rectY9 + (canvas.height - canvas.height * .6));
        ctx.lineTo(rectX9 + (canvas.width - canvas.width * 1.2), rectY9 + (canvas.height - canvas.height * .02));
        ctx.lineTo(rectX9 + (canvas.width - canvas.width * .7), rectY9 + (canvas.height - canvas.height * .01));
        ctx.fillStyle = triangle_gradient;
        ctx.fill();
        ctx.restore();
    };
    init2();
    animate();
    function hex_initial_animation() {
        $(".hex-wrap").velocity("callout.pulse").velocity({
            opacity: .5
        });
        $(".hoverblock").velocity("fadeOut", {
            delay: 3e3,
            duration: 0
        });
    }
    hex_initial_animation();
    $(".skillName").mouseenter(function() {
        var title_color = $(this).parent().attr("data-color");
        var title_name = $(this).parent().attr("data-title");
        var desc_name = $(this).parent().attr("data-content");
        function hex_description() {
            $(".code-description").velocity("stop", true).velocity("transition.slideRightBigIn");
            $("." + desc_name).siblings().removeClass("desc-active");
            setTimeout(function() {
                $("." + desc_name).addClass("desc-active");
                $(".code-descriptopn > div, .desc-active").children().velocity("stop", true).velocity("transition.slideRightBigIn", {
                    stagger: 300
                });
                $(".code-title, .desc-active span").velocity({
                    color: title_color
                }, {
                    queue: false
                });
                $(".code-title").text(title_name);
            }, 0);
        }
        hex_description();
        $(this).parent().addClass("hexactive");
        $(".hexactive").velocity({
            scaleX: "1.1",
            scaleY: "1.1",
            opacity: 1
        }, {
            duration: 200
        });
    }).mouseleave(function() {
        $(".hexactive").velocity("reverse").removeClass("hexactive");
    });
};