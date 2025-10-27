import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import type { AuthState, User } from './types/auth'
import { loginUser, logoutUser, registerUser } from './thunks/authThunks'
import {
  fetchUserLikedProjects,
  fetchUserProjects,
  fetchUserSharedProjects,
} from './thunks/userProfileThunks'

const initialState: AuthState = {
  user: null,
  error: null,
  status: 'idle',
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
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      //register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded'
        state.user = null
      })

      // projects

      .addCase(fetchUserProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
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
        state.status = 'failed'
        state.error = action.payload as string
      })

      //liked
      .addCase(fetchUserLikedProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserLikedProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user!.userProfile!.likedProjects!.list = action.payload ?? null
      })
      .addCase(fetchUserLikedProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Error desconocido al buscar los proyectos gustados'
        toast.error(state.error)
      })

      .addCase(fetchUserSharedProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserSharedProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.user!.userProfile!.likedProjects!.list = action.payload ?? null
      })
      .addCase(fetchUserSharedProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Error desconocido al buscar los proyectos compartidos'
        toast.error(state.error)
      })
  },
})

export default authSlice.reducer
export const { setUser } = authSlice.actions
