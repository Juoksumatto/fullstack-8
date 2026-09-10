import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const ALL_BOOKS = gql`
  query allBooks {
    allBooks {
      title 
      author 
      published 
    }
  }
`

const Books = ({ show = true }) => {
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

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
