/* Phase 4: extracted page-specific runtime */
/* ══ BRONCHIAL TREE ANIMATION ══════════════════════════════════
   Unchanged from original — same algorithm, same quality
══════════════════════════════════════════════════════════════ */
(function(){
  var REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function drawTree(ctx,W,H,breath,dir,cx,originY,trunkH,mainLen){
    ctx.lineCap='round';
    var nodes=[];
    function branch(x,y,angle,len,depth){
      if(depth>8||len<1.5)return;
      var ex=x+Math.sin(angle)*len,ey=y+dir*Math.cos(angle)*len;
      var sw=Math.max(0.12,0.9*Math.pow(0.67,depth));
      var alpha=Math.max(0.06,0.52*Math.pow(0.77,depth));
      ctx.lineWidth=sw;ctx.strokeStyle='rgba(0,179,179,'+alpha.toFixed(3)+')';
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();
      nodes.push({x:ex,y:ey,depth:depth});
      var spread=0.40+breath*0.06;
      branch(ex,ey,angle-spread,len*0.69,depth+1);
      branch(ex,ey,angle+spread,len*0.69,depth+1);
    }
    ctx.lineWidth=0.85;ctx.strokeStyle='rgba(0,179,179,0.48)';
    ctx.beginPath();ctx.moveTo(cx,originY);ctx.lineTo(cx,originY+dir*trunkH);ctx.stroke();
    nodes.push({x:cx,y:originY+dir*trunkH,depth:-1});
    var bo=breath*0.03;
    branch(cx,originY+dir*trunkH,-(0.30+bo),mainLen,0);
    branch(cx,originY+dir*trunkH,(0.25+bo),mainLen*0.94,0);
    nodes.forEach(function(n){
      var r=n.depth<0?2.2:Math.max(0.7,2.2*Math.pow(0.72,n.depth+1));
      var a=Math.max(0.08,0.55*Math.pow(0.78,Math.max(n.depth,0)));
      ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
      ctx.fillStyle='rgba(0,179,179,'+a.toFixed(3)+')';ctx.fill();
    });
    var sc=Math.min(H*0.36,W*0.17);
    var cy=originY+dir*(trunkH+mainLen*1.1);
    var lo=0.07+breath*0.04;
    var lx=cx-sc*0.18,rx=cx+sc*0.18;
    ctx.lineWidth=0.35;ctx.strokeStyle='rgba(0,179,179,'+lo.toFixed(3)+')';
    ctx.beginPath();
    ctx.moveTo(cx,cy-dir*sc);
    ctx.bezierCurveTo(lx-sc*1.05,cy-dir*sc*0.65,lx-sc*1.15,cy+dir*sc*0.45,lx-sc*0.12,cy+dir*sc);
    ctx.bezierCurveTo(cx-sc*0.04,cy+dir*sc*0.55,cx,cy+dir*sc*0.25,cx,cy-dir*sc);ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx,cy-dir*sc);
    ctx.bezierCurveTo(rx+sc*1.05,cy-dir*sc*0.65,rx+sc*1.15,cy+dir*sc*0.45,rx+sc*0.12,cy+dir*sc);
    ctx.bezierCurveTo(cx+sc*0.04,cy+dir*sc*0.55,cx,cy+dir*sc*0.25,cx,cy-dir*sc);ctx.stroke();
  }
  function bootCanvas(id,getCx,dir,getOriginY,getTrunkH,getMainLen,phaseOffset){
    var canvas=document.getElementById(id);if(!canvas)return;
    var ctx=canvas.getContext('2d'),W,H,paused=false;
    function resize(){W=canvas.width=canvas.parentElement.offsetWidth;H=canvas.height=canvas.parentElement.offsetHeight;}
    document.addEventListener('visibilitychange',function(){paused=document.hidden;if(!paused)requestAnimationFrame(draw);});
    function draw(t){
      if(paused)return;
      ctx.clearRect(0,0,W,H);
      var mobile=W<960;
      canvas.style.opacity=mobile?'0.3':'1';
      var breath=REDUCED?0.5:Math.sin((t+phaseOffset)*0.00075)*0.5+0.5;
      drawTree(ctx,W,H,breath,dir,getCx(W,mobile),getOriginY(H),getTrunkH(H),getMainLen(H));
      if(!REDUCED)requestAnimationFrame(draw);
    }
    resize();window.addEventListener('resize',resize);
    if(REDUCED){requestAnimationFrame(function(t){draw(t);});}else{requestAnimationFrame(draw);}
  }
  function boot(){
    bootCanvas('heroBg',function(W,mobile){return mobile?W*0.82:W*0.68;},1,function(H){return H*0.03;},function(H){return H*0.16;},function(H){return H*0.155;},0);
    bootCanvas('footerBg',function(W,mobile){return mobile?W*0.82:W*0.72;},-1,function(H){return H;},function(H){return H*0.1;},function(H){return H*0.14;},3000);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}else{boot();}
})();

document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.netstd-item').forEach(function(btn){
    btn.addEventListener('click', function(){
      var detail = document.getElementById(btn.dataset.target);
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      if (detail) detail.style.maxHeight = isOpen ? '0' : detail.scrollHeight + 'px';
    });
  });
});
