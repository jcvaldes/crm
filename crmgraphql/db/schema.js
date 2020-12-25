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
  type Token {
    token: String
  }
  type Product {
    id: ID
    name: String
    availableStock: Int
    price: Float
    created_on: String
  }
  type Customer {
    id: ID
    name: String
    lastname: String
    company: String
    email: String
    phone: String
    seller: ID
    created_on: String
  }
  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    customer: ID
    seller: ID
    status: OrderStatus
    created_on: String
  }
  type OrderGroup {
    id: ID
    quantity: Float
  }
  type TopCustomer {
    total: Float
    customer: [Customer]
  }
  type TopSeller {
    total: Float
    seller: [User]
  }
  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }
  input AuthInput {
    email: String
    password: String
  }
  input ProductInput {
    name: String!
    availableStock: Int!
    price: Float!
  }
  input CustomerInput {
    id: ID
    name: String!
    lastname: String!
    company: String!
    email: String!
    phone: String!
    seller: ID
  }
  input OrderProductInput {
    id: ID
    quantity: Int
  }
  input OrderInput {
    order: [OrderProductInput]
    total: Float
    customer: ID
    status: OrderStatus
  }
  enum OrderStatus {
    PENDIENTE
    COMPLETADO
    CANCELADO
  }
  type Query {
    # Usuarios
    getUser(token: String!): User

    # Productos
    getProducts: [Product]
    getProduct(id: ID!): Product

    # Clientes
    getCustomers: [Customer]
    getCustomer(id: ID!): Customer
    getCustomersBySeller: [Customer]

    # Pedidos
    getOrders(input: OrderInput): [Order]
    getOrdersBySeller(input: OrderInput): [Order]
    getOrder(id: ID!): Order
    getOrderStatus(status: String!): [Order]

    # Busquedas avanzadas
    bestCustomers: [TopCustomer]
    bestSellers: [TopSeller]
    searchProduct(term: String!): [Product]
  }
  type Mutation {
    # Usuarios
    newUser(input: UserInput): User
    authUser(input: AuthInput): Token

    # Productos
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Clientes
    newCustomer(input: CustomerInput): Customer
    updateCustomer(id: ID!, input: CustomerInput): Customer
    deleteCustomer(id: ID!): String

    # Pedidos
    newOrder(input: OrderInput): Order
    updateOrder(id: ID!, input: OrderInput): Order
    deleteOrder(id: ID!): String
  }
`
module.exports = typeDefs
