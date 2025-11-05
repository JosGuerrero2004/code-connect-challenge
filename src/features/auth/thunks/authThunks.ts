import { createAsyncThunk } from '@reduxjs/toolkit'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth/cordova'
import { auth } from '../../../config/firebase'
import { createUserProfile, fetchUserProfile } from '../services/userProfileService'
import type { User } from '../types/auth'
import { onAuthStateChanged } from 'firebase/auth/cordova'

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await createUserProfile(user as User)
      const userProfile = await fetchUserProfile(user.uid)
      if (!userProfile) {
        return rejectWithValue('No se pudo cargar el perfil del usuario')
      }
      return { uid: user.uid, email: user.email, userProfile } as User
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message)
      } else {
        console.error('Error inesperado en login/registro:', error)
        return rejectWithValue('Ocurrió un error inesperado. Intenta nuevamente.')
      }
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const userProfile = await fetchUserProfile(user.uid)
      if (!userProfile) {
        return rejectWithValue('No se pudo cargar el perfil del usuario')
      }
      return { uid: user.uid, email: user.email, userProfile } as User
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('An unexpected error ocurred')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await signOut(auth)
})

export const checkAuthState = createAsyncThunk('auth/checkAuthState', async () => {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe() // evitamos múltiples llamadas
      if (firebaseUser) {
        try {
          const userProfile = await fetchUserProfile(firebaseUser.uid)
          if (!userProfile) {
            return resolve(null)
          }
          resolve({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            userProfile,
          })
        } catch (error) {
          console.error('Error al recuperar perfil:', error)
          resolve(null)
        }
      } else {
        resolve(null)
      }
    })
  })
})
