import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import type { CommentNode, CommentsState } from '../types'
import { db } from '../../../config/firebase'
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'
import type { RootState } from '../../../redux/store/store'

const initialState: CommentsState = {
  projectId: '',
  comments: [],
  error: null,
  status: 'idle',
}

interface NewCommentInput {
  projectId: string
  content: string
  userId: string
  username: string
  photoURL: string
  replyingTo?: string | null
}

async function addCommentProject({
  projectId,
  content,
  userId,
  username,
  photoURL,
  replyingTo = null,
}: NewCommentInput): Promise<void> {
  try {
    const commentsRef = collection(db, `projects/${projectId}/comments`)
    await addDoc(commentsRef, {
      content,
      userId,
      username,
      photoURL,
      replyingTo,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error al agregar el comentario', error)
    throw new Error('No se pudo agregar el comentario')
  }
}

export const addComment = createAsyncThunk(
  'comments/add',
  async (newComment: NewCommentInput, { dispatch }) => {
    await addCommentProject(newComment)
    dispatch(fetchComments(newComment.projectId))
  }
)

function buildCommentTree(flatComments: CommentNode[]): CommentNode[] {
  const commentMap = new Map<string, CommentNode>()
  const roots: CommentNode[] = []

  // Primero, crear el mapa con todos los comentarios
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // Luego, construir el árbol
  flatComments.forEach((comment) => {
    const node = commentMap.get(comment.id)!

    if (comment.replyingTo) {
      const parent = commentMap.get(comment.replyingTo)
      if (parent) {
        parent.replies.push(node)
      } else {
        // Si no se encuentra el padre, agregar como root
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  // Ordenar las respuestas de cada comentario por fecha
  const sortReplies = (node: CommentNode) => {
    if (node.replies && node.replies.length > 0) {
      node.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      node.replies.forEach(sortReplies)
    }
  }

  roots.forEach(sortReplies)

  // Ordenar los comentarios raíz por fecha (más recientes primero)
  roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return roots
}

export const fetchComments = createAsyncThunk('comments/fetch', async (projectId: string) => {
  try {
    const commentsRef = collection(db, `projects/${projectId}/comments`)
    const q = query(commentsRef, orderBy('createdAt', 'asc'))
    const querySnapshot = await getDocs(q)

    const flatComments: CommentNode[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      } as CommentNode
    })

    return flatComments
  } catch (error) {
    console.error('Error al obtener los comentarios del proyecto', error)
    throw new Error('No se pudieron cargar los comentarios del proyecto')
  }
})

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.comments = action.payload
        state.error = null
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'No se pudieron cargar los comentarios'
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.error = null
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.error.message || 'No se pudo agregar el comentario'
      })
  },
})

export const { clearComments } = commentsSlice.actions

export default commentsSlice.reducer

// Selector para obtener el árbol de comentarios
export const selectCommentsTree = createSelector(
  (state: RootState) => state.comments.comments,
  (flatComments) => buildCommentTree(flatComments)
)

// Selector para obtener el estado de carga
export const selectCommentsStatus = (state: RootState) => state.comments.status

// Selector para obtener errores
export const selectCommentsError = (state: RootState) => state.comments.error
