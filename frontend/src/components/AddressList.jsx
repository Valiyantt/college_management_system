import React, { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

export default function AddressList({ addresses, onEdit, onDelete }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = (a) => {
    setDeleteConfirm({
      id: a.id ?? a.Id,
      name: `${a.streetName ?? a.StreetName}, ${a.city ?? a.City}`
    })
  }

  const confirmDelete = () => {
    onDelete(deleteConfirm.id)
    setDeleteConfirm(null)
  }

  return (
    <>
      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Address"
          message={`Are you sure you want to delete the address at ${deleteConfirm.name}? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          isDangerous={true}
        />
      )}

      {addresses.length === 0 ? (
        <div className="empty">No addresses yet. Use the form to add the first one.</div>
      ) : (
        <table className="address-table">
          <thead>
            <tr>
              <th>Province</th>
              <th>City</th>
              <th>Barangay</th>
              <th>House No.</th>
              <th>Street</th>
              <th>Zip</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map(a => (
              <tr key={a.id ?? a.Id}>
                <td>{a.province ?? a.Province}</td>
                <td>{a.city ?? a.City}</td>
                <td>{a.barangay ?? a.Barangay}</td>
                <td>{a.houseNumberOrBuildingNumber ?? a.HouseNumberOrBuildingNumber || '—'}</td>
                <td>{a.streetName ?? a.StreetName}</td>
                <td>{a.zipcode ?? a.Zipcode}</td>
                <td className="actions">
                  <button 
                    className="edit" 
                    onClick={() => onEdit(a)}
                    title="Edit this address"
                    aria-label={`Edit address at ${a.streetName ?? a.StreetName}`}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete" 
                    onClick={() => handleDelete(a)}
                    title="Delete this address"
                    aria-label={`Delete address at ${a.streetName ?? a.StreetName}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
