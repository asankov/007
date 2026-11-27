import test from 'node:test';
import assert from 'node:assert/strict';
import { games, gameGroups, platforms } from '../src/data/game-catalog.ts';

test('every game has a unique id, released platforms and a research source', () => {
  assert.equal(new Set(games.map((game) => game.id)).size, games.length);
  for (const game of games) {
    assert(game.title && Number.isInteger(game.year) && game.version);
    assert(game.platforms.length > 0);
    assert.equal(new Set(game.platforms).size, game.platforms.length);
    assert.equal(new URL(game.source).protocol, 'https:');
    assert(game.platforms.every((platform) => platforms.includes(platform)));
  }
  assert.deepEqual(
    gameGroups.flatMap((group) => group.games.map((game) => game.id)),
    games.map((game) => game.id),
  );
});

test('platform-specific adaptations stay distinct and upcoming platforms are not playable filters', () => {
  const world = games.filter(
    (game) => game.title === 'The World Is Not Enough',
  );
  assert.equal(world.length, 3);
  assert.deepEqual(
    world.flatMap((game) => game.platforms),
    ['Nintendo 64', 'PlayStation', 'Game Boy Color'],
  );
  const firstLight = games.find((game) => game.id === 'first-light');
  assert(!firstLight.platforms.includes('Nintendo Switch 2'));
  assert.deepEqual(firstLight.upcomingPlatforms, [
    { name: 'Nintendo Switch 2', date: '2027-03-18' },
  ]);
});
