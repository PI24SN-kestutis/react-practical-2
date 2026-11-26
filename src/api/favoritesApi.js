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

// Returns only the favorites that belong to the given user
export function fetchFavorites(userId) {
  return request(`${API_URL}/favorites?userId=${encodeURIComponent(userId)}`)
}

// Returns the created record, including its own id (needed for deleting)
export function addFavorite({ userId, recipeId, name, image }) {
  return request(`${API_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, recipeId, name, image }),
  })
}

// favoriteId is the id of the favorites record, not the recipeId
export function removeFavorite(favoriteId) {
  return request(`${API_URL}/favorites/${encodeURIComponent(favoriteId)}`, {
    method: 'DELETE',
  })
}
