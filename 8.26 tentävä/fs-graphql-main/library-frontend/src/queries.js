import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`

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

export const ADD_BOOK = gql`
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

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`