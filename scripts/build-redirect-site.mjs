import { cp, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = path.join(repositoryRoot, 'dist')
const staticDirectory = path.join(repositoryRoot, 'redirect-site')

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
await cp(staticDirectory, outputDirectory, { recursive: true })

console.log('Built the MyCrochetKit redirect-only recovery site.')
