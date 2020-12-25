const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // se pasa a todos los resolvers
  context: () => {
    const userId = 20
    return {
      userId
    }
  }
})

server.listen().then(({url}) => {
  console.log(`Servidor listo en la url ${url}`)
})