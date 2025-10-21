import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import { useEffect } from 'react'
import { logoutUser } from '../authSlice'

function Logout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(logoutUser()).finally(() => {
      navigate('/login')
    })
  }, [dispatch, navigate])

  return null
}

export default Logout
