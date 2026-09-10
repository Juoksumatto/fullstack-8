import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import Author from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
      genres
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [addBookMutation] = useMutation(ADD_BOOK, {
    refetchQueries: ['allBooks', 'allAuthors'],
  })

  const addBook = async (book) => {
    await addBookMutation({ variables: book })
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Author show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} addBook={addBook} />
    </div>
  )
}

export default App
