import React, { useEffect, useState } from 'react'
import AddressForm from './components/AddressForm'
import AddressList from './components/AddressList'
import EnrollmentStudent from './pages/EnrollmentStudent'
import EnrollmentAdmin from './pages/EnrollmentAdmin'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function App() {
  const [addresses, setAddresses] = useState([])
  const [editing, setEditing] = useState(null)
  const [view, setView] = useState('addresses')

  const load = async () => {
    const res = await fetch(`${API}/api/addresses`)
    const data = await res.json()
    setAddresses(data)
  }

  useEffect(() => { load() }, [])

  const handleSave = async (addr) => {
    if (addr.id) {
      await fetch(`${API}/api/addresses/${addr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addr)
      })
    } else {
      await fetch(`${API}/api/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addr)
      })
    }
    setEditing(null)
    await load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete address?')) return
    await fetch(`${API}/api/addresses/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="container">
      <header className="app-header">
        <div className="brand">
          <div className="logo">CMS</div>
          <div>
            <h1>College Management System</h1>
            <p className="muted">Permanent Addresses • Enrollment • Records</p>
          </div>
        </div>
        <nav style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost" onClick={() => setView('addresses')}>Addresses</button>
          <button className="btn btn-ghost" onClick={() => setView('enroll-student')}>Enrollment (Student)</button>
          <button className="btn btn-ghost" onClick={() => setView('enroll-admin')}>Enrollment (Admin)</button>
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
            <AddressList addresses={addresses} onEdit={(a) => setEditing(a)} onDelete={handleDelete} />
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
