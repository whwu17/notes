# Wenhan's Notes

## Features

- Support beautiful **Night Mode**.
- Modern responsive web design.
- Full layouts `home`, `post`, `tags`, `archive` and `about`.
- Uses font awesome 5 for icons.
- Beautiful page banner with image and video.
- Beautiful Syntax Highlight using [highlight.js][highlight-js].
- RSS support using [Jekyll Feed][jekyll-feed] gem.
- Optimized for search engines using [Jekyll Seo Tag][jekyll-seo-tag] gem.
- Sitemap support using [Jekyll Sitemap][jekyll-sitemap] gem.
- MathJAX and LaTeX support.
- Google Translation support.
- New post tag support.

## Checklist

- Media (Youtube, Spotify, etc.) support without [Jekyll Spaceship][jekyll-spaceship] gem.
- Diagram (PlantUML, Mermaid) support without [Jekyll Spaceship][jekyll-spaceship] gem.
- Complex and flexible table support without [Jekyll Spaceship][jekyll-spaceship] gem.

## Installation Limitation

GitHub Pages runs in `safe` mode and only allows [a set of whitelisted plugins/themes](https://pages.github.com/versions/). **In other words, the third-party gems will not work normally**.

To use the third-party gem in GitHub Pages without limitation:

Here is a GitHub Action named [jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action) for Jekyll site deployment conveniently. 

## Development

To set up your environment to develop this theme, run `bundle install`.

To test your theme, run `bundle exec jekyll serve` and open your browser at `http://localhost:4000`. 

## License

This theme is licensed under the [MIT license](https://opensource.org/licenses/mit-license.php) © JeffreyTse.

<!-- External links -->

[jekyll]: https://jekyllrb.com/
[jekyll-spaceship]: https://github.com/jeffreytse/jekyll-spaceship
[jekyll-seo-tag]: https://github.com/jekyll/jekyll-seo-tag
[jekyll-sitemap]: https://github.com/jekyll/jekyll-sitemap
[jekyll-feed]: https://github.com/jekyll/jekyll-feed
[highlight-js]: https://github.com/highlightjs/highlight.js
