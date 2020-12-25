const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

const connDB = require('./config/db')

// conectar db
connDB()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || ''
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET)
        return {
          user
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Servidor listo en la url ${url}`)
})
