import React, { useState } from 'react'
import api from '../api'
import Toast from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'

export default function EnrollmentStudent() {
  const [studentId, setStudentId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [notes, setNotes] = useState('')
  const [created, setCreated] = useState(null)
  const [docName, setDocName] = useState('')
  const [docType, setDocType] = useState('')
  const [loading, setLoading] = useState(false)
  const [docLoading, setDocLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { toasts, removeToast, success, error } = useToast()

  const start = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!studentId.trim()) {
      setErrors({ studentId: 'Student ID is required' })
      return
    }
    
    const sid = Number(studentId)
    if (isNaN(sid) || sid <= 0) {
      setErrors({ studentId: 'Student ID must be a positive number' })
      return
    }
    
    setErrors({})
    setLoading(true)
    
    try {
      const dto = { 
        StudentId: sid, 
        CourseId: courseId ? Number(courseId) : null, 
        Notes: notes 
      }
      const res = await api.startEnrollment(dto)
      setCreated(res)
      success('Enrollment request created successfully')
      setStudentId('')
      setCourseId('')
      setNotes('')
    } catch (err) {
      error(err.message || 'Failed to create enrollment')
    } finally {
      setLoading(false)
    }
  }

  const addDoc = async (e) => {
    e.preventDefault()
    if (!created) return error('Create an enrollment first')
    
    if (!docName.trim() || !docType.trim()) {
      error('Please provide both document name and type')
      return
    }
    
    setDocLoading(true)
    
    try {
      const dto = { FileName: docName, FilePath: null, DocumentType: docType }
      await api.addDocument(created.id || created.Id, dto)
      success('Document metadata added successfully')
      setDocName('')
      setDocType('')
    } catch (err) {
      error(err.message || 'Failed to add document')
    } finally {
      setDocLoading(false)
    }
  }

  return (
    <div>
      <div className="toast-container">
        {toasts.map(t => (
          <Toast 
            key={t.id} 
            message={t.message} 
            type={t.type} 
            duration={t.duration}
            onClose={() => removeToast(t.id)} 
          />
        ))}
      </div>

      <h2>Student Enrollment</h2>
      <form onSubmit={start} className="address-form">
        <div className={`field ${errors.studentId ? 'error' : ''}`}>
          <label htmlFor="studentId">Student ID <span className="muted">*</span></label>
          <input 
            id="studentId"
            value={studentId} 
            onChange={(e) => {
              setStudentId(e.target.value)
              setErrors({})
            }}
            placeholder="e.g. 1"
            disabled={loading}
          />
          {errors.studentId && <div className="field-error">{errors.studentId}</div>}
        </div>
        
        <div className="field">
          <label htmlFor="courseId">Course ID (optional)</label>
          <input 
            id="courseId"
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="e.g. 2"
            disabled={loading}
          />
        </div>
        
        <div className="field">
          <label htmlFor="notes">Notes</label>
          <input 
            id="notes"
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional info"
            disabled={loading}
          />
        </div>
        
        <div className="buttons">
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Start Enrollment'}
          </button>
        </div>
      </form>

      {created && (
        <div className="panel" style={{marginTop:16}}>
          <h3>✓ Enrollment Created</h3>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#166534'
          }}>
            Enrollment ID: <strong>{created.id || created.Id}</strong>
          </div>

          <details style={{cursor: 'pointer', marginBottom: '16px'}}>
            <summary style={{padding: '8px', userSelect: 'none'}}>View full details</summary>
            <pre style={{
              whiteSpace: 'pre-wrap',
              background: '#f9fafb',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '200px',
              marginTop: '8px'
            }}>{JSON.stringify(created, null, 2)}</pre>
          </details>

          <h4 style={{marginTop: 16, marginBottom: 12}}>Add Document Metadata</h4>
          <form onSubmit={addDoc}>
            <div className="field">
              <label htmlFor="docName">Document Name</label>
              <input 
                id="docName"
                value={docName} 
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Transcript"
                disabled={docLoading}
              />
            </div>
            
            <div className="field">
              <label htmlFor="docType">Document Type</label>
              <input 
                id="docType"
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                placeholder="e.g. Academic"
                disabled={docLoading}
              />
            </div>
            
            <div className="buttons">
              <button 
                className="btn btn-ghost" 
                type="submit"
                disabled={docLoading}
              >
                {docLoading ? 'Adding...' : 'Add Document'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
