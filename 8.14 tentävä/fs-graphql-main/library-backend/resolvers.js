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

      if (args.genre) {
        query.genres = args.genre
      }

      return Book.find(query).populate('author')
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