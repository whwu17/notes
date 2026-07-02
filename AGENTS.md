# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **Jekyll static site** ("Wenhan's Notes"). There is no database, backend, or JS build step — the only service is the Jekyll dev server. Standard commands are documented in `README.md`.

### Environment (already provisioned in the VM snapshot)
- Ruby 3.2 (system, via apt) and Bundler are installed. Gems install to a user-local vendor path (`~/.bundle-vendor`, set via the global bundler config `BUNDLE_PATH`), so **no `sudo` is needed**.
- The update script runs `bundle3.2 install` on startup to refresh gems.

### Running commands (non-obvious gotchas)
- Use the system launcher **`bundle3.2`**, which is always on `PATH`. The bare `bundle`/`jekyll` binaries live in `~/.local/share/gem/ruby/3.2.0/bin` and are only on `PATH` in interactive login shells (via `~/.bashrc`), not in non-interactive `Shell` tool commands. Prefer `bundle3.2 exec ...`.
- Run the dev server: `bundle3.2 exec jekyll serve --host 0.0.0.0 --port 4000`
- Build: `bundle3.2 exec jekyll build` (output in `_site/`, gitignored).
- **The site is served under the `/notes` baseurl**, so the home page is `http://localhost:4000/notes/` — plain `http://localhost:4000/` returns 404. This is intentional (`baseurl: "/notes"` in `_config.yml`).
- `_config.yml` is NOT hot-reloaded; restart `jekyll serve` after editing it. Other content/layout changes auto-regenerate.

### Notes
- The `Gemfile` includes `webrick` because it was removed from Ruby's stdlib in Ruby 3.0+ and is required by `jekyll serve`.
- There is no lint step and no automated test suite; "testing" means building and viewing pages in the browser.
