import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneIndex,scenes,dayNumber} from '../server/content.mjs';
test('archive mapping remains stable and new scenes rotate',()=>{
  assert.equal(scenes.length,10);
  for(const day of ['2025-01-01','2026-10-30','2026-10-31']) assert.equal(sceneIndex(day),((dayNumber(day)%5)+5)%5);
  const used=new Set(Array.from({length:10},(_,i)=>sceneIndex(`2026-11-${String(i+1).padStart(2,'0')}`)));
  assert.equal(used.size,10);
});
