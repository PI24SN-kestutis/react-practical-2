import { useEffect, useState } from 'react'
import { fetchRecipes } from '../api/recipesApi.js'
import RecipeCard from './RecipeCard.jsx'
import './recipes.css'

function RecipeList() {
  const [page] = useState(1)
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Ignore the response if the page changed or the component was removed meanwhile
    let ignore = false

    fetchRecipes(page)
      .then((data) => {
        if (ignore) return
        setRecipes(data.recipes)
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

  if (isLoading) return <p>Kraunama...</p>
  if (error) return <p className="form-error">{error}</p>

  return (
    <section>
      <h1>Receptai</h1>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  )
}

export default RecipeList
