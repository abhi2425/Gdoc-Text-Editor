require('dotenv').config()
require('./connection')
const { findOrCreateDocument } = require('./FindOrCreateDoc')
const Document = require('./schema')
const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
const socketIo = require('socket.io')

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = socketIo(server)

const port = process.env.PORT || 8080
app.use(express.static(path.join(__dirname, '/../dist')))

app.get('/', (_, res) => res.redirect('/documents/'))
app.get(`/documents/*`, (_, res) => res.sendFile(path.resolve(__dirname + '/../dist/index.html')))
app.get('*', (_, res) => res.sendFile(path.resolve(__dirname + '/../dist/index.html')))

io.on('connection', (socket) => {
  socket.on('get-documents', async (documentId) => {
    const { data } = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit('load-documents', data)
    socket.on('send-changes', (delta) =>
      socket.broadcast.to(documentId).emit('receive-changes', delta),
    )
    socket.on('save-documents', async (data) => {
      await Document.findOneAndUpdate({ _id: documentId }, { data })
    })
  })
})

server.listen(port, () => console.log('Server up at-', port))
