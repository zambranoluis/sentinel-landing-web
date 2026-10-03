import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excluded = new Set([".git", ".codex", ".next", "node_modules", "out"]);

async function markdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory() && !excluded.has(entry.name))
      files.push(...(await markdownFiles(target)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(target);
  }
  return files;
}

function withoutFences(source) {
  return source
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function anchors(source) {
  const used = new Map();
  const result = new Set();
  for (const heading of withoutFences(source).matchAll(
    /^#{1,6}\s+(.+?)\s*#*\s*$/gm,
  )) {
    const base = heading[1]
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[^\p{L}\p{N}_\-\s]/gu, "")
      .replace(/\s/g, "-");
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    result.add(count ? `${base}-${count}` : base);
  }
  for (const match of source.matchAll(/\b(?:id|name)=["']([^"']+)["']/g))
    result.add(match[1]);
  return result;
}

let checked = 0;
const errors = [];
for (const file of await markdownFiles(root)) {
  const source = withoutFences(await readFile(file, "utf8"));
  const targets = [
    ...source.matchAll(
      /!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+["'][^\n]*?["'])?\s*\)/g,
    ),
  ].map((match) => match[1]);
  targets.push(
    ...[...source.matchAll(/^\s*\[[^\]]+\]:\s*(<[^>]+>|\S+)/gm)].map(
      (match) => match[1],
    ),
  );
  for (const raw of targets) {
    const link = raw.replace(/^<|>$/g, "");
    if (/^[a-z][a-z\d+.-]*:|^\/\//i.test(link)) continue;
    checked++;
    try {
      const [pathname, fragment] = link.split("#");
      const target = pathname
        ? path.resolve(
            path.dirname(file),
            decodeURIComponent(pathname.split("?")[0]),
          )
        : file;
      const info = await stat(target);
      if (fragment && info.isFile() && target.endsWith(".md")) {
        const ids = anchors(await readFile(target, "utf8"));
        if (!ids.has(decodeURIComponent(fragment)))
          throw new Error(`missing anchor #${fragment}`);
      }
    } catch (error) {
      errors.push(`${path.relative(root, file)}: ${link} (${error.message})`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Checked ${checked} local Markdown links and anchors.`);
