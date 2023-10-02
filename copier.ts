import { readdir, stat, mkdir, copyFile } from 'fs/promises';
import { join } from 'path';

/**
 * Copy the contents of a directory to another.
 * Retains the directory structure.
 *
 * @param sourceDir Source directory
 * @param targetDir Target directory
 */
export default async function copyContents(
  sourceDir: string,
  targetDir: string
): Promise<void> {
  const entries = await readdir(sourceDir);

  for (const entry of entries) {
    const curSource = join(sourceDir, entry);
    const curTarget = join(targetDir, entry);
    if ((await stat(curSource)).isDirectory()) {
      await mkdir(curTarget, { recursive: true });
      await copyContents(curSource, curTarget);
    } else {
      await copyFile(curSource, curTarget);
    }
  }
}
