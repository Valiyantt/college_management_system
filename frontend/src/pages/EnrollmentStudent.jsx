import React, { useState } from 'react'
import api from '../api'

export default function EnrollmentStudent() {
  const [studentId, setStudentId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [notes, setNotes] = useState('')
  const [created, setCreated] = useState(null)
  const [docName, setDocName] = useState('')
  const [docType, setDocType] = useState('')

  const start = async (e) => {
    e.preventDefault()
    try {
      const dto = { StudentId: Number(studentId), CourseId: courseId ? Number(courseId) : null, Notes: notes }
      const res = await api.startEnrollment(dto)
      setCreated(res)
      alert('Enrollment request created')
    } catch (err) { alert('Error: ' + (err.message || err)) }
  }

  const addDoc = async (e) => {
    e.preventDefault()
    if (!created) return alert('Create an enrollment first')
    try {
      const dto = { FileName: docName, FilePath: null, DocumentType: docType }
      const res = await api.addDocument(created.id || created.Id, dto)
      alert('Document metadata added')
    } catch (err) { alert('Error: ' + (err.message || err)) }
  }

  return (
    <div>
      <h2>Student Enrollment</h2>
      <form onSubmit={start} className="address-form">
        <div className="field">
          <label>Student ID</label>
          <input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <div className="field">
          <label>Course ID (optional)</label>
          <input value={courseId} onChange={e => setCourseId(e.target.value)} placeholder="e.g. 2" />
        </div>
        <div className="field">
          <label>Notes</label>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional info" />
        </div>
        <div className="buttons">
          <button className="btn btn-primary" type="submit">Start Enrollment</button>
        </div>
      </form>

      {created && (
        <div className="panel" style={{marginTop:16}}>
          <h3>Enrollment created</h3>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(created, null, 2)}</pre>
          <form onSubmit={addDoc} style={{marginTop:12}}>
            <div className="field">
              <label>Document Name</label>
              <input value={docName} onChange={e => setDocName(e.target.value)} />
            </div>
            <div className="field">
              <label>Document Type</label>
              <input value={docType} onChange={e => setDocType(e.target.value)} />
            </div>
            <div className="buttons">
              <button className="btn btn-ghost" type="submit">Add Document Metadata</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
