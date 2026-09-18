const typeDefs = /* GraphQL */`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }


  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  enum YesNo {
    Yes
    NO
  }

  type Query {
    booksCount: Int
    authorCount: Int
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

module.exports = typeDefs