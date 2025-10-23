import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../features/auth/authSlice'
import projectsReducer from '../../features/projects/projectsSlice'
import commentsReducer from '../../features/projects/comments/commentsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    comments: commentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
