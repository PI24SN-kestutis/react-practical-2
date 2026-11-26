import { Link } from 'react-router-dom'

function Home() {
  return (
    <section>
      <h1>Receptų programėlė</h1>
      <p>Prisijunkite arba užsiregistruokite, kad matytumėte receptus.</p>
      <p>
        <Link to="/login">Prisijungti</Link> | <Link to="/register">Registruotis</Link>
      </p>
    </section>
  )
}

export default Home
