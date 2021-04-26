const Document = require('./schema')

const findOrCreateDocument = async (id) => {
   const defaultValue = ''
   if (id === null) return
   const document = await Document.findById(id)
   if (document) return document
   return Document.create({ _id: id, data: defaultValue })
}
module.exports = { findOrCreateDocument }
