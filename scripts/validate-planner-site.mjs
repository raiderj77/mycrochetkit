import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siteDirectory = path.join(repositoryRoot, 'redirect-site')
const readSiteFile = (name) => readFile(path.join(siteDirectory, name), 'utf8')

const [index, about, privacy, robots, sitemap, app, configSource] = await Promise.all([
  readSiteFile('index.html'),
  readSiteFile('about.html'),
  readSiteFile('privacy.html'),
  readSiteFile('robots.txt'),
  readSiteFile('sitemap.xml'),
  readSiteFile('app.js'),
  readFile(path.join(repositoryRoot, 'vercel.json'), 'utf8'),
])

const config = JSON.parse(configSource)

const requireText = (source, text, label) => {
  if (!source.includes(text)) throw new Error(`${label} is missing: ${text}`)
}

for (const [name, page] of [['index', index], ['about', about], ['privacy', privacy]]) {
  requireText(page, '<title>', name)
  requireText(page, 'name="description"', name)
  requireText(page, 'rel="canonical"', name)
}

if (/name="robots" content="noindex/i.test(index)) throw new Error('The unique planner homepage must be indexable.')
requireText(index, 'data-app-hidden', 'index')
requireText(index, 'https://fibertools.app/crochet-tools', 'index')
requireText(privacy, 'local browser storage', 'privacy')
requireText(privacy, 'does not transmit', 'privacy')
requireText(robots, 'Sitemap: https://mycrochetkit.com/sitemap.xml', 'robots')
requireText(sitemap, '<loc>https://mycrochetkit.com/</loc>', 'sitemap')
requireText(sitemap, '<loc>https://mycrochetkit.com/about</loc>', 'sitemap')
requireText(sitemap, '<loc>https://mycrochetkit.com/privacy</loc>', 'sitemap')

for (const forbidden of ['firebase', 'google-analytics', 'googletagmanager', 'adsbygoogle']) {
  if (`${index}\n${app}`.toLowerCase().includes(forbidden)) throw new Error(`Production planner includes forbidden integration: ${forbidden}`)
}

const csp = config.headers?.flatMap(({ headers }) => headers).find(({ key }) => key === 'Content-Security-Policy')?.value
requireText(csp ?? '', "connect-src 'none'", 'Content-Security-Policy')
requireText(csp ?? '', "frame-ancestors 'none'", 'Content-Security-Policy')

console.log('Validated indexability, truthful privacy copy, sitemap, FiberTools boundary, and restrictive CSP.')
