export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validatePhone = (phone) => {
  const re = /^[0-9\s\-\+\(\)]{10,}$/
  return re.test(phone.replace(/\s/g, ''))
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateForm = (fields) => {
  const errors = {}

  Object.keys(fields).forEach((key) => {
    const value = fields[key]

    if (key === 'email' && !validateEmail(value)) {
      errors.email = 'Invalid email address'
    }
    if (key === 'password' && !validatePassword(value)) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (key === 'phone' && value && !validatePhone(value)) {
      errors.phone = 'Invalid phone number'
    }
    if (key === 'name' && !validateRequired(value)) {
      errors.name = 'Name is required'
    }
    if (key === 'city' && !validateRequired(value)) {
      errors.city = 'City is required'
    }
    if (key === 'bloodType' && !validateRequired(value)) {
      errors.bloodType = 'Blood type is required'
    }
  })

  return errors
}
