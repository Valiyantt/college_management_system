import React, { useEffect, useState } from 'react'

export default function AddressForm({ onSave, editing, onCancel }) {
  const empty = { id: 0, province: '', city: '', barangay: '', houseNumberOrBuildingNumber: '', streetName: '', zipcode: '' }
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (editing) {
      setForm({
        id: editing.id ?? editing.Id ?? 0,
        province: editing.province ?? editing.Province ?? '',
        city: editing.city ?? editing.City ?? '',
        barangay: editing.barangay ?? editing.Barangay ?? '',
        houseNumberOrBuildingNumber: editing.houseNumberOrBuildingNumber ?? editing.HouseNumberOrBuildingNumber ?? '',
        streetName: editing.streetName ?? editing.StreetName ?? '',
        zipcode: editing.zipcode ?? editing.Zipcode ?? ''
      })
      setErrors({})
      setTouched({})
    } else {
      setForm(empty)
      setErrors({})
      setTouched({})
    }
  }, [editing])

  const validate = (fieldName, value) => {
    const newErrors = { ...errors }
    
    switch(fieldName) {
      case 'province':
        if (!value.trim()) {
          newErrors.province = 'Province is required'
        } else if (value.length < 2) {
          newErrors.province = 'Province must be at least 2 characters'
        } else {
          delete newErrors.province
        }
        break
      case 'city':
        if (!value.trim()) {
          newErrors.city = 'City is required'
        } else if (value.length < 2) {
          newErrors.city = 'City must be at least 2 characters'
        } else {
          delete newErrors.city
        }
        break
      case 'barangay':
        if (!value.trim()) {
          newErrors.barangay = 'Barangay is required'
        } else {
          delete newErrors.barangay
        }
        break
      case 'streetName':
        if (!value.trim()) {
          newErrors.streetName = 'Street name is required'
        } else {
          delete newErrors.streetName
        }
        break
      case 'zipcode':
        if (!value.trim()) {
          newErrors.zipcode = 'Zipcode is required'
        } else if (!/^\d{4,6}$/.test(value)) {
          newErrors.zipcode = 'Zipcode must be 4-6 digits'
        } else {
          delete newErrors.zipcode
        }
        break
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const change = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (touched[name]) {
      validate(name, value)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    validate(name, value)
  }

  const validateAll = () => {
    const newErrors = {}
    
    if (!form.province?.trim()) newErrors.province = 'Province is required'
    if (!form.city?.trim()) newErrors.city = 'City is required'
    if (!form.barangay?.trim()) newErrors.barangay = 'Barangay is required'
    if (!form.streetName?.trim()) newErrors.streetName = 'Street name is required'
    if (!form.zipcode?.trim()) newErrors.zipcode = 'Zipcode is required'
    else if (!/^\d{4,6}$/.test(form.zipcode)) newErrors.zipcode = 'Zipcode must be 4-6 digits'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    
    if (!validateAll()) {
      return
    }
    
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
      
      <div className={`field ${errors.province ? 'error' : ''} ${touched.province && !errors.province ? 'success' : ''}`}>
        <label htmlFor="province">Province <span className="muted">*</span></label>
        <input 
          id="province"
          name="province" 
          placeholder="e.g. Laguna" 
          value={form.province} 
          onChange={change}
          onBlur={handleBlur}
          aria-invalid={!!errors.province}
          aria-describedby={errors.province ? 'province-error' : undefined}
        />
        {errors.province && <div id="province-error" className="field-error">{errors.province}</div>}
      </div>

      <div className="row">
        <div className={`field ${errors.city ? 'error' : ''} ${touched.city && !errors.city ? 'success' : ''}`}>
          <label htmlFor="city">City <span className="muted">*</span></label>
          <input 
            id="city"
            name="city" 
            placeholder="e.g. Calamba" 
            value={form.city} 
            onChange={change}
            onBlur={handleBlur}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && <div id="city-error" className="field-error">{errors.city}</div>}
        </div>
        <div className={`field ${errors.barangay ? 'error' : ''} ${touched.barangay && !errors.barangay ? 'success' : ''}`}>
          <label htmlFor="barangay">Barangay <span className="muted">*</span></label>
          <input 
            id="barangay"
            name="barangay" 
            placeholder="e.g. Poblacion" 
            value={form.barangay} 
            onChange={change}
            onBlur={handleBlur}
            aria-invalid={!!errors.barangay}
            aria-describedby={errors.barangay ? 'barangay-error' : undefined}
          />
          {errors.barangay && <div id="barangay-error" className="field-error">{errors.barangay}</div>}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="houseNumber">House / Building No.</label>
          <input 
            id="houseNumber"
            name="houseNumberOrBuildingNumber" 
            placeholder="123 / Building A" 
            value={form.houseNumberOrBuildingNumber} 
            onChange={change}
          />
        </div>
        <div className={`field ${errors.streetName ? 'error' : ''} ${touched.streetName && !errors.streetName ? 'success' : ''}`}>
          <label htmlFor="streetName">Street Name <span className="muted">*</span></label>
          <input 
            id="streetName"
            name="streetName" 
            placeholder="Main St." 
            value={form.streetName} 
            onChange={change}
            onBlur={handleBlur}
            aria-invalid={!!errors.streetName}
            aria-describedby={errors.streetName ? 'streetName-error' : undefined}
          />
          {errors.streetName && <div id="streetName-error" className="field-error">{errors.streetName}</div>}
        </div>
      </div>

      <div className={`field ${errors.zipcode ? 'error' : ''} ${touched.zipcode && !errors.zipcode ? 'success' : ''}`}>
        <label htmlFor="zipcode">Zipcode <span className="muted">*</span></label>
        <input 
          id="zipcode"
          name="zipcode" 
          placeholder="4000" 
          value={form.zipcode} 
          onChange={change}
          onBlur={handleBlur}
          aria-invalid={!!errors.zipcode}
          aria-describedby={errors.zipcode ? 'zipcode-error' : undefined}
        />
        {errors.zipcode && <div id="zipcode-error" className="field-error">{errors.zipcode}</div>}
      </div>

      <div className="buttons">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={Object.keys(errors).length > 0}
        >
          Save
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
