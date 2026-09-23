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
    id: ID!
    allAuthors: [Author!]!
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
    _resetDatabase: Boolean!
  }

  enum YesNo {
    Yes
    NO
  }

  type Query {
    bookCount: Int
    booksCount: Int
    authorCount: Int
    allBooks(author: String, genre: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Subscription { 
    bookAdded: Book!
  }
`

module.exports = typeDefs