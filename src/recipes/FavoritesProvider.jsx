import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AuthContext from '../auth/AuthContext.js'
import FavoritesContext from './FavoritesContext.js'
import { addFavorite, fetchFavorites, removeFavorite } from '../api/favoritesApi.js'

// "loaded" remembers which user the list belongs to
const EMPTY = { userId: null, items: [], error: '' }
const NO_ACTION_ERROR = { message: '', path: '' }

function FavoritesProvider({ children }) {
  const { user } = useContext(AuthContext)
  const userId = user ? user.id : null
  const { pathname } = useLocation()

  const [loaded, setLoaded] = useState(EMPTY)
  const [pendingRecipeIds, setPendingRecipeIds] = useState([])
  // The action error remembers the page where it happened
  const [actionErrorState, setActionErrorState] = useState(NO_ACTION_ERROR)

  // Logout: clear the favorites state (the records on the server stay untouched)
  if (userId === null && loaded.userId !== null) {
    setLoaded(EMPTY)
    setPendingRecipeIds([])
    setActionErrorState(NO_ACTION_ERROR)
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

  // Show the action error only on the page where it happened
  const actionError = actionErrorState.path === pathname ? actionErrorState.message : ''

  function clearActionError() {
    setActionErrorState(NO_ACTION_ERROR)
  }

  function showActionError(message) {
    setActionErrorState({ message, path: pathname })
  }

  function startPending(recipeId) {
    setPendingRecipeIds((ids) => [...ids, recipeId])
  }

  function finishPending(recipeId) {
    setPendingRecipeIds((ids) => ids.filter((id) => id !== recipeId))
  }

  async function addToFavorites(recipe) {
    const alreadyFavorite = favorites.some((item) => item.recipeId === recipe.id)
    if (userId === null || alreadyFavorite || pendingRecipeIds.includes(recipe.id)) return

    clearActionError()
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
      showActionError(err.message)
    } finally {
      finishPending(recipe.id)
    }
  }

  // favoriteId is the id of the favorites record, not the recipeId
  async function removeFromFavorites(favoriteId) {
    const item = favorites.find((fav) => fav.id === favoriteId)
    if (userId === null || !item || pendingRecipeIds.includes(item.recipeId)) return

    clearActionError()
    startPending(item.recipeId)
    try {
      await removeFavorite(favoriteId)
      setLoaded((prev) =>
        prev.userId === userId
          ? { ...prev, items: prev.items.filter((fav) => fav.id !== favoriteId) }
          : prev,
      )
    } catch (err) {
      showActionError(err.message)
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
