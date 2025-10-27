import { createAsyncThunk } from '@reduxjs/toolkit'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { fetchProjectsByUserIdFunc } from '../../projects/services/projectService'
import type { RootState } from '../../../redux/store/store'
import type { User, UserProfile } from '../types/auth'

export const fetchUserProjects = createAsyncThunk(
  'auth/fetchUsersProjects',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState
    const user = state.auth.user

    if (!user) {
      return rejectWithValue('Usuario no autenticado')
    }

    try {
      const projects = await fetchProjectsByUserIdFunc(user.uid)
      return projects
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Error al obtener proyectos del usuario')
      }
    }
  }
)

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userProfileRef = doc(db, 'users', uid)
    const userProfileDoc = await getDoc(userProfileRef)

    if (!userProfileDoc.exists()) {
      console.warn(`Perfil no encontrado para UID: ${uid}`)
      return null
    }

    const data = userProfileDoc.data()
    return {
      uid,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(),
    } as UserProfile
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error)
    return null
  }
}

interface CreateUserProfileData {
  username: string
  displayName: string
  bio: string
  photoURL: string | null
}

export async function createUserProfile(
  user: User,
  userProfileData?: CreateUserProfileData
): Promise<void> {
  if (!userProfileData) {
    userProfileData = {
      username: user.email?.split('@')[0],
      displayName: user.email?.split('@')[0],
      bio: '',
      photoURL: null,
    }
  }
  try {
    const userProfileRef = doc(db, 'users', user.uid)
    await setDoc(userProfileRef, {
      email: user.email,
      createdAt: serverTimestamp(),
      ...userProfileData,
      followers: 0,
      following: 0,
    })
  } catch (error) {
    console.error('Error al crear perfil del usuario:', error)
    throw error
  }
}
