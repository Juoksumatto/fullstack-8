import { gql } from '@apollo/client'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ME } from './queries'
import { useQuery } from '@apollo/client/react'
import Author from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return <div style={{ color: 'red' }}>{errorMessage}</div>
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(() => localStorage.getItem('book-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const loggedIn = Boolean(token)

  const { data: meData } = useQuery(ME, {
    skip: !loggedIn,
  })

  const [addBookMutation] = useMutation(ADD_BOOK, {
    refetchQueries: ['allBooks', 'allAuthors'],
  })
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
  }

  const addBook = async (book) => {
    await addBookMutation({ variables: book })
  }

  const onLogout = () => {
    setToken(null)
    setPage('authors')
    setErrorMessage(null)
    localStorage.removeItem('book-user-token')
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loggedIn && (
          <button onClick={() => setPage('add')}>add book</button>
        )}
        {loggedIn && (
          <button onClick={() => setPage('recommendations')}>recommend</button>
        )}
        {loggedIn ? (
          <button onClick={onLogout}>logout</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      {page === 'login' && !loggedIn && (
        <div>
          <h2>Login</h2>
          <LoginForm setToken={setToken} setError={notify} setPage={setPage} />
        </div>
      )}
      <Author show={page === 'authors'} loggedIn={loggedIn} />

      <Books show={page === 'books' || page === 'recommendations'}
        favoriteGenre={
          page === 'recommendations'
          ? meData?.me?.favoriteGenre
          : undefined
        } />

      <NewBook show={page === 'add' && loggedIn} addBook={addBook} />
    </div>
  )
}

export default App
