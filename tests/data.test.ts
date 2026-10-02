import test from 'node:test';
import assert from 'node:assert/strict';
import { kyivDate, adjacentDate } from '../lib/dates';
import { parseScorers } from '../lib/scorers';
import { readFileSync } from 'node:fs';
test('Kyiv calendar dates cross midnight and year boundaries', () => {
 assert.equal(kyivDate(new Date('2026-10-01T22:30:00Z')), '2026-10-02');
 assert.equal(adjacentDate('2027-01-01', -1), '2026-12-31');
 assert.equal(adjacentDate('2026-12-31', 1), '2027-01-01');
});
test('Kyiv day boundaries during daylight saving changes', () => {
 assert.equal(kyivDate(new Date('2026-03-29T21:30:00Z')), '2026-03-30');
 assert.equal(kyivDate(new Date('2026-10-25T21:30:00Z')), '2026-10-25');
});
test('official PFL scorer markup yields player, club and goal totals for each competition', () => {
 for (const [id,group] of [['1353','1'],['1354','2a'],['1355','2b']]) {
  const players = parseScorers(readFileSync(`tests/fixtures/scorers-${id}.html`, 'utf8'), group);
  assert.ok(players.length >= 5);
  assert.ok(players.every(p=>p.player && p.team && p.goals > 0 && p.group===group));
  assert.ok(players.every((p,i)=>!i || players[i-1].goals>=p.goals));
 }
});
test('missing or changed scorer markup fails closed', () => {
 assert.throws(()=>parseScorers('<html>Unavailable</html>', '1'));
 assert.throws(()=>parseScorers('<div class="row-bombardiers"><div>Changed</div></div>', '1'));
});
