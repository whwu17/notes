(function () {
  var searchRoot = document.getElementById('site-search');
  if (!searchRoot) return;

  var input = searchRoot.querySelector('.site-search-input');
  var resultsEl = searchRoot.querySelector('.site-search-results');
  var dialog = searchRoot.querySelector('.site-search-dialog');
  var trigger = document.getElementById('site-search-trigger');
  var closeBtn = searchRoot.querySelector('.site-search-close');
  var index = null;
  var documents = [];
  var baseUrl = searchRoot.getAttribute('data-baseurl') || '/';

  function normalizeBaseUrl(url) {
    if (!url) return '/';
    return url.endsWith('/') ? url : url + '/';
  }

  baseUrl = normalizeBaseUrl(baseUrl);

  function setOpen(isOpen) {
    searchRoot.classList.toggle('is-open', isOpen);
    dialog.hidden = !isOpen;
    if (isOpen) {
      input.focus();
      input.select();
    } else {
      input.value = '';
      resultsEl.innerHTML = '';
      resultsEl.hidden = true;
    }
  }

  function renderResults(matches) {
    if (!matches.length) {
      resultsEl.innerHTML = '<p class="site-search-empty">No matching posts.</p>';
      resultsEl.hidden = false;
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
      resultsEl.innerHTML = '';
      resultsEl.hidden = true;
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
      });
  }

  if (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      loadIndex().then(function () {
        setOpen(true);
      });
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      setOpen(false);
    });
  }

  searchRoot.addEventListener('click', function (event) {
    if (event.target === searchRoot) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      loadIndex().then(function () {
        setOpen(true);
      });
    }
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });

  input.addEventListener('input', function () {
    runSearch(input.value);
  });
})();
