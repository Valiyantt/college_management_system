import React, { useState } from 'react'
import api from '../api'
import Toast from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'

export default function EnrollmentAdmin() {
  const [enrollId, setEnrollId] = useState('')
  const [record, setRecord] = useState(null)
  const [courseId, setCourseId] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { toasts, removeToast, success, error } = useToast()

  const load = async (e) => {
    e?.preventDefault()
    
    if (!enrollId.trim()) {
      setErrors({ enrollId: 'Enrollment ID is required' })
      return
    }
    
    const eid = Number(enrollId)
    if (isNaN(eid) || eid <= 0) {
      setErrors({ enrollId: 'Enrollment ID must be a positive number' })
      return
    }
    
    setErrors({})
    setLoading(true)
    
    try {
      const res = await api.getEnrollment(eid)
      setRecord(res)
    } catch (err) {
      error(err.message || 'Failed to load enrollment')
      setRecord(null)
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    setActionLoading(true)
    try {
      await api.verifyEnrollment(Number(enrollId))
      success('Enrollment verified successfully')
      await load()
    } catch (err) {
      error(err.message || 'Failed to verify enrollment')
    } finally {
      setActionLoading(false)
    }
  }

  const assign = async (e) => {
    e.preventDefault()
    
    if (!courseId.trim()) {
      error('Please provide a course ID')
      return
    }
    
    setActionLoading(true)
    try {
      await api.assignSchedule(Number(enrollId), { 
        CourseId: Number(courseId), 
        Details: details 
      })
      success('Schedule assigned successfully')
      setCourseId('')
      setDetails('')
      await load()
    } catch (err) {
      error(err.message || 'Failed to assign schedule')
    } finally {
      setActionLoading(false)
    }
  }

  const finalize = async () => {
    setActionLoading(true)
    try {
      await api.finalizeEnrollment(Number(enrollId))
      success('Enrollment finalized successfully')
      await load()
    } catch (err) {
      error(err.message || 'Failed to finalize enrollment')
    } finally {
      setActionLoading(false)
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

      <h2>Admin — Enrollment Management</h2>
      <form onSubmit={load} className="address-form">
        <div className={`field ${errors.enrollId ? 'error' : ''}`}>
          <label htmlFor="enrollId">Enrollment ID <span className="muted">*</span></label>
          <input 
            id="enrollId"
            value={enrollId} 
            onChange={(e) => {
              setEnrollId(e.target.value)
              setErrors({})
            }}
            placeholder="e.g. 1"
            disabled={loading}
            aria-invalid={!!errors.enrollId}
            aria-describedby={errors.enrollId ? 'enrollId-error' : undefined}
          />
          {errors.enrollId && <div id="enrollId-error" className="field-error">{errors.enrollId}</div>}
        </div>
        <div className="buttons">
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load'}
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner text="Loading enrollment..." />}

      {record && (
        <div className="panel" style={{marginTop:16}}>
          <h3>Enrollment Record</h3>
          <div style={{
            background: '#f3f4f6',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px'}}>
              <div><strong>Enrollment ID:</strong> {record.id || record.Id}</div>
              <div><strong>Student ID:</strong> {record.studentId || record.StudentId}</div>
              <div><strong>Status:</strong> {record.status || record.Status || 'N/A'}</div>
              <div><strong>Created:</strong> {new Date(record.createdAt || record.CreatedAt).toLocaleDateString()}</div>
            </div>
          </div>

          <details style={{cursor: 'pointer', marginBottom: '16px'}}>
            <summary style={{padding: '8px', userSelect: 'none'}}>View full JSON</summary>
            <pre style={{
              whiteSpace: 'pre-wrap',
              background: '#f9fafb',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '200px',
              marginTop: '8px'
            }}>{JSON.stringify(record, null, 2)}</pre>
          </details>

          <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
            <button 
              className="btn btn-ghost"
              onClick={verify}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Verify Enrollment'}
            </button>
            <button 
              className="btn btn-ghost"
              onClick={finalize}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Finalize Enrollment'}
            </button>
          </div>

          <h4 style={{marginBottom: 12}}>Assign Schedule</h4>
          <form onSubmit={assign}>
            <div className="row">
              <div className="field">
                <label htmlFor="courseId">Course ID</label>
                <input 
                  id="courseId"
                  value={courseId} 
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="e.g. 5"
                  disabled={actionLoading}
                />
              </div>
              <div className="field">
                <label htmlFor="details">Details</label>
                <input 
                  id="details"
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Schedule details"
                  disabled={actionLoading}
                />
              </div>
            </div>
            <div className="buttons">
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={actionLoading}
              >
                {actionLoading ? 'Assigning...' : 'Assign Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
