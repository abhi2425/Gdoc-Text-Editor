const { Schema, model } = require('mongoose')

const documentSchema = new Schema({
   _id: String,
   data: {},
})
const Document = model('Document', documentSchema)
module.exports = Document
