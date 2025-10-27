import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import type { AuthState, User } from './types/auth'
import { loginUser, logoutUser, registerUser } from './thunks/authThunks'
import { fetchUserProjects } from './thunks/userProfileThunks'

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
}

//Profile functions
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

      // projects

      .addCase(fetchUserProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading = false
        if (!action.payload) {
          toast.error('No tienes proyectos')
          return
        }
        if (!state.user?.userProfile) {
          toast.error('Perfil de usuario no encontrado, inicia sesión')
          return
        }

        state.user.userProfile.ownedProjects = action.payload
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default authSlice.reducer
export const { setUser } = authSlice.actions
