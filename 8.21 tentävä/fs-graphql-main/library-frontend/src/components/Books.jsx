import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

const ALL_BOOKS = gql`
  query allBooks {
    allBooks {
      title 
      author {
        name
      }
      published 
      genres
    }
  }
`

const Books = ({ show = true, favoriteGenre }) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')
  const result = useQuery(ALL_BOOKS, { skip: !show })
  if (!show) {
    return null
  }

  if (result.loading) {
    return <p>loading...</p>
  }

  if (result.error) {
    return <p>Unable to load books.</p>
  }

  const books = result.data?.allBooks ?? []
  const genres = [...new Set(books.flatMap((book) => book.genres))]
  const booksToShow = favoriteGenre
    ? books.filter((book) => book.genres.includes(favoriteGenre))
    : selectedGenre === 'all genres'
      ? books
      : books.filter((book) => book.genres.includes(selectedGenre))

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
        <button onClick={() => setSelectedGenre('all genres')}>
          all genres
        </button>
        <select onChange={({ target }) => setSelectedGenre(target.value)}>
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
