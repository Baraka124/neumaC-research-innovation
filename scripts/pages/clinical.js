(function(){
'use strict';

var list=document.getElementById('researchLinesList');
if(!list)return;

var raf=0;
var bound=false;
var observer=null;
var rows=[];

function reduced(){
  return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function refreshRows(){
  rows=Array.prototype.slice.call(list.querySelectorAll('.research-line-row'));
  if(!rows.length)return;
  rows.forEach(function(row){row.classList.remove('is-active-line');});
  requestUpdate();
}

function update(){
  raf=0;
  if(!rows.length||window.innerWidth<=620){
    list.style.removeProperty('--research-programme-progress');
    rows.forEach(function(row){row.classList.remove('is-active-line');});
    return;
  }

  var viewportH=window.innerHeight||document.documentElement.clientHeight;
  var anchor=viewportH*.44;
  var rect=list.getBoundingClientRect();
  var span=Math.max(1,rect.height);
  var progress=Math.max(0,Math.min(1,(anchor-rect.top)/span));
  list.style.setProperty('--research-programme-progress',(reduced()?1:progress).toFixed(3));

  if(rect.bottom<0||rect.top>viewportH){
    rows.forEach(function(row){row.classList.remove('is-active-line');});
    return;
  }

  var best=null;
  var bestDistance=Infinity;
  rows.forEach(function(row){
    var rr=row.getBoundingClientRect();
    var centre=rr.top+rr.height*.5;
    var distance=Math.abs(centre-anchor);
    if(distance<bestDistance){
      bestDistance=distance;
      best=row;
    }
  });

  rows.forEach(function(row){
    row.classList.toggle('is-active-line',row===best);
  });
}

function requestUpdate(){
  if(raf)return;
  raf=requestAnimationFrame(update);
}

function bind(){
  if(bound)return;
  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate,{passive:true});
  bound=true;
}

observer=new MutationObserver(function(){
  refreshRows();
});
observer.observe(list,{childList:true,subtree:false});

bind();
refreshRows();

document.addEventListener('neumac:languagechange',requestUpdate);
})();