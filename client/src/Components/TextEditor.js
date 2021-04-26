import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { createEditor } from '../utils/createEditor'

const TextEditor = () => {
   const wrapperRef = useRef()
   const [socket, setSocket] = useState(null)
   const [quill, setQuill] = useState(null)
   const { id: documentId } = useParams()

   //create editor
   useEffect(() => {
      const editor = document.createElement('div')
      wrapperRef.current.append(editor)
      const quill = createEditor(editor)
      setQuill(quill)
      return () => (wrapperRef.innerHTML = '')
   }, [])

   // set socket connection
   useEffect(() => {
      const socket = io()
      setSocket(socket)
      return () => socket.disconnect()
   }, [])

   // sending data to server when user uses editor
   useEffect(() => {
      if (socket === null || quill === null) return
      const handler = (delta, _, source) => {
         if (source !== 'user') return
         socket.emit('send-changes', delta)
      }
      quill.on('text-change', handler)
      return () => quill.off('text-change', handler)
   }, [socket, quill])

   // receive changes
   useEffect(() => {
      if (socket === null || quill === null) return
      const handler = (delta) => {
         quill.updateContents(delta)
      }
      socket.on('receive-changes', handler)
      return () => socket.off('receive-changes', handler)
   }, [socket, quill])

   // load document
   useEffect(() => {
      if (socket === null || quill === null) return
      socket.once('load-documents', (documents) => {
         quill.setContents(documents)
      })
      quill.enable()
      socket.emit('get-documents', documentId)
   }, [socket, quill, documentId])

   //save document
   useEffect(() => {
      if (socket === null || quill === null) return
      const interval = setInterval(() => {
         socket.emit('save-documents', quill.getContents())
      }, 2000)
      return () => clearInterval(interval)
   }, [socket, quill])

   return <div className='container' ref={wrapperRef}></div>
}

export default TextEditor
