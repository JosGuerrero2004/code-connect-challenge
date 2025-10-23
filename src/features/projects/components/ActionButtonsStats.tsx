import { Code2, MessageSquare, Share2 } from 'lucide-react'
import type { Project } from '../types'

type Props = {
  project: Project
}

const ActionButtonsStats = ({ project }: Props) => {
  return (
    <>
      {/* Action buttons/stats */}
      <div className='flex items-center gap-4 md:gap-5'>
        {/* Code/Tech likes button */}
        <button
          className='flex items-center gap-1.5 text-slate-400 hover:text-verdeDestaque transition-colors group'
          title='Code likes'
        >
          <Code2 className='w-4 h-4 md:w-5 md:h-5' />
          <span className='text-xs md:text-sm font-medium'>{project.likes}</span>
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
          className='flex items-center gap-1.5 text-slate-400 hover:text-purple-400 transition-colors group'
          title='Compartir'
        >
          <Share2 className='w-4 h-4 md:w-5 md:h-5' />
          <span className='text-xs md:text-sm font-medium'>{project.shares}</span>
        </button>
      </div>
    </>
  )
}

export default ActionButtonsStats
