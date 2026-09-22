import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_BORN } from '../queries'
import { ALL_AUTHORS } from '../queries'

const Authors = ({ show = true, loggedIn = false }) => {
  const result = useQuery(ALL_AUTHORS, { skip: !show })
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeBorn ] = useMutation(EDIT_BORN, {
    refetchQueries: ['allAuthors'],
  })

  const submit = (event) => {
    event.preventDefault()

    changeBorn({ variables: { name, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }

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
      {loggedIn && <>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
        <div>
          name 
        <select name="name" onChange={({ target }) => setName(target.value)}>
          {authors.map((author) => (
          <option key={author.name} value={author.name}>{author.name}</option>
          ))}
          </select>
        </div>
        <div>
          born <input
          type='number'
          value={born}
          onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
        </form>
      </>}
    </div>
  )
}

export default Authors
