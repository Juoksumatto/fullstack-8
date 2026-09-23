import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show = true, favoriteGenre }) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')
  const genre = favoriteGenre ||
    (selectedGenre === 'all genres' ? undefined : selectedGenre)
  const result = useQuery(ALL_BOOKS, {
    skip: !show,
    variables: { genre },
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <p>loading...</p>
  }

  if (result.error) {
    return <p>Unable to load books.</p>
  }

  const allBooks = result.data?.allBooks ?? []
  const books = result.data?.filteredBooks ?? []
  const genres = [
    ...new Set(allBooks.flatMap((book) => book.genres)),
  ]

  const booksToShow = books

  return (
    <div>
      <h2>{favoriteGenre ? 'recommendations' : 'books'}</h2>
      {favoriteGenre ? (
        <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
      ) : selectedGenre !== 'all genres' && (
        <p>in genre <strong>{selectedGenre}</strong></p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
      {!favoriteGenre && <div>
        <select
          value={selectedGenre}
          onChange={(event) => setSelectedGenre(event.target.value)}
        >
          <option value="all genres">all genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>}
    </div>
  )
}

export default Books