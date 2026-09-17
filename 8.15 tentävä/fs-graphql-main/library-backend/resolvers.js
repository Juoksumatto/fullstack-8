const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const Author = require('./modules/author')
const Book = require('./modules/book')

const resolvers = {
  Query: {
    booksCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const query = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        if (!author) {
          return[]
        }

        query.author = author._id
      }

      if (args.genres) {
        query.genres = args.genres
      }

      const books = await Book.find(query).populate('author')
      return books.filter((book) => book.author)
    },

    allAuthors: async () => {
      return Author.find()
    }
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      if (args.title.length <= 4) {
        throw new GraphQLError('title must be more than 4 letters long', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (args.author.length <= 3) {
        throw new GraphQLError('Author name must be more than 3 letters long', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (args.genres.length === 0) {
        throw new GraphQLError('Have at least 1 genre', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = await Author.create({ name: args.author })
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      })

      const savedBook = await book.save()
      return savedBook.populate('author')
    },

    editAuthor: async (root, args) => {
    const author = await Author.findOne({ name: args.name })
    if (!author) {
      throw new GraphQLError('Author not found')
    }

    author.born = args.setBornTo

    return author.save()
    },
  },
}


module.exports = resolvers