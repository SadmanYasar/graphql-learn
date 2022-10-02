import { useEffect, useState } from "react"

const Books = (props) => {
  const [filter, setFilter] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')

  useEffect(() => {
    const books = props.books
    let genres = ['ALL BOOKS']

    books.forEach(b => {
      b.genres.forEach(g => {
        if (genres.indexOf(g) === -1) {
          genres.push(g)
        }
      })
    })

    setGenres(genres)
    setSelectedGenre('ALL BOOKS')
  }, [props.books])

  useEffect(() => {
    if (selectedGenre === 'ALL BOOKS') {
      setFilter(props.books)
    } else {
      setFilter(props.books.filter(b => b.genres.indexOf(selectedGenre) !== -1))
    }
  }, [props.books, selectedGenre])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <h4>in genre {selectedGenre}</h4>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filter.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.length > 0 &&
          genres.map((g) => (
            <button onClick={() => setSelectedGenre(g)} key={g}>
              {g}
            </button>
          ))}
      </div>
    </div>
  )
}

export default Books
