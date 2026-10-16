import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import * as core from '../redirect-site/planner-core.js'

const source = readFileSync(new URL('../redirect-site/app.js', import.meta.url), 'utf8').replace(/^import \{[\s\S]*?\} from '\.\/planner-core.js'/, '')
const key = 'mycrochetkit:planner:v1'
function launch(projects = [core.createProject('existing')], options = {}) {
  const elements = new Map()
  const element = (name) => {
    if (!elements.has(name)) elements.set(name, { value: '', dataset: {}, style: {}, listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn }, replaceChildren(...children) { this.children = children }, setAttribute() {}, focus() {} })
    return elements.get(name)
  }
  element('#project-form').elements = { namedItem: element }
  let saved = 'raw' in options ? options.raw : JSON.stringify({ version: 1, projects, currentId: projects[0].id })
  let writes = 0
  let exported
  const windowListeners = {}
  let confirmed = true
  const context = vm.createContext({ ...core, console, Date, Intl, Math, JSON, Set, Number, String, Blob,
    URL: { createObjectURL: (blob) => { exported = blob; return 'blob:fixture' }, revokeObjectURL() {} },
    crypto: { randomUUID: () => 'replacement' },
    confirm: () => confirmed,
    localStorage: { getItem: () => { if (options.readFails) throw new Error('Unavailable'); return saved }, setItem: (k, value) => { writes++; if (options.writeFails) throw new Error('Quota exceeded'); assert.equal(k, key); saved = value } },
    document: { querySelector: element, createElement: () => ({ click() {} }), querySelectorAll: () => [] },
    window: { addEventListener(type, fn) { windowListeners[type] = fn } },
  })
  vm.runInContext(source, context)
  return { element, read: () => JSON.parse(saved), raw: () => saved, writes: () => writes, cancel: () => { confirmed = false },
    exported: async () => JSON.parse(await exported.text()),
    externalWrite: (raw) => { saved = raw; windowListeners.storage({ key }) },
    event: (selector, type, arg) => element(selector).listeners[type](arg),
    import: (text) => element('#import-projects').listeners.change({ target: { files: [{ size: text.length, text: async () => text }], value: 'backup.json' } }),
  }
}

test('actual form handlers normalize edits before persistence and retain unrelated project data', () => {
  const first = { ...core.createProject('first'), name: 'Blanket', notes: 'Keep my notes', yarnName: 'Wool' }
  const other = { ...core.createProject('other'), name: 'Hat', notes: 'Keep other notes' }
  const app = launch([first, other])
  const cases = { currentRow: ['-4', 0], targetRows: ['2000000', 999999], skeinsOnHand: ['4.56', 4.6], yardsPerSkein: ['100000', 99999], gaugeStitches: ['12.34', 12.3], gaugeRows: ['Infinity', ''] }
  for (const [field, [input, expected]] of Object.entries(cases)) {
    app.element(field).value = input
    app.event('#project-form', 'input')
    assert.equal(app.read().projects[0][field], expected)
  }
  app.element('currentRow').value = '8.7'
  app.event('#project-form', 'change')
  assert.equal(app.read().projects[0].currentRow, 9)
  assert.equal(app.read().projects[0].notes, first.notes)
  assert.deepEqual(app.read().projects[1], other)
})

test('duplicate import preserves payloads, allows selecting each, and deletes only selected project', async () => {
  const projects = ['First', 'Second', 'Third'].map(name => ({ ...core.createProject('duplicate'), name, notes: `${name} notes` }))
  const app = launch()
  await app.import(core.createBackup(projects))
  const imported = app.read().projects
  assert.equal(new Set(imported.map(p => p.id)).size, 3)
  for (let index = 0; index < imported.length; index++) {
    assert.deepEqual({ ...imported[index], id: 'duplicate' }, projects[index])
    app.element('#project-select').value = imported[index].id
    app.event('#project-select', 'change')
    assert.equal(app.element('name').value, projects[index].name)
  }
  app.event('#delete-project', 'click')
  assert.deepEqual(app.read().projects, imported.slice(0, 2))
  const reloaded = launch(app.read().projects)
  assert.deepEqual(reloaded.read().projects, imported.slice(0, 2))
})

test('cancelled import and malformed import preserve existing saved data', async () => {
  const app = launch([{ ...core.createProject('existing'), notes: 'Original data' }])
  const before = app.read()
  app.cancel()
  await app.import(core.createBackup([core.createProject('replacement')]))
  assert.deepEqual(app.read(), before)
  await app.import('{broken')
  assert.deepEqual(app.read(), before)
})

test('cancelled deletion preserves existing data', () => {
  const app = launch()
  const before = app.read()
  app.cancel()
  app.event('#delete-project', 'click')
  assert.deepEqual(app.read(), before)
})

test('legacy same-ID projects are independently accessible and deletion preserves the other after load', () => {
  const projects = ['First', 'Second'].map(name => ({ ...core.createProject('duplicate'), name, notes: `${name} notes` }))
  const app = launch(projects)
  const restored = app.read().projects
  assert.equal(new Set(restored.map(p => p.id)).size, 2)
  for (let index = 0; index < restored.length; index++) {
    assert.deepEqual({ ...restored[index], id: 'duplicate' }, projects[index])
    app.element('#project-select').value = restored[index].id
    app.event('#project-select', 'change')
    assert.equal(app.element('name').value, projects[index].name)
  }
  app.event('#delete-project', 'click')
  assert.deepEqual(app.read().projects, [restored[0]])
  assert.deepEqual(launch(app.read().projects).read().projects, [restored[0]])
})

test('loading valid legacy data preserves every project, user field, and active selection', () => {
  const projects = Array.from({ length: 101 }, (_, index) => ({ ...core.createProject(`legacy-${index}`), notes: 'n'.repeat(8100), name: `  Name ${index}  `, customField: { keep: true } }))
  const original = { version: 1, projects, currentId: 'legacy-100', customState: 'keep' }
  const restored = launch(projects, { raw: JSON.stringify(original) }).read()
  assert.equal(restored.projects.length, original.projects.length)
  assert.equal(JSON.stringify(restored), JSON.stringify(original))
})

test('malformed, unsupported and partially damaged storage is never overwritten on load or edit', () => {
  for (const raw of ['{broken', 'null', '{}', '{"version":2,"projects":[]}', '{"version":1,"projects":[]}', '{"version":1,"projects":[{"id":"keep"},null]}']) {
    const app = launch(undefined, { raw })
    app.element('name').value = 'In-memory work'
    app.event('#project-form', 'input')
    assert.equal(app.raw(), raw)
    assert.equal(app.writes(), 0)
    assert.equal(app.element('#app-status').dataset.error, 'true')
  }
})

test('storage read failure blocks writes and preserves original bytes', () => {
  const raw = JSON.stringify({ version: 1, projects: [core.createProject('existing')], currentId: 'existing' })
  const app = launch(undefined, { raw, readFails: true })
  app.event('#new-project', 'click')
  assert.equal(app.raw(), raw)
  assert.equal(app.writes(), 0)
})

test('failed repair writes leave original bytes intact while repaired projects remain accessible and exportable', async () => {
  const projects = ['First', 'Second'].map(name => ({ ...core.createProject('duplicate'), name, notes: `${name} notes` }))
  const raw = JSON.stringify({ version: 1, projects, currentId: 'duplicate' })
  const app = launch(projects, { raw, writeFails: true })
  const options = app.element('#project-select').children
  assert.equal(new Set(options.map(option => option.value)).size, 2)
  app.element('#project-select').value = options[1].value
  app.event('#project-select', 'change')
  assert.equal(app.element('name').value, 'Second')
  assert.equal(app.raw(), raw)
  assert.equal(app.element('#app-status').dataset.error, 'true')
  app.event('#export-projects', 'click')
  const backup = await app.exported()
  assert.equal(new Set(backup.projects.map(project => project.id)).size, 2)
  assert.deepEqual(backup.projects.map(project => project.notes), projects.map(project => project.notes))
  assert.equal(app.raw(), raw)
})

test('recovery avoids ID collisions and keeps later original IDs and custom fields', () => {
  const projects = ['duplicate', 'duplicate', 'replacement', '', 'replacement-2'].map((id, index) => ({ ...core.createProject(id), notes: `Project ${index}`, custom: [index] }))
  const restored = launch(projects).read().projects
  assert.equal(new Set(restored.map(p => p.id)).size, 5)
  assert.equal(restored[0].id, 'duplicate')
  assert.equal(restored[2].id, 'replacement')
  assert.equal(restored[4].id, 'replacement-2')
  for (let index = 0; index < projects.length; index++) {
    assert.deepEqual({ ...restored[index], id: projects[index].id }, projects[index])
  }
})

test('storage events repair in memory without write-back loops and preserve malformed external data', () => {
  const app = launch()
  const writes = app.writes()
  const projects = ['First', 'Second'].map(name => ({ ...core.createProject('duplicate'), name }))
  const raw = JSON.stringify({ version: 1, projects, currentId: 'duplicate' })
  app.externalWrite(raw)
  assert.equal(new Set(app.element('#project-select').children.map(option => option.value)).size, 2)
  assert.equal(app.writes(), writes)
  app.externalWrite('{broken')
  app.event('#project-form', 'input')
  assert.equal(app.raw(), '{broken')
  assert.equal(app.writes(), writes)
})

test('an absent storage key still creates and saves a usable first project', () => {
  const app = launch(undefined, { raw: null })
  assert.equal(app.read().projects.length, 1)
  assert.equal(app.element('#app-status').dataset.error, 'false')
})

