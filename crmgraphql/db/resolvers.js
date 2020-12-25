const User = require('../models/User')
const Product = require('../models/Product')
const Customer = require('../models/Customer')
const Order = require('../models/Order')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })
const createToken = (user, secret, expiresIn) => {
  const { id, name, lastname, email } = user
  return jwt.sign({ id, name, lastname, email }, secret, { expiresIn })
}
// Resolvers
const resolvers = {
  Query: {
    // Usuarios
    getUser: async (_, { token }) => {
      const user = await jwt.verify(token, process.env.SECRET)
      return user
    },
    // Productos
    getProducts: async () => {
      try {
        return await Product.find({})
      } catch (err) {
        console.error(err)
      }
    },
    getProduct: async (_, { id }) => {
      try {
        const product = await Product.findById(id)
        if (!product) {
          throw new Error('Producto no encontrado')
        }
        return product
      } catch (err) {
        console.error(err)
      }
    },
    // Clientes
    getCustomers: async () => {
      try {
        return await Customer.find({})
      } catch (err) {
        console.error(err)
      }
    },
    getCustomer: async (_, { id }, ctx) => {
      try {
        // Revisar si el cliente existe o no
        const customer = await Customer.findById(id)
        if (!customer) {
          throw new Error('Cliente no encontrado')
        }

        // Quien lo creo puede verlo
        if (customer.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }
        return customer
      } catch (err) {
        console.error(err)
      }
    },
    getCustomersBySeller: async (_, {}, ctx) => {
      try {
        return await Customer.find({ seller: ctx.user.id.toString() })
      } catch (err) {
        console.error(err)
      }
    },
    getOrders: async () => {
      try {
        return await Order.find({})
      } catch (err) {
        console.error(err)
      }
    },
    getOrdersBySeller: async (_, {}, ctx) => {
      try {
        return await Order.find({ seller: ctx.user.id.toString() })
      } catch (err) {
        console.error(err)
      }
    },
    getOrder: async (_, { id }, ctx) => {
      try {
        // Revisar si el pedido existe o no
        const order = await Order.findById(id)
        if (!order) {
          throw new Error('Pedido no encontrado')
        }

        // Quien lo creo puede verlo
        if (order.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }
        return order
      } catch (err) {
        console.error(err)
      }
    },
    getOrderStatus: async (_, { status }, ctx) => {
      try {
        // Revisar si el pedido existe o no
        const order = await Order.find({ seller: ctx.user.id, status })
        if (!order) {
          throw new Error('Pedido no encontrado')
        }
        return order
      } catch (err) {
        console.error(err)
      }
    },
    bestCustomers: async () => {
      const customers = await Order.aggregate([
        { $match: { status: 'COMPLETADO' } },
        {
          $group: {
            _id: '$customer',
            total: { $sum: '$total' }
          }
        },
        {
          // es como un join
          $lookup: {
            from: 'customers',
            localField: '_id',
            foreignField: '_id',
            as: 'customer' // coincide con el schema TopCustomer
          }
        },
        {
          $limit: 10
        },
        {
          $sort: { total: -1 }
        }
      ])
      return customers
    },
    bestSellers: async () => {
      const sellers = await Order.aggregate([
        { $match: { status: 'COMPLETADO' } },
        {
          $group: {
            // cuanto vendio el vendedor
            _id: '$seller',
            total: { $sum: '$total' }
          }
        },
        {
          // es como un join
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'seller' // coincide con el schema TopSeller
          }
        },
        {
          $limit: 3
        },
        {
          $sort: { total: -1 }
        }
      ])
      return sellers
    },
    searchProduct: async (_, { term }) => {
      return await Product.find({ $text: { $search: term } }).limit(10)
    }
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input
      // Revisar si el usuario esta registrado

      const existUser = await User.findOne({ email })
      console.log(existUser)

      if (existUser) {
        throw new Error('El usuario ya está registrado')
      }
      // hashear pass
      const salt = await bcryptjs.genSalt(10)
      input.password = await bcryptjs.hash(password, salt)
      // Guardar usuario
      try {
        const user = new User(input)
        user.save()
        return user
      } catch (err) {
        console.error(err)
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input

      // verifico si el usuario existe
      const existUser = await User.findOne({ email })
      if (!existUser) {
        throw new Error('Credenciales inválidas')
      }

      // verifico si el password es correcto
      const passwordValid = await bcryptjs.compare(password, existUser.password)

      if (!passwordValid) {
        throw new Error('Credenciales inválidas')
      }
      // crear token
      return {
        token: createToken(existUser, process.env.SECRET, '24h')
      }
      return token
    },
    newProduct: async (_, { input }) => {
      // console.log(input)
      try {
        const product = new Product(input)
        return await product.save()
      } catch (err) {
        console.error(err)
      }
    },
    updateProduct: async (_, { id, input }) => {
      // console.log(input)
      try {
        const product = await Product.findById(id)
        if (!product) {
          throw new Error('Producto no encontrado')
        }
        return await Product.findOneAndUpdate({ _id: id }, input, { new: true })
      } catch (err) {
        console.error(err)
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        const product = await Product.findById(id)
        console.log(product)
        if (!product) {
          throw new Error('Producto no encontrado')
        }
        await Product.findOneAndDelete({ _id: id })
        return 'Producto eliminado'
      } catch (err) {
        console.error(err)
      }
    },
    newCustomer: async (_, { input }, ctx) => {
      const { email } = input
      console.log(ctx)
      try {
        const customer = await Customer.findOne({ email })
        if (customer) {
          throw new Error('Ese cliente ya existe')
        }
        const newCustomer = new Customer(input)
        newCustomer.seller = ctx.user.id
        return await newCustomer.save()
      } catch (err) {
        console.error(err)
      }
    },
    updateCustomer: async (_, { id, input }, ctx) => {
      // console.log(input)
      try {
        // verifico que exista el cliente
        const customer = await Customer.findById(id)
        if (!customer) {
          throw new Error('Cliente no encontrado')
        }
        // Verificar si el vendedor es quien edita
        if (customer.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }
        // guardar el cliente
        return await Customer.findOneAndUpdate({ _id: id }, input, {
          new: true
        })
      } catch (err) {
        console.error(err)
      }
    },
    deleteProduct: async (_, { id }, ctx) => {
      try {
        // verifico que exista el cliente
        const customer = await Customer.findById(id)
        if (!customer) {
          throw new Error('Cliente no encontrado')
        }
        // Verificar si el vendedor es quien quiere borrar
        if (customer.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }
        // elimino el cliente
        await Customer.findOneAndDelete({ _id: id })
        return 'Cliente eliminado'
      } catch (err) {
        console.error(err)
      }
    },
    newOrder: async (_, { input }, ctx) => {
      try {
        // Revisar si el cliente existe o no
        const { customer } = input
        const customerModel = await Customer.findById(customer)
        if (!customerModel) {
          throw new Error('Cliente no encontrado')
        }
        // Verifico si el cliente es del vendedor
        if (customerModel.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }
        // Revisar si hay stock disponible
        for await (const article of input.order) {
          const { id } = article
          const product = await Product.findById(id)
          console.log(product)
          if (article.quantity > product.availableStock) {
            throw new Error(
              `El articulo ${product.name} excede la cantidad disponible`
            )
          } else {
            // Restar la cantidad a lo disponible
            product.availableStock = product.availableStock - article.quantity
            await product.save()
          }
        }
        // Crear un nuevo pedido
        const newOrder = new Order(input)
        // Asignarle un vendedor
        newOrder.seller = ctx.user.id
        // Guardar en db
        return await newOrder.save()
      } catch (err) {
        console.error(err)
      }
    },
    updateOrder: async (_, { id, input }, ctx) => {
      // console.log(input)
      const { customer } = input
      try {
        // verifico que exista el pedido
        const order = await Order.findById(id)
        if (!order) {
          throw new Error('Pedido no encontrado')
        }
        // Verificar si el vendedor es quien edita
        if (order.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }

        // Verifico que exista el cliente
        const customerModel = await Customer.findById(id)
        if (!customerModel) {
          throw new Error('Cliente no encontrado')
        }
        // Verifico si el cliente es del vendedor
        if (customerModel.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }

        // Revisar si hay stock disponible
        if (input.order) {
          for await (const article of input.order) {
            const { id } = article
            const product = await Product.findById(id)
            console.log(product)
            if (article.quantity > product.availableStock) {
              throw new Error(
                `El articulo ${product.name} excede la cantidad disponible`
              )
            } else {
              // Restar la cantidad a lo disponible
              product.availableStock = product.availableStock - article.quantity
              await product.save()
            }
          }
        }

        // guardar el pedido
        return await Order.findOneAndUpdate({ _id: id }, input, {
          new: true
        })
      } catch (err) {
        console.error(err)
      }
    },
    deleteOrder: async (_, { id, input }, ctx) => {
      // console.log(input)
      try {
        // verifico que exista el pedido
        const order = await Order.findById(id)
        if (!order) {
          throw new Error('Pedido no encontrado')
        }
        // Verificar si el vendedor es quien borra
        if (order.seller.toString() !== ctx.user.id) {
          throw new Error('No tienes las credenciales válidas')
        }

        // elimino el pedido
        await Order.findOneAndUpdate({ _id: id })
        return 'Pedido eliminado'
      } catch (err) {
        console.error(err)
      }
    }
  }
}

module.exports = resolvers
