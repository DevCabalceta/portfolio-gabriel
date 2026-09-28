import { access, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const projectImages = path.join(projectRoot, "public", "images", "projects");
const portrait = path.join(projectRoot, "public", "images", "gabriel-cabalceta.png");

async function collectImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectImages(absolute);
    return /\.(?:jpe?g|png)$/i.test(entry.name) ? [absolute] : [];
  }));
  return nested.flat();
}

const portraitExists = await access(portrait).then(() => true, () => false);
const sources = [...(portraitExists ? [portrait] : []), ...(await collectImages(projectImages))];

for (const source of sources) {
  const destination = source.replace(/\.(?:jpe?g|png)$/i, ".webp");
  const quality = source === portrait ? 90 : 86;
  await sharp(source)
    .rotate()
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(destination);

  const [before, after] = await Promise.all([stat(source), stat(destination)]);
  const saving = Math.round((1 - after.size / before.size) * 100);
  console.log(`${path.relative(projectRoot, source)} -> ${path.relative(projectRoot, destination)} (${saving}% smaller)`);
}
