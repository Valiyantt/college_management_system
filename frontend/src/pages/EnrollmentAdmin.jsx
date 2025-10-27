import React, { useState } from 'react'
import api from '../api'

export default function EnrollmentAdmin() {
  const [enrollId, setEnrollId] = useState('')
  const [record, setRecord] = useState(null)
  const [courseId, setCourseId] = useState('')
  const [details, setDetails] = useState('')

  const load = async (e) => {
    e?.preventDefault()
    try {
      const res = await api.getEnrollment(Number(enrollId))
      setRecord(res)
    } catch (err) { alert('Error: ' + (err.message || err)) }
  }

  const verify = async () => {
    try { await api.verifyEnrollment(Number(enrollId)); alert('Verified'); await load() } catch (err) { alert('Error: ' + (err.message || err)) }
  }

  const assign = async (e) => {
    e.preventDefault()
    try { await api.assignSchedule(Number(enrollId), { CourseId: Number(courseId), Details: details }); alert('Schedule assigned'); await load() } catch (err) { alert('Error: ' + (err.message || err)) }
  }

  const finalize = async () => {
    try { await api.finalizeEnrollment(Number(enrollId)); alert('Finalized'); await load() } catch (err) { alert('Error: ' + (err.message || err)) }
  }

  return (
    <div>
      <h2>Admin — Enrollment</h2>
      <form onSubmit={load} className="address-form">
        <div className="field">
          <label>Enrollment ID</label>
          <input value={enrollId} onChange={e => setEnrollId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <div className="buttons">
          <button className="btn btn-primary" type="submit">Load</button>
        </div>
      </form>

      {record && (
        <div className="panel" style={{marginTop:16}}>
          <h3>Record</h3>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(record, null, 2)}</pre>

          <div style={{marginTop:12}}>
            <button className="btn btn-ghost" onClick={verify}>Verify</button>
            <button className="btn btn-ghost" onClick={finalize} style={{marginLeft:8}}>Finalize</button>
          </div>

          <form onSubmit={assign} style={{marginTop:12}}>
            <div className="row">
              <div className="field">
                <label>Course ID</label>
                <input value={courseId} onChange={e => setCourseId(e.target.value)} />
              </div>
              <div className="field">
                <label>Details</label>
                <input value={details} onChange={e => setDetails(e.target.value)} />
              </div>
            </div>
            <div className="buttons">
              <button className="btn btn-primary" type="submit">Assign Schedule</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
