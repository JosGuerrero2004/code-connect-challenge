import type { ReactNode } from 'react'

type Props = {
  isRegister?: boolean
  children: ReactNode
}

function AuthLayout({ isRegister = false, children }: Props) {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='rounded-xl backdrop-blur-sm bg-[#171D1F]/80 max-w-4xl w-full rounded-2xl- shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Side image */}
        <div className='md:flex md:aspect-auto aspect-square p-8 flex items-center justify-center rounded-xl overflow-hidden '>
          <img
            src='/auth-illustration.png'
            alt='Auth illustration'
            className='w-full h-full object-cover'
          />
        </div>
        {/* Right panel */}
        <div className='p-8 flex flex-col'>
          <h2 className='text-2xl font-medium text-verdeDestaque mb-2'>
            {isRegister ? 'Registro' : 'Iniciar sesión'}
          </h2>
          <p className='text-sm text-grisClaro mb-6'>
            {isRegister ? '¡Hola! Completa tus datos.' : 'Bienvenido - ingresa tus credenciales.'}
          </p>
          <div className='flex-1'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
