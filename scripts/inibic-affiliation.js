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
      'neumACt carries out its research activity within this biomedical and translational environment, connecting respiratory medicine with research, technology and clinical innovation.',
      'neumACt desarrolla su actividad investigadora en este entorno biomédico y traslacional, conectando la medicina respiratoria con investigación, tecnología e innovación clínica.'
    );

    setLangText(
      card.querySelector('.home-affiliation-card__link'),
      'View institutional profile',
      'Ver perfil institucional'
    );
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});
  else enhance();
})();
