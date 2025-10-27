import React, { useEffect, useState } from 'react'
import AddressForm from './components/AddressForm'
import AddressList from './components/AddressList'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function App() {
  const [addresses, setAddresses] = useState([])
  const [editing, setEditing] = useState(null)

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
        <div className="muted">Admin Panel</div>
      </header>

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
    </div>
  )
}
