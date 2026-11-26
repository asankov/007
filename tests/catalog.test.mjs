import test from 'node:test';
import assert from 'node:assert/strict';
import { movies, actorGroups, attachWatched } from '../src/data/catalog.ts';

test('every catalog film appears in exactly one actor group, with Niven first', () => {
  assert.equal(movies.length, 27);
  assert.equal(actorGroups[0].actor, 'David Niven');
  const groupedIds = actorGroups.flatMap((group) =>
    group.films.map((movie) => movie.id),
  );
  assert.equal(new Set(groupedIds).size, 27);
  assert.deepEqual(
    [...groupedIds].sort(),
    movies.map((movie) => movie.id).sort(),
  );
  assert.equal(
    movies.filter((movie) => movie.title === 'Casino Royale').length,
    2,
  );
});

test('file data drives watched status, with strict validation for manual edits', () => {
  const entries = movies.map(({ watched, ...movie }) => movie);
  const statuses = Object.fromEntries(
    entries.map((movie) => [movie.id, false]),
  );
  statuses[entries[0].id] = true;
  assert.equal(
    attachWatched(entries, statuses).filter((movie) => movie.watched).length,
    1,
  );
  assert.throws(() => attachWatched(entries, {}), /expected true or false/);
  assert.throws(
    () => attachWatched(entries, { ...statuses, [entries[0].id]: 'true' }),
    /expected true or false/,
  );
  assert.throws(
    () => attachWatched(entries, { ...statuses, typo: true }),
    /unknown movie/,
  );
});
