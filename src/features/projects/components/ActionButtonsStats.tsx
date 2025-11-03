import { Code, Code2, MessageSquare, Share2 } from 'lucide-react'
import type { Project } from '../types'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { toggleLikeThunk, toggleShareThunk } from '../../auth/thunks/userInteractionsThunk'
import { useState } from 'react'

type Props = {
  project: Project
}

const ActionButtonsStats = ({ project }: Props) => {
  const dispatch = useAppDispatch()
  const likedIds = useAppSelector((state) => state.auth.user?.userProfile?.likedProjects?.ids ?? [])
  const shareIds = useAppSelector(
    (state) => state.auth.user?.userProfile?.sharedProjects?.ids ?? []
  )
  const [isLiked, setIsLiked] = useState(likedIds.includes(project.id))
  const [likes, setLikes] = useState(project.likes)
  const [isShared, setIsShared] = useState(shareIds.includes(project.id))
  const [shares, setShares] = useState(project.shares)

  const hadleLike = () => {
    dispatch(toggleLikeThunk(project.id))
    setLikes(isLiked ? likes - 1 : likes + 1)
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    dispatch(toggleShareThunk(project.id))
    setShares(isShared ? shares - 1 : shares + 1)
    setIsShared(!isShared)
  }

  return (
    <>
      {/* Action buttons/stats */}
      <div className='flex items-center gap-4 md:gap-5'>
        {/* Code/Tech likes button */}
        <button
          onClick={hadleLike}
          className={`flex items-center gap-1.5 transition-colors group ${
            isLiked ? 'text-verdeDestaque' : 'text-slate-400 hover:text-verdeDestaque'
          }`}
          title={isLiked ? 'Quitar me gusta' : 'Me gusta'}
        >
          {isLiked ? (
            <Code2 className='w-4 h-4 md:w-5 md:h-5' />
          ) : (
            <Code className='w-4 h-4 md:w-5 md:h-5' />
          )}
          <span className='text-xs md:text-sm font-medium'>{likes}</span>
        </button>

        {/* Comments button */}
        <button
          className='flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors group'
          title='Comentarios'
        >
          <MessageSquare className='w-4 h-4 md:w-5 md:h-5' />
          <span className='text-xs md:text-sm font-medium'>{project.commentsCount}</span>
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 transition-colors group ${
            isShared ? 'text-purple-400' : 'text-slate-400 hover:text-purple-400'
          }`}
          title={isShared ? 'Quitar compartido' : 'Compartir'}
        >
          <Share2 className='w-4 h-4 md:w-5 md:h-5' />
          <span className='text-xs md:text-sm font-medium'>{shares}</span>
        </button>
      </div>
    </>
  )
}

export default ActionButtonsStats
