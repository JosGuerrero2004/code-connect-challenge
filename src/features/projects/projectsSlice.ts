import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Project, ProjectsState } from '../../features/projects/types'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../config/firebase'

const initialState: ProjectsState = {
  items: [],
  filtered: [],
  loading: false,
  error: null,
  activeTags: [],
}

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

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addFilterTag: (state, action: PayloadAction<string>) => {
      if (action.payload === 'all') {
        state.activeTags = ['all']
        state.filtered = state.items
      } else {
        // all se usa solo para mostrar si la tag de todos está activa, por lo que si está activa (siempre es única) se vacían las tags
        if (state.activeTags[0] === 'all') state.activeTags = []

        if (state.activeTags.includes(action.payload)) {
          return
        }

        state.activeTags.push(action.payload)

        state.filtered = state.items.filter((p) =>
          state.activeTags.every((tag) => p.tags.includes(tag))
        )
      }
    },

    removeFilterTag: (state, action: PayloadAction<string>) => {
      if (state.activeTags.includes(action.payload)) {
        const index = state.activeTags.indexOf(action.payload)
        if (index !== -1) state.activeTags.splice(index, 1)
        state.filtered = state.items.filter((p) =>
          state.activeTags.every((tag) => p.tags.includes(tag))
        )
      }
    },
    filterBySearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLocaleLowerCase()
      state.filtered = state.items.filter(
        (p) =>
          p.title.toLocaleLowerCase().includes(query) ||
          p.description.toLocaleLowerCase().includes(query) ||
          p.authorDisplayName.toLowerCase().includes(query)
      )
    },

    sortRecent: (state) => {
      state.filtered = [...state.filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filtered = action.payload
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false
        state.error = 'Error al cargar proyectos'
      })
  },
})

export const { addFilterTag, removeFilterTag, filterBySearch, sortRecent } = projectsSlice.actions
export default projectsSlice.reducer
