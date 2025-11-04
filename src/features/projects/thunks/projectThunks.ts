import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Project } from '../../../features/projects/types'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { fetchProjectsByUserIdFunc } from '../services/projectService'
import type { RootState } from '../../../redux/store/store'

export const fetchProjects = createAsyncThunk('projects/fetch', async () => {
  try {
    const projectsRef = collection(db, 'projects')
    const q = query(projectsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const projects: Project[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      } as Project
    })

    return projects
  } catch (error) {
    console.error('Error al obtener proyectos', error)
    throw new Error('No se pudieron cargar los proyectos')
  }
})

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: string) => {
    const projectRef = doc(db, 'projects', projectId)
    const projectDoc = await getDoc(projectRef)
    if (!projectDoc.exists()) {
      throw new Error('Proyecto no encontrado')
    }
    return {
      id: projectDoc.id,
      ...projectDoc.data(),
      createdAt: projectDoc.data().createdAt?.toDate().toISOString(),
    } as Project
  }
)

export const fetchProjectsByUserId = createAsyncThunk(
  'projects/fetchByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const projects = await fetchProjectsByUserIdFunc(userId)
      return projects
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Error al obtener proyectos')
      }
    }
  }
)

interface NewProjectData {
  title: string
  description: string
  banner: string
  tags: string[]
}

export const createNewProject = createAsyncThunk(
  'projects/createNew',
  async (newProject: NewProjectData, { rejectWithValue, getState }) => {
    const state = getState() as RootState
    if (!state.auth.user) {
      return rejectWithValue('Usuario no autenticado')
    }
    if (!state.auth.user.userProfile) {
      return rejectWithValue('Usuario no tiene perfil detectado')
    }

    const author = state.auth.user.userProfile

    try {
      const projectsRef = collection(db, 'projects')
      const docRef = await addDoc(projectsRef, {
        ...newProject,
        likes: 0,
        shares: 0,
        commentsCount: 0,
        authorDisplayName: author.displayName,
        authorId: state.auth.user.uid,
        authorPhoto: author.photoURL ?? '',
        authorUsername: author.username,
        code: '',
        createdAt: serverTimestamp(),
      })
      return { id: docRef.id }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido al crear el proyecto'
      return rejectWithValue(message)
    }
  }
)
