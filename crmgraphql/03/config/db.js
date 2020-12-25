const mongoose = require('mongoose')
require('dotenv').config({ path: 'variables.env' })
const connDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
  } catch (err) {
    console.error('Error al conectar db')
    console.error(err)
    process.exit(1)
  }
}
module.exports = connDB
