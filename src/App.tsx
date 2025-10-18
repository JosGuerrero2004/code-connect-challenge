import { Route, Routes } from 'react-router-dom'
import Feed from './pages/Feed'
import Login from './features/auth/pages/Login'
import Register from './pages/Register'
import Publicar from './pages/Publicar'
import Logout from './features/auth/pages/Logout'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<Register />} />
        <Route path='/publicar' element={<Publicar />} />
        <Route path='*' element={<h1>404 Not found</h1>} />
      </Routes>
    </>
  )
}

export default App
