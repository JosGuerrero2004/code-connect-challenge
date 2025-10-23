import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User, UserProfile } from './types/auth'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth/cordova'
import { auth, db } from '../../config/firebase'
import { FirebaseError } from 'firebase/app'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
}

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

//Profile functions
async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
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

async function createUserProfile(
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //register
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer
export const { setUser } = authSlice.actions
