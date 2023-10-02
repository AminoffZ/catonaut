import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { djb2 } from './crypto';
import glob from 'tiny-glob';

/**
 * Remove inline scripts and styles from the generated HTML files.
 *
 * @param directory The directory to remove inline scripts and styles from.
 */
async function removeInlineScriptAndStyle(directory: string) {
  console.log('Removing Inline Scripts and Styles');
  const scriptRegx = /<script[^>]*>([\s\S]+?)<\/script>/g;
  const styleRegx = /<style[^>]*>([\s\S]+?)<\/style>/g;
  const files = await glob('**/*.html', {
    cwd: directory,
    dot: true,
    absolute: false,
    filesOnly: true,
  });

  console.log(`Found ${files.length} files`);

  for (const file of files.map((f) => join(directory, f))) {
    console.log(`Edit file: ${file}`);
    let f = await readFile(file, { encoding: 'utf-8' });

    let script;
    while ((script = scriptRegx.exec(f))) {
      const inlineScriptContent = script[1]
        .replace('__sveltekit', 'const __sveltekit')
        .replace(
          'document.currentScript.parentElement',
          'document.body.firstElementChild'
        );
      const fn = `/script-${djb2(inlineScriptContent)}.js`;
      f = f.replace(
        script[0], // Using script[0] to replace the entire matched script tag
        `<script type="module" src="${fn}"></script>`
      );
      await writeFile(`${directory}${fn}`, inlineScriptContent);
      console.log(`Inline script extracted and saved at: ${directory}${fn}`);
    }

    let style;
    while ((style = styleRegx.exec(f))) {
      const inlineStyleContent = style[1];
      const fn = `/style-${djb2(inlineStyleContent)}.css`;
      f = f.replace(
        style[0], // Using style[0] to replace the entire matched style tag
        `<link rel="stylesheet" href="${fn}" />`
      );
      await writeFile(`${directory}${fn}`, inlineStyleContent);
      console.log(`Inline style extracted and saved at: ${directory}${fn}`);
    }

    await writeFile(file, f);
  }
}

await removeInlineScriptAndStyle('../dist');
