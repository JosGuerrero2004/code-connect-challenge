import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchProjectsByIds,
  fetchProjectsByUserIdFunc,
} from '../../projects/services/projectService'
import type { RootState } from '../../../redux/store/store'

export const fetchUserProjects = createAsyncThunk(
  'userProfile/fetchUsersProjects',
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

export const fetchUserLikedProjects = createAsyncThunk(
  'userProfile/fetchLikedProjects',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState
    const user = state.auth.user

    if (!user) {
      return rejectWithValue('Usuario no autenticado')
    }

    if (!user.userProfile) {
      return rejectWithValue('Este usuario no tiene Perfil de usuario')
    }

    if (!user.userProfile.likedProjects?.ids?.length) {
      return rejectWithValue('Este usuario no tiene proyectos guardados')
    }

    try {
      const projects = await fetchProjectsByIds(user.userProfile.likedProjects.ids)

      return projects
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Error al obtener proyectos guardados del usuario')
      }
    }
  }
)

export const fetchUserSharedProjects = createAsyncThunk(
  'userProfile/fetchSharedProjects',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState
    const user = state.auth.user

    if (!user) {
      return rejectWithValue('Usuario no autenticado')
    }

    if (!user.userProfile) {
      return rejectWithValue('Este usuario no tiene Perfil de usuario')
    }

    if (!user.userProfile.sharedProjects?.ids?.length) {
      return rejectWithValue('Este usuario no tiene proyectos compartidos')
    }

    try {
      const projects = await fetchProjectsByIds(user.userProfile.sharedProjects?.ids)
      return projects
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || 'Error al obtener proyectos compartidos del usuario'
        )
      }
    }
  }
)
