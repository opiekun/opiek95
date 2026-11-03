(() => {
  'use strict';
  const desktop = window.opiekunDesktop;
  const shell = document.querySelector('[data-desktop-shell]');
  if (!desktop || !shell) return;
  let serial = 0;
  let musicWindow = null;

  // Clone only inert content. Never copy executable elements, event handlers or unsafe URLs.
  function copyPanel(source) {
    const copy = source.cloneNode(true);
    copy.querySelectorAll('script, iframe, object, embed, link, meta, base, style, form, video, audio').forEach(node => node.remove());
    copy.hidden = false;
    const nodes = [copy, ...copy.querySelectorAll('*')];
    const ids = new Map();
    const prefix = `os-copy-${++serial}-`;
    nodes.forEach(node => { if (node.id) { ids.set(node.id, prefix + node.id); node.id = prefix + node.id; } });
    nodes.forEach(node => {
      [...node.attributes].forEach(attr => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || name === 'style' || name === 'srcdoc') node.removeAttribute(attr.name);
        else if (['href', 'src', 'xlink:href', 'action', 'formaction'].includes(name)) {
          const value = attr.value.trim();
          let safe = false;
          try { safe = ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(value, location.href).protocol); } catch {}
          if (!safe) node.removeAttribute(attr.name);
          else if (value.startsWith('#') && ids.has(value.slice(1))) node.setAttribute(attr.name, '#' + ids.get(value.slice(1)));
        } else if (['for', 'aria-labelledby', 'aria-describedby', 'aria-controls'].includes(name)) {
          node.setAttribute(attr.name, attr.value.split(/\s+/).map(id => ids.get(id) || id).join(' '));
        }
      });
    });
    return copy;
  }

  function openPanel(name) {
    const content = document.createElement('div');
    content.className = 'os-app-content';
    const title = { journal: 'Journal', projects: 'Projects', about: 'About' }[name];
    const app = desktop.windows.open({ title, icon: name === 'projects' ? 'directory_closed-0' : 'notepad-1', content, onClose: name === 'about' ? () => { try { localStorage.setItem('opiekun-about-dismissed', '1'); } catch {} } : undefined });
    if (name === 'about') {
      app.element.classList.add('os-about-window');
      const area = shell.querySelector('[data-window-layer]').getBoundingClientRect();
      const width = Math.min(590, Math.max(0, (area.width || innerWidth) - 24));
      const height = Math.min(520, Math.max(0, (area.height || innerHeight - 32) - 16));
      app.element.style.width = `${width}px`;
      app.element.style.height = `${height}px`;
      app.place();
    }
    function show(panel, focus = false) {
      content.replaceChildren(copyPanel(document.getElementById(panel)));
      if (focus) {
        const heading = content.querySelector('h1, h2');
        if (heading) { heading.tabIndex = -1; heading.focus(); }
      }
      if (panel === 'projects') {
        const search = content.querySelector('input[type="search"]');
        const projects = [...content.querySelectorAll('[data-project]')];
        const empty = content.querySelector('.project-empty');
        const results = content.querySelector('.project-results');
        const filter = () => {
          const query = search.value.trim().toLowerCase();
          let count = 0;
          projects.forEach(project => { project.hidden = !project.textContent.toLowerCase().includes(query); if (!project.hidden) count++; });
          empty.hidden = count !== 0;
          results.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
        };
        search.addEventListener('input', filter); search.addEventListener('search', filter); filter();
      }
      if (panel.startsWith('article-')) {
        const base = panel === 'article-preview' ? '/preview/article/' : '/journal/' + panel.slice(8) + '/';
        content.querySelectorAll('a[href^="#os-copy-"]').forEach(link => {
          const id = link.getAttribute('href').slice(1);
          link.dataset.osFragment = id;
          link.href = base + '#' + id.replace(/^os-copy-\d+-/, '');
        });
        const permalink = document.createElement('a');
        permalink.href = base;
        permalink.textContent = 'Open or copy direct link';
        permalink.className = 'os-permalink';
        content.append(permalink);
      }
    }
    content.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (link.target && link.target !== '_self')) return;
      if (link.dataset.osFragment) {
        const target = document.getElementById(link.dataset.osFragment);
        if (target && content.contains(target)) { event.preventDefault(); event.stopPropagation(); target.tabIndex = -1; target.focus(); target.scrollIntoView?.({ block: 'start' }); }
        return;
      }
      const view = link.dataset.view;
      if (view === 'journal' || (view && view.startsWith('article-') && document.getElementById(view))) {
        event.preventDefault(); event.stopPropagation(); show(view, true);
      }
    });
    show(name);
    return app;
  }

  function openResume() {
    const content = document.createElement('div'); content.className = 'os-resume';
    const toolbar = document.createElement('div'); toolbar.className = 'os-toolbar';
    const download = document.createElement('a'); download.href = '/assets/Profile.pdf'; download.download = 'Profile.pdf'; download.textContent = 'Download Resume (PDF)';
    const external = document.createElement('a'); external.href = '/assets/Profile.pdf'; external.target = '_blank'; external.rel = 'noopener'; external.textContent = 'Open PDF in new tab';
    toolbar.append(download, external);
    content.append(toolbar, copyPanel(document.getElementById('resume-document')));
    desktop.windows.open({ title: 'Resume', icon: 'notepad-1', content });
  }

  function openMusic() {
    if (musicWindow && musicWindow.element.isConnected) { musicWindow.element.hidden = false; musicWindow.focus(); return; }
    const player = document.getElementById('music-player');
    const parent = player.parentNode; const next = player.nextSibling;
    const content = document.createElement('div'); content.className = 'os-music';
    content.innerHTML = `<div class="os-media-player">
      <div class="os-media-menu" data-media-menu>
        <details><summary>File</summary><div><a href="https://plaza.one/" target="_blank" rel="noopener">Visit Nightwave Plaza</a><button type="button" data-media-close>Close</button></div></details>
        <details><summary>View</summary><div><button type="button" data-media-view>Show station info</button></div></details>
        <details><summary>Help</summary><div><p>Live radio: seeking and track skipping are unavailable.</p></div></details>
      </div>
      <div class="os-media-screen" data-media-screen><div class="os-media-screen-content"><img src="/assets/icons/media_player-0.png" alt=""><span>Nightwave Plaza</span><small data-media-track>Live vaporwave radio</small></div></div>
      <div class="os-media-timeline"><input type="range" min="0" max="100" value="0" aria-label="Seek in live stream" data-media-seek disabled><div class="os-media-scale" aria-hidden="true"></div><div class="os-media-times"><span>LIVE</span><span>--:--</span></div></div>
      <div class="os-media-transport"><div class="os-media-buttons">
        <button type="button" data-media-play aria-label="Play" title="Play">▶</button>
        <button type="button" data-media-pause aria-label="Pause" title="Pause">Ⅱ</button>
        <button type="button" data-media-stop aria-label="Stop" title="Stop">■</button>
        <span class="os-media-separator" aria-hidden="true"></span>
        <button type="button" aria-label="Previous track unavailable" title="Previous track unavailable" disabled><span class="os-media-skip os-media-skip-previous" aria-hidden="true"></span></button>
        <button type="button" aria-label="Next track unavailable" title="Next track unavailable" disabled><span class="os-media-skip os-media-skip-next" aria-hidden="true"></span></button>
        <span class="os-media-separator" aria-hidden="true"></span>
        <button type="button" data-media-mute aria-label="Mute" title="Mute">♫</button>
      </div><label class="os-media-volume">Volume <input type="range" min="0" max="100" value="30" data-media-volume aria-label="Volume"></label></div>
      <div class="os-media-status" role="status"><span data-media-state>Ready</span><span>Nightwave Plaza</span></div>
      <div class="os-media-source"></div>
    </div>`;
    content.querySelector('.os-media-source').append(player);
    const audio = player.querySelector('#music-audio');
    const originalToggle = player.querySelector('#music-toggle');
    const originalVolume = player.querySelector('#music-volume');
    const volume = content.querySelector('[data-media-volume]');
    const state = content.querySelector('[data-media-state]');
    const track = content.querySelector('[data-media-track]');
    const screen = content.querySelector('[data-media-screen]');
    const sync = () => {
      state.textContent = player.querySelector('#music-status').textContent;
      track.textContent = `${player.querySelector('#music-title').textContent} — ${player.querySelector('#music-artist').textContent}`;
      volume.value = originalVolume.value;
      content.querySelector('[data-media-play]').disabled = originalToggle.getAttribute('aria-label') === 'Pause music';
      content.querySelector('[data-media-pause]').disabled = originalToggle.getAttribute('aria-label') !== 'Pause music';
      content.querySelector('[data-media-stop]').disabled = originalToggle.getAttribute('aria-label') !== 'Pause music';
    };
    const observer = new MutationObserver(sync);
    observer.observe(player, { attributes: true, childList: true, characterData: true, subtree: true, attributeFilter: ['data-playing', 'aria-label'] });
    audio.addEventListener('volumechange', sync);
    content.querySelector('[data-media-play]').addEventListener('click', () => originalToggle.click());
    content.querySelector('[data-media-pause]').addEventListener('click', () => originalToggle.click());
    content.querySelector('[data-media-stop]').addEventListener('click', () => { if (originalToggle.getAttribute('aria-label') === 'Pause music') originalToggle.click(); sync(); });
    content.querySelector('[data-media-mute]').addEventListener('click', () => { volume.value = audio.muted ? (originalVolume.dataset.lastVolume || '30') : '0'; volume.dispatchEvent(new Event('input', { bubbles: true })); });
    volume.addEventListener('input', () => { if (volume.value !== '0') originalVolume.dataset.lastVolume = volume.value; originalVolume.value = volume.value; originalVolume.dispatchEvent(new Event('input', { bubbles: true })); });
    content.querySelector('[data-media-view]').addEventListener('click', () => { screen.classList.toggle('show-info'); content.querySelector('[data-media-view]').textContent = screen.classList.contains('show-info') ? 'Hide station info' : 'Show station info'; });
    sync();
    musicWindow = desktop.windows.open({ title: 'Music Player', icon: 'media_player-0', content, onClose() { observer.disconnect(); audio.removeEventListener('volumechange', sync); parent.insertBefore(player, next); musicWindow = null; } });
    musicWindow.element.classList.add('os-media-window');
    musicWindow.place();
    content.querySelector('[data-media-close]').addEventListener('click', () => musicWindow.element.querySelector('[data-window-close]').click());
  }
  shell.addEventListener('desktop:leaving', () => {
    if (musicWindow?.element.isConnected) musicWindow.element.querySelector('[data-window-close]').click();
  });

  function launch(name) {
    shell.querySelector('[data-start-menu]').hidden = true;
    shell.querySelector('[data-start]').setAttribute('aria-expanded', 'false');
    if (name === 'resume') openResume();
    else if (name === 'music') openMusic();
    else if (['journal', 'projects', 'about'].includes(name)) openPanel(name);
  }
  function targetApp(target) {
    const item = target.closest('[data-menu-app], [data-app], .os-icons a[href^="/#"]');
    if (!item) return null;
    return { item, name: item.dataset.menuApp || item.dataset.app || item.getAttribute('href').slice(2) };
  }
  shell.addEventListener('click', event => {
    const target = targetApp(event.target); if (!target) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (target.item.closest('.os-icons') && event.detail > 0 && event.pointerType !== 'touch' && lastPointer !== 'touch') return;
    launch(target.name);
  }, true);
  let lastPointer = '';
  shell.addEventListener('pointerdown', event => { lastPointer = event.pointerType; }, true);
  shell.addEventListener('dblclick', event => {
    const target = targetApp(event.target);
    if (!target || !target.item.closest('.os-icons') || lastPointer === 'touch') return;
    event.preventDefault(); event.stopImmediatePropagation(); launch(target.name);
  }, true);
  function openWelcomeAbout() {
    if (shell.hidden || shell.querySelector('[data-desktop]').hidden || shell.querySelector('[data-desktop]').dataset.ready !== 'true') return;
    try { if (localStorage.getItem('opiekun-about-dismissed') === '1') return; } catch {}
    if (shell.querySelector('[data-window][aria-label="About"]')) return;
    openPanel('about');
  }
  shell.addEventListener('desktop:ready', openWelcomeAbout);
  openWelcomeAbout();
})();
