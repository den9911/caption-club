import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openStore } from '../server/store.mjs';
import { createCaptions } from '../server/captions.mjs';

test('caption rules keep daily limits and votes consistent', () => {
  const db = openStore(':memory:');
  let sequence = 0;
  let date = new Date('2026-11-01T12:00:00Z');
  const captions = createCaptions({ db, timezone: 'UTC', now: () => date, makeId: () => `caption-${++sequence}` });
  try {
    const first = captions.publish('  Hello  ', 'author');
    captions.publish('Second', 'author');
    captions.publish('Third', 'author');
    assert.throws(() => captions.publish('Fourth', 'author'), { status: 429 });
    assert.deepEqual(captions.vote(first.id, 'reader'), { ok: true });
    assert.throws(() => captions.vote(first.id, 'reader'), { status: 409 });
    assert.equal(captions.list(null, 'reader').entries[0].votes, 1);
    assert.equal(captions.list(null, 'reader').entries[0].voted, 1);
    assert.throws(() => captions.vote('missing', 'reader'), { status: 404 });
    date = new Date('2026-11-02T12:00:00Z');
    assert.equal(captions.list(null, 'reader').winner.title, 'Hello');
    assert.equal(captions.publish('New day', 'author').day, '2026-11-02');
  } finally { db.close(); }
});


test('yesterday is the previous calendar date even in UTC+14 and across year/leap boundaries',()=>{
 for(const [zone,instant,today,previous] of [
  ['Pacific/Kiritimati','2026-11-01T20:00:00Z','2026-11-02','2026-11-01'],
  ['Europe/Moscow','2026-12-31T22:00:00Z','2027-01-01','2026-12-31'],
  ['America/Los_Angeles','2024-03-01T12:00:00Z','2024-03-01','2024-02-29'],
  ['UTC','2026-11-02T12:00:00Z','2026-11-02','2026-11-01']]){
  const db=openStore(':memory:');
  try{for(const day of [today,previous])db.prepare("INSERT INTO posts(id,kind,title,day,owner,status,created) VALUES(?,'caption',?,?,'author','approved',1)").run(day,day,day);
   const feature=createCaptions({db,timezone:zone,now:()=>new Date(instant)});
   const result=feature.list(null,'reader');assert.equal(result.day,today);assert.equal(result.winner.title,previous);
  }finally{db.close();}
 }
});
