import React from 'react'

export default function AddressList({ addresses, onEdit, onDelete }) {
  return (
    <div>
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
                <td>{a.houseNumberOrBuildingNumber ?? a.HouseNumberOrBuildingNumber}</td>
                <td>{a.streetName ?? a.StreetName}</td>
                <td>{a.zipcode ?? a.Zipcode}</td>
                <td className="actions">
                  <button className="edit" onClick={() => onEdit(a)}>Edit</button>
                  <button className="delete" onClick={() => onDelete(a.id ?? a.Id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
