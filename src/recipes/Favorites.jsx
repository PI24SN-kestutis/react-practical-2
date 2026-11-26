import { useContext } from 'react'
import { Link } from 'react-router-dom'
import FavoritesContext from './FavoritesContext.js'
import './recipes.css'

function Favorites() {
  const { favorites, isLoading, error, actionError, pendingRecipeIds, removeFromFavorites } =
    useContext(FavoritesContext)

  if (isLoading) return <p>Kraunama...</p>
  if (error) return <p className="form-error">{error}</p>

  return (
    <section>
      <h1>Mėgstamiausi receptai</h1>
      {actionError && <p className="form-error">{actionError}</p>}

      {favorites.length === 0 ? (
        <p>Mėgstamiausių receptų dar nėra.</p>
      ) : (
        favorites.map((item) => (
          <article key={item.id} className="recipe-card">
            <img className="recipe-card-image" src={item.image} alt={item.name} />
            <div className="recipe-card-body">
              <h2 className="recipe-card-title">{item.name}</h2>
              <Link to={`/recipe/${item.recipeId}`}>Peržiūrėti receptą</Link>
              <button
                type="button"
                className="favorite-button"
                onClick={() => removeFromFavorites(item.id)}
                disabled={pendingRecipeIds.includes(item.recipeId)}
              >
                {pendingRecipeIds.includes(item.recipeId) ? 'Palaukite...' : 'Pašalinti'}
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  )
}

export default Favorites
