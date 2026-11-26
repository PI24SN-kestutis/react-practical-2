import { Link } from 'react-router-dom'
import './recipes.css'

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <img className="recipe-card-image" src={recipe.image} alt={recipe.name} />
      <div className="recipe-card-body">
        <h2 className="recipe-card-title">{recipe.name}</h2>
        <p className="recipe-card-cuisine">Virtuvė: {recipe.cuisine}</p>
        <Link to={`/recipe/${recipe.id}`}>Peržiūrėti receptą</Link>
      </div>
    </article>
  )
}

export default RecipeCard
