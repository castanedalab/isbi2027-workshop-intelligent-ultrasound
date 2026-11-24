// All workshop content lives in index.html. This script only handles navigation.
'use strict';
const root = document.documentElement;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
const header = document.querySelector('.site-header');
const links = [...nav.querySelectorAll('a[href^="#"]')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const mobile = window.matchMedia('(max-width: 860px)');

root.classList.add('js');
menu.hidden = false;

function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
links.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenu(false);
});
mobile.addEventListener('change', () => setMenu(false));

// Highlight the section currently being read, without changing the URL.
let queued = false;
function updateNavigation() {
  queued = false;
  const cutoff = header.getBoundingClientRect().height + 65;
  let active = null;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= cutoff) active = section.id;
  }
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= root.scrollHeight - 3) {
    active = sections[sections.length - 1]?.id;
  }
  for (const link of links) {
    if (link.hash === '#' + active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function requestUpdate() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(updateNavigation);
  }
}
window.addEventListener('scroll', requestUpdate, {passive: true});
window.addEventListener('resize', requestUpdate);
window.addEventListener('load', requestUpdate);
updateNavigation();
