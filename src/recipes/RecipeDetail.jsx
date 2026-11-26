import { useParams } from 'react-router-dom'

function RecipeDetail() {
  // The id comes from the route /recipe/:id
  const { id } = useParams()

  return <h1>Receptas nr. {id}</h1>
}

export default RecipeDetail
