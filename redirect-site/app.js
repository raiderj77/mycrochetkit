import {
  calculateProgress,
  calculateYardage,
  createBackup,
  createProject,
  createProjectSummary,
  numberFields,
  parseBackup,
  restoreStoredState,
  sanitizeNumberField,
  STORAGE_VERSION,
  textFields,
} from './planner-core.js'

const storageKey = `mycrochetkit:planner:v${STORAGE_VERSION}`
const form = document.querySelector('#project-form')
const projectSelect = document.querySelector('#project-select')
const status = document.querySelector('#app-status')
const progressBar = document.querySelector('#progress-bar')
const progressTrack = document.querySelector('.progress-track')
const progressCopy = document.querySelector('#progress-copy')
const rowOutput = document.querySelector('#row-output')
const yardageSummary = document.querySelector('#yardage-summary')
const progressSummary = document.querySelector('#progress-summary')
const savedSummary = document.querySelector('#saved-summary')

const newId = () => globalThis.crypto?.randomUUID?.() ?? `project-${Date.now()}-${Math.random().toString(16).slice(2)}`
const now = () => new Date().toISOString()

let storageReadBlocked = false
let state = loadState()

function loadState() {
  storageReadBlocked = false
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) return restoreStoredState(stored, () => newId())
  } catch {
    storageReadBlocked = true
  }
  const project = createProject(newId())
  return { version: STORAGE_VERSION, projects: [project], currentId: project.id }
}

function currentProject() {
  return state.projects.find(({ id }) => id === state.currentId) ?? state.projects[0]
}

function saveState(message = 'Saved on this device.') {
  if (storageReadBlocked) {
    setStatus('', true)
    return false
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
    setStatus(message)
    return true
  } catch {
    setStatus('This browser could not save the project. Export a backup before leaving.', true)
    return false
  }
}

function setStatus(message, isError = false) {
  if (!status) return
  if (storageReadBlocked) {
    message = 'The existing saved data could not be read safely and has been left unchanged. Changes are temporary; export a backup before leaving.'
    isError = true
  }
  status.textContent = message
  status.dataset.error = isError ? 'true' : 'false'
}

function renderProjectOptions() {
  projectSelect.replaceChildren(...state.projects.map((project) => {
    const option = document.createElement('option')
    option.value = project.id
    option.textContent = project.name || 'Untitled project'
    option.selected = project.id === state.currentId
    return option
  }))
}

function renderForm() {
  const project = currentProject()
  for (const field of [...textFields, ...numberFields]) {
    const input = form.elements.namedItem(field)
    if (input) input.value = project[field] ?? ''
  }
  renderSummary(project)
}

function formatSavedDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not saved yet'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function renderSummary(project) {
  const currentRows = Number(project.currentRow) || 0
  const progress = calculateProgress(project)
  const yardage = calculateYardage(project)

  rowOutput.textContent = `Row ${currentRows.toLocaleString()}`
  progressBar.style.width = `${progress ?? 0}%`
  progressTrack.setAttribute('aria-valuenow', String(Math.round(progress ?? 0)))
  progressCopy.textContent = progress === null
    ? 'Add a target row count to see progress.'
    : `${currentRows.toLocaleString()} of ${Number(project.targetRows).toLocaleString()} rows (${Math.round(progress)}%).`

  yardageSummary.textContent = yardage === null ? 'Add skeins and yardage' : `${Math.round(yardage).toLocaleString()} yd`
  progressSummary.textContent = progress === null ? `${currentRows.toLocaleString()} rows` : `${Math.round(progress)}%`
  savedSummary.textContent = formatSavedDate(project.updatedAt)
}

function render() {
  renderProjectOptions()
  renderForm()
}

function updateFromForm() {
  const project = currentProject()
  for (const field of textFields) project[field] = String(form.elements.namedItem(field)?.value ?? '')
  for (const field of numberFields) {
    const value = form.elements.namedItem(field)?.value ?? ''
    project[field] = sanitizeNumberField(field, value)
  }
  project.name = project.name.trim() || 'Untitled project'
  project.updatedAt = now()
  saveState()
  renderProjectOptions()
  renderSummary(project)
}

function changeRow(amount) {
  const input = form.elements.namedItem('currentRow')
  const current = Number(input.value) || 0
  input.value = String(Math.max(0, Math.min(current + amount, 999999)))
  updateFromForm()
}

function addProject() {
  if (state.projects.length >= 100) {
    setStatus('The local planner is limited to 100 projects. Export and remove an older project first.', true)
    return
  }
  const project = createProject(newId())
  project.name = `Untitled project ${state.projects.length + 1}`
  state.projects.push(project)
  state.currentId = project.id
  saveState('New project created on this device.')
  render()
  form.elements.namedItem('name')?.focus()
}

function deleteProject() {
  const project = currentProject()
  if (!confirm(`Delete “${project.name}” from this browser? Export a backup first if you may need it later.`)) return
  state.projects = state.projects.filter(({ id }) => id !== project.id)
  if (!state.projects.length) state.projects.push(createProject(newId()))
  state.currentId = state.projects[0].id
  saveState('Project deleted from this device.')
  render()
}

function exportProjects() {
  const blob = new Blob([createBackup(state.projects)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  anchor.href = url
  anchor.download = `mycrochetkit-backup-${date}.json`
  anchor.click()
  URL.revokeObjectURL(url)
  setStatus(`Exported a backup of ${state.projects.length} project${state.projects.length === 1 ? '' : 's'}.`)
}

async function importProjects(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (file.size > 1_000_000) {
    setStatus('That backup is larger than the 1 MB safety limit.', true)
    return
  }

  try {
    const projects = parseBackup(await file.text(), () => newId())
    if (!confirm(`Replace the projects saved in this browser with ${projects.length} project${projects.length === 1 ? '' : 's'} from this backup?`)) return
    state = { version: STORAGE_VERSION, projects, currentId: projects[0].id }
    saveState('Backup imported and saved on this device.')
    render()
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'That backup could not be imported.', true)
  }
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(createProjectSummary(currentProject()))
    setStatus('Project summary copied. Nothing was posted or shared automatically.')
  } catch {
    setStatus('The browser blocked clipboard access. Printing or exporting still works.', true)
  }
}

form.addEventListener('input', updateFromForm)
form.addEventListener('change', updateFromForm)
projectSelect.addEventListener('change', () => {
  state.currentId = projectSelect.value
  saveState('Project opened.')
  renderForm()
})
document.querySelector('#new-project').addEventListener('click', addProject)
document.querySelector('#delete-project').addEventListener('click', deleteProject)
document.querySelector('#increment-row').addEventListener('click', () => changeRow(1))
document.querySelector('#decrement-row').addEventListener('click', () => changeRow(-1))
document.querySelector('#export-projects').addEventListener('click', exportProjects)
document.querySelector('#import-projects').addEventListener('change', importProjects)
document.querySelector('#copy-summary').addEventListener('click', copySummary)
document.querySelector('#print-project').addEventListener('click', () => window.print())
window.addEventListener('storage', (event) => {
  if (event.key !== storageKey) return
  state = loadState()
  render()
  setStatus('Planner refreshed with changes from another tab.')
})

document.querySelectorAll('[data-app-hidden]').forEach((element) => { element.hidden = false })
saveState('Ready. Changes are saved on this device as you type.')
render()
