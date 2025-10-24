import { useState } from 'react'
import type { CommentNode } from '../../types'
import CommentItem from './CommentItem'
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks'
import { addComment } from '../commentsSlice'

type Props = {
  comments: CommentNode[]
  projectId: string
}

const CommentsSection = ({ comments, projectId }: Props) => {
  const [newComment, setNewComment] = useState('')
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector((state) => state.auth?.user)

  // useEffect(() => {
  //   if (projectId) dispatch(fetchComments(projectId))
  // }, [])

  function onReply(replyingTo: string, content: string) {
    if (!currentUser) {
      console.error('User not authenticated')
      return
    }
    dispatch(
      addComment({
        projectId,
        content,
        userId: currentUser.uid,
        username: currentUser.userProfile!.username,
        photoURL: currentUser.userProfile!.photoURL,
        replyingTo: replyingTo || null,
      })
    )
  }
  const handleSubmitComment = () => {
    if (newComment.trim() && currentUser) {
      dispatch(
        addComment({
          projectId,
          content: newComment,
          userId: currentUser.uid,
          username: currentUser.userProfile?.displayName || 'Usuario',
          photoURL: currentUser.userProfile?.photoURL || '',
          replyingTo: null,
        })
      )
      setNewComment('')
    }
  }

  return (
    <div className='bg-[#0d1d17] rounded-lg p-6 md:p-8'>
      <h2 className='text-2xl md:text-3xl font-bold text-white mb-6'>Comentarios</h2>

      {/* New Comment Input */}
      <div className='mb-8 flex gap-3'>
        <div className='flex-shrink-0'>
          <div className='w-10 h-10 rounded-full bg-grisOscuro flex items-center justify-center'>
            <span className='text-verdeDestaque font-bold text-lg'>U</span>
          </div>
        </div>
        <div className='flex-1 flex gap-2'>
          <input
            type='text'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Escribe un comentario...'
            className='flex-1 bg-grisOscuro text-offwhite rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-verdeDestaque'
            onKeyUp={(e) => e.key === 'Enter' && handleSubmitComment()}
          />
          <button
            onClick={handleSubmitComment}
            className='px-6 py-2 bg-verdeDestaque text-verdePetroleo rounded-lg font-medium hover:bg-verdeDestaque/90 transition-colors'
          >
            Comentar
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className='space-y-6'>
        {comments.length === 0 ? (
          <p className='text-grisClaro text-center py-8'>
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={onReply} />
          ))
        )}
      </div>
    </div>
  )
}

export default CommentsSection
