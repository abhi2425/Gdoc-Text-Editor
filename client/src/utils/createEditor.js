import Quill from 'quill'
import { TOOLBAR_OPTIONS } from './toolbarOptions'

export const createEditor = (editor) => {
   const quill = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } })
   quill.disable()
   quill.setText('Loading...')
   return quill
}
