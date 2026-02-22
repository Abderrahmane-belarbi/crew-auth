export default function passwordCriteria(password) {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains a lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains a special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ]
  return criteria
}