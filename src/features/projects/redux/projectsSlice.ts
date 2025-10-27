import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Project, ProjectsState } from '../../../features/projects/types'
import { fetchProjectById, fetchProjects } from '../thunks/projectThunks'

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
