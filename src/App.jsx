import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import NotFound from './components/NotFound.jsx'
import Login from './auth/Login.jsx'
import Register from './auth/Register.jsx'
import RecipeList from './recipes/RecipeList.jsx'
import RecipeDetail from './recipes/RecipeDetail.jsx'
import Favorites from './recipes/Favorites.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
