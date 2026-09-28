/* neumACt Innovation — small page interaction only.
   Project data rendering remains in scripts/api.js. */
(function(){
  'use strict';
  const toggle=document.getElementById('innovationInquiryToggle');
  const panel=document.getElementById('innovationInquiryPanel');
  const close=document.getElementById('innovationInquiryClose');
  if(!toggle||!panel)return;
  function setOpen(open){toggle.setAttribute('aria-expanded',String(open));panel.hidden=!open;if(open)panel.querySelector('input,select,textarea,button')?.focus();}
  toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
  close?.addEventListener('click',()=>{setOpen(false);toggle.focus();});
})();
