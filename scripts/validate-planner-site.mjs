import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siteDirectory = path.join(repositoryRoot, 'redirect-site')
const readSiteFile = (name) => readFile(path.join(siteDirectory, name), 'utf8')

const [index, about, privacy, robots, sitemap, app, socialImage, configSource] = await Promise.all([
  readSiteFile('index.html'),
  readSiteFile('about.html'),
  readSiteFile('privacy.html'),
  readSiteFile('robots.txt'),
  readSiteFile('sitemap.xml'),
  readSiteFile('app.js'),
  readFile(path.join(siteDirectory, 'og-image.png')),
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
requireText(index, 'utm_source=mycrochetkit', 'index attribution')
requireText(index, 'utm_medium=referral', 'index attribution')
requireText(index, 'utm_campaign=planner_to_calculator', 'index attribution')
requireText(index, 'id="share-site"', 'index share action')
requireText(index, 'https://mycrochetkit.com/og-image.png', 'index social image')
requireText(index, 'name="twitter:card" content="summary_large_image"', 'index social metadata')
requireText(index, '"@type":"WebApplication"', 'index structured data')
requireText(about, 'mailto:jason@fibertools.app?subject=MyCrochetKit%20feedback', 'about feedback')
requireText(privacy, 'local browser storage', 'privacy')
requireText(privacy, 'does not transmit', 'privacy')
requireText(privacy, 'never include project names, notes, yarn details, progress, or other planner data', 'privacy attribution disclosure')
requireText(app, "url: 'https://mycrochetkit.com/'", 'share action')
requireText(app, 'No project details were included.', 'share privacy')
requireText(robots, 'Sitemap: https://mycrochetkit.com/sitemap.xml', 'robots')
requireText(sitemap, '<loc>https://mycrochetkit.com/</loc>', 'sitemap')
requireText(sitemap, '<loc>https://mycrochetkit.com/about</loc>', 'sitemap')
requireText(sitemap, '<loc>https://mycrochetkit.com/privacy</loc>', 'sitemap')

for (const forbidden of ['firebase', 'google-analytics', 'googletagmanager', 'adsbygoogle']) {
  if (`${index}\n${app}`.toLowerCase().includes(forbidden)) throw new Error(`Production planner includes forbidden integration: ${forbidden}`)
}

if (socialImage.readUInt32BE(16) !== 1200 || socialImage.readUInt32BE(20) !== 630) {
  throw new Error('The social preview image must be a 1200 x 630 PNG.')
}

for (const page of [index, about, privacy]) {
  if (/utm_(?:source|medium|campaign|content)=[^"&]*(?:project|yarnName|notes|currentRow)/i.test(page)) {
    throw new Error('Attribution URLs must not contain planner field names or project data.')
  }
}

const csp = config.headers?.flatMap(({ headers }) => headers).find(({ key }) => key === 'Content-Security-Policy')?.value
requireText(csp ?? '', "connect-src 'none'", 'Content-Security-Policy')
requireText(csp ?? '', "frame-ancestors 'none'", 'Content-Security-Policy')
const structuredData = index.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1]
if (!structuredData) throw new Error('The homepage is missing WebApplication structured data.')
const structuredDataHash = createHash('sha256').update(structuredData).digest('base64')
requireText(csp ?? '', `'sha256-${structuredDataHash}'`, 'Content-Security-Policy structured-data hash')
if (csp?.includes("'unsafe-inline'")) throw new Error('Content-Security-Policy must not allow unsafe inline scripts.')

console.log('Validated indexability, truthful privacy and attribution copy, social preview, sitemap, FiberTools boundary, and restrictive CSP.')
