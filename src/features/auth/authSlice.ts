import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import type { AuthState, User } from './types/auth'
import { checkAuthState, loginUser, logoutUser, registerUser } from './thunks/authThunks'
import {
  fetchUserLikedProjects,
  fetchUserProjects,
  fetchUserSharedProjects,
  updateUserCascade,
} from './thunks/userProfileThunks'
import { toggleLikeThunk, toggleShareThunk } from './thunks/userInteractionsThunk'

const initialState: AuthState = {
  user: null,
  error: null,
  status: 'idle',
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
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        toast.error(state.error)
      })

      // Registro
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        toast.error(state.error)
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded'
        state.user = null
        state.error = null
      })

      // Proyectos propios
      .addCase(fetchUserProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const profile = state.user?.userProfile
        if (!profile) {
          toast.error('Perfil de usuario no encontrado, inicia sesión')
          return
        }
        profile.ownedProjects = action.payload ?? []
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        toast.error(state.error)
      })

      // Proyectos gustados
      .addCase(fetchUserLikedProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserLikedProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const liked = state.user?.userProfile?.likedProjects
        if (liked) liked.list = action.payload ?? []
      })
      .addCase(fetchUserLikedProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Error al obtener proyectos gustados'
        toast.error(state.error)
      })

      // Proyectos compartidos
      .addCase(fetchUserSharedProjects.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserSharedProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const shared = state.user?.userProfile?.sharedProjects
        if (shared) shared.list = action.payload ?? []
      })
      .addCase(fetchUserSharedProjects.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Error al obtener proyectos compartidos'
        toast.error(state.error)
      })

      // Interacciones del usuario (like, share, etc.)
      .addCase(toggleLikeThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(toggleLikeThunk.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(toggleLikeThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string' ? action.payload : 'error al dar like a este proyecto'
        toast.error(state.error)
      })
      .addCase(toggleShareThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(toggleShareThunk.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(toggleShareThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string' ? action.payload : 'error al dar like a este proyecto'
        toast.error(state.error)
      })
      //persistencia de sesion
      .addCase(checkAuthState.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.status = 'failed'
        state.user = null
      })
      //actualizacion en cascada del usuario puede ir aqui
      .addCase(updateUserCascade.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateUserCascade.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { authorPhoto, authorDisplayName } = action.payload

        if (state.user && state.user.userProfile) {
          // Actualiza solo los campos válidos del perfil
          state.user.userProfile.photoURL = authorPhoto ?? state.user.userProfile.photoURL
          state.user.userProfile.displayName =
            authorDisplayName ?? state.user.userProfile.displayName
        }
      })
      .addCase(updateUserCascade.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
        toast.error(state.error)
      })
  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
