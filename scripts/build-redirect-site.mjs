import { cp, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = path.join(repositoryRoot, 'dist')
const staticDirectory = path.join(repositoryRoot, 'redirect-site')
const publicDirectory = path.join(repositoryRoot, 'public')
const brandAssets = ['logo-mark.svg', 'favicon.ico', 'favicon-512.png', 'favicon-180.png']

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
await cp(staticDirectory, outputDirectory, { recursive: true })
await Promise.all(brandAssets.map((name) =>
  cp(path.join(publicDirectory, name), path.join(outputDirectory, name)),
))

console.log('Built the dependency-free MyCrochetKit private project planner.')
