const movies=[
['Dr. No',1962,'Sean Connery'],['From Russia with Love',1963,'Sean Connery'],['Goldfinger',1964,'Sean Connery'],['Thunderball',1965,'Sean Connery'],['Casino Royale',1967,'David Niven',true],['You Only Live Twice',1967,'Sean Connery'],['On Her Majesty’s Secret Service',1969,'George Lazenby'],['Diamonds Are Forever',1971,'Sean Connery'],['Live and Let Die',1973,'Roger Moore'],['The Man with the Golden Gun',1974,'Roger Moore'],['The Spy Who Loved Me',1977,'Roger Moore'],['Moonraker',1979,'Roger Moore'],['For Your Eyes Only',1981,'Roger Moore'],['Octopussy',1983,'Roger Moore'],['Never Say Never Again',1983,'Sean Connery',true],['A View to a Kill',1985,'Roger Moore'],['The Living Daylights',1987,'Timothy Dalton'],['Licence to Kill',1989,'Timothy Dalton'],['GoldenEye',1995,'Pierce Brosnan'],['Tomorrow Never Dies',1997,'Pierce Brosnan'],['The World Is Not Enough',1999,'Pierce Brosnan'],['Die Another Day',2002,'Pierce Brosnan'],['Casino Royale',2006,'Daniel Craig'],['Quantum of Solace',2008,'Daniel Craig'],['Skyfall',2012,'Daniel Craig'],['Spectre',2015,'Daniel Craig'],['No Time to Die',2021,'Daniel Craig']];

let state = null;
let filter = 'all';
const $ = s => document.querySelector(s);
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const id = i => movies[i][1] + '-' + movies[i][0];
const watched = i => state.seen[id(i)] === true;
const actors = ['David Niven','Sean Connery','George Lazenby','Roger Moore','Timothy Dalton','Pierce Brosnan','Daniel Craig'];
let timer;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => $('#toast').classList.remove('show'), 2600);
}
function render() {
  if (!state) return;
  const count = movies.filter((m,i) => watched(i)).length;
  $('#watchedCount').textContent = count;
  $('#remainingCount').textContent = movies.length - count;
  $('#progress').style.width = (count / movies.length * 100) + '%';
  $('#status').textContent = count === movies.length ? 'Mission accomplished.' : count === 0 ? 'Just getting started.' : `${movies.length-count} missions remaining.`;
  const query = $('#search').value.toLowerCase(), actor = $('#actor').value;
  const tones = ['#704b27','#254945','#88651d','#354e70','#653345','#7b362f'];
  let visibleCount = 0;
  $('#grid').innerHTML = actors.map((name, groupIndex) => {
    const all = movies.map((m,i) => ({m,i})).filter(({m}) => m[2] === name);
    const visible = all.filter(({m,i}) => !(filter === 'watched' && !watched(i)) && !(filter === 'unseen' && watched(i)) && (!actor || m[2] === actor) && `${m[0]} ${m[1]} ${m[2]}`.toLowerCase().includes(query));
    if (!visible.length) return '';
    visibleCount += visible.length;
    const years = all.map(({m}) => m[1]);
    const done = all.filter(({i}) => watched(i)).length;
    return `<section class="actor-group" aria-labelledby="actor-${groupIndex}"><div class="actor-heading"><div><p class="eyebrow">${name === 'David Niven' ? 'INDEPENDENT BOND' : 'THE BOND DOSSIER'} · ${Math.min(...years)}${Math.min(...years) === Math.max(...years) ? '' : '–'+Math.max(...years)}</p><h3 id="actor-${groupIndex}">${escape(name)}</h3></div><span>${done} / ${all.length} watched</span></div><div class="film-grid">${visible.map(({m,i}) => `<article class="film"><div class="poster" style="--tone:${tones[groupIndex%tones.length]}"><span class="poster-year">${m[1]}</span>${watched(i)?'<span class="badge">✓ WATCHED</span>':''}${m[3]?'<span class="independent-label">INDEPENDENT RELEASE</span>':''}<div class="poster-title">${escape(m[0])}</div><small>JAMES BOND · 007</small></div><div class="film-info"><div class="metadata">${m[1]} · ${m[2]}</div><h4>${escape(m[0])}</h4><div class="watchers"><span class="watch-status${watched(i)?' is-watched':''}">${watched(i)?'✓ Watched':'Not watched'}</span></div></div></article>`).join('')}</div></section>`;
  }).join('');
  $('#empty').hidden = visibleCount !== 0;
}
document.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(t => {t.classList.toggle('active', t === button);t.setAttribute('aria-pressed', String(t === button));});
  render();
});
$('#search').addEventListener('input', render);
$('#actor').addEventListener('change', render);
const dialog = $('#dialog');
$('#close').onclick = () => dialog.close();
dialog.addEventListener('click', e => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
});
$('#pick').onclick = () => {
  if (!state) return;
  const pool = movies.map((m,i) => i).filter(i => !watched(i));
  if (!pool.length) { toast('Mission accomplished! Every film watched.'); return; }
  const i = pool[Math.floor(Math.random()*pool.length)], m = movies[i];
  $('#dialogContent').innerHTML = `<p class="eyebrow">TONIGHT’S ASSIGNMENT</p><h2>${escape(m[0])}</h2><p class="metadata">${m[1]} · ${m[2]}${m[3]?' · Independent release':''}</p><p>Settle in. Your next mission is ready.</p><div class="watchers"><span class="watch-status">Not watched</span></div>`;
  dialog.showModal();
};
async function loadWatched() {
  $('#pick').disabled = true;
  $('#status').textContent = 'Loading dossier…';
  $('#watchedCount').textContent = '—';
  $('#remainingCount').textContent = '—';
  $('#grid').textContent = 'Loading movie status…';
  try {
    const response = await fetch('watched.json', {cache: 'no-store'});
    if (!response.ok) throw new Error(`Could not load watched.json (${response.status})`);
    const seen = await response.json();
    if (!seen || typeof seen !== 'object' || Array.isArray(seen) ||
        movies.some((m,i) => typeof seen[id(i)] !== 'boolean')) {
      throw new Error('watched.json must contain a true or false value for every movie.');
    }
    state = {seen};
    $('#pick').disabled = false;
    render();
  } catch (error) {
    $('#grid').textContent = 'Movie status could not be loaded. Please check watched.json and reload.';
    $('#status').textContent = 'Dossier unavailable.';
    console.error(error);
  }
}
loadWatched();
