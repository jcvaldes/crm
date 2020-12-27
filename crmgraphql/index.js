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
    // console.log(req.headers)
    const token = req.headers.authorization.replace('Bearer ', '') || ''
    // console.log(token)
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET)
        // console.log(user)
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
