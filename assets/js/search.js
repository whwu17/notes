(function () {
  var searchRoot = document.getElementById('site-search');
  var searchSheet = document.getElementById('site-search-sheet');
  if (!searchRoot || !searchSheet) return;

  var input = searchRoot.querySelector('.site-search-input');
  var resultsEl = searchRoot.querySelector('.site-search-results');
  var index = null;
  var documents = [];
  var baseUrl = searchRoot.getAttribute('data-baseurl') || '/';
  var scrollLockY = 0;

  function normalizeBaseUrl(url) {
    if (!url) return '/';
    return url.endsWith('/') ? url : url + '/';
  }

  baseUrl = normalizeBaseUrl(baseUrl);

  function isMobileSearch() {
    return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  }

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

  document.addEventListener('click', function (event) {
    if (!searchSheet.contains(event.target)) {
      clearResults();
    }
  });

  input.addEventListener('focus', function () {
    loadIndex();
    openSearchSheet();
  });

  input.addEventListener('blur', function () {
    window.setTimeout(function () {
      if (document.activeElement === input) return;
      closeSearchSheet();
    }, 0);
  });

  input.addEventListener('input', function () {
    loadIndex().then(function () {
      runSearch(input.value);
    });
  });

  function lockScroll() {
    if (document.body.classList.contains('site-search-scroll-lock')) return;
    scrollLockY = window.scrollY;
    document.body.classList.add('site-search-scroll-lock');
    document.body.style.top = -scrollLockY + 'px';
  }

  function unlockScroll() {
    if (!document.body.classList.contains('site-search-scroll-lock')) return;
    document.body.classList.remove('site-search-scroll-lock');
    document.body.style.top = '';
    window.scrollTo(0, scrollLockY);
  }

  function openSearchSheet() {
    if (isMobileSearch()) {
      lockScroll();
      searchSheet.classList.add('is-active');
      searchRoot.classList.add('is-keyboard-open');
      return;
    }

    searchRoot.classList.add('is-keyboard-open');
  }

  function closeSearchSheet() {
    searchSheet.classList.remove('is-active');
    searchRoot.classList.remove('is-keyboard-open');
    unlockScroll();
  }
})();
