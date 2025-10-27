import React, { useEffect, useState } from 'react'

export default function AddressForm({ onSave, editing, onCancel }) {
  const empty = { id: 0, province: '', city: '', barangay: '', houseNumberOrBuildingNumber: '', streetName: '', zipcode: '' }
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (editing) {
      // map incoming model (Id) to lowercase id if necessary
      setForm({
        id: editing.id ?? editing.Id ?? 0,
        province: editing.province ?? editing.Province ?? '',
        city: editing.city ?? editing.City ?? '',
        barangay: editing.barangay ?? editing.Barangay ?? '',
        houseNumberOrBuildingNumber: editing.houseNumberOrBuildingNumber ?? editing.HouseNumberOrBuildingNumber ?? '',
        streetName: editing.streetName ?? editing.StreetName ?? '',
        zipcode: editing.zipcode ?? editing.Zipcode ?? ''
      })
    } else {
      setForm(empty)
    }
  }, [editing])

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // basic client-side validation
    if (!form.province || !form.city || !form.barangay || !form.streetName || !form.zipcode) {
      alert('Please fill required fields')
      return
    }
    // build server model casing to match API (Id, Province, etc.)
    const payload = {
      Id: form.id || 0,
      Province: form.province,
      City: form.city,
      Barangay: form.barangay,
      HouseNumberOrBuildingNumber: form.houseNumberOrBuildingNumber,
      StreetName: form.streetName,
      Zipcode: form.zipcode
    }
    onSave(payload)
  }

  return (
    <form onSubmit={submit} className="address-form">
      <h2>{form.id ? 'Edit Address' : 'New Address'}</h2>
      <div className="field">
        <label>Province <span className="muted">*</span></label>
        <input name="province" placeholder="e.g. Laguna" value={form.province} onChange={change} />
      </div>

      <div className="row">
        <div className="field">
          <label>City <span className="muted">*</span></label>
          <input name="city" placeholder="e.g. Calamba" value={form.city} onChange={change} />
        </div>
        <div className="field">
          <label>Barangay <span className="muted">*</span></label>
          <input name="barangay" placeholder="e.g. Poblacion" value={form.barangay} onChange={change} />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>House / Building No.</label>
          <input name="houseNumberOrBuildingNumber" placeholder="123 / Building A" value={form.houseNumberOrBuildingNumber} onChange={change} />
        </div>
        <div className="field">
          <label>Street Name <span className="muted">*</span></label>
          <input name="streetName" placeholder="Main St." value={form.streetName} onChange={change} />
        </div>
      </div>

      <div className="field">
        <label>Zipcode <span className="muted">*</span></label>
        <input name="zipcode" placeholder="4000" value={form.zipcode} onChange={change} />
      </div>

      <div className="buttons">
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
      </div>
    </form>
  )
}
