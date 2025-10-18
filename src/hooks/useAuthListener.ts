import { useEffect } from 'react'
import { useAppDispatch } from './reduxHooks'
import { onAuthStateChanged } from 'firebase/auth/cordova'
import type { User } from '../features/auth/types/auth'
import { setUser } from '../features/auth/authSlice'
import { auth } from '../config/firebase'

export const useAuthListener = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName }))
      } else {
        dispatch(setUser(null))
      }
    })
    return () => unsub()
  }, [dispatch])
}
