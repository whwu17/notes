(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var page = document.querySelector(".search-page");
    if (!page) {
      return;
    }

    var input = document.getElementById("search-input");
    var results = document.getElementById("search-results");
    var status = document.getElementById("search-status");
    var jsonUrl = page.getAttribute("data-search-json");
    var store = [];
    var loaded = false;

    function escapeHtml(text) {
      var div = document.createElement("div");
      div.textContent = text == null ? "" : String(text);
      return div.innerHTML;
    }

    function snippet(content, query) {
      if (!content) {
        return "";
      }
      var idx = content.toLowerCase().indexOf(query);
      var start = idx > 40 ? idx - 40 : 0;
      var text = content.substr(start, 160);
      if (start > 0) {
        text = "\u2026" + text;
      }
      if (start + 160 < content.length) {
        text = text + "\u2026";
      }
      return escapeHtml(text);
    }

    function render(query) {
      results.innerHTML = "";

      if (!query) {
        status.textContent = "";
        return;
      }

      var q = query.toLowerCase();
      var matches = store.filter(function (item) {
        return (
          (item.title && item.title.toLowerCase().indexOf(q) !== -1) ||
          (item.tags && item.tags.toLowerCase().indexOf(q) !== -1) ||
          (item.category && item.category.toLowerCase().indexOf(q) !== -1) ||
          (item.content && item.content.toLowerCase().indexOf(q) !== -1)
        );
      });

      if (matches.length === 0) {
        status.textContent = 'No results for "' + query + '".';
        return;
      }

      status.textContent =
        matches.length + (matches.length === 1 ? " result" : " results") + ' for "' + query + '".';

      matches.forEach(function (item) {
        var li = document.createElement("li");
        var meta = [item.date, item.category].filter(Boolean).join(" \u00b7 ");
        li.innerHTML =
          '<h2 class="post-title"><a class="post-link" href="' +
          item.url +
          '">' +
          escapeHtml(item.title) +
          "</a></h2>" +
          '<div class="post-meta">' +
          escapeHtml(meta) +
          "</div>" +
          '<p class="search-snippet">' +
          snippet(item.content, q) +
          "</p>";
        results.appendChild(li);
      });
    }

    function loadAndRender() {
      var query = input.value.trim();
      if (loaded) {
        render(query);
        return;
      }
      status.textContent = "Loading index\u2026";
      fetch(jsonUrl)
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          store = data;
          loaded = true;
          render(query);
        })
        .catch(function () {
          status.textContent = "Could not load the search index.";
        });
    }

    var debounce;
    input.addEventListener("input", function () {
      clearTimeout(debounce);
      debounce = setTimeout(loadAndRender, 150);
    });

    // Support ?q=term deep links.
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q");
    if (initial) {
      input.value = initial;
      loadAndRender();
    }
  });
})();
