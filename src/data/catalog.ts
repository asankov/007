import catalog from './movies.json' with { type: 'json' };
import watched from './watched.json' with { type: 'json' };

export interface Movie {
  id: string;
  title: string;
  year: number;
  actor: string;
  independent: boolean;
  watched: boolean;
}

export const actors = [
  'David Niven',
  'Sean Connery',
  'George Lazenby',
  'Roger Moore',
  'Timothy Dalton',
  'Pierce Brosnan',
  'Daniel Craig',
];

export function attachWatched(
  entries: Omit<Movie, 'watched'>[],
  statuses: Record<string, unknown>,
): Movie[] {
  const ids = new Set(entries.map((movie) => movie.id));
  for (const movie of entries) {
    if (typeof statuses[movie.id] !== 'boolean') {
      throw new Error(
        `watched.json: expected true or false for "${movie.id}".`,
      );
    }
  }
  for (const id of Object.keys(statuses)) {
    if (!ids.has(id)) throw new Error(`watched.json: unknown movie "${id}".`);
  }
  return entries.map((movie) => ({
    ...movie,
    watched: statuses[movie.id] === true,
  }));
}

export const movies = attachWatched(catalog, watched);
export const watchedCount = movies.filter((movie) => movie.watched).length;
export const actorGroups = actors.map((actor, index) => {
  const films = movies.filter((movie) => movie.actor === actor);
  const years = films.map((movie) => movie.year);
  const first = Math.min(...years);
  const last = Math.max(...years);
  const tones = [
    '#704b27',
    '#254945',
    '#88651d',
    '#354e70',
    '#653345',
    '#7b362f',
  ];
  return {
    actor,
    films,
    years: first === last ? `${first}` : `${first}–${last}`,
    watchedCount: films.filter((movie) => movie.watched).length,
    tone: tones[index % tones.length],
  };
});
