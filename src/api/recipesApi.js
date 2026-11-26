const API_URL = 'https://dummyjson.com/recipes'

export const RECIPES_PER_PAGE = 5

// Returns { recipes, total } for the given page (pages start from 1)
export async function fetchRecipes(page) {
  const skip = (page - 1) * RECIPES_PER_PAGE

  let response
  try {
    response = await fetch(`${API_URL}?limit=${RECIPES_PER_PAGE}&skip=${skip}`)
  } catch {
    throw new Error('Nepavyko susisiekti su serveriu.')
  }
  if (!response.ok) {
    throw new Error('Nepavyko gauti receptų.')
  }

  const data = await response.json()
  return { recipes: data.recipes, total: data.total }
}

// Returns the recipe, or null when it does not exist (HTTP 404)
export async function fetchRecipe(id) {
  let response
  try {
    response = await fetch(`${API_URL}/${encodeURIComponent(id)}`)
  } catch {
    throw new Error('Nepavyko susisiekti su serveriu.')
  }
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Nepavyko gauti recepto.')
  }

  return response.json()
}
