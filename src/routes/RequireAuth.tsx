import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/reduxHooks'

type Props = { children: React.ReactNode }

function RequireAuth({ children }: Props) {
  const user = useAppSelector((s) => s.auth.user)
  if (!user) return <Navigate to='/login' replace />
  return children
}

export default RequireAuth
