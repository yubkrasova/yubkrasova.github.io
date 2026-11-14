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
