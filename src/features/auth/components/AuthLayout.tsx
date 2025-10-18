import type { ReactNode } from 'react'

type Props = {
  isRegister?: boolean
  children: ReactNode
}

function AuthLayout({ isRegister = false, children }: Props) {
  return (
    <div>
      <div>
        {/* Side image */}
        <div>
          <img src='/auth-illustration.png' alt='Auth illustration' />
        </div>
        {/* Right panel */}
        <div>
          <h2>{isRegister ? 'Registro' : 'Iniciar sesión'}</h2>
          <p>
            {isRegister ? '¡Hola! Completa tus datos.' : 'Bienvenido - ingresa tus credenciales.'}
          </p>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
