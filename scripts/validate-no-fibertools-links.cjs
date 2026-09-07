#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const generatorFiles = [
  path.join(root, 'fibertools-blogs.sh'),
  path.join(root, 'implement-fibertools-blogs.sh'),
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

const sourceFiles = walk(path.join(root, 'src'));
const forbiddenHost = /fibertools\.app/i;
const offenders = [...sourceFiles, ...generatorFiles].flatMap((file) => {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  return lines.flatMap((line, index) => (
    forbiddenHost.test(line)
      ? [`${path.relative(root, file)}:${index + 1}`]
      : []
  ));
});

if (offenders.length > 0) {
  console.error('FiberTools backlinks must not appear in rendered source or generators:');
  offenders.forEach((offender) => console.error(`- ${offender}`));
  process.exit(1);
}

console.log(`No FiberTools backlinks found across ${sourceFiles.length} source files and ${generatorFiles.length} generators.`);
