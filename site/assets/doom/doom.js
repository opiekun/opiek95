(() => {
  'use strict';
  const canvas = document.getElementById('canvas');
  const launcher = document.getElementById('launcher');
  const play = document.getElementById('play');
  const status = document.getElementById('status');
  const gameData = document.getElementById('game-data');
  let loaded = false;
  let started = false;
  let selectedWad = gameData.value;
  let saveDatabase = null;

  function openSaveDatabase() {
    if (!window.indexedDB) return Promise.resolve(null);
    return new Promise(resolve => {
      const databaseName = selectedWad === 'freedoom1.wad' ? 'opiek95-freedoom-saves' : 'opiek95-doom-shareware-saves';
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('files', { keyPath: 'name' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  async function restoreSaves() {
    saveDatabase = await openSaveDatabase();
    if (!saveDatabase) return;
    await new Promise(resolve => {
      const request = saveDatabase.transaction('files', 'readonly').objectStore('files').getAll();
      request.onsuccess = () => {
        for (const file of request.result) {
          if (!/^[a-z0-9_-]+\.dsg$/i.test(file.name) || !file.data) continue;
          window.Module.FS.createDataFile('/savefiles', file.name, new Uint8Array(file.data), true, true, true);
        }
        resolve();
      };
      request.onerror = () => resolve();
    });
  }

  function persistSaves() {
    if (!saveDatabase || !started) return;
    const files = window.Module.FS.readdir('/savefiles').filter(name => /^[a-z0-9_-]+\.dsg$/i.test(name));
    if (!files.length) return;
    const store = saveDatabase.transaction('files', 'readwrite').objectStore('files');
    for (const name of files) store.put({ name, data: window.Module.FS.readFile(`/savefiles/${name}`) });
  }

  function ready() {
    loaded = true;
    play.disabled = false;
    play.textContent = 'Play';
    status.textContent = 'Ready. Click Play, then use the keyboard or touch controls.';
  }

  window.Module = {
    canvas,
    noInitialRun: true,
    noExitRuntime: true,
    print: () => {},
    printErr: message => { status.textContent = String(message); },
    preRun() {
      const fs = window.Module.FS;
      fs.mkdir('/savefiles');
      fs.createPreloadedFile('', selectedWad, selectedWad, true, true);
      fs.createPreloadedFile('', 'default.cfg', 'default.cfg', true, true);
    },
    onRuntimeInitialized() { restoreSaves().then(ready); },
    onExit: code => { status.textContent = `Game exited (${code}).`; launcher.hidden = false; }
  };

  play.addEventListener('click', () => {
    if (!loaded) {
      play.disabled = true;
      selectedWad = gameData.value;
      gameData.disabled = true;
      status.textContent = 'Loading engine and game data…';
      const script = document.createElement('script');
      script.src = 'websockets-doom.js';
      script.addEventListener('error', () => { status.textContent = 'Could not load the game engine.'; play.disabled = false; gameData.disabled = false; });
      document.body.append(script);
      return;
    }
    if (started) return;
    try {
      canvas.focus();
      window.callMain(['-iwad', selectedWad, '-window', '-nogui', '-nomusic', '-config', 'default.cfg', '-savedir', '/savefiles']);
      started = true;
      launcher.hidden = true;
      setInterval(persistSaves, 5000);
    } catch (error) {
      status.textContent = `Could not start game: ${error.message}`;
      play.disabled = false;
    }
  });
  window.addEventListener('pagehide', persistSaves);

  const keys = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Control: 17, Space: 32, Shift: 16, Enter: 13, Escape: 27 };
  const keyNames = { Control: 'Control', Space: ' ', Shift: 'Shift' };
  function sendKey(type, name) {
    const code = keys[name];
    const event = new KeyboardEvent(type, { key: keyNames[name] || name, code: name, bubbles: true, cancelable: true });
    Object.defineProperties(event, { keyCode: { get: () => code }, which: { get: () => code } });
    document.dispatchEvent(event);
    canvas.dispatchEvent(event);
  }
  document.querySelectorAll('[data-key]').forEach(button => {
    const name = button.dataset.key;
    const release = () => { if (!button.classList.contains('is-down')) return; button.classList.remove('is-down'); sendKey('keyup', name); };
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); button.classList.add('is-down'); sendKey('keydown', name); });
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
  });
})();
