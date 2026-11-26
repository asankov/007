const search = document.querySelector<HTMLInputElement>('#search')!;
const actor = document.querySelector<HTMLSelectElement>('#actor')!;
const filterButtons = [
  ...document.querySelectorAll<HTMLButtonElement>('[data-filter]'),
];
const cards = [...document.querySelectorAll<HTMLElement>('[data-movie]')];
const groups = [...document.querySelectorAll<HTMLElement>('.actor-group')];
const empty = document.querySelector<HTMLElement>('#empty')!;
let filter = 'all';

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  for (const card of cards) {
    const movie = card.dataset;
    const matchesQuery = `${movie.title} ${movie.year} ${movie.actor}`
      .toLowerCase()
      .includes(query);
    const matchesActor = !actor.value || movie.actor === actor.value;
    const matchesStatus =
      filter === 'all' ||
      (filter === 'watched'
        ? movie.watched === 'true'
        : movie.watched === 'false');
    card.hidden = !(matchesQuery && matchesActor && matchesStatus);
  }
  for (const group of groups) {
    group.hidden = !group.querySelector('[data-movie]:not([hidden])');
  }
  empty.hidden = cards.some((card) => !card.hidden);
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    filter = button.dataset.filter!;
    for (const tab of filterButtons) {
      tab.classList.toggle('active', tab === button);
      tab.setAttribute('aria-pressed', String(tab === button));
    }
    applyFilters();
  });
}
search.addEventListener('input', applyFilters);
actor.addEventListener('change', applyFilters);

const dialog = document.querySelector<HTMLDialogElement>('#dialog')!;
const title = document.querySelector<HTMLElement>('#mission-title')!;
const metadata = document.querySelector<HTMLElement>('#mission-metadata')!;
const toast = document.querySelector<HTMLElement>('#toast')!;
const unwatched = cards.filter((card) => card.dataset.watched === 'false');
let toastTimer: ReturnType<typeof setTimeout>;

document
  .querySelector('#close')!
  .addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});
document.querySelector('#pick')!.addEventListener('click', () => {
  if (!unwatched.length) {
    toast.textContent = 'Mission accomplished! Every film watched.';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    return;
  }
  const movie = unwatched[Math.floor(Math.random() * unwatched.length)].dataset;
  title.textContent = movie.title!;
  metadata.textContent = `${movie.year} · ${movie.actor}${movie.independent === 'true' ? ' · Independent release' : ''}`;
  dialog.showModal();
});
