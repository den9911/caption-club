// Original vector scenes, rendered locally; no external images or fonts.
export const sceneNames=['Совещание по коробочным вопросам','Понедельник вышел из чата','Всё под контролем. Почти.','Специалист на удалёнке','Планы на продуктивный день',"Робот на перерыве","Пингвин в отпуске","Рыбка на совещании","Чайник и большие планы","Космическая прогулка"];
const cat=`<path d="M210 220 L205 120 L250 155 Q300 130 350 155 L395 120 L390 220 Q400 310 300 315 Q200 310 210 220Z" fill="#f1a668" stroke="#2b302b" stroke-width="5"/><path d="M258 210h12m60 0h12" stroke="#2b302b" stroke-width="8" stroke-linecap="round"/><path d="M290 240l10 8 10-8m-10 8v15m0 0q-18 15-27 0m27 0q18 15 27 0" fill="none" stroke="#2b302b" stroke-width="4"/>`;
export function sceneSvg(index=0) {
  const background=['#cbded1','#c4cfea','#edcfb1','#e6c6cc','#ddd2ae',"#d3dde2","#c5ddec","#d6e7d5","#edd9c3","#d9cee8"][index];
  const objects=[
    `${cat}<path d="M170 250H430V365H170Z" fill="#bb8d5a" stroke="#2b302b" stroke-width="5"/><path d="M170 250l-60 45h125l65-45 65 45h125l-60-45m-130 0v115" fill="#d6ad77" stroke="#2b302b" stroke-width="4"/>`,
    `<circle cx="300" cy="220" r="110" fill="#f5e9be" stroke="#2b302b" stroke-width="5"/><path d="M250 210h24m55 0h24m-77 57q25-20 50 0" stroke="#2b302b" fill="none" stroke-width="5" stroke-linecap="round"/><path d="M100 110h30m-15-15v30m340 170h30m-15-15v30" stroke="#2b302b" stroke-width="4"/>`,
    `<path d="M300 285V130m0 85q-100 0-95-85 90-5 95 85m0 40q100 0 95-85-90-5-95 85" fill="#689778" stroke="#2b302b" stroke-width="5"/><path d="M230 280h140l-25 100h-90Z" fill="#c97d62" stroke="#2b302b" stroke-width="5"/><path d="M280 320h5m30 0h5m-36 25h32" stroke="#2b302b" stroke-width="6"/>`,
    `${cat}<path d="M160 265H440L410 380H190Z" fill="#718ba1" stroke="#2b302b" stroke-width="5"/><circle cx="300" cy="320" r="13" fill="#dce5e8"/>`,
    `<path d="M210 160h170v150q0 55-85 55t-85-55Z" fill="#f5f0df" stroke="#2b302b" stroke-width="5"/><path d="M380 185q100 0 60 85-20 25-60 20" fill="none" stroke="#2b302b" stroke-width="12"/><path d="M255 125q-25-30 0-65m55 65q-25-30 0-65" fill="none" stroke="#2b302b" stroke-width="5"/><path d="M250 245h20m60 0h20m-70 40q20 20 40 0" fill="none" stroke="#2b302b" stroke-width="5"/>`,
    `<rect x="185" y="145" width="230" height="180" rx="30" fill="#a6bcc3" stroke="#2b302b" stroke-width="7"/><path d="M300 145V95m-20 0h40" stroke="#2b302b" stroke-width="7"/><circle cx="250" cy="220" r="12"/><circle cx="350" cy="220" r="12"/><path d="M260 275q40 25 80 0" fill="none" stroke="#2b302b" stroke-width="7"/><path d="M170 330h260" stroke="#2b302b" stroke-width="7"/>`,
    `<ellipse cx="300" cy="245" rx="100" ry="135" fill="#344450"/><ellipse cx="300" cy="255" rx="65" ry="92" fill="#fffdf4"/><circle cx="270" cy="170" r="8" fill="#fff"/><circle cx="330" cy="170" r="8" fill="#fff"/><path d="M280 195h40l-20 25Z" fill="#e4a651"/><path d="M205 155q95-100 190 0Z" fill="#e5a468"/><path d="M165 350h270" stroke="#2b302b" stroke-width="7"/>`,
    `<rect x="155" y="110" width="290" height="230" rx="25" fill="#d9eff0" stroke="#2b302b" stroke-width="7"/><path d="M210 230q65-90 150 0-85 90-150 0Zm150 0 45-38v76Z" fill="#ebae74" stroke="#2b302b" stroke-width="6"/><circle cx="255" cy="218" r="6"/><circle cx="320" cy="155" r="10" fill="#fff"/><path d="M200 350h200" stroke="#2b302b" stroke-width="7"/>`,
    `<path d="M205 180h190l-18 140q-8 45-75 45t-77-45Z" fill="#e7a879" stroke="#2b302b" stroke-width="7"/><path d="M205 200q-80-20-75 30 4 28 80 35m185-65q65-45 70-5 5 30-80 55M245 180q0-50 55-50t55 50" fill="none" stroke="#2b302b" stroke-width="7"/><circle cx="260" cy="245" r="7"/><circle cx="340" cy="245" r="7"/><path d="M275 280q25 20 50 0" fill="none" stroke="#2b302b" stroke-width="6"/>`,
    `<circle cx="300" cy="180" r="70" fill="#f6f5ec" stroke="#2b302b" stroke-width="7"/><circle cx="300" cy="180" r="48" fill="#a9ced7" stroke="#2b302b" stroke-width="5"/><path d="M245 250q55-30 110 0l20 100H225Z" fill="#f6f5ec" stroke="#2b302b" stroke-width="7"/><path d="M245 270l-65 45m175-45 65 45m-140 35-20 35m60-35 20 35" stroke="#2b302b" stroke-width="9" stroke-linecap="round"/><path d="M130 115h32m-16-16v32m325 20h32m-16-16v32" stroke="#e0a363" stroke-width="7"/>`,
  ][index];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 430" role="img" aria-label="${sceneNames[index]}"><rect width="600" height="430" fill="${background}"/><ellipse cx="300" cy="385" rx="190" ry="18" fill="#2b302b" opacity=".09"/>${objects}</svg>`;
}
export async function drawScene(ctx,index,x,y,w,h) {
  const blob=new Blob([sceneSvg(index)],{type:'image/svg+xml'}),url=URL.createObjectURL(blob);
  try {const img=new Image();img.src=url;await img.decode();ctx.drawImage(img,x,y,w,h);}
  finally{URL.revokeObjectURL(url);}
}
