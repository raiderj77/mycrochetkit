export const STORAGE_VERSION = 1

export const textFields = [
  'name',
  'pattern',
  'startedOn',
  'yarnName',
  'yarnWeight',
  'hookSize',
  'dyeLot',
  'gaugeSize',
  'targetWidth',
  'targetLength',
  'notes',
]

export const numberFields = [
  'skeinsOnHand',
  'yardsPerSkein',
  'gaugeStitches',
  'gaugeRows',
  'currentRow',
  'targetRows',
]

const textLimits = {
  name: 80,
  pattern: 160,
  startedOn: 10,
  yarnName: 120,
  yarnWeight: 40,
  hookSize: 40,
  dyeLot: 60,
  gaugeSize: 40,
  targetWidth: 40,
  targetLength: 40,
  notes: 8000,
}

const numberRules = {
  skeinsOnHand: { maximum: 999, step: 0.1 },
  yardsPerSkein: { maximum: 99999, step: 1 },
  gaugeStitches: { maximum: 999, step: 0.1 },
  gaugeRows: { maximum: 999, step: 0.1 },
  currentRow: { maximum: 999999, step: 1 },
  targetRows: { maximum: 999999, step: 1 },
}

const cleanText = (value, limit) => String(value ?? '').trim().slice(0, limit)

const cleanNumber = (value, { maximum, step }) => {
  if (value === '' || value === null || value === undefined) return ''
  const number = Number(value)
  if (!Number.isFinite(number)) return ''
  const clamped = Math.min(Math.max(number, 0), maximum)
  const stepped = Math.round(clamped / step) * step
  const decimalPlaces = String(step).split('.')[1]?.length ?? 0
  return Number(stepped.toFixed(decimalPlaces))
}

export function sanitizeNumberField(field, value) {
  const rule = numberRules[field]
  return rule ? cleanNumber(value, rule) : ''
}

export function createProject(id, now = new Date().toISOString()) {
  return {
    id,
    name: 'Untitled project',
    pattern: '',
    startedOn: '',
    yarnName: '',
    yarnWeight: '',
    hookSize: '',
    dyeLot: '',
    skeinsOnHand: '',
    yardsPerSkein: '',
    gaugeStitches: '',
    gaugeRows: '',
    gaugeSize: '',
    targetWidth: '',
    targetLength: '',
    currentRow: 0,
    targetRows: '',
    notes: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function sanitizeProject(candidate, fallbackId, now = new Date().toISOString()) {
  const safe = createProject(cleanText(candidate?.id, 100) || fallbackId, now)

  for (const field of textFields) {
    safe[field] = cleanText(candidate?.[field], textLimits[field])
  }

  for (const field of numberFields) {
    safe[field] = sanitizeNumberField(field, candidate?.[field])
  }

  safe.name = safe.name || 'Untitled project'
  safe.createdAt = cleanText(candidate?.createdAt, 40) || now
  safe.updatedAt = cleanText(candidate?.updatedAt, 40) || now
  return safe
}

// Stored projects are user data, not a new import: do not trim fields or drop
// records during recovery. Reserve existing IDs before generating replacements.
export function restoreStoredState(json, idFactory) {
  const parsed = JSON.parse(json)
  const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
  if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.projects) || !parsed.projects.length) {
    throw new Error('The saved planner data is not supported.')
  }
  for (const project of parsed.projects) {
    if (!isRecord(project)
      || [...textFields, 'createdAt', 'updatedAt'].some(field => field in project && typeof project[field] !== 'string')
      || numberFields.some(field => field in project && typeof project[field] !== 'number' && typeof project[field] !== 'string')) {
      throw new Error('A saved project could not be read safely.')
    }
  }
  const validId = (id) => typeof id === 'string' && id.trim().length > 0
  const reservedIds = new Set(parsed.projects.map(project => project.id).filter(validId))
  const usedIds = new Set()
  const projects = parsed.projects.map((project, index) => {
    let id = project.id
    if (!validId(id) || usedIds.has(id)) {
      const baseId = cleanText(idFactory(index), 90) || `recovered-${index + 1}`
      id = baseId
      let suffix = 2
      while (reservedIds.has(id) || usedIds.has(id)) id = `${baseId}-${suffix++}`
    }
    usedIds.add(id)
    return { ...createProject(id), ...project, id }
  })
  const currentId = usedIds.has(parsed.currentId) ? parsed.currentId : projects[0].id
  return { ...parsed, projects, currentId }
}

export function calculateProgress(project) {
  const current = Number(project?.currentRow)
  const target = Number(project?.targetRows)
  if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0) return null
  return Math.min(Math.max((current / target) * 100, 0), 100)
}

export function calculateYardage(project) {
  const skeins = Number(project?.skeinsOnHand)
  const yards = Number(project?.yardsPerSkein)
  if (!Number.isFinite(skeins) || !Number.isFinite(yards) || skeins <= 0 || yards <= 0) return null
  return skeins * yards
}

export function createBackup(projects, now = new Date().toISOString()) {
  return JSON.stringify({
    application: 'MyCrochetKit',
    version: STORAGE_VERSION,
    exportedAt: now,
    projects,
  }, null, 2)
}

export function parseBackup(json, idFactory = (index) => `imported-${index + 1}`, now = new Date().toISOString()) {
  const parsed = JSON.parse(json)
  if (parsed?.application !== 'MyCrochetKit' || parsed?.version !== STORAGE_VERSION || !Array.isArray(parsed.projects)) {
    throw new Error('This is not a supported MyCrochetKit backup.')
  }
  if (parsed.projects.length < 1 || parsed.projects.length > 100) {
    throw new Error('A backup must contain between 1 and 100 projects.')
  }
  const usedIds = new Set()
  return parsed.projects.map((project, index) => {
    const safe = sanitizeProject(project, idFactory(index), now)
    if (usedIds.has(safe.id)) {
      const baseId = cleanText(idFactory(index), 90) || `imported-${index + 1}`
      let replacementId = baseId
      let suffix = 2
      while (usedIds.has(replacementId)) {
        replacementId = `${baseId}-${suffix}`
        suffix += 1
      }
      safe.id = replacementId
    }
    usedIds.add(safe.id)
    return safe
  })
}

export function createProjectSummary(project) {
  const rows = Number(project.currentRow) || 0
  const lines = [
    project.name || 'Untitled project',
    project.yarnName ? `Yarn: ${project.yarnName}` : null,
    project.hookSize ? `Hook: ${project.hookSize}` : null,
    `Current row: ${rows}${project.targetRows ? ` of ${project.targetRows}` : ''}`,
    project.targetWidth || project.targetLength ? `Target size: ${project.targetWidth || '?'} × ${project.targetLength || '?'}` : null,
    'Planned with MyCrochetKit · Calculators at fibertools.app',
  ]
  return lines.filter(Boolean).join('\n')
}
