#!/usr/bin/env node
// Regenerates the alphabetical library list in README.md from the YAML files in
// data/. Run with `pnpm generate-readme` after adding or editing a library.
//
// Only the text between the BEGIN/END GENERATED LIST markers is rewritten; the
// rest of the README is left untouched.

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const readmePath = join(root, "README.md");

const BEGIN = "<!-- BEGIN GENERATED LIST -->";
const END = "<!-- END GENERATED LIST -->";

// Awesome list descriptions must not start with the library's own name, so
// strip a leading title (and any "is a/the" filler) and re-capitalize.
const stripLeadingTitle = (title, text) => {
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `^${esc}\\b[\\s:,–—-]*(?:(?:is|are|was|were)(?:\\s+(?:a|an|the))?\\s+)?`,
    "i"
  );
  const stripped = text.replace(re, "");
  if (!stripped || stripped === text) return text;
  return stripped[0].toUpperCase() + stripped.slice(1);
};

// Collapse whitespace and take the first sentence so each entry stays one line.
const shortDescription = (title, description) => {
  const text = String(description ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  let sentence = match ? match[0] : text;
  sentence = stripLeadingTitle(title, sentence);
  // Awesome lists require descriptions to start with valid (upper) casing.
  sentence = sentence[0].toUpperCase() + sentence.slice(1);
  if (sentence.length > 200) sentence = sentence.slice(0, 197).trimEnd() + "…";
  // Awesome lists expect descriptions to end with punctuation.
  if (!/[.!?…]$/.test(sentence)) sentence += ".";
  return sentence;
};

const libraries = readdirSync(dataDir)
  .filter((name) => name.endsWith(".yml"))
  .map((name) => {
    const item = parseYaml(readFileSync(join(dataDir, name), "utf8"));
    if (!item || typeof item !== "object") {
      throw new Error(`Expected ${name} to be an object`);
    }
    const url = item.homeUrl || (item.githubRepo ? `https://github.com/${item.githubRepo}` : null);
    if (!item.title || !url) {
      throw new Error(`${name} is missing a title or URL`);
    }
    return { title: item.title, url, description: shortDescription(item.title, item.description) };
  })
  .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

const list = libraries
  .map(({ title, url, description }) =>
    description ? `- [${title}](${url}) - ${description}` : `- [${title}](${url})`
  )
  .join("\n");

const readme = readFileSync(readmePath, "utf8");
const beginIdx = readme.indexOf(BEGIN);
const endIdx = readme.indexOf(END);
if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx) {
  throw new Error(`Could not find ${BEGIN} / ${END} markers in README.md`);
}

const updated =
  readme.slice(0, beginIdx + BEGIN.length) +
  "\n\n" +
  list +
  "\n\n" +
  readme.slice(endIdx);

writeFileSync(readmePath, updated);
console.log(`Wrote ${libraries.length} libraries to README.md`);
