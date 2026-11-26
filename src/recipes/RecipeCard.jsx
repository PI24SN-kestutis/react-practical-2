import { useContext } from 'react'
import { Link } from 'react-router-dom'
import FavoritesContext from './FavoritesContext.js'
import './recipes.css'

function RecipeCard({ recipe }) {
  const { favorites, isLoading, error, pendingRecipeIds, addToFavorites, removeFromFavorites } =
    useContext(FavoritesContext)

  // The favorites record is needed because deleting uses its id, not the recipeId
  const favorite = favorites.find((item) => item.recipeId === recipe.id)
  const isPending = pendingRecipeIds.includes(recipe.id)

  function handleToggle() {
    if (favorite) {
      removeFromFavorites(favorite.id)
    } else {
      addToFavorites(recipe)
    }
  }

  let buttonText = 'Pridėti į mėgstamiausius'
  if (isPending) {
    buttonText = 'Palaukite...'
  } else if (favorite) {
    buttonText = 'Pašalinti iš mėgstamiausių'
  }

  return (
    <article className="recipe-card">
      <img className="recipe-card-image" src={recipe.image} alt={recipe.name} />
      <div className="recipe-card-body">
        <h2 className="recipe-card-title">{recipe.name}</h2>
        <p className="recipe-card-cuisine">Virtuvė: {recipe.cuisine}</p>
        {favorite && <p className="recipe-card-badge">★ Mėgstamas</p>}
        <Link to={`/recipe/${recipe.id}`}>Peržiūrėti receptą</Link>
        <button
          type="button"
          className="favorite-button"
          onClick={handleToggle}
          disabled={isLoading || Boolean(error) || isPending}
        >
          {buttonText}
        </button>
      </div>
    </article>
  )
}

export default RecipeCard
