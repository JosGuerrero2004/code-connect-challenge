import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Project, ProjectsState } from '../../features/projects/types'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../config/firebase'

const initialState: ProjectsState = {
  items: [],
  filtered: [],
  viewed: [],
  error: null,
  activeTags: [],
  selectedProject: null,
  hasFetched: false,
  status: 'idle',
}

const setSelectedProjectLocal = (state: ProjectsState, action: PayloadAction<Project>) => {
  if (!state.viewed.includes(action.payload)) state.viewed.push(action.payload)
  state.selectedProject = action.payload
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

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: setSelectedProjectLocal,
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
      // FetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        if (state.filtered.length === 0) {
          state.filtered = action.payload
        }
        state.hasFetched = true
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Error al cargar proyectos'
      })
      // Fetch Project By Id
      .addCase(fetchProjectById.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selectedProject = action.payload
        setSelectedProjectLocal(state, action)
      })
      .addCase(fetchProjectById.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Error al cargar el proyecto seleccionado, proyecto no existe'
      })
  },
})

export const { setSelectedProject, addFilterTag, removeFilterTag, filterBySearch, sortRecent } =
  projectsSlice.actions
export default projectsSlice.reducer
