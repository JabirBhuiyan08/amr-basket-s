import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'node22',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  minify: false,
  outDir: 'dist',
  outExtension({ format }) {
    return { js: format === 'esm' ? '.js' : '.cjs' };
  },
  // Speed: skip type-checking during build and rely on `npm run typecheck` in CI
  // If you want type-checking here too, remove `noCheck` and expect longer builds.
  noCheck: true,
});
