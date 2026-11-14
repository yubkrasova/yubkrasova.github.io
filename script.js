// Tabs with URL hash support (e.g. /#personal opens the Personal tab).
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = tabs.map((t) => document.getElementById(t.dataset.tab));

function select(id, { focus = false, updateHash = true } = {}) {
  const index = Math.max(0, tabs.findIndex((t) => t.dataset.tab === id));
  tabs.forEach((tab, i) => {
    const active = i === index;
    tab.setAttribute('aria-selected', active);
    tab.tabIndex = active ? 0 : -1;
    panels[i].hidden = !active;
  });
  if (focus) tabs[index].focus();
  if (updateHash) history.replaceState(null, '', '#' + tabs[index].dataset.tab);
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => select(tab.dataset.tab));
  tab.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const next = tabs[(i + step + tabs.length) % tabs.length];
    select(next.dataset.tab, { focus: true });
  });
});

window.addEventListener('hashchange', () => select(location.hash.slice(1), { updateHash: false }));
select(location.hash.slice(1), { updateHash: false });

document.getElementById('year').textContent = new Date().getFullYear();

// Lightbox: click any image to view it large. Arrows/swipe move within the
// same section, Esc or a click on the dark area closes it.
const box = document.createElement('dialog');
box.className = 'lightbox';
box.innerHTML = `
  <button class="lb-close" aria-label="Close">×</button>
  <button class="lb-prev" aria-label="Previous image">‹</button>
  <figure><img alt=""><figcaption></figcaption></figure>
  <button class="lb-next" aria-label="Next image">›</button>
  <span class="lb-count"></span>`;
document.body.append(box);

const lbImg = box.querySelector('img');
const lbCap = box.querySelector('figcaption');
const lbCount = box.querySelector('.lb-count');
let group = [];
let current = 0;

function show(i) {
  current = (i + group.length) % group.length;
  const img = group[current];
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
  lbCount.textContent = group.length > 1 ? `${current + 1} / ${group.length}` : '';
  box.classList.toggle('single', group.length < 2);
}

document.querySelectorAll('main figure img, main .row img').forEach((img) => {
  img.classList.add('zoomable');
  img.addEventListener('click', () => {
    const scope = img.closest('.panel') || img.closest('figure');
    group = [...scope.querySelectorAll('img.zoomable')];
    show(group.indexOf(img));
    box.showModal();
  });
});

box.querySelector('.lb-close').addEventListener('click', () => box.close());
box.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
box.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
box.addEventListener('click', (e) => { if (e.target === box || e.target.tagName === 'FIGURE') box.close(); });
box.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') show(current + 1);
  if (e.key === 'ArrowLeft') show(current - 1);
});

let touchX = null;
box.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
box.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  touchX = null;
});
