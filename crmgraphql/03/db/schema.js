const { gql } = require('apollo-server')

// Schema
const typeDefs = gql`
  type User {
    id: ID
    name: String
    lastname: String
    email: String
    created_on: String
  }
  type Query {
    obtenerCurso: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }
  type Mutation {
    newUser(input: UserInput): String
  }
`
module.exports = typeDefs
