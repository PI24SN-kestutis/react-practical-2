const API_URL = 'http://localhost:3001'

// Wrapper around fetch: checks response.ok and turns network errors into one clear message
async function request(url, options) {
  let response
  try {
    response = await fetch(url, options)
  } catch {
    throw new Error('Nepavyko susisiekti su serveriu.')
  }
  if (!response.ok) {
    throw new Error('Serverio klaida. Bandykite dar kartą.')
  }
  return response.json()
}

// The email is lower-cased so "A@b.lt" and "a@b.lt" count as the same user
function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function findUsersByEmail(email) {
  return request(`${API_URL}/users?email=${encodeURIComponent(normalizeEmail(email))}`)
}

export async function registerUser({ name, email, password }) {
  const existing = await findUsersByEmail(email)
  if (existing.length > 0) {
    throw new Error('Naudotojas su tokiu el. paštu jau egzistuoja.')
  }

  await request(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim(), email: normalizeEmail(email), password }),
  })
}

// Returns only safe user data (id, name, email) - never the password
export async function loginUser(email, password) {
  const users = await findUsersByEmail(email)
  const user = users[0]

  // The password is compared here, because it must not be sent in the URL
  if (!user || user.password !== password) {
    throw new Error('Neteisingas el. paštas arba slaptažodis.')
  }

  return { id: user.id, name: user.name, email: user.email }
}
