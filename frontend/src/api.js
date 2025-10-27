const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const text = await res.text().catch(() => null)
    const err = new Error(text || res.statusText)
    err.status = res.status
    throw err
  }
  return res.status === 204 ? null : res.json()
}

export async function startEnrollment(dto) {
  return api('/api/enrollment/start', { method: 'POST', body: JSON.stringify(dto) })
}

export async function getEnrollment(id) {
  return api(`/api/enrollment/${id}`)
}

export async function getEnrollmentsByStudent(studentId) {
  return api(`/api/enrollment/student/${studentId}`)
}

export async function addDocument(id, dto) {
  return api(`/api/enrollment/${id}/documents`, { method: 'POST', body: JSON.stringify(dto) })
}

export async function verifyEnrollment(id) {
  return api(`/api/enrollment/${id}/verify`, { method: 'POST' })
}

export async function assignSchedule(id, dto) {
  return api(`/api/enrollment/${id}/assign-schedule`, { method: 'POST', body: JSON.stringify(dto) })
}

export async function finalizeEnrollment(id) {
  return api(`/api/enrollment/${id}/finalize`, { method: 'POST' })
}

export default { startEnrollment, getEnrollment, getEnrollmentsByStudent, addDocument, verifyEnrollment, assignSchedule, finalizeEnrollment }
