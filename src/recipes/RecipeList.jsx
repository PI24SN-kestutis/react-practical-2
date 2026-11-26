import { useContext, useEffect, useState } from 'react'
import { fetchRecipes, RECIPES_PER_PAGE } from '../api/recipesApi.js'
import FavoritesContext from './FavoritesContext.js'
import RecipeCard from './RecipeCard.jsx'
import './recipes.css'

function RecipeList() {
  const { error: favoritesError, actionError } = useContext(FavoritesContext)
  const [page, setPage] = useState(1)
  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Ignore the response if the page changed or the component was removed meanwhile
    let ignore = false

    fetchRecipes(page)
      .then((data) => {
        if (ignore) return
        setRecipes(data.recipes)
        setTotal(data.total)
        setError('')
        setIsLoading(false)
      })
      .catch((err) => {
        if (ignore) return
        setError(err.message)
        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [page])

  // Changing the page also switches on the loading state (done here, not inside the effect)
  function goToPage(newPage) {
    setIsLoading(true)
    setPage(newPage)
  }

  if (isLoading) return <p>Kraunama...</p>
  if (error) return <p className="form-error">{error}</p>

  // Calculated from the total returned by the API, not stored in state
  const totalPages = Math.ceil(total / RECIPES_PER_PAGE)

  return (
    <section>
      <h1>Receptai</h1>
      {(favoritesError || actionError) && (
        <p className="form-error">{favoritesError || actionError}</p>
      )}
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}

      <div className="pagination">
        <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
          Atgal
        </button>
        <span>
          Puslapis {page} iš {totalPages}
        </span>
        <button type="button" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
          Kitas
        </button>
      </div>
    </section>
  )
}

export default RecipeList
