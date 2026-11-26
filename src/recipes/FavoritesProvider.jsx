import { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth/AuthContext.js'
import FavoritesContext from './FavoritesContext.js'
import { addFavorite, fetchFavorites, removeFavorite } from '../api/favoritesApi.js'

// "loaded" remembers which user the list belongs to
const EMPTY = { userId: null, items: [], error: '' }

function FavoritesProvider({ children }) {
  const { user } = useContext(AuthContext)
  const userId = user ? user.id : null

  const [loaded, setLoaded] = useState(EMPTY)
  const [pendingRecipeIds, setPendingRecipeIds] = useState([])
  const [actionError, setActionError] = useState('')

  // Logout: clear the favorites state (the records on the server stay untouched)
  if (userId === null && loaded.userId !== null) {
    setLoaded(EMPTY)
    setPendingRecipeIds([])
    setActionError('')
  }

  useEffect(() => {
    if (userId === null) return

    // Ignore the response if the user changed or the component was removed meanwhile
    let ignore = false

    fetchFavorites(userId)
      .then((items) => {
        if (ignore) return
        setLoaded({ userId, items, error: '' })
      })
      .catch((err) => {
        if (ignore) return
        setLoaded({ userId, items: [], error: err.message })
      })

    return () => {
      ignore = true
    }
  }, [userId])

  // Show only the list that belongs to the current user
  const isCurrent = loaded.userId === userId
  const favorites = isCurrent ? loaded.items : []
  const error = isCurrent ? loaded.error : ''
  const isLoading = userId !== null && !isCurrent

  function startPending(recipeId) {
    setPendingRecipeIds((ids) => [...ids, recipeId])
  }

  function finishPending(recipeId) {
    setPendingRecipeIds((ids) => ids.filter((id) => id !== recipeId))
  }

  async function addToFavorites(recipe) {
    const alreadyFavorite = favorites.some((item) => item.recipeId === recipe.id)
    if (userId === null || alreadyFavorite || pendingRecipeIds.includes(recipe.id)) return

    setActionError('')
    startPending(recipe.id)
    try {
      const created = await addFavorite({
        userId,
        recipeId: recipe.id,
        name: recipe.name,
        image: recipe.image,
      })
      // Add to the list only after the server confirmed it (and only for the same user)
      setLoaded((prev) =>
        prev.userId === userId ? { ...prev, items: [...prev.items, created] } : prev,
      )
    } catch (err) {
      setActionError(err.message)
    } finally {
      finishPending(recipe.id)
    }
  }

  // favoriteId is the id of the favorites record, not the recipeId
  async function removeFromFavorites(favoriteId) {
    const item = favorites.find((fav) => fav.id === favoriteId)
    if (userId === null || !item || pendingRecipeIds.includes(item.recipeId)) return

    setActionError('')
    startPending(item.recipeId)
    try {
      await removeFavorite(favoriteId)
      setLoaded((prev) =>
        prev.userId === userId
          ? { ...prev, items: prev.items.filter((fav) => fav.id !== favoriteId) }
          : prev,
      )
    } catch (err) {
      setActionError(err.message)
    } finally {
      finishPending(item.recipeId)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        error,
        actionError,
        pendingRecipeIds,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesProvider
