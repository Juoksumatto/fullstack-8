import { gql } from '@apollo/client'

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