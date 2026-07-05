(function () {
  var searchRoot = document.getElementById('site-search');
  if (!searchRoot) return;

  var input = searchRoot.querySelector('.site-search-input');
  var resultsEl = searchRoot.querySelector('.site-search-results');
  var index = null;
  var documents = [];
  var baseUrl = searchRoot.getAttribute('data-baseurl') || '/';
  var layoutHeight = window.innerHeight;
  var layoutWidth = window.innerWidth;
  var keyboardRaf = 0;
  var isTouch = window.matchMedia('(pointer: coarse)').matches;

  var gutter = document.createElement('div');
  gutter.className = 'site-search-gutter';
  gutter.hidden = true;
  gutter.setAttribute('aria-hidden', 'true');
  document.body.appendChild(gutter);

  if ('virtualKeyboard' in navigator) {
    navigator.virtualKeyboard.overlaysContent = true;
  }

  function normalizeBaseUrl(url) {
    if (!url) return '/';
    return url.endsWith('/') ? url : url + '/';
  }

  baseUrl = normalizeBaseUrl(baseUrl);

  function clearResults() {
    resultsEl.innerHTML = '';
    resultsEl.hidden = true;
    searchRoot.classList.remove('has-results');
  }

  function renderResults(matches) {
    if (!matches.length) {
      resultsEl.innerHTML = '<p class="site-search-empty">No matching posts.</p>';
      resultsEl.hidden = false;
      searchRoot.classList.add('has-results');
      return;
    }

    var html = '<ul class="site-search-list">';
    matches.slice(0, 8).forEach(function (match) {
      var doc = documents[match.ref];
      if (!doc) return;
      html += '<li><a href="' + doc.url + '">';
      html += '<span class="site-search-title">' + escapeHtml(doc.title) + '</span>';
      if (doc.excerpt) {
        html += '<span class="site-search-excerpt">' + escapeHtml(doc.excerpt) + '</span>';
      }
      html += '</a></li>';
    });
    html += '</ul>';
    resultsEl.innerHTML = html;
    resultsEl.hidden = false;
    searchRoot.classList.add('has-results');
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildIndex(data) {
    documents = data;
    index = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('tags', { boost: 5 });
      this.field('category', { boost: 3 });
      this.field('excerpt');

      data.forEach(function (doc) {
        this.add({
          id: String(doc.id),
          title: doc.title || '',
          tags: (doc.tags || []).join(' '),
          category: doc.category || '',
          excerpt: doc.excerpt || ''
        });
      }, this);
    });
  }

  function runSearch(query) {
    if (!index) return;
    var trimmed = query.trim();
    if (!trimmed) {
      clearResults();
      return;
    }

    try {
      var matches = index.search(trimmed + '*');
      if (!matches.length) {
        matches = index.search(trimmed);
      }
      renderResults(matches);
    } catch (e) {
      resultsEl.innerHTML = '<p class="site-search-empty">No matching posts.</p>';
      resultsEl.hidden = false;
      searchRoot.classList.add('has-results');
    }
  }

  function loadIndex() {
    if (index) return Promise.resolve();
    return fetch(baseUrl + 'search-index.json')
      .then(function (response) {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      })
      .then(function (data) {
        buildIndex(data);
      })
      .catch(function () {
        resultsEl.innerHTML = '<p class="site-search-empty">Search is temporarily unavailable.</p>';
        resultsEl.hidden = false;
        searchRoot.classList.add('has-results');
      });
  }

  function isSearchFocused() {
    return document.activeElement === input;
  }

  function getKeyboardOffset() {
    var viewport = window.visualViewport;
    if (!viewport) return 0;

    var byLayout = Math.max(0, layoutHeight - viewport.height);
    var byInset = Math.max(0, window.innerHeight - viewport.offsetTop - viewport.height);
    return Math.max(byLayout, byInset);
  }

  function scheduleKeyboardLift() {
    updateKeyboardLift();
    if (keyboardRaf) cancelAnimationFrame(keyboardRaf);
    keyboardRaf = requestAnimationFrame(updateKeyboardLift);
    [50, 150, 350, 600].forEach(function (delay) {
      window.setTimeout(updateKeyboardLift, delay);
    });
  }

  function updateKeyboardLift() {
    if (!isSearchFocused()) {
      resetKeyboardLift();
      return;
    }

    var offset = getKeyboardOffset();
    searchRoot.classList.add('is-keyboard-open');
    searchRoot.style.bottom = offset + 'px';
    document.documentElement.style.setProperty('--keyboard-offset', offset + 'px');

    if (offset > 0) {
      gutter.hidden = false;
      gutter.style.height = offset + 'px';
      return;
    }

    gutter.hidden = true;
    gutter.style.removeProperty('height');
  }

  function resetKeyboardLift() {
    if (keyboardRaf) {
      cancelAnimationFrame(keyboardRaf);
      keyboardRaf = 0;
    }

    searchRoot.classList.remove('is-keyboard-open');
    searchRoot.style.removeProperty('bottom');
    document.documentElement.style.removeProperty('--keyboard-offset');
    gutter.hidden = true;
    gutter.style.removeProperty('height');
  }

  function enableInput() {
    input.removeAttribute('readonly');
  }

  function disableInput() {
    input.setAttribute('readonly', 'readonly');
  }

  function focusInputWithoutScroll() {
    enableInput();
    try {
      input.focus({ preventScroll: true });
    } catch (e) {
      input.focus();
    }
    scheduleKeyboardLift();
  }

  if (isTouch) {
    disableInput();

    input.addEventListener('touchend', function (event) {
      if (!input.hasAttribute('readonly')) return;
      event.preventDefault();
      focusInputWithoutScroll();
    });

    input.addEventListener('blur', function () {
      window.setTimeout(function () {
        if (document.activeElement === input) return;
        disableInput();
        resetKeyboardLift();
      }, 0);
    });
  }

  document.addEventListener('click', function (event) {
    if (!searchRoot.contains(event.target)) {
      clearResults();
    }
  });

  input.addEventListener('focus', function () {
    loadIndex();
    scheduleKeyboardLift();
  });

  input.addEventListener('input', function () {
    loadIndex().then(function () {
      runSearch(input.value);
      scheduleKeyboardLift();
    });
  });

  function handleWindowResize() {
    var viewport = window.visualViewport;
    var widthChanged = window.innerWidth !== layoutWidth;

    if (!viewport || (viewport.offsetTop === 0 && widthChanged)) {
      layoutHeight = window.innerHeight;
      layoutWidth = window.innerWidth;
    }

    if (isSearchFocused()) {
      scheduleKeyboardLift();
    }
  }

  window.addEventListener('resize', handleWindowResize);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleKeyboardLift);
    window.visualViewport.addEventListener('scroll', scheduleKeyboardLift);
  }
})();
