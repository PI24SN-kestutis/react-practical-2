import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section>
      <h1>Puslapis nerastas</h1>
      <p><Link to="/">Grįžti į pradžią</Link></p>
    </section>
  )
}

export default NotFound
