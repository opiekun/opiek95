(() => {
  'use strict';
  const desktop = window.opiekunDesktop;
  const shell = document.querySelector('[data-desktop-shell]');
  if (!desktop || !shell) return;
  const workspace = shell.querySelector('[data-desktop]');
  const icons = shell.querySelector('.os-icons');
  const startMenu = shell.querySelector('[data-start-menu]');
  const start = shell.querySelector('[data-start]');
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const closeMenu = () => { startMenu.hidden = true; start.setAttribute('aria-expanded', 'false'); };
  const open = (title, content, icon = 'computer-2') => desktop.windows.open({ title, content, icon });
  const panel = html => { const node = document.createElement('div'); node.className = 'os-utility'; node.innerHTML = html; return node; };
  const launchPortfolio = name => { const target = shell.querySelector(`[data-menu-app="${name}"]`); if (target) target.click(); };

  const wallpapers = { teal: '#087c80', navy: '#173879', plum: '#694358', forest: '#315e50' };
  const images = [
    'Windows 95 4K.jpg', 'Windows 95 Install 4K.jpg', 'Baseball 4K.jpg',
    'Chess 4K.jpg', 'Dangerous Creatures 4K.jpg', 'da Vinci 4K.jpg',
    'Inside 4K.jpg', 'Jungle 4K.jpg', 'More Windows 4K.jpg', 'Mystery 4K.jpg',
    'Nature 4K.jpg', 'Paper 4K.jpg', 'Party 4K.jpg', 'Party 4K (Circles).jpg',
    'Ribbons 4K.jpg', 'Science 4K.jpg', 'Space 4K.jpg', 'Sports 4K.jpg',
    'The Golden Era 4K.jpg', 'Travel 4K.jpg', 'Underwater 4K.jpg'
  ];
  let wallpaperRequest = 0;
  const wallpaperUrl = name => `/assets/wallpapers/${encodeURIComponent(name).replace(/[!'()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)}`;
  function applyWallpaper(name) {
    const image = images.includes(name);
    const choice = image || Object.hasOwn(wallpapers, name) ? name : 'teal';
    const request = ++wallpaperRequest;
    const url = image ? wallpaperUrl(choice) : '';
    workspace.style.backgroundColor = image ? '#080d12' : wallpapers[choice];
    workspace.style.backgroundImage = image ? `url("${url}")` : 'none';
    workspace.style.backgroundSize = 'cover';
    workspace.style.backgroundPosition = 'center center';
    workspace.style.backgroundRepeat = 'no-repeat';
    workspace.dataset.wallpaper = choice;
    const label = workspace.querySelector('.os-wallpaper-label');
    if (label) label.hidden = image;
    if (image) {
      const preload = new Image();
      preload.onerror = () => {
        if (request === wallpaperRequest) workspace.style.backgroundColor = wallpapers.teal;
      };
      preload.src = url;
    }
  }
  applyWallpaper(get('opiekun-wallpaper') ?? 'Windows 95 4K.jpg');
  function afterDarkStage() {
    const stage = document.createElement('span');
    stage.className = 'os-after-dark-stage';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = '<span class="os-ad-warp"></span><span class="os-ad-ball"></span><span class="os-ad-rain"></span>';
    const warp = stage.querySelector('.os-ad-warp');
    for (let i = 0; i < 6; i++) warp.append(document.createElement('i'));
    const rain = stage.querySelector('.os-ad-rain');
    for (let i = 0; i < 28; i++) { const drop = document.createElement('i'); drop.style.setProperty('--x', `${(i * 37) % 97}%`); drop.style.setProperty('--delay', `${-((i * 13) % 31) / 10}s`); drop.style.setProperty('--duration', `${0.8 + (i % 5) * 0.15}s`); rain.append(drop); }
    return stage;
  }
  function settings() {
    const content = panel(`<div class="os-property-tabs" role="tablist" aria-label="Display settings"><button type="button" role="tab" data-display-tab="background" aria-selected="true">Background</button><button type="button" role="tab" data-display-tab="screen-saver" aria-selected="false">Screen Saver</button><button type="button" role="tab" data-display-tab="appearance" aria-selected="false">Appearance</button><button type="button" role="tab" data-display-tab="settings" aria-selected="false">Settings</button></div>
      <div class="os-display-body"><div class="os-display-preview"><div class="os-display-monitor" data-display-monitor><div class="os-display-screen" data-display-screen><img src="/assets/icons/computer-2.png" alt=""><span class="os-display-label">opiekun 95</span><div class="os-display-mini-window"><b>My Computer</b><i>▣　▣　▣</i></div><small>Start　▤　　　　　　　12:00</small></div></div><div class="os-display-monitor-stand"></div></div>
      <div class="os-appearance-preview" data-appearance-preview hidden><div class="os-preview-inactive">Inactive Window <span>_ □ ×</span></div><div class="os-preview-active">Active Window <span>_ □ ×</span></div><div class="os-preview-menu">Normal　<span>Disabled</span>　<em>Selected</em></div><div class="os-preview-paper">Window Text<div class="os-preview-scrollbar">▲<br>▼</div></div><div class="os-preview-message"><b>Message Box <span>×</span></b><p>Message Text</p><span class="os-preview-ok">OK</span></div></div>
      <div class="os-display-page" data-display-page="background"><div class="os-display-columns"><fieldset><legend>Pattern</legend><select size="5" aria-label="Pattern" disabled><option>(None)</option><option>50% Gray</option><option>Boxes</option><option>Bricks</option></select></fieldset><fieldset><legend>Wallpaper</legend><select size="5" data-wallpaper aria-label="Wallpaper"><option value="teal">Classic teal</option><option value="navy">Navy</option><option value="plum">Plum</option><option value="forest">Forest</option></select></fieldset></div></div>
      <div class="os-display-page" data-display-page="screen-saver" hidden><fieldset><legend>Screen Saver</legend><div class="os-display-row"><select data-screen-saver aria-label="Screen saver"><option value="none">(None)</option><option value="warp">Warp</option><option value="bounce">Bouncing Ball</option><option value="rain">Hard Rain</option></select><button type="button" data-screen-saver-preview>Preview</button></div><label class="os-display-muted"><input type="checkbox" disabled> Password protected</label><label class="os-display-muted">Wait: <input type="number" min="1" max="60" value="1" disabled> minutes · Preview only</label></fieldset><fieldset disabled><legend>Energy saving features of monitor</legend><label><input type="checkbox"> Low-power standby</label><label><input type="checkbox"> Shut off monitor</label></fieldset></div>
      <div class="os-display-page os-appearance-options" data-display-page="appearance" hidden><div class="os-display-row"><label>Scheme: <select data-window-color><option value="classic">Windows Standard</option><option value="slate">Slate</option><option value="sand">Sand</option></select></label><button type="button" disabled>Save As...</button><button type="button" data-appearance-delete disabled>Delete</button></div><div class="os-display-row os-display-muted"><label>Item: <select data-appearance-item disabled><option>Desktop</option></select></label><label class="os-appearance-small">Size: <input type="number" disabled></label><label class="os-appearance-small">Color: <button type="button" class="os-appearance-color" aria-label="Desktop color" disabled></button></label></div><div class="os-display-row os-display-muted"><label>Font: <select data-appearance-font disabled><option>MS Sans Serif</option></select></label><label class="os-appearance-small">Size: <select disabled><option></option></select></label><label class="os-appearance-small">Color: <button type="button" class="os-appearance-color" aria-label="Font color" disabled></button></label><button type="button" disabled>B</button><button type="button" disabled><i>I</i></button></div></div>
      <div class="os-display-page" data-display-page="settings" hidden><div class="os-display-columns"><fieldset><legend>Color palette</legend><select disabled><option>True Color (32 bit)</option></select><div class="os-color-spectrum"></div></fieldset><fieldset><legend>Desktop area</legend><span>Less</span><input type="range" min="0" max="100" value="50" disabled><span>More</span><p data-desktop-area></p></fieldset></div><fieldset disabled><legend>Font size</legend><select><option>Small Fonts</option></select><button type="button">Custom...</button></fieldset><p>Resolution is controlled by your browser.</p></div></div>
      <p class="os-display-status" role="status" aria-live="polite">Choose a background for your desktop.</p><div class="os-display-actions"><button type="button" data-display-ok>OK</button><button type="button" data-display-cancel>Cancel</button><button type="button" data-display-apply disabled>Apply</button></div>`);
    content.classList.add('os-display-dialog');
    content.dataset.activeTab = 'background';
    const imageGroup = document.createElement('optgroup'); imageGroup.label = 'Wallpapers';
    images.forEach(name => { const option = document.createElement('option'); option.value = name; option.textContent = name.replace(/ 4K\.jpg$/, ''); imageGroup.append(option); });
    const select = content.querySelector('[data-wallpaper]'); select.append(imageGroup); select.value = workspace.dataset.wallpaper;
    const color = content.querySelector('[data-window-color]'); color.value = shell.dataset.windowColor;
    const saver = content.querySelector('[data-screen-saver]'); saver.value = get('opiekun-screen-saver') || 'none'; if (!saver.value) saver.value = 'none';
    const screen = content.querySelector('[data-display-screen]');
    screen.append(afterDarkStage());
    const status = content.querySelector('[role=status]');
    const apply = content.querySelector('[data-display-apply]');
    const overlay = document.createElement('button'); overlay.type = 'button'; overlay.className = 'os-screen-saver'; overlay.dataset.screenSaverOverlay = ''; overlay.hidden = true; overlay.setAttribute('aria-label', 'Exit screen saver preview'); overlay.append(afterDarkStage()); shell.append(overlay);
    const restoreStorage = (key, value) => { try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch {} };
    let baseline = { wallpaper: workspace.dataset.wallpaper, wallpaperStored: get('opiekun-wallpaper'), color: shell.dataset.windowColor, colorStored: get('opiekun-window-color'), saver: saver.value, saverStored: get('opiekun-screen-saver') };
    let confirmed = false;
    function preview() {
      const active = content.querySelector('[data-display-tab][aria-selected="true"]').dataset.displayTab;
      const name = select.value, image = images.includes(name);
      screen.dataset.saver = active === 'screen-saver' ? saver.value : 'none';
      screen.style.backgroundColor = image ? '#087c80' : (wallpapers[name] || wallpapers.teal);
      if (active === 'screen-saver' && saver.value !== 'none') screen.style.removeProperty('background-image');
      else screen.style.backgroundImage = image ? `url("${wallpaperUrl(name)}")` : 'none';
      content.querySelector('[data-screen-saver-preview]').disabled = saver.value === 'none';
    }
    function revert() { applyWallpaper(baseline.wallpaper); applyWindowColor(baseline.color); restoreStorage('opiekun-wallpaper', baseline.wallpaperStored); restoreStorage('opiekun-window-color', baseline.colorStored); restoreStorage('opiekun-screen-saver', baseline.saverStored); }
    select.addEventListener('change', () => { applyWallpaper(select.value); preview(); status.textContent = set('opiekun-wallpaper', select.value) ? 'Wallpaper changed. Click Apply to keep it.' : 'Wallpaper changed for this session.'; apply.disabled = false; });
    color.addEventListener('change', () => { applyWindowColor(color.value); status.textContent = set('opiekun-window-color', color.value) ? 'Scheme changed. Click Apply to keep it.' : 'Scheme changed for this session.'; apply.disabled = false; });
    saver.addEventListener('change', () => { preview(); status.textContent = set('opiekun-screen-saver', saver.value) ? 'Screen saver preview selected.' : 'Screen saver preview selected for this session.'; apply.disabled = false; });
    content.querySelectorAll('[data-display-tab]').forEach(button => button.addEventListener('click', () => {
      content.querySelectorAll('[data-display-tab]').forEach(tab => tab.setAttribute('aria-selected', String(tab === button)));
      content.dataset.activeTab = button.dataset.displayTab;
      content.querySelectorAll('[data-display-page]').forEach(page => { page.hidden = page.dataset.displayPage !== button.dataset.displayTab; });
      content.querySelector('[data-display-monitor]').parentElement.hidden = button.dataset.displayTab === 'appearance';
      content.querySelector('[data-appearance-preview]').hidden = button.dataset.displayTab !== 'appearance';
      status.textContent = { background: 'Choose a background for your desktop.', 'screen-saver': 'Choose a screen saver to preview.', appearance: 'Choose a window color scheme.', settings: 'Browser controls the desktop resolution.' }[button.dataset.displayTab];
      preview();
    }));
    content.querySelector('.os-property-tabs').addEventListener('keydown', event => {
      const tabs = [...content.querySelectorAll('[data-display-tab]')];
      const index = tabs.indexOf(event.target);
      if (index < 0) return;
      const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault(); tabs[(next + tabs.length) % tabs.length].click(); tabs[(next + tabs.length) % tabs.length].focus();
    });
    content.querySelector('[data-desktop-area]').textContent = `${innerWidth} by ${innerHeight} pixels`;
    content.querySelector('[data-screen-saver-preview]').addEventListener('click', () => { overlay.dataset.mode = saver.value; overlay.hidden = false; overlay.focus(); });
    overlay.addEventListener('click', () => { overlay.hidden = true; content.querySelector('[data-screen-saver-preview]').focus(); });
    overlay.addEventListener('keydown', event => { if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); overlay.click(); } });
    const app = desktop.windows.open({ title: 'Display Properties', content, icon: 'display_properties-2', onClose() { if (!confirmed) revert(); overlay.remove(); } });
    const area = shell.querySelector('[data-window-layer]').getBoundingClientRect();
    const width = area.width || innerWidth, height = area.height || innerHeight - 32;
    app.element.style.width = `${Math.min(420, width)}px`; app.element.style.height = `${Math.min(460, height)}px`;
    app.place();
    content.querySelector('[data-display-cancel]').addEventListener('click', () => app.element.querySelector('[data-window-close]').click());
    content.querySelector('[data-display-ok]').addEventListener('click', () => { confirmed = true; app.element.querySelector('[data-window-close]').click(); });
    apply.addEventListener('click', () => { baseline = { wallpaper: workspace.dataset.wallpaper, wallpaperStored: get('opiekun-wallpaper'), color: shell.dataset.windowColor, colorStored: get('opiekun-window-color'), saver: saver.value, saverStored: get('opiekun-screen-saver') }; apply.disabled = true; status.textContent = 'Changes saved.'; });
    preview();
  }
  function applyWindowColor(value) { shell.dataset.windowColor = ['slate', 'sand'].includes(value) ? value : 'classic'; }
  applyWindowColor(get('opiekun-window-color'));
  function sounds() {
    const content = panel('<h2>Sounds Properties</h2><p>System sounds</p><label><input type="checkbox" data-startup-enabled> Play startup sound</label><div class="os-utility-toolbar"><button type="button" data-sound-preview>Preview</button><span role="status" aria-live="polite"></span></div>');
    const enabled = content.querySelector('[data-startup-enabled]'); enabled.checked = get('opiekun-startup-sound') !== '0';
    enabled.addEventListener('change', () => { set('opiekun-startup-sound', enabled.checked ? '1' : '0'); content.querySelector('[role=status]').textContent = 'Preference saved.'; });
    content.querySelector('[data-sound-preview]').addEventListener('click', () => { const audio = shell.querySelector('[data-login-sound]'); audio.currentTime = 0; Promise.resolve(audio.play()).catch(() => { content.querySelector('[role=status]').textContent = 'Sound could not play.'; }); });
    open('Sounds Properties', content);
  }
  function dateTime() {
    const now = new Date();
    const content = panel('<h2>Date/Time Properties</h2><p data-current-date></p><p data-current-time></p><p>Time shown from your device. Change it in your system settings.</p>');
    content.querySelector('[data-current-date]').textContent = now.toLocaleDateString([], { dateStyle: 'full' });
    content.querySelector('[data-current-time]').textContent = now.toLocaleTimeString();
    open('Date/Time Properties', content);
  }
  function controlPanel() {
    const content = document.createElement('div'); content.className = 'os-control-panel';
    content.innerHTML = '<div class="os-control-menubar" data-control-menubar><details><summary>File</summary><div><button type="button" data-control-close>Close</button></div></details><details><summary>View</summary><div><button type="button" data-control-view="icons">Large Icons</button><button type="button" data-control-view="list">List</button></div></details><details><summary>Help</summary><div><button type="button" data-control-help>About Control Panel</button></div></details></div><div class="os-control-grid" data-control-grid></div><div class="os-control-status" data-control-status role="status">Select an icon to view its description.</div>';
    const items = [
      ['Accessibility Options', 'accessibility', 'accessibility', 'Accessibility options are unavailable in this simulation.'],
      ['Add New Hardware', 'hardware', 'hardware', 'Hardware settings are unavailable in this simulation.'],
      ['Add/Remove Programs', 'programs', 'programs', 'Program installation is unavailable in this simulation.'],
      ['Date/Time', 'date', 'date-time', 'Displays the date and time from your device.'],
      ['Display', 'display', 'display', 'Changes your desktop background and window appearance.'],
      ['Fonts', 'fonts', 'fonts', 'Font management is unavailable in this simulation.'],
      ['Internet', 'internet', 'internet', 'Internet settings are unavailable in this simulation.'],
      ['Keyboard', 'keyboard', 'keyboard', 'Keyboard settings are unavailable in this simulation.'],
      ['Mail', 'mail', 'mail', 'Mail settings are unavailable in this simulation.'],
      ['Mouse', 'mouse', 'mouse', 'Mouse settings are unavailable in this simulation.'],
      ['Multimedia', 'multimedia', 'multimedia', 'Multimedia settings are unavailable in this simulation.'],
      ['Network', 'network', 'network', 'Network settings are unavailable in this simulation.'],
      ['Passwords', 'passwords', null, 'Password settings are unavailable in this simulation.'],
      ['Power', 'power', 'power', 'Power settings are unavailable in this simulation.'],
      ['Printers', 'printers', 'printers', 'Printer settings are unavailable in this simulation.'],
      ['Regional Settings', 'regional', 'regional', 'Regional settings are unavailable in this simulation.'],
      ['Sounds', 'sounds', 'sounds', 'Changes the startup sound preference.'],
      ['System', 'system', null, 'System hardware details are unavailable in this simulation.']
    ];
    const grid = content.querySelector('[data-control-grid]');
    items.forEach(([label, action, image, description]) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'os-control-item'; button.dataset.control = action; button.dataset.description = description;
      const icon = document.createElement('img'); icon.alt = ''; icon.src = image ? `/assets/icons/control-panel/${image}.png` : `/assets/icons/${action === 'system' ? 'computer-2' : 'users-0'}.png`;
      const caption = document.createElement('span'); caption.textContent = label; button.append(icon, caption); grid.append(button);
    });
    const controls = { display: settings, sounds, date: dateTime };
    const status = content.querySelector('[data-control-status]');
    content.addEventListener('focusin', event => { const button = event.target.closest('[data-control]'); if (button) status.textContent = button.dataset.description; });
    content.addEventListener('click', event => { const button = event.target.closest('[data-control]'); if (!button) return; if (controls[button.dataset.control]) controls[button.dataset.control](); else status.textContent = button.dataset.description; });
    const app = open('Control Panel', content, 'display_properties-2');
    const area = shell.querySelector('[data-window-layer]').getBoundingClientRect();
    const width = area.width || innerWidth, height = area.height || innerHeight - 32;
    app.element.style.width = `${Math.min(450, width)}px`;
    app.element.style.height = `${Math.min(420, height)}px`;
    app.place();
    content.querySelector('[data-control-close]').addEventListener('click', () => app.element.querySelector('[data-window-close]').click());
    content.querySelectorAll('[data-control-view]').forEach(button => button.addEventListener('click', () => { grid.classList.toggle('is-list', button.dataset.controlView === 'list'); status.textContent = button.dataset.controlView === 'list' ? 'List view.' : 'Large icons view.'; }));
    content.querySelector('[data-control-help]').addEventListener('click', () => { status.textContent = 'Control Panel contains simulated settings for this desktop.'; });
  }
  function notepad() {
    const content = panel('<div class="os-utility-toolbar"><button type="button" data-note-save>Save</button><button type="button" data-note-clear>Clear</button><span role="status" aria-live="polite"></span></div><label class="os-note-label">Notepad<textarea data-notepad aria-label="Notepad text"></textarea></label>');
    const text = content.querySelector('textarea'); text.value = get('opiekun-notepad') || '';
    content.querySelector('[data-note-save]').addEventListener('click', () => { content.querySelector('[role=status]').textContent = set('opiekun-notepad', text.value) ? 'Saved on this device.' : 'Unable to save on this device.'; });
    content.querySelector('[data-note-clear]').addEventListener('click', () => { text.value = ''; text.focus(); });
    open('Notepad', content, 'notepad-1'); text.focus();
  }
  function about() { open('About opiekun 95', panel('<h2>opiekun 95</h2><p>Explore the journal, projects, Resume and Music Player from the desktop or Start menu.</p>')); }
  function help() { open('Help', panel('<h2>Desktop Help</h2><p>Double-click a desktop shortcut, or focus it and press Enter. On touch screens, tap once. Drag shortcuts to move them; positions are saved on this device.</p><p>Use the title bar to move a window, the corner to resize it, and the taskbar to restore a minimized window. Arrow keys also move or resize focused controls.</p><p>Right-click the desktop to arrange icons or open Display Properties. Right-click a shortcut to open it or move it to the Recycle Bin. Run accepts notepad, control, explorer, help and about.</p>')); }
  function documents() {
    const content = panel('<h2>Documents</h2><p>Open a portfolio document:</p><div class="os-utility-list"><button type="button" data-document="journal">Journal</button><button type="button" data-document="projects">Projects</button><button type="button" data-document="about">About</button><button type="button" data-document="resume">Resume</button></div>');
    content.addEventListener('click', event => { const button = event.target.closest('[data-document]'); if (button) launchPortfolio(button.dataset.document); }); open('Documents', content, 'directory_closed-0');
  }
  function find() {
    const content = panel('<h2>Find</h2><label>Find a portfolio item <input type="search" data-find placeholder="Search documents"></label><div class="os-utility-list" data-results></div><p role="status" aria-live="polite"></p>');
    const items = [['Journal', 'journal'], ['Projects', 'projects'], ['About', 'about'], ['Resume', 'resume'], ['Music Player', 'music']];
    function render() { const query = content.querySelector('input').value.trim().toLowerCase(), results = content.querySelector('[data-results]'); results.replaceChildren(); const matches = items.filter(([name]) => name.toLowerCase().includes(query)); matches.forEach(([name, id]) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = name; button.addEventListener('click', () => launchPortfolio(id)); results.append(button); }); content.querySelector('[role=status]').textContent = `${matches.length} results`; }
    content.querySelector('input').addEventListener('input', render); render(); open('Find', content); content.querySelector('input').focus();
  }
  function dosPrompt() {
    const content = panel('<div class="os-dos-output" data-dos-output aria-live="polite"></div><form data-dos-form><label><span data-dos-path>C:\\&gt;</span> <input name="command" aria-label="DOS command" autocomplete="off" spellcheck="false"></label></form>');
    content.classList.add('os-dos');
    const output = content.querySelector('[data-dos-output]');
    const input = content.querySelector('input');
    let folder = '';
    const entries = { '': ['PORTFOLIO    <DIR>', 'PROFILE.PDF   DOC', 'MUSIC.EXE     APP'], PORTFOLIO: ['JOURNAL.TXT   DOC', 'PROJECTS.TXT  DOC', 'ABOUT.TXT     DOC', 'RESUME.TXT    DOC'] };
    const textFiles = { 'JOURNAL.TXT': 'Personal notes and articles. Open Journal from Start.', 'PROJECTS.TXT': 'Selected work. Open Projects from Start.', 'ABOUT.TXT': 'About Matheus. Open About from Start.', 'RESUME.TXT': 'Open Resume from Start.' };
    const write = value => { const line = document.createElement('div'); line.textContent = value; output.append(line); output.scrollTop = output.scrollHeight; };
    function neofetch() {
      const logo = [String.raw`  /\___/\  `, ' (  o o  ) ', String.raw` /  ===  \ `, String.raw` \  ---  / `, String.raw`  \_____/  `];
      const user = shell.querySelector('[name="username"]')?.value.trim() || 'Guest';
      const details = [
        `${user}@opiekun95`, '--------------------', 'OS:         opiekun 95',
        'Host:       Browser desktop', 'Shell:      opiekun DOS 7.0',
        `Resolution: ${innerWidth}x${innerHeight}`, `Wallpaper:  ${workspace.dataset.wallpaper}`,
        `Windows:    ${shell.querySelectorAll('[data-window]:not([hidden])').length}`
      ];
      details.forEach((detail, index) => write(`${(logo[index] || '').padEnd(12)} ${detail}`));
    }
    write('opiekun DOS 7.0'); write('Type HELP for available commands.');
    content.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const raw = input.value.trim(); input.value = '';
      write(`C:\\${folder ? `${folder}\\` : ''}>${raw}`);
      const [command = '', ...args] = raw.toUpperCase().split(/\s+/); const argument = args.join(' ');
      if (command === 'HELP') write('DIR  CD  TYPE  CLS  DATE  TIME  VER  NEOFETCH  HELP');
      else if (command === 'DIR') entries[folder].forEach(write);
      else if (command === 'CD') { if (!argument || argument === '\\') folder = ''; else if (argument === '..') folder = ''; else if (argument === 'PORTFOLIO' && !folder) folder = 'PORTFOLIO'; else write('Invalid directory'); }
      else if (command === 'TYPE') write(folder === 'PORTFOLIO' && Object.hasOwn(textFiles, argument) ? textFiles[argument] : 'File not found');
      else if (command === 'CLS') output.replaceChildren();
      else if (command === 'DATE') write(new Date().toLocaleDateString());
      else if (command === 'TIME') write(new Date().toLocaleTimeString());
      else if (command === 'VER') write('opiekun DOS 7.0');
      else if (command === 'NEOFETCH') neofetch();
      else if (command) write('Bad command or file name');
      content.querySelector('[data-dos-path]').textContent = `C:\\${folder ? `${folder}\\` : ''}>`;
    });
    open('MS-DOS Prompt', content, 'executable-0'); input.focus();
  }
  function run() {
    const content = panel('<div class="os-run-intro"><img src="/assets/icons/executable-0.png" alt=""><p>Type the name of a program, folder, or document, and opiekun 95 will open it for you.</p></div><form data-run-form><div class="os-run-open"><label for="os-run-command">Open:</label><input id="os-run-command" name="command" autocomplete="off"><button type="button" data-run-history aria-label="Show recent commands" aria-expanded="false">▼</button></div><div class="os-run-options" data-run-options hidden></div><p class="os-run-status" role="status" aria-live="polite"></p><div class="os-run-actions"><button type="submit">OK</button><button type="button" data-run-cancel>Cancel</button><button type="button" data-run-browse>Browse...</button></div></form>');
    content.classList.add('os-run-dialog');
    const input = content.querySelector('[name="command"]');
    const options = content.querySelector('[data-run-options]');
    const choices = ['notepad', 'control', 'explorer', 'command', 'help', 'about'];
    const renderOptions = values => { options.replaceChildren(); values.forEach(value => { const button = document.createElement('button'); button.type = 'button'; button.dataset.runOption = value; button.textContent = value; button.addEventListener('click', () => { input.value = value; options.hidden = true; history.setAttribute('aria-expanded', 'false'); input.focus(); }); options.append(button); }); options.hidden = !values.length; };
    const history = content.querySelector('[data-run-history]');
    history.addEventListener('click', () => { const recent = (get('opiekun-run-history') || '').split(',').filter(value => choices.includes(value)); renderOptions(options.hidden ? recent : []); history.setAttribute('aria-expanded', String(!options.hidden)); });
    content.querySelector('[data-run-browse]').addEventListener('click', () => renderOptions(options.hidden ? choices : []));
    content.querySelector('form').addEventListener('submit', event => { event.preventDefault(); const command = event.currentTarget.elements.command.value.trim().toLowerCase().replace(/\.exe$/, ''); const commands = { notepad, control: controlPanel, explorer: () => shell.querySelector('[data-menu-computer]').click(), command: dosPrompt, cmd: dosPrompt, help, about }; if (Object.hasOwn(commands, command)) { content.querySelector('[role=status]').textContent = ''; set('opiekun-run-history', [command, ...(get('opiekun-run-history') || '').split(',').filter(value => value && value !== command)].slice(0, 6).join(',')); commands[command](); } else content.querySelector('[role=status]').textContent = `Command not found: ${event.currentTarget.elements.command.value}`; });
    const app = open('Run', content, 'executable-0');
    app.element.style.width = `${Math.min(360, shell.querySelector('[data-window-layer]').clientWidth || innerWidth)}px`;
    app.element.style.height = `${Math.min(185, shell.querySelector('[data-window-layer]').clientHeight || innerHeight - 32)}px`;
    app.place();
    app.element.classList.add('os-run-window');
    const controls = app.element.querySelector('.os-controls');
    const helpButton = document.createElement('button');
    helpButton.type = 'button'; helpButton.dataset.runHelp = ''; helpButton.setAttribute('aria-label', 'Run Help'); helpButton.textContent = '?';
    helpButton.addEventListener('click', () => { content.querySelector('[role=status]').textContent = `Available: ${choices.join(', ')}`; });
    controls.querySelector('[data-window-minimize]').replaceWith(helpButton);
    controls.querySelector('[data-window-maximize]').remove();
    app.element.querySelector('[data-resize]').hidden = true;
    content.querySelector('[data-run-cancel]').addEventListener('click', () => app.element.querySelector('[data-window-close]').click());
    input.focus();
  }

  const shortcuts = [...icons.children];
  const readIndices = key => { try { const value = JSON.parse(get(key) || '[]'); return Array.isArray(value) ? value.filter(index => Number.isInteger(index) && index >= 0 && index < shortcuts.length) : []; } catch { return []; } };
  let recycled = readIndices('opiekun-recycle-bin');
  let discarded = readIndices('opiekun-discarded-shortcuts');
  function syncBin() { shortcuts.forEach((item, index) => { item.hidden = recycled.includes(index) || discarded.includes(index); }); set('opiekun-recycle-bin', JSON.stringify(recycled)); set('opiekun-discarded-shortcuts', JSON.stringify(discarded)); }
  syncBin();
  const bin = document.createElement('button'); bin.type = 'button'; bin.className = 'os-icon'; bin.dataset.recycleBin = ''; bin.innerHTML = '<img src="/assets/icons/recycle_bin_empty-0.png" alt="">Recycle Bin'; icons.append(bin);
  const iconItems = [...icons.children];
  iconItems.forEach(item => { item.draggable = false; item.querySelectorAll('img').forEach(image => { image.draggable = false; }); });
  icons.addEventListener('dragstart', event => event.preventDefault());
  const iconKeys = ['computer', 'journal', 'projects', 'about', 'resume', 'music', 'recycle-bin'];
  let positions;
  try { positions = JSON.parse(get('opiekun-icon-positions') || '{}'); if (!positions || typeof positions !== 'object' || Array.isArray(positions)) positions = {}; } catch { positions = {}; }
  let autoArrange = get('opiekun-icon-auto-arrange') === '1';
  const iconArea = () => ({ width: icons.clientWidth || innerWidth, height: icons.clientHeight || innerHeight - 32 });
  const iconLimits = item => { const area = iconArea(); return { x: Math.max(0, area.width - (item.offsetWidth || 76)), y: Math.max(0, area.height - (item.offsetHeight || 64)) }; };
  const placeIcon = (item, x, y, limits = iconLimits(item)) => { const left = Math.max(0, Math.min(Math.round(x), limits.x)), top = Math.max(0, Math.min(Math.round(y), limits.y)); item.style.left = `${left}px`; item.style.top = `${top}px`; };
  const recordIcon = item => { const key = iconKeys[iconItems.indexOf(item)]; if (key) positions[key] = { x: parseFloat(item.style.left), y: parseFloat(item.style.top) }; };
  const savePositions = () => set('opiekun-icon-positions', JSON.stringify(positions));
  const gridPosition = (index, rows) => ({ x: 4 + Math.floor(index / rows) * 80, y: 8 + index % rows * 68 });
  function arrangeIcons(order = iconItems) {
    const area = iconArea(); const rows = Math.max(1, Math.floor((area.height - 8) / 68));
    order.forEach((item, index) => { const point = gridPosition(index, rows); placeIcon(item, point.x, point.y); recordIcon(item); });
    savePositions();
  }
  function lineUpIcons() {
    iconItems.forEach(item => { const x = parseFloat(item.style.left) || 0, y = parseFloat(item.style.top) || 0; placeIcon(item, 4 + Math.round((x - 4) / 80) * 80, 8 + Math.round((y - 8) / 68) * 68); recordIcon(item); });
    savePositions();
  }
  const initialRows = Math.max(1, Math.floor((iconArea().height - 8) / 68));
  iconItems.forEach((item, index) => { const point = positions[iconKeys[index]], fallback = gridPosition(index, initialRows); placeIcon(item, Number.isFinite(point?.x) && !autoArrange ? point.x : fallback.x, Number.isFinite(point?.y) && !autoArrange ? point.y : fallback.y); });
  if (autoArrange) arrangeIcons();
  let suppressIcon = null, suppressUntil = 0;
  document.addEventListener('click', event => { if (suppressIcon && Date.now() <= suppressUntil && suppressIcon.contains(event.target)) { event.preventDefault(); event.stopImmediatePropagation(); } suppressIcon = null; }, true);
  document.addEventListener('dblclick', event => { if (suppressIcon && Date.now() <= suppressUntil && suppressIcon.contains(event.target)) { event.preventDefault(); event.stopImmediatePropagation(); } suppressIcon = null; }, true);
  icons.addEventListener('pointerdown', event => {
    const item = event.target.closest('.os-icon');
    if (!item || event.button !== 0 || autoArrange) return;
    suppressIcon = null;
    const x = event.clientX, y = event.clientY, left = parseFloat(item.style.left), top = parseFloat(item.style.top);
    const limits = iconLimits(item);
    let moved = false;
    const move = e => {
      if (!moved && Math.hypot(e.clientX - x, e.clientY - y) < 4) return;
      moved = true; item.classList.add('is-dragging');
      placeIcon(item, left + e.clientX - x, top + e.clientY - y, limits);
    };
    const end = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end);
      item.classList.remove('is-dragging');
      if (moved) { recordIcon(item); savePositions(); suppressIcon = item; suppressUntil = Date.now() + 500; }
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  });
  window.addEventListener('resize', () => iconItems.forEach(item => placeIcon(item, parseFloat(item.style.left), parseFloat(item.style.top))));
  function recycleBin() {
    const content = panel('<h2>Recycle Bin</h2><p>Removed desktop shortcuts appear here. Original portfolio content is not deleted.</p><div class="os-utility-list" data-bin-items></div><button type="button" data-empty-bin>Empty Recycle Bin</button><p role="status" aria-live="polite"></p>');
    function render() { const list = content.querySelector('[data-bin-items]'); list.replaceChildren(); recycled.forEach(index => { const button = document.createElement('button'); button.type = 'button'; button.dataset.restoreItem = String(index); button.textContent = `Restore ${shortcuts[index].textContent.trim()}`; button.addEventListener('click', () => { recycled = recycled.filter(item => item !== index); syncBin(); render(); }); list.append(button); }); content.querySelector('[role=status]').textContent = recycled.length ? `${recycled.length} shortcut(s)` : 'Recycle Bin is empty.'; content.querySelector('[data-empty-bin]').disabled = !recycled.length; }
    content.querySelector('[data-empty-bin]').addEventListener('click', () => { if (!window.confirm('Permanently remove these desktop shortcuts from the Recycle Bin? The portfolio content remains available from Start.')) return; discarded = [...new Set([...discarded, ...recycled])]; recycled = []; syncBin(); render(); });
    render(); open('Recycle Bin', content, 'recycle_bin_empty-0');
  }
  let lastPointer = '';
  bin.addEventListener('pointerdown', event => { lastPointer = event.pointerType; });
  bin.addEventListener('click', event => { if (!event.detail || lastPointer === 'touch') recycleBin(); });
  bin.addEventListener('dblclick', () => { if (lastPointer !== 'touch') recycleBin(); });

  const context = document.createElement('div'); context.className = 'os-context-menu'; context.hidden = true; context.setAttribute('role', 'menu'); context.innerHTML = `
    <div data-context-desktop>
      <div class="os-context-submenu"><button type="button" role="menuitem" aria-haspopup="true">Arrange Icons</button><div role="menu" aria-label="Arrange Icons">
        <button type="button" role="menuitem" data-context-arrange="name">by Name</button>
        <button type="button" role="menuitem" data-context-arrange="type">by Type</button>
        <button type="button" role="menuitem" disabled>by Size</button>
        <button type="button" role="menuitem" disabled>by Date</button>
        <hr><button type="button" role="menuitemcheckbox" data-context-auto-arrange>Auto Arrange</button>
      </div></div>
      <button type="button" role="menuitem" data-context-lineup>Line Up Icons</button>
      <button type="button" role="menuitem" data-context-refresh>Refresh</button><hr>
      <button type="button" role="menuitem" disabled>Paste</button>
      <button type="button" role="menuitem" disabled>Paste Shortcut</button><hr>
      <button type="button" role="menuitem" disabled>New</button><hr>
      <button type="button" role="menuitem" data-context-properties>Properties</button>
    </div>
    <div data-context-icon hidden>
      <button type="button" role="menuitem" data-context-open><strong>Open</strong></button><hr>
      <button type="button" role="menuitem" disabled>Cut</button><button type="button" role="menuitem" disabled>Copy</button>
      <button type="button" role="menuitem" disabled>Create Shortcut</button><hr>
      <button type="button" role="menuitem" data-context-delete>Delete</button>
      <button type="button" role="menuitem" disabled>Rename</button><hr>
      <button type="button" role="menuitem" data-context-icon-properties>Properties</button>
    </div>`; workspace.append(context);
  let selected = null;
  workspace.addEventListener('contextmenu', event => {
    if (event.target.closest('[data-window], .os-taskbar, [data-start-menu], .os-context-menu')) return;
    event.preventDefault(); selected = event.target.closest('.os-icon');
    context.querySelector('[data-context-desktop]').hidden = !!selected;
    context.querySelector('[data-context-icon]').hidden = !selected;
    context.querySelector('[data-context-delete]').hidden = !selected || selected === bin;
    context.querySelector('[data-context-auto-arrange]').setAttribute('aria-checked', String(autoArrange));
    context.querySelector('.os-context-submenu').classList.remove('is-open');
    context.hidden = false;
    const width = context.offsetWidth || 190, height = context.offsetHeight || 230;
    const areaWidth = workspace.clientWidth || innerWidth;
    const left = Math.max(0, Math.min(event.clientX, areaWidth - width));
    context.classList.toggle('is-flipped', left + width + 155 > areaWidth);
    context.style.left = `${left}px`;
    context.style.top = `${Math.max(0, Math.min(event.clientY, (workspace.clientHeight || innerHeight) - 32 - height))}px`;
    context.querySelector(selected ? '[data-context-open]' : '[data-context-desktop] button:not(:disabled)').focus();
  });
  context.querySelector('[data-context-open]').addEventListener('click', () => { context.hidden = true; suppressIcon = null; selected?.click(); });
  const arrangeMenu = context.querySelector('.os-context-submenu');
  const arrangeButton = arrangeMenu.querySelector('[aria-haspopup]');
  arrangeButton.addEventListener('click', () => { arrangeMenu.classList.toggle('is-open'); if (arrangeMenu.classList.contains('is-open')) arrangeMenu.querySelector('[data-context-arrange]').focus(); });
  arrangeButton.addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); arrangeMenu.classList.add('is-open'); arrangeMenu.querySelector('[data-context-arrange]').focus(); } });
  arrangeMenu.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); arrangeMenu.classList.remove('is-open'); arrangeButton.focus(); } });
  context.querySelector('[data-context-delete]').addEventListener('click', () => { const index = shortcuts.indexOf(selected); if (index >= 0 && !recycled.includes(index)) recycled.push(index); syncBin(); context.hidden = true; bin.focus(); });
  context.querySelector('[data-context-properties]').addEventListener('click', () => { context.hidden = true; settings(); });
  context.querySelector('[data-context-icon-properties]').addEventListener('click', () => { if (!selected) return; context.hidden = true; const content = panel('<h2 data-shortcut-name></h2><p>Type: Desktop shortcut</p><p data-shortcut-target></p>'); const name = selected.textContent.trim(); content.querySelector('[data-shortcut-name]').textContent = name; content.querySelector('[data-shortcut-target]').textContent = selected.getAttribute('href') ? `Target: ${selected.getAttribute('href')}` : `Target: ${name}`; open(`${name} Properties`, content); });
  context.querySelectorAll('[data-context-arrange]').forEach(button => button.addEventListener('click', () => { const sorted = [...iconItems].sort((a, b) => button.dataset.contextArrange === 'name' ? a.textContent.localeCompare(b.textContent) : (a.tagName === 'BUTTON') - (b.tagName === 'BUTTON') || a.textContent.localeCompare(b.textContent)); arrangeIcons(sorted); context.hidden = true; }));
  context.querySelector('[data-context-lineup]').addEventListener('click', () => { lineUpIcons(); context.hidden = true; });
  context.querySelector('[data-context-refresh]').addEventListener('click', () => { applyWallpaper(workspace.dataset.wallpaper); context.hidden = true; });
  context.querySelector('[data-context-auto-arrange]').addEventListener('click', () => { autoArrange = !autoArrange; set('opiekun-icon-auto-arrange', autoArrange ? '1' : '0'); if (autoArrange) arrangeIcons(); context.hidden = true; });
  document.addEventListener('pointerdown', event => { if (!context.contains(event.target)) context.hidden = true; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !context.hidden) { context.hidden = true; (selected || start).focus(); } });

  const power = document.createElement('section'); power.className = 'os-power-off'; power.dataset.powerOff = ''; power.hidden = true; power.setAttribute('aria-label', 'Power off'); power.innerHTML = '<div><h1>It is now safe to close this page.</h1><p>opiekun 95 has shut down.</p><button type="button" data-power-restart>Restart</button></div>'; shell.append(power);
  power.querySelector('[data-power-restart]').addEventListener('click', () => { power.hidden = true; shell.querySelector('[data-restart]').click(); });
  function shutdown() { closeMenu(); context.hidden = true; shell.querySelectorAll('[data-window-close]').forEach(button => button.click()); workspace.hidden = true; power.hidden = false; power.querySelector('button').focus(); }
  const actions = { settings, sounds, dateTime, controlPanel, find, help, documents, run, notepad, dosPrompt, about, shutdown };
  const labels = { notepad: ['Notepad', 'notepad-1'], dosPrompt: ['MS-DOS Prompt', 'executable-0'], documents: ['Documents folder', 'directory_closed-0'], settings: ['Display', 'display_properties-2'], sounds: ['Sounds', 'media_player-0'], dateTime: ['Date/Time', 'display_properties-2'], controlPanel: ['Control Panel', 'display_properties-2'], find: ['Find', 'search_directory-2'], help: ['Help', 'help_book_computer-0'], run: ['Run…', 'executable-0'], about: ['About opiekun 95', 'users-0'], shutdown: ['Shut Down', 'shut_down_normal-0'] };
  const programs = shell.querySelector('.os-start-group [data-start-submenu]');
  const settingsMenu = shell.querySelector('[data-settings-group] [data-start-submenu]');
  const bottom = shell.querySelector('[data-start-utilities]');
  const destinations = { notepad: programs, dosPrompt: programs, documents: programs, settings: settingsMenu, sounds: settingsMenu, dateTime: settingsMenu, controlPanel: settingsMenu, find: bottom, help: bottom, run: bottom, about: bottom, shutdown: bottom };
  Object.entries(labels).forEach(([name, [label, icon]]) => { const button = document.createElement('button'); button.type = 'button'; button.dataset.utilityMenu = name; const image = document.createElement('img'); image.src = `/assets/icons/${icon}.png`; image.alt = ''; button.append(image, document.createTextNode(label)); button.addEventListener('click', () => { closeMenu(); actions[name](); }); destinations[name].append(button); });
  const taskbar = shell.querySelector('[data-taskbar]');
  const clock = shell.querySelector('[data-clock]');
  function showTaskbarClock() { clock.hidden = get('opiekun-show-clock') === '0'; }
  showTaskbarClock();
  function taskbarProperties() {
    const content = panel('<h2>Taskbar Properties</h2><label><input type="checkbox" data-show-clock> Show clock</label><p role="status" aria-live="polite"></p>');
    const checkbox = content.querySelector('[data-show-clock]'); checkbox.checked = !clock.hidden;
    checkbox.addEventListener('change', () => { set('opiekun-show-clock', checkbox.checked ? '1' : '0'); showTaskbarClock(); content.querySelector('[role=status]').textContent = 'Preference saved.'; });
    open('Taskbar Properties', content);
  }
  const taskMenu = document.createElement('div'); taskMenu.className = 'os-task-context os-context-menu'; taskMenu.hidden = true;
  taskMenu.innerHTML = '<button type="button" data-task-tile="vertical">Tile Windows Vertically</button><button type="button" data-task-tile="horizontal">Tile Windows Horizontally</button><button type="button" data-task-minimize>Minimize All Windows</button><hr><button type="button" data-task-properties>Properties</button>';
  workspace.append(taskMenu);
  taskbar.addEventListener('contextmenu', event => { event.preventDefault(); context.hidden = true; closeMenu(); const rect = workspace.getBoundingClientRect(); taskMenu.style.left = `${Math.max(0, Math.min(event.clientX - rect.left, rect.width - 210))}px`; taskMenu.style.bottom = '32px'; taskMenu.hidden = false; taskMenu.querySelector('[data-task-tile]').focus(); });
  taskMenu.addEventListener('click', event => { const button = event.target.closest('button'); if (!button) return; taskMenu.hidden = true; if (button.dataset.taskTile) desktop.windows.tile(button.dataset.taskTile); else if (button.hasAttribute('data-task-minimize')) shell.querySelectorAll('[data-window]:not([hidden]) [data-window-minimize]').forEach(control => control.click()); else if (button.hasAttribute('data-task-properties')) taskbarProperties(); });
  workspace.addEventListener('pointerdown', event => { if (!taskMenu.contains(event.target)) taskMenu.hidden = true; });
  workspace.addEventListener('contextmenu', event => { if (!taskbar.contains(event.target)) taskMenu.hidden = true; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !taskMenu.hidden) { taskMenu.hidden = true; start.focus(); } });
  shell.querySelector('[data-clock]').addEventListener('click', dateTime);
})();
