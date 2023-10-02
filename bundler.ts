import copyContents from './copier';
import entryPoints from './entrypoints';

const entrypoints = await entryPoints();

await Bun.build({
  entrypoints: entrypoints,
  outdir: './build',
  minify: true,
});

await copyContents('./public', './build');
