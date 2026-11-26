import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchRecipe } from '../api/recipesApi.js'
import './recipes.css'

function RecipeDetail() {
  // The id comes from the route /recipe/:id
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Ignore the response if the id changed or the component was removed meanwhile
    let ignore = false

    fetchRecipe(id)
      .then((data) => {
        if (ignore) return
        setRecipe(data)
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
  }, [id])

  if (isLoading) return <p>Kraunama...</p>

  if (error) {
    return (
      <section>
        <p className="form-error">{error}</p>
        <Link to="/dashboard">← Atgal į receptus</Link>
      </section>
    )
  }

  // fetchRecipe returns null when the API answers 404
  if (!recipe) {
    return (
      <section>
        <h1>Receptas nerastas</h1>
        <p>Recepto, kurio nr. {id}, nėra.</p>
        <Link to="/dashboard">← Atgal į receptus</Link>
      </section>
    )
  }

  return (
    <article className="recipe-detail">
      <p>
        <Link to="/dashboard">← Atgal į receptus</Link>
      </p>
      <h1>{recipe.name}</h1>
      <img className="recipe-detail-image" src={recipe.image} alt={recipe.name} />

      <ul className="recipe-detail-info">
        <li>Paruošimo trukmė: {recipe.prepTimeMinutes} min.</li>
        <li>Gaminimo trukmė: {recipe.cookTimeMinutes} min.</li>
        <li>Porcijų skaičius: {recipe.servings}</li>
      </ul>

      <h2>Ingredientai</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={`${index}-${ingredient}`}>{ingredient}</li>
        ))}
      </ul>

      <h2>Gaminimo žingsniai</h2>
      <ol>
        {recipe.instructions.map((step, index) => (
          <li key={`${index}-${step}`}>{step}</li>
        ))}
      </ol>
    </article>
  )
}

export default RecipeDetail
