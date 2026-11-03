(() => {
  'use strict';

  const transport = document.getElementById('music-player');
  const toggle = document.getElementById('music-toggle');
  const audio = document.getElementById('music-audio');
  const title = document.getElementById('music-title');
  const artist = document.getElementById('music-artist');
  const status = document.getElementById('music-status');
  const volume = document.getElementById('music-volume');
  const playIcon = toggle?.querySelector('.music-play-icon');
  const pauseIcon = toggle?.querySelector('.music-pause-icon');
  if (!transport || !toggle || !audio || !title || !artist || !status || !volume || !playIcon || !pauseIcon) return;

  const streamURL = 'https://radio.plaza.one/mp3';
  const metadataURL = 'https://api.plaza.one/status';
  const metadataInterval = 15000;
  const metadataTimeout = 8000;
  let intent = false;
  let playing = false;
  let generation = 0;
  let pollTimer = null;
  let metadataRequest = null;
  let changingVolume = false;

  function setTrack(trackTitle = 'Nightwave Plaza', trackArtist = 'Live vaporwave radio') {
    title.textContent = trackTitle;
    title.title = trackTitle;
    artist.textContent = trackArtist;
    artist.title = trackArtist;
  }

  function renderTransport() {
    transport.dataset.playing = String(playing);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', intent ? 'Pause music' : 'Play music');
    playIcon.toggleAttribute('hidden', intent);
    pauseIcon.toggleAttribute('hidden', !intent);
  }

  function clearMetadata() {
    window.clearTimeout(pollTimer);
    pollTimer = null;
    const request = metadataRequest;
    metadataRequest = null;
    if (request) {
      window.clearTimeout(request.timer);
      request.controller.abort();
    }
  }

  function releaseConnection() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }

  function stop(message = 'Paused') {
    intent = false;
    playing = false;
    generation += 1;
    clearMetadata();
    setTrack();
    status.textContent = message;
    renderTransport();
    releaseConnection();
  }

  function isActive(candidate) {
    return intent && playing && generation === candidate;
  }

  async function refreshMetadata(candidate) {
    if (!isActive(candidate) || metadataRequest) return;
    const request = { controller: new AbortController(), timer: null };
    metadataRequest = request;
    try {
      const timeout = new Promise((resolve, reject) => {
        request.timer = window.setTimeout(() => {
          request.controller.abort();
          reject(new Error('Metadata request timed out'));
        }, metadataTimeout);
      });
      const response = (async () => {
        const result = await fetch(metadataURL, { signal: request.controller.signal });
        if (!result.ok) throw new Error('Metadata unavailable');
        return result.json();
      })();
      const data = await Promise.race([response, timeout]);
      if (!isActive(candidate) || metadataRequest !== request || request.controller.signal.aborted) return;
      const song = data?.song;
      if (typeof song?.title === 'string' && song.title.trim() && typeof song.artist === 'string' && song.artist.trim()) {
        setTrack(song.title.trim(), song.artist.trim());
      } else {
        setTrack();
      }
    } catch {
      if (isActive(candidate) && metadataRequest === request) setTrack();
    } finally {
      window.clearTimeout(request.timer);
      if (metadataRequest === request) {
        metadataRequest = null;
        if (isActive(candidate)) {
          pollTimer = window.setTimeout(() => {
            pollTimer = null;
            refreshMetadata(candidate);
          }, metadataInterval);
        }
      }
    }
  }

  function syncVolume() {
    if (changingVolume) return;
    const value = audio.muted ? 0 : Math.round(audio.volume * 100);
    volume.value = String(value);
    volume.setAttribute('aria-valuetext', value === 0 ? 'Muted' : `${value}%`);
  }

  function applyVolume() {
    const candidate = Number(volume.value);
    const value = Number.isFinite(candidate) ? Math.max(0, Math.min(100, candidate)) : 30;
    // Native volumechange may be queued separately for volume and muted.
    // Read the final media state, never a captured value from an older event.
    changingVolume = true;
    audio.volume = value / 100;
    audio.muted = value === 0;
    changingVolume = false;
    syncVolume();
  }

  toggle.addEventListener('click', () => {
    if (intent) {
      stop();
      return;
    }
    intent = true;
    playing = false;
    const candidate = ++generation;
    setTrack();
    status.textContent = 'Loading…';
    renderTransport();
    audio.src = streamURL;
    try {
      // Keep play() inside the click stack for mobile user-gesture policies.
      const pending = audio.play();
      Promise.resolve(pending).then(() => {
        // A canceled play may resolve late; never stop a newer session.
        if (!intent) releaseConnection();
      }).catch(error => {
        if (!intent || generation !== candidate) return;
        stop(error?.name === 'NotAllowedError'
          ? 'Playback blocked. Press Play to retry, or visit Nightwave Plaza.'
          : 'Unable to play. Press Play to retry, or visit Nightwave Plaza.');
      });
    } catch {
      if (intent && generation === candidate) stop('Unable to play. Press Play to retry, or visit Nightwave Plaza.');
    }
  });

  audio.addEventListener('playing', () => {
    if (!intent) {
      releaseConnection();
      return;
    }
    playing = true;
    status.textContent = 'Live';
    renderTransport();
    if (pollTimer === null && !metadataRequest) refreshMetadata(generation);
  });

  const showLoading = () => {
    if (intent) status.textContent = 'Loading…';
  };
  audio.addEventListener('waiting', showLoading);
  audio.addEventListener('stalled', showLoading);
  audio.addEventListener('pause', () => {
    if (intent && audio.paused) stop();
  });
  audio.addEventListener('ended', () => {
    if (intent) stop('Stream ended. Press Play to reconnect.');
  });
  audio.addEventListener('error', () => {
    if (intent) stop('Radio unavailable. Press Play to retry, or visit Nightwave Plaza.');
  });
  audio.addEventListener('volumechange', syncVolume);
  volume.addEventListener('input', applyVolume);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && intent) stop();
  });
  window.addEventListener('pagehide', () => stop());

  setTrack();
  applyVolume();
  renderTransport();
  toggle.disabled = false;
  volume.disabled = false;
})();
