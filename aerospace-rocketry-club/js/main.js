(function(){
  var canvas = document.getElementById('stars');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var w, h, stars = [], shootingStars = [];
  var STAR_COUNT = 200;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  function initStars(){
    stars = [];
    for(var i=0; i<STAR_COUNT; i++){
      stars.push({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.2 + 0.3,
        baseAlpha: Math.random()*0.5 + 0.25,
        phase: Math.random()*Math.PI*2,
        speed: Math.random()*0.015 + 0.005
      });
    }
  }
  function maybeSpawnShootingStar(){
    if(reduceMotion) return;
    if(Math.random() < 0.006 && shootingStars.length < 2){
      shootingStars.push({
        x: Math.random()*w*0.6 + w*0.1,
        y: Math.random()*h*0.4,
        len: Math.random()*80 + 60,
        speed: Math.random()*6 + 7,
        angle: Math.PI/5,
        life: 1
      });
    }
  }
  function draw(t){
    ctx.clearRect(0,0,w,h);
    for(var i=0;i<stars.length;i++){
      var s = stars[i];
      var tw = Math.sin(t*s.speed + s.phase)*0.3;
      var alpha = Math.max(0, Math.min(1, s.baseAlpha + tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(243,242,236,' + alpha.toFixed(3) + ')';
      ctx.fill();
    }
    maybeSpawnShootingStar();
    for(var j=shootingStars.length-1; j>=0; j--){
      var sh = shootingStars[j];
      sh.x += Math.cos(sh.angle)*sh.speed;
      sh.y += Math.sin(sh.angle)*sh.speed;
      sh.life -= 0.012;
      var tailX = sh.x - Math.cos(sh.angle)*sh.len;
      var tailY = sh.y - Math.sin(sh.angle)*sh.len;
      var grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
      grad.addColorStop(0, 'rgba(244,197,66,' + (0.85*sh.life).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(244,197,66,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      if(sh.life <= 0 || sh.y > h || sh.x > w){ shootingStars.splice(j,1); }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', function(){ resize(); initStars(); });
  resize();
  initStars();
  requestAnimationFrame(draw);
})();

(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('nav.links a');
  links.forEach(function(l){
    var href = l.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      l.classList.add('active');
    }
  });
})();
