import { Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import AuthLayout from '../components/AuthLayout'

const Login = () => {
  return (
    <AuthLayout isRegister={false}>
      <AuthForm isRegister={false} />
      <div className='text-center mt-4 text-sm text-grisClaro'>
        ¿No tienes cuenta?{' '}
        <Link to='/register' className='text-verdeDestaque'>
          Regístrate
        </Link>
      </div>
    </AuthLayout>
  )
}

export default Login
