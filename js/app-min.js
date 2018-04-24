"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),TxtRotate=function(){function TxtRotate(element,data,period){_classCallCheck(this,TxtRotate),this.toRotate=data,this.el=element,this.loopNum=0,this.period=parseInt(period,10)||1e3,this.txt="",this.isDeleting=!1,this.tick()}return _createClass(TxtRotate,[{key:"tick",value:function tick(){var i=this.loopNum%this.toRotate.length,fullTxt=this.toRotate[i];this.isDeleting?this.txt=fullTxt.substring(0,this.txt.length-1):this.txt=fullTxt.substring(0,this.txt.length+1),this.el.innerHTML='<span class="wrap">'+this.txt+"</span>";var that=this,delta=200-100*Math.random();this.isDeleting&&(delta/=2),this.isDeleting||this.txt!==fullTxt?this.isDeleting&&""===this.txt&&(this.isDeleting=!1,this.loopNum++,delta=500):(delta=this.period,this.isDeleting=!0),setTimeout(function(){that.tick()},delta)}}]),TxtRotate}();window.onload=function(){function HSLA(h,s,l,a){this.h=h||0,this.s=s||0,this.l=l||0,this.a=a||0}function Particle(x,y,color){this.x=x||0,this.y=y||0,this.color=color||new HSLA,this.pastX=this.x,this.pastY=this.y}for(var elements=document.getElementsByClassName("txt-rotate"),_i=0;_i<elements.length;_i++){var toRotate=elements[_i].getAttribute("data-rotate"),period=elements[_i].getAttribute("data-period");toRotate&&new TxtRotate(elements[_i],JSON.parse(toRotate),period)}var css=document.createElement("style");css.type="text/css",css.innerHTML=".txt-rotate > .wrap { border-right: 0.08em solid #666 }",document.body.appendChild(css);var delay=!1,i=0;/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||$(document).on("mousewheel DOMMouseScroll",function(event){if(event.preventDefault(),!delay){delay=!0,setTimeout(function(){delay=!1},1800);var wd=event.originalEvent.wheelDelta||-event.originalEvent.detail,sections=document.getElementsByClassName("page");wd<0&&i<sections.length?i++:i>0&&i--,void 0!==sections[i]&&TweenMax.to(window,2,{scrollTo:{y:sections[i].offsetTop},ease:Power2.easeOut})}}),document.querySelectorAll(".scrollClick").forEach(function(link){link.addEventListener("click",function(event){event.preventDefault();var href=link.getAttribute("href").substring(1),rect=document.getElementById(href).getBoundingClientRect(),topY=rect.top+document.body.scrollTop;TweenMax.to(window,1,{scrollTo:{y:topY,autoKill:!0},ease:Power2.easeIn})})}),window.requestAnimationFrame=function(){var returned=function returned(callback){window.setTimeout(callback,1e3/60)};return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||returned}();var Configs={backgroundColor:"#fafafa",particleNum:200,step:3,base:1e3,zInc:2e-4},canvas=void 0,context=void 0,screenWidth=void 0,screenHeight=void 0,centerX=void 0,centerY=void 0,particles=[],hueBase=0,simplexNoise=void 0,zoff=0,init=function init(){canvas=document.getElementById("c"),window.addEventListener("resize",onWindowResize,!1),onWindowResize(null);for(var i=0;i<Configs.particleNum;i++)initParticle(particles[i]=new Particle);simplexNoise=new SimplexNoise,canvas.addEventListener("click",onCanvasClick,!1),update()},onWindowResize=function onWindowResize(e){screenWidth=canvas.width=window.innerWidth,screenHeight=canvas.height=window.innerHeight,centerX=screenWidth/2,centerY=screenHeight/2,context=canvas.getContext("2d"),context.lineWidth=.3,context.lineCap=context.lineJoin="round"},onCanvasClick=function onCanvasClick(e){context.save(),context.globalAlpha=.1,context.fillStyle=Configs.backgroundColor,context.fillRect(0,0,screenWidth,screenHeight),context.restore(),simplexNoise=new SimplexNoise},getNoise=function getNoise(x,y,z){var octaves=4,fallout=.5,amp=1,f=1,sum=0,i;for(i=0;i<4;++i)amp*=.5,sum+=amp*(simplexNoise.noise3D(x*f,y*f,z*f)+1)*.5,f*=2;return sum},initParticle=function initParticle(p){p.x=p.pastX=screenWidth*Math.random(),p.y=p.pastY=screenHeight*Math.random(),p.color.h=hueBase+180*Math.atan2(centerY-p.y,centerX-p.x)/Math.PI,p.color.s=1,p.color.l=.5,p.color.a=0},update=function update(){var step=Configs.step,base=Configs.base,i,p,angle;for(i=0;i<particles.length;i++)p=particles[i],p.pastX=p.x,p.pastY=p.y,angle=6*Math.PI*getNoise(p.x/base*1.75,p.y/base*1.75,zoff),p.x+=Math.cos(angle)*step,p.y+=Math.sin(angle)*step,p.color.a<.05&&(p.color.a+=.002),context.beginPath(),context.strokeStyle=p.color.toString(),context.moveTo(p.pastX,p.pastY),context.lineTo(p.x,p.y),context.stroke(),(p.x<0||p.x>screenWidth||p.y<0||p.y>screenHeight)&&initParticle(p);hueBase+=.1,zoff+=Configs.zInc,requestAnimationFrame(update)};HSLA.prototype.toString=function(){return"hsla("+this.h+","+100*this.s+"%,"+100*this.l+"%,"+this.a+")"},init();var ww=$(window).width(),wh=$(window).height(),aboutCanvas=document.getElementById("hero-canvas"),workCanvas=document.getElementById("work-canvas"),contactCanvas=document.getElementById("contact-canvas");aboutCanvas.setAttribute("width",ww),aboutCanvas.setAttribute("height",wh),workCanvas.setAttribute("width",ww),workCanvas.setAttribute("height",wh),contactCanvas.setAttribute("width",ww),contactCanvas.setAttribute("height",wh);var random=function random(min,max){return Math.random()*(max-min)+min};window.requestAnimFrame=function(){return window.requestAnimationFrame||function(callback,element){window.setTimeout(callback,1e3/60)}}();var init2=function init2(){},animate=function animate(){requestAnimFrame(animate);var color1="rgba(60,32,230,0.03)",color2="rgba(80,25,240,0.2)",color3="rgba(195,55,100,0.03)",color4="rgba(195,55,100,0.2)",color5="rgba(28,38,113,0.03)",color6="rgba(27,30,100,0.2)",canvas=document.getElementById("hero-canvas"),workCanvas=document.getElementById("work-canvas"),contactCanvas=document.getElementById("contact-canvas"),ctx=document.getElementById("hero-canvas").getContext("2d"),ctx2=document.getElementById("work-canvas").getContext("2d"),ctx3=document.getElementById("contact-canvas").getContext("2d");draw("rgba(60,32,230,0.03)","rgba(80,25,240,0.2)",canvas,ctx),draw("rgba(195,55,100,0.03)","rgba(195,55,100,0.2)",workCanvas,ctx2),drawFooter("rgba(28,38,113,0.03)","rgba(27,30,100,0.2)",contactCanvas,ctx3)},draw=function draw(color1,color2,canvas,ctx){var time=.002*(new Date).getTime();ctx.clearRect(0,0,canvas.width,canvas.height),ctx.save();var randomX=random(.2,.9),randomY=random(.1,.2),rectX=1.5*Math.cos(1*time)+randomX,rectY=1.5*Math.sin(1*time)+randomY,rectX2=3*Math.cos(.7*time)+randomX,rectY2=3*Math.sin(.7*time)+randomY,rectX3=4*Math.cos(1.4*time)+randomX,rectY3=4*Math.sin(1.4*time)+randomY,triangle_gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.height);triangle_gradient.addColorStop(0,color1),triangle_gradient.addColorStop(1,color2),canvas.width>600&&(ctx.beginPath(),ctx.moveTo(rectX3-50,rectY3+(canvas.height-350)),ctx.lineTo(rectX3+350,rectY3+(canvas.height-220)),ctx.lineTo(rectX3-100,rectY3+(canvas.height-120)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX+100,rectY+(canvas.height-380)),ctx.lineTo(rectX+320,rectY+(canvas.height-180)),ctx.lineTo(rectX-275,rectY+(canvas.height+150)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX2-230,rectY2+(canvas.height-50)),ctx.lineTo(rectX2+215,rectY2+(canvas.height-110)),ctx.lineTo(rectX2+250,rectY2+(canvas.height+130)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX+(canvas.width-100),rectY+(canvas.height-160)),ctx.lineTo(rectX+(canvas.width-30),rectY+(canvas.height+90)),ctx.lineTo(rectX+(canvas.width-420),rectY+(canvas.height+60)),ctx.fillStyle=triangle_gradient,ctx.fill()),ctx.beginPath(),ctx.moveTo(rectX2+(canvas.width-320),rectY2+(canvas.height-200)),ctx.lineTo(rectX2+(canvas.width-50),rectY2+(canvas.height-20)),ctx.lineTo(rectX2+(canvas.width-420),rectY2+(canvas.height+120)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX3+(canvas.width-80),rectY3+(canvas.height-320)),ctx.lineTo(rectX3+(canvas.width+250),rectY3+(canvas.height+220)),ctx.lineTo(rectX3+(canvas.width-200),rectY3+(canvas.height+140)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.restore()},drawFooter=function drawFooter(color1,color2,canvas,ctx){var time=.002*(new Date).getTime();ctx.clearRect(0,0,canvas.width,canvas.height),ctx.save();var randomX=random(.2,.9),randomY=random(.1,.2),rectX=1.5*Math.cos(1*time)+randomX,rectY=1.5*Math.sin(1*time)+randomY,rectX2=3*Math.cos(.7*time)+randomX,rectY2=3*Math.sin(.7*time)+randomY,rectX3=4*Math.cos(1.4*time)+randomX,rectY3=4*Math.sin(1.4*time)+randomY,rectX4=4*Math.cos(2.1*time)+randomX,rectY4=4*Math.sin(2.1*time)+randomY,rectX5=4*Math.cos(2.5*time)+randomX,rectY5=4*Math.sin(2.5*time)+randomY,rectX6=4*Math.cos(2.9*time)+randomX,rectY6=4*Math.sin(2.9*time)+randomY,rectX7=4*Math.cos(3.2*time)+randomX,rectY7=4*Math.sin(3.2*time)+randomY,rectX8=4*Math.cos(3.9*time)+randomX,rectY8=4*Math.sin(3.9*time)+randomY,rectX9=4*Math.cos(4*time)+randomX,rectY9=4*Math.sin(4.2*time)+randomY,triangle_gradient=ctx.createLinearGradient(0,0,canvas.width,canvas.height);triangle_gradient.addColorStop(0,color1),triangle_gradient.addColorStop(1,color2),ctx.beginPath(),ctx.moveTo(rectX3+(canvas.width-80),rectY3+(canvas.height-460)),ctx.lineTo(rectX3+(canvas.width+250),rectY3+(canvas.height+200)),ctx.lineTo(rectX3+(canvas.width-200),rectY3+(canvas.height+140)),ctx.fillStyle=triangle_gradient,ctx.fill(),canvas.width>600&&(ctx.beginPath(),ctx.moveTo(rectX+(canvas.width-100),rectY+(canvas.height-160)),ctx.lineTo(rectX+(canvas.width-30),rectY+(canvas.height+90)),ctx.lineTo(rectX+(canvas.width-420),rectY+(canvas.height+60)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX2+(canvas.width-320),rectY2+(canvas.height-200)),ctx.lineTo(rectX2+(canvas.width-50),rectY2+(canvas.height-20)),ctx.lineTo(rectX2+(canvas.width-420),rectY2+(canvas.height+120)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX4+(canvas.width-500),rectY4+(canvas.height-220)),ctx.lineTo(rectX4+(canvas.width-150),rectY4+(canvas.height-50)),ctx.lineTo(rectX4+(canvas.width-720),rectY4+(canvas.height+90)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX5+(canvas.width-.46*canvas.width),rectY5+(canvas.height-.27*canvas.height)),ctx.lineTo(rectX5+(canvas.width-.57*canvas.width),rectY5+(canvas.height+.2*canvas.height)),ctx.lineTo(rectX5+(canvas.width-.09*canvas.width),rectY5+(canvas.height+.4*canvas.height)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX5+(canvas.width-.4*canvas.width),rectY5+(canvas.height-.27*canvas.height)),ctx.lineTo(rectX5+(canvas.width-.63*canvas.width),rectY5+(canvas.height+0*canvas.height)),ctx.lineTo(rectX5+(canvas.width-.38*canvas.width),rectY5+(canvas.height+0*canvas.height)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX6+(canvas.width-.55*canvas.width),rectY6+(canvas.height-.25*canvas.height)),ctx.lineTo(rectX6+(canvas.width-.72*canvas.width),rectY6+(canvas.height+0*canvas.height)),ctx.lineTo(rectX6+(canvas.width-.43*canvas.width),rectY6+(canvas.height+.15*canvas.height)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX7+(canvas.width-.7*canvas.width),rectY7+(canvas.height-.35*canvas.height)),ctx.lineTo(rectX7+(canvas.width-.88*canvas.width),rectY7+(canvas.height-.06*canvas.height)),ctx.lineTo(rectX7+(canvas.width-.65*canvas.width),rectY7+(canvas.height+.35*canvas.height)),ctx.fillStyle=triangle_gradient,ctx.fill()),ctx.beginPath(),ctx.moveTo(rectX8+(canvas.width-.85*canvas.width),rectY8+(canvas.height-.35*canvas.height)),ctx.lineTo(rectX8+(canvas.width-.92*canvas.width),rectY8+(canvas.height-0*canvas.height)),ctx.lineTo(rectX8+(canvas.width-.7*canvas.width),rectY8+(canvas.height+.35*canvas.height)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.beginPath(),ctx.moveTo(rectX9+(canvas.width-.95*canvas.width),rectY9+(canvas.height-.6*canvas.height)),ctx.lineTo(rectX9+(canvas.width-1.2*canvas.width),rectY9+(canvas.height-.02*canvas.height)),ctx.lineTo(rectX9+(canvas.width-.7*canvas.width),rectY9+(canvas.height-.01*canvas.height)),ctx.fillStyle=triangle_gradient,ctx.fill(),ctx.restore()};animate(),function hex_initial_animation(){$(".hex-wrap").velocity("callout.pulse").velocity({opacity:.5}),$(".hoverblock").velocity("fadeOut",{delay:3e3,duration:0})}(),$(".skillName").mouseenter(function(){var title_color=$(this).parent().attr("data-color"),title_name=$(this).parent().attr("data-title"),desc_name=$(this).parent().attr("data-content");(function hex_description(){$(".code-description").velocity("stop",!0).velocity("transition.slideRightBigIn"),$("."+desc_name).siblings().removeClass("desc-active"),setTimeout(function(){$("."+desc_name).addClass("desc-active"),$(".code-descriptopn > div, .desc-active").children().velocity("stop",!0).velocity("transition.slideRightBigIn",{stagger:300}),$(".code-title, .desc-active span").velocity({color:title_color},{queue:!1}),$(".code-title").text(title_name)},0)})(),$(this).parent().addClass("hexactive"),$(".hexactive").velocity({scaleX:"1.1",scaleY:"1.1",opacity:1},{duration:200})}).mouseleave(function(){$(".hexactive").velocity("reverse").removeClass("hexactive")})};