import { Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import AuthLayout from '../components/AuthLayout'

const Register = () => {
  return (
    <AuthLayout isRegister={true}>
      <AuthForm isRegister={true} />
      <div className='mt-4 text-sm text-grisClaro'>
        ¿Tienes una cuenta?{' '}
        <Link to='/login' className='text-verdeDestaque'>
          Inicia sesión
        </Link>
      </div>
    </AuthLayout>
  )
}

export default Register
