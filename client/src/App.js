import React from 'react'
import TextEditor from './Components/TextEditor'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { v4 as uuId } from 'uuid'
import Error from './Components/Error'
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Redirect to={`/documents/${uuId()}`} />
        </Route>
        <Route path='/documents/:id'>
          <TextEditor />
        </Route>
        <Route to='*'>
          <Error />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
