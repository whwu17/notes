source 'https://rubygems.org'

gem 'jekyll', '~> 4.4'

# webrick is required by `jekyll serve` but was removed from Ruby's stdlib in Ruby 3.0+
gem 'webrick', '~> 1.8'

# Jekyll 4 defaults to jekyll-sass-converter 3.x (Dart Sass). Pin to the 2.x
# series (LibSass) so the theme's existing SCSS (@import, map-get, str-index)
# keeps compiling without a Sass rewrite.
gem 'jekyll-sass-converter', '~> 2.0'

# webrick is required by `jekyll serve` but was removed from Ruby's stdlib in Ruby 3.0+
gem 'webrick', '~> 1.8'

group :jekyll_plugins do
  gem 'jekyll-archives', '~> 2.2'
  gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
  gem 'jekyll-feed', '~> 0.17'
  gem 'jekyll-paginate', '~> 1.1'
  gem 'jekyll-seo-tag', '~> 2.8'
  gem 'jekyll-sitemap', '~> 1.4'
  gem 'jekyll-redirect-from', '~> 0.16'
  gem 'kramdown-parser-gfm', '~> 1.1'
  gem 'kramdown', '~> 2.4'
  gem 'wdm', '>= 0.1.0' if Gem.win_platform?
end
