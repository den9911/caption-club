import { $, $$, api, escape, action, share, toast, download, wrapText, reportButton, wireReports } from '/locales/ru/shared/ui.js';
import { sceneSvg, drawScene } from '/locales/ru/shared/scenes.js';

export async function mount(config) {
  let current;
  const requested=new URLSearchParams(location.search).get('day')??config.day;
  const data=await api(`/api/captions?day=${encodeURIComponent(requested)}`);current=data;
  $('#app').innerHTML=`<div class="split"><div class="stack"><div class="scene">${sceneSvg(data.scene)}<div class="scene-caption"><span>Картинка дня</span><span>${escape(data.day)}</span></div></div>${data.winner?`<aside class="winner"><p class="eyebrow">ВЧЕРА БЫЛО ХОРОШО</p><p>«${escape(data.winner.title)}»</p><p class="small muted">${data.winner.votes} голосов</p></aside>`:''}</div><div class="stack">${data.day===config.day?`<form id="caption-form" class="panel stack"><h2>А что здесь происходит?</h2><p class="muted small">До трёх подписей в день. Лучшие выбирают посетители.</p><label>Твоя подпись<textarea name="title" rows="3" maxlength="160" required placeholder="Когда заказал коробку, а получил квартиру…"></textarea></label><div class="row between"><span id="chars" class="small muted">0 / 160</span><button type="submit">Опубликовать ↗</button></div></form>`:`<div class="note">Это архив конкурса. <a href="/caption/">Сегодняшняя картинка →</a></div>`}<div class="panel stack"><h3>Сделай открытку</h3><p class="small muted">Выбери «Карточка» у любой подписи: получится картинка для чата.</p><p class="small muted">Голосовать можно за несколько понравившихся подписей, по одному разу за каждую.</p></div></div></div><section class="section-gap"><div class="section-head"><h2>Версии происходящего</h2><button id="refresh" class="secondary">Обновить</button></div><div id="entries"></div></section>`;
  async function card(title) {
    const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1040;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#f7f5ef';ctx.fillRect(0,0,1000,1040);
    await drawScene(ctx,current.scene,40,40,920,659);
    ctx.fillStyle='#252a27';ctx.font='bold 40px sans-serif';wrapText(ctx,title,60,770,880,52,4);
    ctx.font='22px sans-serif';ctx.fillText(`Подпись дня · ${current.day} · Минута клуб`,60,995);
    download(canvas,`caption-${current.day}.png`);
  }
  function entries() {
    $('#entries').innerHTML=current.entries.length?`<div class="panel caption-list">${current.entries.map(row=>`<article class="caption-entry" id="entry-${escape(row.id)}"><div><p>${escape(row.title)}</p><div class="entry-actions"><button class="text-button card" data-id="${escape(row.id)}">Карточка ↓</button><button class="text-button share" data-id="${escape(row.id)}">Ссылка ↗</button>${reportButton(row.id)}</div></div><button class="vote ${row.voted?'secondary':''}" data-id="${escape(row.id)}" ${row.voted?'disabled':''} aria-label="Голосовать за подпись">${row.voted?'✓':'↑'} ${row.votes}</button></article>`).join('')}</div>`:'<div class="empty panel"><h3>Здесь будет первая версия</h3><p class="muted">Начни конкурс своей подписью.</p></div>';
    $$('.vote').forEach(button=>action(button,async()=>{await api('/api/captions/vote',{id:button.dataset.id});await refresh();}));
    $$('.card').forEach(button=>action(button,()=>card(current.entries.find(row=>row.id===button.dataset.id).title)));
    $$('.share').forEach(button=>action(button,()=>share(`${location.origin}/caption/?day=${current.day}#entry-${button.dataset.id}`,'Подпись дня')));
    wireReports();
  }
  async function refresh(){current=await api(`/api/captions?day=${encodeURIComponent(requested)}`);entries();}
  entries();action($('#refresh'),refresh);
  const form=$('#caption-form');
  if(form){$('textarea',form).addEventListener('input',e=>{$('#chars').textContent=`${e.target.value.length} / 160`;});action(form,async()=>{const result=await api('/api/captions',{title:form.elements.title.value});form.reset();$('#chars').textContent='0 / 160';await refresh();location.hash=`entry-${result.id}`;toast('Подпись опубликована. Теперь можно поделиться.');},'submit');}
  if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();
}
