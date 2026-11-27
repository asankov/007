export {};

const search = document.querySelector<HTMLInputElement>('#game-search')!;
const platform = document.querySelector<HTMLSelectElement>('#game-platform')!;
const cards = [...document.querySelectorAll<HTMLElement>('[data-game]')].map(
  (element) => ({
    element,
    searchText: element.dataset.search ?? '',
    platforms: JSON.parse(element.dataset.platforms ?? '[]') as string[],
  }),
);
const groups = [...document.querySelectorAll<HTMLElement>('.game-group')];
const count = document.querySelector<HTMLElement>('#game-count')!;
const empty = document.querySelector<HTMLElement>('#games-empty')!;

function filterGames() {
  const query = search.value.trim().toLowerCase();
  let visibleCount = 0;
  for (const card of cards) {
    const matches =
      card.searchText.includes(query) &&
      (!platform.value || card.platforms.includes(platform.value));
    card.element.hidden = !matches;
    if (matches) visibleCount++;
  }
  for (const group of groups)
    group.hidden = !group.querySelector('[data-game]:not([hidden])');
  count.textContent = `${visibleCount} ${visibleCount === 1 ? 'entry' : 'entries'}`;
  empty.hidden = visibleCount > 0;
}
search.addEventListener('input', filterGames);
platform.addEventListener('change', filterGames);
