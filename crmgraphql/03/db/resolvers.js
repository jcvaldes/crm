const User = require('../models/User')
// Resolvers
const resolvers = {
  Query: {
    obtenerCurso: () => 'Algo',
  },
  Mutation: {
    newUser: (_, { input }) => {
      console.log(input)
      return 'Creando usuario'
    },
  },
}

module.exports = resolvers
