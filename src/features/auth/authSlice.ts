import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from './types/auth'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth/cordova'
import { auth } from '../../config/firebase'
import { FirebaseError } from 'firebase/app'

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
      return { uid: user.uid, email: user.email } as User
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('An unexpected error ocurred')
    }
  }
)

export const loginUser = createAsyncThunk(
  'autn/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      return { uid: user.uid, email: user.email } as User
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
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer
export const { setUser } = authSlice.actions
