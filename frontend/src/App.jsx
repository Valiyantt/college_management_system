import React, { useEffect, useState } from 'react'
import AddressForm from './components/AddressForm'
import AddressList from './components/AddressList'
import EnrollmentStudent from './pages/EnrollmentStudent'
import EnrollmentAdmin from './pages/EnrollmentAdmin'
import Toast from './components/Toast'
import ConfirmDialog from './components/ConfirmDialog'
import LoadingSpinner from './components/LoadingSpinner'
import { useToast } from './hooks/useToast'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function App() {
  const [addresses, setAddresses] = useState([])
  const [editing, setEditing] = useState(null)
  const [view, setView] = useState('addresses')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const { toasts, removeToast, success, error } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/addresses`)
      if (!res.ok) throw new Error('Failed to load addresses')
      const data = await res.json()
      setAddresses(data)
    } catch (err) {
      error(err.message || 'Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (addr) => {
    try {
      const method = addr.id ? 'PUT' : 'POST'
      const url = addr.id ? `${API}/api/addresses/${addr.id}` : `${API}/api/addresses`
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addr)
      })
      
      if (!res.ok) throw new Error('Failed to save address')
      
      success(addr.id ? 'Address updated successfully' : 'Address created successfully')
      setEditing(null)
      await load()
    } catch (err) {
      error(err.message || 'Failed to save address')
    }
  }

  const handleDelete = async (id) => {
    const addr = addresses.find(a => a.id === id || a.Id === id)
    setDeleteConfirm({ 
      id, 
      name: `${addr?.streetName || addr?.StreetName || ''}, ${addr?.city || addr?.City || ''}` 
    })
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API}/api/addresses/${deleteConfirm.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete address')
      success('Address deleted successfully')
      await load()
    } catch (err) {
      error(err.message || 'Failed to delete address')
    } finally {
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="container">
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

      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Address"
          message={`Are you sure you want to delete the address at ${deleteConfirm.name}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
        />
      )}

      <header className="app-header">
        <div className="brand">
          <div className="logo">CMS</div>
          <div>
            <h1>College Management System</h1>
            <p className="muted">Permanent Addresses • Enrollment • Records</p>
          </div>
        </div>
        <nav style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost" onClick={() => setView('addresses')} aria-label="View addresses">Addresses</button>
          <button className="btn btn-ghost" onClick={() => setView('enroll-student')} aria-label="Student enrollment">Enrollment (Student)</button>
          <button className="btn btn-ghost" onClick={() => setView('enroll-admin')} aria-label="Admin enrollment">Enrollment (Admin)</button>
        </nav>
      </header>

      {view === 'addresses' && (
        <div className="layout">
          <div className="panel">
            <AddressForm onSave={handleSave} editing={editing} onCancel={() => setEditing(null)} />
          </div>
          <div className="panel">
            <div className="card-title">
              <h2 style={{margin:0}}>Addresses</h2>
              <div className="muted">{addresses.length} records</div>
            </div>
            {loading ? (
              <LoadingSpinner text="Loading addresses..." />
            ) : (
              <AddressList addresses={addresses} onEdit={(a) => setEditing(a)} onDelete={handleDelete} />
            )}
          </div>
        </div>
      )}

      {view === 'enroll-student' && (
        <div className="layout">
          <div className="panel">
            <EnrollmentStudent />
          </div>
          <div className="panel">
            <div className="muted">Use this pane to start a new enrollment and add requirement metadata.</div>
          </div>
        </div>
      )}

      {view === 'enroll-admin' && (
        <div className="layout">
          <div className="panel">
            <EnrollmentAdmin />
          </div>
          <div className="panel">
            <div className="muted">Admin tools: verify records, assign schedules and finalize enrollments.</div>
          </div>
        </div>
      )}
    </div>
  )
}
