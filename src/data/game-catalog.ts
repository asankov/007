import entries from './games.json' with { type: 'json' };

export const games = entries;
export type Game = (typeof games)[number];
export const platforms = [
  ...new Set(games.flatMap((game) => game.platforms)),
].sort();
export const gameGroups = [
  ...new Set(games.map((game) => Math.floor(game.year / 10) * 10)),
].map((decade) => ({
  decade,
  games: games.filter((game) => Math.floor(game.year / 10) * 10 === decade),
}));
