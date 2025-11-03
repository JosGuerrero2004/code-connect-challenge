import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../../../redux/store/store'
import { toggleProjectLike, toggleProjectShare } from '../services/userInteractionService'
import { setUser } from '../authSlice'
import { updateProjectLikes, updateProjectShares } from '../../projects/redux/projectsSlice'

export const toggleLikeThunk = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>('projects/toggleLike', async (projectId, { getState, rejectWithValue, dispatch }) => {
  const user = getState().auth.user
  if (!user?.uid) return rejectWithValue('Usuario no autenticado')

  try {
    const result = await toggleProjectLike(user.uid, projectId)

    // Actualiza likes en projects
    dispatch(updateProjectLikes({ projectId, delta: result === 'liked' ? 1 : -1 }))

    // Actualiza likedProjects en auth
    const likedIds = user.userProfile?.likedProjects?.ids ?? []
    const updatedIds =
      result === 'liked' ? [...likedIds, projectId] : likedIds.filter((id) => id !== projectId)

    dispatch(
      setUser({
        ...user,
        userProfile: {
          ...user.userProfile!,
          likedProjects: {
            ...user.userProfile!.likedProjects!,
            ids: updatedIds,
          },
        },
      })
    )
  } catch (err) {
    return rejectWithValue(`Error al actualizar me gusta. ${err}`)
  }
})

export const toggleShareThunk = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>('projects/toggleShare', async (projectId, { getState, rejectWithValue, dispatch }) => {
  const user = getState().auth.user
  if (!user?.uid) return rejectWithValue('Usuario no autenticado')

  try {
    const result = await toggleProjectShare(user.uid, projectId)

    // Actualiza shares en projects
    dispatch(updateProjectShares({ projectId, delta: result === 'shared' ? 1 : -1 }))

    // Actualiza sharedProjects en auth
    const sharedIds = user.userProfile?.sharedProjects?.ids ?? []
    const updatedIds =
      result === 'shared' ? [...sharedIds, projectId] : sharedIds.filter((id) => id !== projectId)

    dispatch(
      setUser({
        ...user,
        userProfile: {
          ...user.userProfile!,
          sharedProjects: {
            ...user.userProfile!.sharedProjects!,
            ids: updatedIds,
          },
        },
      })
    )
  } catch (err) {
    return rejectWithValue(`Error al actualizar compartido. ${err}`)
  }
})
