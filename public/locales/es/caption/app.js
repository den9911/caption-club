import { $, $$, api, escape, action, share, toast, download, wrapText, reportButton, wireReports } from '/locales/es/shared/ui.js';
import { sceneSvg, drawScene } from '/locales/es/shared/scenes.js';

export async function mount(config) {
  let current;
  const requested=new URLSearchParams(location.search).get('day')??config.day;
  const data=await api(`/api/captions?day=${encodeURIComponent(requested)}`);current=data;
  $('#app').innerHTML=`<div class="split"><div class="stack"><div class="scene">${sceneSvg(data.scene)}<div class="scene-caption"><span>Imagen del día</span><span>${escape(data.day)}</span></div></div>${data.winner?`<aside class="winner"><p class="eyebrow">LA FAVORITA DE AYER</p><p>«${escape(data.winner.title)}»</p><p class="small muted">${data.winner.votes} votos</p></aside>`:''}</div><div class="stack">${data.day===config.day?`<form id="caption-form" class="panel stack"><h2>¿Y qué está pasando aquí?</h2><p class="muted small">Hasta tres subtítulos al día. Los visitantes eligen el mejor.</p><label>Tu subtítulo<textarea name="title" rows="3" maxlength="160" required placeholder="Cuando pediste una caja y recibiste un piso…"></textarea></label><div class="row between"><span id="chars" class="small muted">0 / 160</span><button type="submit">Publicar ↗</button></div></form>`:`<div class="note">Estás viendo un reto archivado. <a href="/caption/">Imagen de hoy →</a></div>`}<div class="panel stack"><h3>Crea una tarjeta</h3><p class="small muted">Pulsa ‘Tarjeta’ bajo cualquier subtítulo y crea una imagen para tu chat.</p><p class="small muted">Puedes votar por varios subtítulos, una vez por cada uno.</p></div></div></div><section class="section-gap"><div class="section-head"><h2>Versiones de la historia</h2><button id="refresh" class="secondary">Actualizar</button></div><div id="entries"></div></section>`;
  async function card(title) {
    const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1040;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#f7f5ef';ctx.fillRect(0,0,1000,1040);
    await drawScene(ctx,current.scene,40,40,920,659);
    ctx.fillStyle='#252a27';ctx.font='bold 40px sans-serif';wrapText(ctx,title,60,770,880,52,4);
    ctx.font='22px sans-serif';ctx.fillText(`Club de subtítulos · ${current.day} · Club Minuto`,60,995);
    download(canvas,`caption-${current.day}.png`);
  }
  function entries() {
    $('#entries').innerHTML=current.entries.length?`<div class="panel caption-list">${current.entries.map(row=>`<article class="caption-entry" id="entry-${escape(row.id)}"><div><p>${escape(row.title)}</p><div class="entry-actions"><button class="text-button card" data-id="${escape(row.id)}">Tarjeta ↓</button><button class="text-button share" data-id="${escape(row.id)}">Enlace ↗</button>${reportButton(row.id)}</div></div><button class="vote ${row.voted?'secondary':''}" data-id="${escape(row.id)}" ${row.voted?'disabled':''} aria-label="Votar por este subtítulo">${row.voted?'✓':'↑'} ${row.votes}</button></article>`).join('')}</div>`:'<div class="empty panel"><h3>Aquí empieza la primera versión</h3><p class="muted">Abre el reto con tu subtítulo.</p></div>';
    $$('.vote').forEach(button=>action(button,async()=>{await api('/api/captions/vote',{id:button.dataset.id});await refresh();}));
    $$('.card').forEach(button=>action(button,()=>card(current.entries.find(row=>row.id===button.dataset.id).title)));
    $$('.share').forEach(button=>action(button,()=>share(`${location.origin}/caption/?day=${current.day}#entry-${button.dataset.id}`,'Club de subtítulos')));
    wireReports();
  }
  async function refresh(){current=await api(`/api/captions?day=${encodeURIComponent(requested)}`);entries();}
  entries();action($('#refresh'),refresh);
  const form=$('#caption-form');
  if(form){$('textarea',form).addEventListener('input',e=>{$('#chars').textContent=`${e.target.value.length} / 160`;});action(form,async()=>{const result=await api('/api/captions',{title:form.elements.title.value});form.reset();$('#chars').textContent='0 / 160';await refresh();location.hash=`entry-${result.id}`;toast('Subtítulo publicado. Ya puedes compartirlo.');},'submit');}
  if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();
}
