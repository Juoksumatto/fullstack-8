import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const EDIT_BORN = gql`
  mutation editAuthor( $name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
        }
    }
`

export const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ME = gql`
query {
  me {
    username
    favoriteGenre
  }
}`

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }

    filteredBooks: allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`