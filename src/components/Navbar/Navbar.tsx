import { Home, Info, LogIn, LogOut, Search, User } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavbarLink from './NavbarLink'
import SearchBar from './SearchBar'
import { useAppSelector } from '../../hooks/reduxHooks'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)

  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = !!user

  const showSearch = location.pathname === '/feed'

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/logout')
    } else {
      navigate('/login')
    }
  }
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className='hidden md:flex flex-col bg-[#0a1612] text-offwhite w-64 min-h-screen p-6'>
        {/* Logo y botón publicar */}
        <div className='mb-8'>
          <img src='/Logo.svg' alt='CodeConnect' className='mb-6' />
          {isAuthenticated && (
            <button
              onClick={() => navigate('/publicar')}
              className='w-full px-6 py-3 border-2 border-verdeDestaque text-verdeDestaque rounded-lg hover:bg-verdeDestaque/10 transition-colors font-medium'
            >
              Publicar
            </button>
          )}
        </div>

        {/* Barra de búsqueda en desktop (solo en feed) */}
        {showSearch && (
          <div className='mb-6'>
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        )}

        {/* Enlaces de navegación */}
        <ul className='flex flex-col gap-2 flex-1'>
          <NavbarLink to='/feed' icon={<Home size={20} />} label='Feed' />
          {isAuthenticated && <NavbarLink to='/perfil' icon={<User size={20} />} label='Perfil' />}
          <NavbarLink to='/sobre-nosotros' icon={<Info size={20} />} label='Sobre nosotros' />
        </ul>

        {/* Botón Salir/Entrar */}
        <button
          onClick={handleAuthAction}
          className='flex items-center gap-3 px-4 py-3 text-grisClaro hover:text-verdeDestaque hover:bg-grisOscuro/50 rounded-lg transition-colors'
        >
          {isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
          <span className='text-sm'>{isAuthenticated ? 'Salir' : 'Entrar'}</span>
        </button>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-[#0a1612] border-t border-grisOscuro'>
        <ul className='flex justify-around items-center px-4 py-3'>
          <NavbarLink to='/feed' icon={<Home size={22} />} label='Feed' />
          {showSearch && (
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className='flex flex-col items-center gap-1 text-grisClaro hover:text-verdeDestaque transition-colors'
            >
              <Search size={22} />
              <span className='text-xs'>Buscar</span>
            </button>
          )}
          {isAuthenticated && <NavbarLink to='/perfil' icon={<User size={22} />} label='Perfil' />}
          <NavbarLink to='/sobre-nosotros' icon={<Info size={22} />} label='Sobre nós' />
          <button
            onClick={handleAuthAction}
            className='flex flex-col items-center gap-1 text-grisClaro hover:text-verdeDestaque transition-colors'
          >
            {isAuthenticated ? <LogOut size={22} /> : <LogIn size={22} />}
            <span className='text-xs'>{isAuthenticated ? 'Salir' : 'Entrar'}</span>
          </button>
        </ul>
      </nav>

      {/* Mobile Top Bar con logo y publicar */}
      <div className='md:hidden fixed top-0 left-0 right-0 bg-[#0a1612] border-b border-grisOscuro px-4 py-3 z-10'>
        <div className='flex items-center justify-between'>
          <img src='/Logo.svg' alt='CodeConnect' className='h-8' />
          {isAuthenticated && (
            <button
              onClick={() => navigate('/publicar')}
              className='px-5 py-2 border-2 border-verdeDestaque text-verdeDestaque rounded-lg text-sm font-medium hover:bg-verdeDestaque/10 transition-colors'
            >
              Publicar
            </button>
          )}
        </div>

        {/* Barra de búsqueda mobile (desplegable) */}
        {showSearch && showSearchBar && (
          <div className='mt-3 animate-in slide-in-from-top duration-200'>
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar
