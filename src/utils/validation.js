export function validateReport(form) {
  const errors = {}
  if (!form.title?.trim()) errors.title = 'Enter a short, specific title.'
  else if (form.title.trim().length < 6) errors.title = 'Title should be at least 6 characters.'
  if (!form.description?.trim() || form.description.trim().length < 20) {
    errors.description = 'Describe the damage in at least 20 characters.'
  }
  if (!form.category) errors.category = 'Select a damage category.'
  if (!form.severity) errors.severity = 'Select a severity level.'
  if (!form.roadName?.trim()) errors.roadName = 'Enter the road name.'
  if (!form.locality?.trim()) errors.locality = 'Enter the locality or area.'
  if (!form.city?.trim()) errors.city = 'Enter the city.'
  if (!form.postalCode?.trim()) errors.postalCode = 'Enter the postal code.'
  else if (!/^[0-9]{6}$/.test(form.postalCode.trim())) errors.postalCode = 'Use a 6-digit postal code.'
  if (form.lat !== '' && form.lat != null && Number.isNaN(Number(form.lat))) errors.lat = 'Latitude must be a number.'
  if (form.lng !== '' && form.lng != null && Number.isNaN(Number(form.lng))) errors.lng = 'Longitude must be a number.'
  if (form.lat && (Number(form.lat) < -90 || Number(form.lat) > 90)) errors.lat = 'Latitude must be between -90 and 90.'
  if (form.lng && (Number(form.lng) < -180 || Number(form.lng) > 180)) errors.lng = 'Longitude must be between -180 and 180.'
  return errors
}

export function validateRegister(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Enter your full name.'
  if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.phone?.trim() || form.phone.replace(/\s/g, '').length < 10) errors.phone = 'Enter a valid phone number.'
  if (!form.city?.trim()) errors.city = 'Enter your city.'
  if (!form.password || form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (form.password !== form.confirm) errors.confirm = 'Passwords do not match.'
  return errors
}

export function validateProfile(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Enter your full name.'
  if (!form.phone?.trim() || form.phone.replace(/\s/g, '').length < 10) errors.phone = 'Enter a valid phone number.'
  if (!form.city?.trim()) errors.city = 'Enter your city.'
  return errors
}

export function composeAddress(form) {
  return [form.roadName, form.locality, form.city, form.postalCode].filter(Boolean).join(', ')
}
