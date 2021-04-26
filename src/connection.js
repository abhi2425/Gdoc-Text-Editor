require('dotenv').config()
const mongoose = require('mongoose')
//local mongodb server
mongoose
   .connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
   })
   .then(() => console.log('Connected To Database!!'))
   .catch((error) => console.log(error.message))

module.exports = mongoose
