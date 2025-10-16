import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' />
        <Route path='/login' />
        <Route path='/logout' />
        <Route path='/publicar' />
        <Route path='/feed' />
        <Route path='*' />
      </Routes>
    </>
  )
}

export default App
