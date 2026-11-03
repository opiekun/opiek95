(() => {
  'use strict';

  // Content routes remain the original site; only the unfragmented home page boots.
  if (location.pathname !== '/' || location.hash) return;
  const shell = document.createElement('div');
  shell.className = 'os-shell';
  shell.dataset.desktopShell = '';
  shell.innerHTML = `
    <audio data-login-sound src="/assets/sounds/the-microsoft-sound.wav" preload="auto" hidden></audio>
    <section class="os-boot" data-boot aria-label="Computer startup">
      <div class="os-bios-brand" data-bios-brand aria-hidden="true">opiekun<span>★</span></div>
      <div class="os-post" data-boot-screen aria-live="polite"></div><div class="os-progress" data-boot-progress hidden role="progressbar" aria-label="Loading desktop"><span></span></div>
      <div class="os-boot-footer" data-boot-footer><button type="button" data-boot-setup>Press <strong>DEL</strong> to enter SETUP</button><span>Virtual hardware · opiekun 95</span></div>
      <section class="os-bios-setup" data-bios-setup aria-labelledby="os-bios-title" hidden><h2 id="os-bios-title">OPIEKUN BIOS SETUP UTILITY</h2><div class="os-bios-panel"><h3>Standard CMOS Features</h3><p>Processor&nbsp;&nbsp; Virtual Portfolio CPU</p><p>Memory&nbsp;&nbsp;&nbsp;&nbsp; 640K OK</p><p>Primary Master&nbsp; Portfolio Drive</p><label><input type="checkbox" data-bios-show-post> Show POST on return visits</label></div><div class="os-bios-actions"><button type="button" data-bios-save>Save &amp; Exit</button><button type="button" data-bios-exit>Exit Without Saving</button></div><p>Simulation settings only. No computer hardware is changed.</p></section>
      <button type="button" class="os-skip" data-boot-skip>Skip startup</button>
    </section>
    <section class="os-login" data-login hidden aria-labelledby="os-login-title">
      <form class="os-login-card" data-login-form><div class="os-login-mark" aria-hidden="true"></div><div><p class="os-kicker">WELCOME TO</p><h1 id="os-login-title">opiekun<span>95</span></h1><p>Simulated sign-in. No account or password required.</p>
      <label class="os-login-field">User name <input name="username" value="Guest" autocomplete="off"></label>
      <label class="os-login-field">Password <input name="password" type="password" autocomplete="off"></label>
      <label class="os-remember"><input type="checkbox" data-remember checked> Remember this device and skip startup next time</label>
      <button type="submit" class="os-button" data-login-enter>Enter desktop →</button><p class="os-auto-login">Signing in automatically in a moment. Edit a field to pause.</p></div></form>
    </section>
    <section class="os-desktop" data-desktop hidden aria-label="Desktop">
      <div class="os-wallpaper-label" aria-hidden="true">opiekun<span>95</span><small>personal computer</small></div>
      <div class="os-icons" aria-label="Desktop shortcuts. Double-click to open, or press Enter.">
        <button type="button" class="os-icon" data-open-computer><img src="/assets/icons/computer-2.png" alt="">My Computer</button>
        <a class="os-icon" href="/#journal"><img src="/assets/icons/notepad-1.png" alt="">Journal</a>
        <a class="os-icon" href="/#projects"><img src="/assets/icons/directory_closed-0.png" alt="">Projects</a>
        <a class="os-icon" href="/#about"><img src="/assets/icons/users-0.png" alt="">About</a>
        <a class="os-icon" href="/assets/Profile.pdf" data-app="resume"><img src="/assets/icons/notepad-1.png" alt="">Resume</a>
        <button type="button" class="os-icon" data-app="music"><img src="/assets/icons/media_player-0.png" alt="">Music Player</button>
      </div>
      <div class="os-window-layer" data-window-layer></div>
      <nav class="os-start-menu" data-start-menu aria-label="Start menu" hidden><div class="os-start-brand">opiekun <b>95</b></div><div class="os-start-items"><div class="os-start-group"><button type="button" data-submenu-trigger aria-expanded="false"><img src="/assets/icons/directory_closed-0.png" alt=""> Programs</button><div class="os-start-submenu" data-start-submenu><button type="button" data-menu-computer><img src="/assets/icons/computer-2.png" alt=""> My Computer</button><a href="/#journal" data-menu-app="journal"><img src="/assets/icons/notepad-1.png" alt=""> Journal</a><a href="/#projects" data-menu-app="projects"><img src="/assets/icons/directory_closed-0.png" alt=""> Projects</a><a href="/#about" data-menu-app="about"><img src="/assets/icons/users-0.png" alt=""> About</a><a href="/assets/Profile.pdf" data-menu-app="resume"><img src="/assets/icons/notepad-1.png" alt=""> Resume</a><button type="button" data-menu-app="music"><img src="/assets/icons/media_player-0.png" alt=""> Music Player</button><a href="mailto:opiekun.matheus@gmail.com"><img src="/assets/icons/envelope_closed-0.png" alt=""> Contact</a></div></div><div class="os-start-group" data-documents-group><button type="button" data-submenu-trigger aria-expanded="false"><img src="/assets/icons/directory_closed-0.png" alt=""> Documents</button><div class="os-start-submenu" data-start-submenu><a href="/#journal"><img src="/assets/icons/notepad-1.png" alt=""> Journal</a><a href="/#projects"><img src="/assets/icons/directory_closed-0.png" alt=""> Projects</a><a href="/assets/Profile.pdf" data-app="resume"><img src="/assets/icons/notepad-1.png" alt=""> Resume</a></div></div><div class="os-start-group" data-settings-group><button type="button" data-submenu-trigger aria-expanded="false"><img src="/assets/icons/display_properties-2.png" alt=""> Settings</button><div class="os-start-submenu" data-start-submenu></div></div><div class="os-start-divider"></div><div data-start-utilities></div><button type="button" data-restart><img src="/assets/icons/shut_down_normal-0.png" alt=""> Restart</button></div></nav>
      <div class="os-taskbar" data-taskbar><button type="button" class="os-start" data-start aria-expanded="false" aria-controls="os-start-menu"><img src="/assets/icons/windows-0.png" alt=""> Start</button><div class="os-task-windows" data-task-windows aria-label="Open windows"></div><button type="button" class="os-clock" data-clock aria-label="Date and time"></button></div>
    </section>
    <section class="os-startup-sound-prompt" data-startup-sound-prompt role="dialog" aria-modal="true" aria-label="Welcome to opiekun 95" hidden><div class="os-startup-sound-card"><div class="os-startup-sound-title">Welcome to opiekun 95</div><div class="os-startup-sound-body"><p>Click Enter desktop to play the startup sound.</p><p role="status" aria-live="polite"></p><div><button type="button" class="os-button" data-startup-sound-play>Enter desktop</button><button type="button" class="os-button" data-startup-sound-skip>Continue silently</button></div></div></div></section>`;
  const raccoon = document.querySelector('.hero-art .raccoon-art');
  if (raccoon) shell.querySelector('.os-login-mark').append(raccoon.cloneNode(true));
  shell.querySelector('[data-start-menu]').id = 'os-start-menu';
  document.body.append(shell);
  document.body.classList.add('os-active');
  const boot = shell.querySelector('[data-boot]');
  const screen = shell.querySelector('[data-boot-screen]');
  const login = shell.querySelector('[data-login]');
  const desktop = shell.querySelector('[data-desktop]');
  const menu = shell.querySelector('[data-start-menu]');
  const start = shell.querySelector('[data-start]');
  const progress = shell.querySelector('[data-boot-progress]');
  const setup = shell.querySelector('[data-bios-setup]');
  const brand = shell.querySelector('[data-bios-brand]');
  const bootFooter = shell.querySelector('[data-boot-footer]');
  const bootSkip = shell.querySelector('[data-boot-skip]');
  const loginSound = shell.querySelector('[data-login-sound]');
  const soundPrompt = shell.querySelector('[data-startup-sound-prompt]');
  let timer;
  let postActive = false;
  let z = 1;
  let count = 0;
  const storage = { get() { try { return localStorage.getItem('opiekun-desktop-visited'); } catch { return null; } }, set(value) { try { if (value) localStorage.setItem('opiekun-desktop-visited', '1'); else localStorage.removeItem('opiekun-desktop-visited'); } catch {} } };
  let showPost = (() => { try { return localStorage.getItem('opiekun-bios-show-post') === '1'; } catch { return false; } })();
  function offerStartupSound() { if (desktop.hidden) return; soundPrompt.hidden = false; soundPrompt.querySelector('[data-startup-sound-play]').focus(); }
  function signalDesktopReady() { desktop.dataset.ready = 'true'; shell.dispatchEvent(new Event('desktop:ready')); }
  function startupSoundError(error, interactive) {
    if (error?.name === 'NotAllowedError' && !interactive) offerStartupSound();
    else if (interactive) soundPrompt.querySelector('[role=status]').textContent = 'Sound could not play. You can continue silently.';
  }
  function playStartupSound(interactive = false) {
    try { if (localStorage.getItem('opiekun-startup-sound') === '0') return; } catch {}
    if (!loginSound.canPlayType('audio/wav')) return;
    try {
      loginSound.currentTime = 0;
      const result = loginSound.play();
      return result?.then(() => { if (interactive) { soundPrompt.hidden = true; shell.querySelector('[data-open-computer]').focus(); signalDesktopReady(); } }).catch(error => startupSoundError(error, interactive));
    } catch (error) {
      startupSoundError(error, interactive);
    }
  }
  function enterDesktop() { storage.set(shell.querySelector('[data-remember]').checked); showDesktop(); shell.querySelector('[data-open-computer]').focus(); }
  function showLogin() { clearTimeout(timer); postActive = false; soundPrompt.hidden = true; boot.hidden = true; desktop.hidden = true; login.hidden = false; shell.querySelector('.os-auto-login').textContent = 'Signing in automatically in a moment. Edit a field to pause.'; shell.querySelector('[data-login-enter]').focus(); timer = setTimeout(enterDesktop, 6000); }
  function showDesktop() { clearTimeout(timer); postActive = false; boot.hidden = true; login.hidden = true; desktop.hidden = false; desktop.dataset.ready = 'false'; Promise.resolve(playStartupSound()).then(() => { if (soundPrompt.hidden) signalDesktopReady(); }); }
  soundPrompt.querySelector('[data-startup-sound-play]').addEventListener('click', () => playStartupSound(true));
  soundPrompt.querySelector('[data-startup-sound-skip]').addEventListener('click', () => { soundPrompt.hidden = true; shell.querySelector('[data-open-computer]').focus(); signalDesktopReady(); });
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function startBoot() {
    clearTimeout(timer); soundPrompt.hidden = true; desktop.hidden = true; login.hidden = true; boot.hidden = false;
    postActive = true; setup.hidden = true; screen.hidden = false; brand.hidden = false; bootFooter.hidden = false; bootSkip.hidden = false;
    const postHeader = 'opiekun BIOS v1.00\nCopyright (C) 1995 opiekun\n\nOPIEKUN 95 BIOS Revision 1.00\n\nMain Processor : Virtual Portfolio CPU\nMemory Testing: ';
    const frames = [
      `${postHeader}128K`,
      `${postHeader}384K`,
      `${postHeader}640K OK\n\nPrimary Master : Portfolio Drive\nPrimary Slave  : None\nSecondary Master: Music Player\nSecondary Slave : None\n\nKeyboard: OK\nDisplay adapter: OK`,
      'Starting opiekun DOS...\n\nC:\\> load desktop\nLoading personal files...\nReady.',
      'opiekun 95\n\nA personal computer, on the web.'
    ];
    let frame = 0;
    const advance = () => { screen.textContent = frames[frame]; postActive = frame < 3; brand.hidden = !postActive; bootFooter.hidden = !postActive; progress.hidden = frame !== frames.length - 1; frame++; timer = setTimeout(frame < frames.length ? advance : showLogin, frame < 3 ? 650 : frame === 3 ? 2200 : 1000); };
    advance();
  }
  function openSetup() { if (boot.hidden || !setup.hidden || !postActive) return; clearTimeout(timer); setup.hidden = false; screen.hidden = true; brand.hidden = true; bootFooter.hidden = true; bootSkip.hidden = true; progress.hidden = true; setup.querySelector('[data-bios-show-post]').checked = showPost; setup.querySelector('[data-bios-show-post]').focus(); }
  if (!showPost && (storage.get() || reduced)) showDesktop(); else startBoot();
  bootSkip.addEventListener('click', showLogin);
  shell.querySelector('[data-boot-setup]').addEventListener('click', openSetup);
  document.addEventListener('keydown', event => { if (event.key === 'Delete' && !boot.hidden && setup.hidden) { event.preventDefault(); openSetup(); } else if (event.key === 'Escape' && !setup.hidden) { event.preventDefault(); startBoot(); } });
  setup.querySelector('[data-bios-save]').addEventListener('click', () => { showPost = setup.querySelector('[data-bios-show-post]').checked; try { localStorage.setItem('opiekun-bios-show-post', showPost ? '1' : '0'); } catch {} startBoot(); });
  setup.querySelector('[data-bios-exit]').addEventListener('click', startBoot);
  shell.querySelector('[data-login-form]').addEventListener('submit', event => { event.preventDefault(); enterDesktop(); });
  shell.querySelector('[data-login-form]').addEventListener('input', () => { clearTimeout(timer); shell.querySelector('.os-auto-login').textContent = 'Automatic sign-in paused.'; });
  function setMenu(open) { menu.hidden = !open; start.setAttribute('aria-expanded', String(open)); if (!open) menu.querySelectorAll('[data-submenu-trigger]').forEach(button => button.setAttribute('aria-expanded', 'false')); }
  start.addEventListener('click', () => setMenu(menu.hidden));
  start.addEventListener('keydown', event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setMenu(true); const items = menu.querySelectorAll('.os-start-items > .os-start-group > button, .os-start-items > [data-start-utilities] > button, .os-start-items > button'); items[event.key === 'ArrowDown' ? 0 : items.length - 1]?.focus(); } });
  menu.addEventListener('click', event => { const trigger = event.target.closest('[data-submenu-trigger]'); if (trigger) { const wasOpen = trigger.getAttribute('aria-expanded') === 'true'; menu.querySelectorAll('[data-submenu-trigger]').forEach(button => button.setAttribute('aria-expanded', 'false')); trigger.setAttribute('aria-expanded', String(!wasOpen)); } });
  menu.addEventListener('keydown', event => {
    const target = event.target.closest('button, a'); if (!target) return;
    const group = target.closest('.os-start-group');
    if (event.key === 'ArrowRight' && target.matches('[data-submenu-trigger]')) { event.preventDefault(); target.setAttribute('aria-expanded', 'true'); group.querySelector('[data-start-submenu] button, [data-start-submenu] a')?.focus(); }
    else if (event.key === 'ArrowLeft' && group && !target.matches('[data-submenu-trigger]')) { event.preventDefault(); group.querySelector('[data-submenu-trigger]').focus(); group.querySelector('[data-submenu-trigger]').setAttribute('aria-expanded', 'false'); }
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); const container = target.closest('[data-start-submenu]') || menu.querySelector('.os-start-items'); const options = [...container.querySelectorAll(':scope > button, :scope > a, :scope > .os-start-group > button, :scope > [data-start-utilities] > button')]; const index = options.indexOf(target); options[(index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus(); }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { setMenu(false); start.focus(); } });
  desktop.addEventListener('pointerdown', event => { if (!menu.contains(event.target) && !start.contains(event.target)) setMenu(false); });
  const clock = shell.querySelector('[data-clock]');
  function updateClock() { const now = new Date(); clock.title = now.toLocaleDateString(); clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  updateClock();
  setInterval(updateClock, 30000);

  const layer = shell.querySelector('[data-window-layer]');
  const tasks = shell.querySelector('[data-task-windows]');
  const windowPositionKey = 'opiekun-window-positions';
  const rememberedPositions = (() => { try { const value = JSON.parse(localStorage.getItem(windowPositionKey) || '{}'); return new Map(Object.entries(value && typeof value === 'object' && !Array.isArray(value) ? value : {})); } catch { return new Map(); } })();
  function createWindow({ title: windowTitle, icon = 'computer-2', content, onClose }) {
    const id = ++count;
    const win = document.createElement('section');
    win.className = 'os-window'; win.dataset.window = ''; win.dataset.maximized = 'false';
    win.setAttribute('role', 'region');
    win.innerHTML = `<div class="os-titlebar" data-titlebar tabindex="0" aria-label="Move window with arrow keys"><span class="os-title-label"><span data-window-icon></span><span data-window-title></span></span><div class="os-controls"><button type="button" data-window-minimize aria-label="Minimize">_</button><button type="button" data-window-maximize aria-label="Maximize">□</button><button type="button" data-window-close aria-label="Close">×</button></div></div><div class="os-window-content" data-window-content></div><button type="button" class="os-resize" data-resize aria-label="Resize window with arrow keys"></button>`;
    const makeIcon = () => { const image = document.createElement('img'); image.src = `/assets/icons/${icon}.png`; image.alt = ''; return image; };
    win.querySelector('[data-window-icon]').append(makeIcon());
    win.querySelector('[data-window-content]').append(content);
    const task = document.createElement('button'); task.type = 'button'; task.dataset.taskWindow = String(id);
    function setTitle(value) { win.querySelector('[data-window-title]').textContent = value; win.setAttribute('aria-label', value); task.replaceChildren(makeIcon(), document.createTextNode(value)); }
    setTitle(windowTitle);
    layer.append(win); tasks.append(task);
    let restore = null;
    function focus() { win.style.zIndex = String(++z); layer.querySelectorAll('.os-window').forEach(window => window.classList.remove('is-active')); win.classList.add('is-active'); tasks.querySelectorAll('button').forEach(button => button.classList.remove('is-active')); task.classList.add('is-active'); }

    win.querySelector('[data-window-close]').addEventListener('click', () => {
      const position = win.dataset.maximized === 'true' && restore ? restore : win.style;
      const x = parseFloat(position.left), y = parseFloat(position.top);
      if (Number.isFinite(x) && Number.isFinite(y)) {
        rememberedPositions.set(windowTitle, { x, y });
        try { localStorage.setItem(windowPositionKey, JSON.stringify(Object.fromEntries(rememberedPositions))); } catch {}
      }
      if (onClose) onClose(); win.remove(); task.remove(); shell.querySelector('[data-open-computer]').focus();
    });
    win.querySelector('[data-window-minimize]').addEventListener('click', () => { win.hidden = true; win.classList.remove('is-active'); task.classList.remove('is-active'); task.focus(); });
    task.addEventListener('click', () => { win.hidden = false; focus(); win.querySelector('[data-titlebar]').focus(); });
    const maximize = win.querySelector('[data-window-maximize]');
    maximize.addEventListener('click', () => {
      if (win.dataset.maximized === 'true') { win.dataset.maximized = 'false'; Object.assign(win.style, restore); constrain(); maximize.setAttribute('aria-label', 'Maximize'); }
      else { restore = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height }; win.dataset.maximized = 'true'; maximize.setAttribute('aria-label', 'Restore'); }
      focus();
    });
    win.addEventListener('pointerdown', focus);
    win.addEventListener('focusin', focus);
    const title = win.querySelector('[data-titlebar]');
    const resize = win.querySelector('[data-resize]');
    function bounds() { const r = layer.getBoundingClientRect(); return { width: r.width || innerWidth, height: r.height || innerHeight - 32 }; }
    function place() {
      const area = bounds();
      const width = Math.min(win.getBoundingClientRect().width || parseFloat(win.style.width) || 560, area.width);
      const height = Math.min(win.getBoundingClientRect().height || parseFloat(win.style.height) || 360, area.height);
      const saved = rememberedPositions.get(windowTitle);
      const x = Number.isFinite(saved?.x) ? saved.x : Math.round((area.width - width) / 2);
      const y = Number.isFinite(saved?.y) ? saved.y : Math.round((area.height - height) / 2);
      win.style.left = `${Math.max(0, Math.min(x, area.width - width))}px`;
      win.style.top = `${Math.max(0, Math.min(y, area.height - height))}px`;
    }
    function constrain() {
      const area = bounds();
      const width = Math.min(win.offsetWidth || 560, area.width), height = Math.min(win.offsetHeight || 360, area.height);
      win.style.width = `${width}px`; win.style.height = `${height}px`;
      win.style.left = `${Math.max(0, Math.min(parseFloat(win.style.left) || 0, area.width - width))}px`;
      win.style.top = `${Math.max(0, Math.min(parseFloat(win.style.top) || 0, area.height - height))}px`;
    }
    function adjust(dx, dy, resizing) {
      if (win.dataset.maximized === 'true') return;
      const r = win.getBoundingClientRect(), area = bounds();
      const left = parseFloat(win.style.left) || 0, top = parseFloat(win.style.top) || 0;
      const width = r.width || 560, height = r.height || 360;
      if (resizing) { win.style.width = `${Math.max(Math.min(260, area.width - left), Math.min(area.width - left, width + dx))}px`; win.style.height = `${Math.max(Math.min(180, area.height - top), Math.min(area.height - top, height + dy))}px`; }
      else { win.style.left = `${Math.max(0, Math.min(area.width - width, left + dx))}px`; win.style.top = `${Math.max(0, Math.min(area.height - height, top + dy))}px`; }
    }
    function bindMove(handle, resizing) {
      handle.addEventListener('pointerdown', event => {
        if (event.button !== 0 || (!resizing && event.target.closest('button'))) return;
        event.preventDefault(); focus(); let x = event.clientX, y = event.clientY;
        const move = e => { adjust(e.clientX - x, e.clientY - y, resizing); x = e.clientX; y = e.clientY; };
        const end = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
      });
      handle.addEventListener('keydown', event => { const delta = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[event.key]; if (delta && event.target === handle) { event.preventDefault(); adjust(...delta, resizing); } });
    }
    bindMove(title, false); bindMove(resize, true);
    place();
    focus(); title.focus();
    return { element: win, setTitle, focus, place };
  }
  function tileWindows(direction) {
    const visible = [...layer.querySelectorAll('[data-window]')].filter(win => !win.hidden);
    if (!visible.length) return;
    const area = layer.getBoundingClientRect(), width = area.width || innerWidth, height = area.height || innerHeight - 32;
    visible.forEach((win, index) => {
      win.dataset.maximized = 'false';
      const columns = direction === 'vertical' ? visible.length : 1, rows = direction === 'horizontal' ? visible.length : 1;
      win.style.left = `${direction === 'vertical' ? Math.floor(index * width / columns) : 0}px`;
      win.style.top = `${direction === 'horizontal' ? Math.floor(index * height / rows) : 0}px`;
      win.style.width = `${Math.floor((direction === 'vertical' ? (index + 1) * width / columns - index * width / columns : width))}px`;
      win.style.height = `${Math.floor((direction === 'horizontal' ? (index + 1) * height / rows - index * height / rows : height))}px`;
    });
    visible.at(-1).querySelector('[data-titlebar]').focus();
  }
  const windows = { open: createWindow, tile: tileWindows };
  window.opiekunDesktop = { windows };
  document.addEventListener('keydown', event => {
    if (!event.altKey || event.key !== 'Tab' || desktop.hidden || shell.hidden) return;
    const visible = [...layer.querySelectorAll('[data-window]')].filter(win => !win.hidden);
    if (visible.length < 2) return;
    event.preventDefault();
    const active = visible.findIndex(win => win.classList.contains('is-active'));
    visible[(active + (event.shiftKey ? visible.length - 1 : 1)) % visible.length].querySelector('[data-titlebar]').focus();
  });
  const folders = {
    computer: { title: 'My Computer', path: 'My Computer', entries: [{ name: 'Portfolio', folder: 'portfolio', icon: 'directory_closed-0' }, { name: 'Profile.pdf', href: '/assets/Profile.pdf', app: 'resume', icon: 'notepad-1' }, { name: 'Music Player', app: 'music', icon: 'media_player-0' }] },
    portfolio: { title: 'Portfolio', path: 'My Computer / Portfolio', entries: [{ name: 'Journal', href: '/#journal', app: 'journal', icon: 'notepad-1' }, { name: 'Projects', href: '/#projects', app: 'projects', icon: 'directory_closed-0' }, { name: 'About', href: '/#about', app: 'about', icon: 'users-0' }, { name: 'Resume', href: '/assets/Profile.pdf', app: 'resume', icon: 'notepad-1' }, { name: 'Music Player', app: 'music', icon: 'media_player-0' }] }
  };
  function openComputer() {
    setMenu(false);
    const content = document.createElement('div');
    content.className = 'os-explorer';
    content.innerHTML = '<div class="os-toolbar"><button type="button" data-back>← Back</button><button type="button" data-up>↑ Up</button><button type="button" data-view-icons aria-pressed="true">Icons</button><button type="button" data-view-details aria-pressed="false">Details</button><button type="button" data-file-properties disabled>Properties</button></div><div class="os-toolbar os-address"><span>Address</span><strong data-address></strong></div><div class="os-files" data-files></div><div class="os-status" data-status></div>';
    const app = windows.open({ title: 'My Computer', icon: 'computer-2', content });
    let current = 'computer';
    let selected = null;
    const files = content.querySelector('[data-files]');
    function select(entry, item) { selected = entry; files.querySelectorAll('.os-file').forEach(file => file.classList.toggle('is-selected', file === item)); content.querySelector('[data-file-properties]').disabled = !entry; content.querySelector('[data-status]').textContent = entry ? `${entry.name} · ${entry.folder ? 'File folder' : entry.href ? 'Document' : 'Program'}` : `${folders[current].entries.length} objects`; }
    function properties() {
      if (!selected) return;
      const detail = document.createElement('div'); detail.className = 'os-utility';
      const heading = document.createElement('h2'); heading.textContent = selected.name;
      const type = document.createElement('p'); type.textContent = `Type: ${selected.folder ? 'File folder' : selected.href ? 'Document' : 'Program'}`;
      const location = document.createElement('p'); location.textContent = `Location: ${folders[current].path}`;
      detail.append(heading, type, location); windows.open({ title: `${selected.name} Properties`, content: detail, icon: selected.icon });
    }
    function render(folder) {
      current = folder; const data = folders[folder];
      app.setTitle(data.title);
      content.querySelector('[data-address]').textContent = data.path;
      content.querySelector('[data-back]').disabled = folder === 'computer';
      content.querySelector('[data-up]').disabled = folder === 'computer';
      selected = null; content.querySelector('[data-file-properties]').disabled = true;
      content.querySelector('[data-status]').textContent = `${data.entries.length} objects`;
      files.replaceChildren();
      data.entries.forEach(entry => {
        const item = document.createElement(entry.href ? 'a' : 'button');
        item.className = 'os-file';
        if (entry.app) item.dataset.app = entry.app;
        if (entry.href) item.href = entry.href; else { item.type = 'button'; if (entry.folder) { item.dataset.folder = entry.folder; item.addEventListener('click', () => render(entry.folder)); } }
        const icon = document.createElement('img'); icon.alt = ''; icon.src = `/assets/icons/${entry.icon}.png`;
        const label = document.createElement('span'); label.textContent = entry.name;
        const type = document.createElement('small'); type.textContent = entry.folder ? 'File folder' : entry.href ? 'Document' : 'Program';
        item.append(icon, label, type); files.append(item);
        item.addEventListener('focus', () => select(entry, item));
        item.addEventListener('contextmenu', event => { event.preventDefault(); select(entry, item); properties(); });
      });
    }
    content.querySelector('[data-back]').addEventListener('click', () => { if (current !== 'computer') render('computer'); });
    content.querySelector('[data-up]').addEventListener('click', () => { if (current !== 'computer') render('computer'); });
    content.querySelector('[data-file-properties]').addEventListener('click', properties);
    content.querySelector('[data-view-icons]').addEventListener('click', () => { files.classList.remove('is-details'); content.querySelector('[data-view-icons]').setAttribute('aria-pressed', 'true'); content.querySelector('[data-view-details]').setAttribute('aria-pressed', 'false'); });
    content.querySelector('[data-view-details]').addEventListener('click', () => { files.classList.add('is-details'); content.querySelector('[data-view-icons]').setAttribute('aria-pressed', 'false'); content.querySelector('[data-view-details]').setAttribute('aria-pressed', 'true'); });
    render('computer');
  }
  const computerShortcut = shell.querySelector('[data-open-computer]');
  let shortcutPointer = '';
  shell.querySelector('.os-icons').addEventListener('pointerdown', event => { shortcutPointer = event.pointerType; });
  computerShortcut.addEventListener('click', event => { if (event.detail === 0 || shortcutPointer === 'touch') openComputer(); });
  computerShortcut.addEventListener('dblclick', () => { if (shortcutPointer !== 'touch') openComputer(); });
  shell.querySelectorAll('.os-icons a').forEach(shortcut => {
    shortcut.addEventListener('click', event => {
      if (event.detail > 0 && shortcutPointer !== 'touch' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); event.stopPropagation(); }
    });
    shortcut.addEventListener('dblclick', () => shortcut.click());
  });
  shell.querySelector('[data-menu-computer]').addEventListener('click', openComputer);
  shell.querySelector('[data-restart]').addEventListener('click', () => { setMenu(false); layer.querySelectorAll('[data-window-close]').forEach(button => button.click()); layer.replaceChildren(); tasks.replaceChildren(); startBoot(); });
  function hideDesktop() { if (!shell.hidden) shell.dispatchEvent(new Event('desktop:leaving')); shell.hidden = true; document.body.classList.remove('os-active'); }
  function route() { const active = location.pathname === '/' && !location.hash; if (active) { shell.hidden = false; document.body.classList.add('os-active'); } else hideDesktop(); }
  shell.addEventListener('click', event => { const a = event.target.closest('a'); if (!a || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (a.target && a.target !== '_self') || a.hasAttribute('download')) return; if (a.getAttribute('href')?.startsWith('/#')) hideDesktop(); });
  window.addEventListener('hashchange', route); window.addEventListener('popstate', route);
  window.addEventListener('resize', () => { layer.querySelectorAll('[data-window]').forEach(win => { if (win.dataset.maximized === 'true') return; const area = layer.getBoundingClientRect(); const width = Math.min(win.offsetWidth, area.width), height = Math.min(win.offsetHeight, area.height); win.style.width = `${width}px`; win.style.height = `${height}px`; win.style.left = `${Math.max(0, Math.min(parseFloat(win.style.left) || 0, area.width - width))}px`; win.style.top = `${Math.max(0, Math.min(parseFloat(win.style.top) || 0, area.height - height))}px`; }); });
})();
