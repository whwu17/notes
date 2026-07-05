// Fix DOM matches function
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

function getScrollContainer() {
  return document.querySelector('.site-scroll-area');
}

// Get Scroll position
function getScrollPos() {
  var container = getScrollContainer();
  if (container) {
    return { x: container.scrollLeft, y: container.scrollTop };
  }

  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

  var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
  var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

  return { x: x, y: y };
}

var _scrollTimer = [];

// Smooth scroll
function smoothScrollTo(y, time) {
  time = time == undefined ? 500 : time;

  var container = getScrollContainer();
  var scrollPos = getScrollPos();
  var count = 60;
  var length = (y - scrollPos.y);

  function easeInOut(k) {
    return .5 * (Math.sin((k - .5) * Math.PI) + 1);
  }

  for (var i = _scrollTimer.length - 1; i >= 0; i--) {
    clearTimeout(_scrollTimer[i]);
  }

  for (var i = 0; i <= count; i++) {
    (function() {
      var cur = i;
      _scrollTimer[cur] = setTimeout(function() {
        if (container) {
          container.scrollTo(
            scrollPos.x,
            scrollPos.y + length * easeInOut(cur / count)
          );
          return;
        }

        window.scrollTo(
          scrollPos.x,
          scrollPos.y + length * easeInOut(cur / count)
        );
      }, (time / count) * cur);
    })();
  }
}

function bindScrollListener(callback) {
  var container = getScrollContainer();
  if (container) {
    container.addEventListener('scroll', callback);
    return;
  }

  window.addEventListener('scroll', callback);
}
