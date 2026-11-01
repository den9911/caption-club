import { randomUUID } from 'node:crypto';
import { dayKey, sceneIndex } from './content.mjs';
import { HttpError, text, validDay } from './validation.mjs';
import { transaction } from './store.mjs';

const fields = 'id,kind,title,body,category,day,status,votes,created,CASE WHEN image IS NULL THEN 0 ELSE 1 END AS hasImage';

// The feature owns caption rules; the transport supplies identity and handles HTTP.
export function createCaptions({ db, timezone, now = () => new Date(), makeId = randomUUID }) {
  const today = () => dayKey(now(), timezone);
  return {
    list(day, voter) {
      const currentDay = today();
      day = validDay(day ?? currentDay);
      const entries = db.prepare(`SELECT ${fields},EXISTS(SELECT 1 FROM votes v WHERE v.scope='caption' AND v.target=posts.id AND v.voter=?) AS voted FROM posts WHERE kind='caption' AND day=? AND status='approved' ORDER BY votes DESC,created LIMIT 100`).all(voter, day);
      const yesterday = dayKey(new Date(Date.parse(`${currentDay}T12:00:00Z`) - 86400000), timezone);
      const winner = db.prepare(`SELECT ${fields} FROM posts WHERE kind='caption' AND day=? AND status='approved' ORDER BY votes DESC,created LIMIT 1`).get(yesterday);
      return { day, scene: sceneIndex(day), entries, winner: winner ?? null };
    },
    publish(title, owner) {
      title = text(title, 160);
      const day = today();
      const count = db.prepare("SELECT COUNT(*) AS n FROM posts WHERE kind='caption' AND owner=? AND day=?").get(owner, day).n;
      if (count >= 3) throw new HttpError(429, 'На сегодня достаточно трёх подписей.');
      const id = makeId();
      db.prepare("INSERT INTO posts(id,kind,title,day,owner,status,created) VALUES(?,'caption',?,?,?,'approved',?)").run(id, title, day, owner, now().getTime());
      return { id, day };
    },
    vote(id, voter) {
      text(id, 50);
      transaction(db, () => {
        const row = db.prepare('SELECT id FROM posts WHERE id=? AND kind=? AND status=?').get(id, 'caption', 'approved');
        if (!row) throw new HttpError(404, 'Публикация не найдена.');
        const result = db.prepare('INSERT OR IGNORE INTO votes(scope,target,voter,choice,created) VALUES(?,?,?,?,?)').run('caption', id, voter, '', now().getTime());
        if (!result.changes) throw new HttpError(409, 'Ваш голос уже учтён.');
        db.prepare('UPDATE posts SET votes=votes+1 WHERE id=?').run(id);
      });
      return { ok: true };
    }
  };
}
