import { Route, Routes } from 'react-router-dom'
import Feed from './pages/Feed'
import Login from './features/auth/pages/LoginPage'
import Register from './features/auth/pages/RegisterPage'
import Publicar from './pages/Publicar'
import Logout from './features/auth/pages/Logout'
import RequireAuth from './routes/RequireAuth'
import SobreNosotros from './pages/SobreNosotros'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Feed />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/publicar'
          element={
            <RequireAuth>
              <Publicar />
            </RequireAuth>
          }
        />
        <Route path='/sobre-nosotros' element={<SobreNosotros />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<h1>404 Not found</h1>} />
      </Routes>
    </>
  )
}

export default App
