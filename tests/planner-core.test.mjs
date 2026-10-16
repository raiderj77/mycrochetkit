import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateProgress,
  calculateYardage,
  createBackup,
  createProject,
  createProjectSummary,
  parseBackup,
  sanitizeNumberField,
  sanitizeProject,
} from '../redirect-site/planner-core.js'

test('creates a private blank project without account fields', () => {
  const project = createProject('abc', '2026-10-15T12:00:00.000Z')
  assert.equal(project.id, 'abc')
  assert.equal(project.name, 'Untitled project')
  assert.equal('email' in project, false)
  assert.equal('userId' in project, false)
})

test('calculates row progress and caps it at 100 percent', () => {
  assert.equal(calculateProgress({ currentRow: 25, targetRows: 100 }), 25)
  assert.equal(calculateProgress({ currentRow: 110, targetRows: 100 }), 100)
  assert.equal(calculateProgress({ currentRow: 12, targetRows: '' }), null)
})

test('calculates yarn on hand only from valid positive values', () => {
  assert.equal(calculateYardage({ skeinsOnHand: 4.5, yardsPerSkein: 220 }), 990)
  assert.equal(calculateYardage({ skeinsOnHand: '', yardsPerSkein: 220 }), null)
})

test('sanitizes imported values and clamps numbers', () => {
  const project = sanitizeProject({
    id: 'safe',
    name: 'x'.repeat(100),
    currentRow: -2,
    targetRows: 2_000_000,
    notes: 'n'.repeat(9000),
  }, 'fallback')
  assert.equal(project.name.length, 80)
  assert.equal(project.currentRow, 0)
  assert.equal(project.targetRows, 999999)
  assert.equal(project.notes.length, 8000)
})

test('normalizes live numeric fields to their allowed range and step', () => {
  assert.equal(sanitizeNumberField('currentRow', -4), 0)
  assert.equal(sanitizeNumberField('currentRow', 8.7), 9)
  assert.equal(sanitizeNumberField('skeinsOnHand', 4.56), 4.6)
  assert.equal(sanitizeNumberField('yardsPerSkein', 100000), 99999)
  assert.equal(sanitizeNumberField('unknown', 12), '')
})

test('round trips a versioned backup', () => {
  const project = createProject('project-one')
  project.name = 'Blanket'
  const parsed = parseBackup(createBackup([project], '2026-10-15T12:00:00.000Z'))
  assert.equal(parsed.length, 1)
  assert.equal(parsed[0].name, 'Blanket')
})

test('rejects unrelated or oversized backups', () => {
  assert.throws(() => parseBackup('{"projects":[]}'), /not a supported/)
  assert.throws(() => parseBackup(JSON.stringify({ application: 'MyCrochetKit', version: 1, projects: [] })), /between 1 and 100/)
})

test('replaces duplicate imported project ids', () => {
  const backup = JSON.stringify({
    application: 'MyCrochetKit',
    version: 1,
    projects: [
      { id: 'duplicate', name: 'First' },
      { id: 'duplicate', name: 'Second' },
      { id: 'replacement', name: 'Third' },
    ],
  })
  const projects = parseBackup(backup, (index) => index === 1 ? 'replacement' : `generated-${index}`)
  assert.equal(new Set(projects.map(({ id }) => id)).size, 3)
  assert.deepEqual(projects.map(({ name }) => name), ['First', 'Second', 'Third'])
})

test('creates a copyable summary without private identifiers', () => {
  const summary = createProjectSummary({ name: 'Blanket', yarnName: 'Charcoal wool', hookSize: '6.5 mm', currentRow: 12, targetRows: 80 })
  assert.match(summary, /Blanket/)
  assert.match(summary, /Current row: 12 of 80/)
  assert.match(summary, /fibertools\.app/)
  assert.doesNotMatch(summary, /email|user id/i)
})
