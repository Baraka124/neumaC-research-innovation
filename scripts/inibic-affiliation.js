/* M5.4 — INIBIC affiliation copy refinement.
 * Keeps the existing semantic affiliation surface while replacing bureaucratic
 * profile wording with direct institutional affiliation language.
 */
(function(){
  'use strict';

  function setLangText(root,en,es){
    if(!root)return;
    var enNode=root.querySelector('[lang="en"]');
    var esNode=root.querySelector('[lang="es"]');
    if(enNode)enNode.textContent=en;
    if(esNode)esNode.textContent=es;
  }

  function enhance(){
    var card=document.querySelector('.home-affiliation-card');
    if(!card)return;

    setLangText(
      card.querySelector('.home-affiliation-card__eyebrow'),
      'Research affiliation',
      'Afiliación investigadora'
    );

    var body=card.querySelector('p:not(.home-affiliation-card__eyebrow):not(.home-affiliation-card__institution)');
    setLangText(
      body,
      'neumACt carries out its research activity within the INIBIC environment, connecting respiratory medicine with biomedical and translational research.',
      'neumACt desarrolla su actividad investigadora en el entorno de INIBIC, conectando la medicina respiratoria con la investigación biomédica y traslacional.'
    );

    setLangText(
      card.querySelector('.home-affiliation-card__link'),
      'View profile at INIBIC',
      'Ver perfil en INIBIC'
    );
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});
  else enhance();
})();
