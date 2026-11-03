(() => {
  'use strict';

  const views = new Map([
    ['journal', { title: 'Journal', filename: 'journal / index', address: 'journal', context: 'journal', url: '/#journal', status: 'Journal folder · 1 entry' }],
    ['projects', { title: 'Projects', filename: 'projects / index', address: 'projects', context: 'projects', url: '/#projects', status: 'Project folder · repositories and development tools' }],
    ['about', { title: 'About', filename: 'about / index', address: 'about', context: 'about', url: '/#about', status: 'About me · the person behind the keyboard' }],
    ['article-preview', { title: 'Article layout preview', filename: 'journal / reading preview', address: 'preview / article', context: 'journal', url: '/preview/article/', status: 'Unpublished layout preview · not a journal entry' }]
  ]);

  const posts = [{
    view: 'article-first-entry',
    slug: 'first-entry',
    title: 'First entry',
    date: '2026-10-27',
    dateLabel: '27 October 2026',
    category: 'Journal',
    summary: 'A first note on what I want to put in this journal.',
    lead: 'I finally put a post in the journal.',
    content: 'article-first-entry-content'
  }];

  function mountPosts() {
    const entries = document.getElementById('journal-entries');
    for (const post of posts) {
      const url = `/journal/${post.slug}/`;
      views.set(post.view, {
        title: post.title,
        filename: `journal / ${post.slug}`,
        address: `journal / ${post.slug}`,
        context: 'journal',
        url,
        status: `Journal entry · ${post.dateLabel}`
      });

      const entry = document.createElement('article');
      entry.className = 'journal-entry';
      entry.dataset.post = post.slug;
      const meta = document.createElement('p');
      meta.className = 'journal-entry-meta';
      const date = document.createElement('time');
      date.dateTime = post.date;
      date.textContent = post.dateLabel;
      meta.append(date, ` · ${post.category}`);
      const heading = document.createElement('h2');
      const link = document.createElement('a');
      link.href = url;
      link.dataset.view = post.view;
      link.textContent = post.title;
      heading.append(link);
      const summary = document.createElement('p');
      summary.className = 'journal-entry-summary';
      summary.textContent = post.summary;
      entry.append(meta, heading, summary);
      entries.append(entry);

      const panel = document.getElementById(post.view);
      const layout = document.getElementById('article-layout').content.cloneNode(true);
      const articleTitle = layout.querySelector('[data-article-title]');
      articleTitle.id = `${post.view}-title`;
      articleTitle.textContent = post.title;
      layout.querySelector('[data-article-label]').textContent = post.category;
      const articleMeta = layout.querySelector('[data-article-meta]');
      articleMeta.hidden = false;
      const published = document.createElement('time');
      published.dateTime = post.date;
      published.textContent = post.dateLabel;
      articleMeta.append(published, ' · Matheus');
      layout.querySelector('[data-article-notice]').remove();
      layout.querySelector('[data-article-lead]').textContent = post.lead;
      layout.querySelector('[data-article-body]').append(
        document.getElementById(post.content).content.cloneNode(true)
      );
      panel.append(layout);
    }
    document.querySelector('.empty-journal').hidden = posts.length > 0;
  }

  function mountArticlePreview() {
    const panel = document.getElementById('article-preview');
    if (panel.childElementCount) return;
    const layout = document.getElementById('article-layout').content.cloneNode(true);
    const title = layout.querySelector('[data-article-title]');
    title.id = 'article-preview-title';
    title.textContent = 'Article layout preview';
    layout.querySelector('[data-article-label]').textContent = 'Unpublished layout preview';
    layout.querySelector('[data-article-notice]').textContent = 'This is not a published post.';
    layout.querySelector('[data-article-lead]').textContent = 'A view of the typography, code examples, and navigation available for future journal entries.';
    layout.querySelector('[data-article-body]').append(
      document.getElementById('article-preview-content').content.cloneNode(true)
    );
    panel.append(layout);
  }
  mountPosts();
  mountArticlePreview();

  const navigation = Array.from(document.querySelectorAll('[data-view]'));
  const panels = Array.from(views.keys(), name => document.getElementById(name));
  const main = document.getElementById('main');
  const filename = document.getElementById('content-filename');
  const address = document.getElementById('address-view');
  const status = document.getElementById('content-status');
  const originalRobots = document.querySelector('meta[name="robots"]');
  const originalRobotsContent = originalRobots?.getAttribute('content');
  const previewRobots = originalRobots || document.createElement('meta');
  previewRobots.name = 'robots';
  let activeView;

  function renderView(name, focusHeading = false) {
    const active = views.has(name) ? name : 'journal';
    const view = views.get(active);
    panels.forEach(panel => { panel.hidden = panel.id !== active; });
    navigation.forEach(link => {
      if (link.dataset.view === view.context) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    filename.textContent = view.filename;
    address.textContent = view.address;
    status.textContent = view.status;
    document.title = `${view.title} — opiekun / Matheus`;
    document.body.classList.toggle('reading-mode', active.startsWith('article-'));
    if (active === 'article-preview') {
      previewRobots.content = 'noindex, nofollow';
      if (!previewRobots.isConnected) document.head.append(previewRobots);
    } else if (originalRobots) {
      if (originalRobotsContent === null) previewRobots.removeAttribute('content');
      else previewRobots.setAttribute('content', originalRobotsContent);
    } else {
      previewRobots.remove();
    }
    activeView = active;
    if (focusHeading) {
      document.getElementById(`${active}-title`).focus({ preventScroll: true });
    }
  }

  function routeFromLocation() {
    if (window.location.pathname === '/preview/article/') return 'article-preview';
    const post = posts.find(entry => window.location.pathname === `/journal/${entry.slug}/`);
    if (post) return post.view;
    const name = window.location.hash.slice(1);
    return ['journal', 'projects', 'about'].includes(name) ? name : 'journal';
  }

  function restoreRoute() {
    const name = routeFromLocation();
    // A contents fragment changes the position, not the selected view or focus.
    renderView(name, name !== activeView);
  }

  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    main.focus({ preventScroll: true });
    if (typeof main.scrollIntoView === 'function') {
      main.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });

  navigation.forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const name = link.dataset.view;
      if (!views.has(name)) return;
      event.preventDefault();
      const url = views.get(name).url;
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== url) {
        window.history.pushState(null, '', url);
      }
      renderView(name, true);
      if (typeof main.scrollIntoView === 'function') {
        const reducedMotion = typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        main.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'instant' : 'smooth' });
      }
    });
  });
  window.addEventListener('popstate', restoreRoute);
  window.addEventListener('hashchange', restoreRoute);
  renderView(routeFromLocation());
  if (activeView.startsWith('article-') && window.location.hash) {
    const section = document.getElementById(window.location.hash.slice(1));
    if (section && document.getElementById(activeView).contains(section) &&
        typeof section.scrollIntoView === 'function') {
      section.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  const search = document.getElementById('project-search');
  const projects = Array.from(document.querySelectorAll('[data-project]'));
  const projectIndex = projects.map(element => ({ element, text: element.textContent.toLowerCase() }));
  const empty = document.getElementById('project-empty');
  const results = document.getElementById('project-results');

  function filterProjects() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    projectIndex.forEach(({ element, text }) => {
      const matches = text.includes(query);
      element.hidden = !matches;
      if (matches) visible += 1;
    });
    empty.hidden = visible !== 0;
    results.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}${query ? ' found' : ''}`;
  }
  search.addEventListener('input', filterProjects);
  search.addEventListener('search', filterProjects);
  filterProjects();

  const clock = document.getElementById('desktop-clock');
  function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    clock.hidden = false;
  }
  updateClock();
  window.setInterval(updateClock, 30_000);
})();
