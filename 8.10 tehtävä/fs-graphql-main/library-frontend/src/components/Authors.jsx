import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const Authors = ({ show = true }) => {
  const result = useQuery(ALL_AUTHORS, { skip: !show })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <p>loading...</p>
  }

  if (result.error) {
    return <p>Unable to load authors.</p>
  }

  const authors = result.data?.allAuthors ?? []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born ?? '-'}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
