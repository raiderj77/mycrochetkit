import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(await readFile(path.join(repositoryRoot, 'vercel.json'), 'utf8'))

const requiredRedirects = new Map([
  ['/yarn-calculator', 'https://fibertools.app/yarn-calculator'],
  ['/hook-converter', 'https://fibertools.app/blog/crochet-hook-size-chart'],
  ['/stitch-glossary', 'https://fibertools.app/abbreviation-glossary'],
  ['/quick-counter', 'https://fibertools.app/stitch-counter'],
  ['/blog/crochet-blanket-size-chart', 'https://fibertools.app/blanket-calculator'],
  ['/blog/crochet-gauge-calculator-guide', 'https://fibertools.app/gauge-calculator'],
])

const redirects = new Map(config.redirects.map(({ source, destination, permanent }) => {
  if (permanent !== true) {
    throw new Error(`Redirect ${source} must be permanent.`)
  }
  return [source, destination]
}))

for (const [source, destination] of requiredRedirects) {
  if (redirects.get(source) !== destination) {
    throw new Error(`Missing redirect ${source} -> ${destination}`)
  }
}

for (const destination of redirects.values()) {
  if (!destination.startsWith('https://fibertools.app/')) {
    throw new Error(`Unexpected redirect destination: ${destination}`)
  }
}

if (!config.rewrites?.some(({ source, destination }) => source === '/(.*)' && destination === '/index.html')) {
  throw new Error('Missing retirement-page fallback rewrite.')
}

console.log(`Validated ${redirects.size} permanent FiberTools redirects and the retirement fallback.`)
