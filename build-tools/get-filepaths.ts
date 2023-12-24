/* This file is used to retrieve all .ts and .js filepaths from the scripts directory
 * to be bundled into the dist/ directory by bun.
 */

import { readdir } from 'fs/promises';
import { extname, join } from 'path';

const sourceDir = '../src/scripts';

/**
 * Recursively get all .ts and .js filepaths from the directory.
 *
 * @param dir (Optional, defaults to `./src/scripts`) The directory to search.
 * @param deep (Optional, defaults to `false`) Whether to search recursively (nested folders).
 * @returns The entrypoints.
 */
export async function getFilepaths({
  dir = sourceDir,
  deep = false,
}: {
  dir?: string;
  deep?: boolean;
} = {}): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = join(dir, dirent.name);
      if (dirent.isDirectory() && deep) {
        return getFilepaths({ dir: res, deep: deep });
      }
      return Promise.resolve(res);
    })
  );

  // Flatten the array and filter only .ts and .js files
  return Array.prototype
    .concat(...files)
    .filter((file) => ['.ts', '.js'].includes(extname(file)));
}
