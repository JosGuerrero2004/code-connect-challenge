import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Project } from '../../../features/projects/types'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { fetchProjectsByUserIdFunc } from '../services/projectService'

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
