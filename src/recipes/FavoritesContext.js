import { createContext } from 'react'

// Provides: favorites, isLoading, error, actionError, pendingRecipeIds,
// addToFavorites(recipe), removeFromFavorites(favoriteId)
const FavoritesContext = createContext(null)

export default FavoritesContext
