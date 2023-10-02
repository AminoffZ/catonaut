/* This file is used to compile content.ts and
 * background.ts scripts from the src/srcipts folder into the
 * extension's dist folder as JavaScript to be used in the
 * extension.
 */

import { getFilepaths } from './get-filepaths';

const entrypoints = await getFilepaths();

await Bun.build({
  entrypoints: entrypoints,
  outdir: '../dist',
  minify: true,
});
