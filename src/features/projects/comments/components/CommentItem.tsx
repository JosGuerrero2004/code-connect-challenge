import { useState } from 'react'
import type { CommentNode } from '../../types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CommentItemProps {
  comment: CommentNode
  onReply: (commentId: string, replyingToUsername: string, content: string) => void
  level?: number
}

function CommentItem({ comment, onReply, level = 0 }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, comment.username, replyContent)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  const hasReplies = comment.replies && comment.replies.length > 0

  return (
    <div className={`${level > 0 ? 'ml-8 md:ml-12' : ''}`}>
      <div className='flex gap-3 mb-4'>
        {/* Avatar */}
        <div className='flex-shrink-0'>
          <div className='w-10 h-10 rounded-full bg-grisOscuro flex items-center justify-center overflow-hidden'>
            {comment.photoURL ? (
              <img
                src={comment.photoURL}
                alt={comment.username}
                className='w-full h-full object-cover'
              />
            ) : (
              <span className='text-verdeDestaque font-bold text-lg'>
                {comment.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <div className='flex-1'>
          <div className='mb-1'>
            <span className='font-semibold text-white'>@{comment.username}</span>
            {comment.replyingTo && (
              <span className='text-grisClaro text-sm ml-2'>
                respondiendo a{' '}
                <span className='text-verdeDestaque'>@{comment.replyingToUsername}</span>
              </span>
            )}
          </div>
          <p className='text-grisClaro mb-2'>{comment.content}</p>

          {/* Actions */}
          <div className='flex items-center gap-4 text-sm'>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className='text-grisClaro hover:text-verdeDestaque transition-colors'
            >
              Responder
            </button>

            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className='flex items-center gap-1 text-grisClaro hover:text-verdeDestaque transition-colors'
              >
                {showReplies ? (
                  <>
                    <ChevronUp size={16} />
                    <span>Ocultar respuestas</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    <span>Ver respuestas ({comment.replies.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className='mt-3 flex gap-2'>
              <input
                type='text'
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder='Escribe tu respuesta...'
                className='flex-1 bg-grisOscuro text-offwhite rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verdeDestaque'
                onKeyUp={(e) => e.key === 'Enter' && handleSubmitReply()}
              />
              <button
                onClick={handleSubmitReply}
                className='px-4 py-2 bg-verdeDestaque text-verdePetroleo rounded-lg text-sm font-medium hover:bg-verdeDestaque/90 transition-colors'
              >
                Enviar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {hasReplies && showReplies && (
        <div className='border-l-2 border-grisOscuro pl-4 md:pl-6 ml-5'>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem
