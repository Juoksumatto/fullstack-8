const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const Author = require('./modules/author')
const Book = require('./modules/book')
const User = require('./modules/user')
const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
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

      const genre = args.genre || args.genres
      if (genre) {
        query.genres = genre
      }

      const books = await Book.find(query).populate('author')
      return books.filter((book) => book.author)
    },

    me: (root, args, context) => {
      return context.currentUser
    },          
    allAuthors: async () => {
      return Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books',
          },
        },
        {
          $addFields: {
            bookCount: { $size: '$books' },
          },
        },
        {
          $project: { books: 0 },
        },
      ])
    }

    },

  Author: {
    id: (root) => root._id.toString(),
    bookCount: (root) => root.bookCount ?? Book.countDocuments({ author: root._id }),
    allAuthors: async () => {
      console.log('Author.find')
      const authors = await Author.find()
      return authors
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

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
      const populatedBook = await savedBook.populate('author')

      await pubsub.publish('BOOK_ADDED', {
        bookAdded: populatedBook,
      })
      return populatedBook
    },

    editAuthor: async (root, args, context) => {
    const author = await Author.findOne({ name: args.name })
    
    if (!context.currentUser){
      throw new GraphQLError('Not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED'
        }
      })
    }

    if (!author) {
      return null
    }

    author.born = args.setBornTo

    return author.save()
    },

    createUser: async (root, args) => {
      const user = new User({ 
        username: args.username, 
        favoriteGenre: args.favoriteGenre 
      })
      return user.save()
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) 
    }
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }

      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers