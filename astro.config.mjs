// @ts-check
import { defineConfig } from 'astro/config';

// Canonical production domain is not yet verified (Task.md D12). `site` is left
// unset so no canonical URL or sitemap can point at a guessed host.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
