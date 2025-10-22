import { Code2, MessageSquare, Share2 } from 'lucide-react'
import type { Project } from '../types'

type Props = { project: Project }

const ProjectCard = ({ project }: Props) => {
  return (
    <div className='bg-slate-800/90 rounded-xl overflow-hidden shadow-lg hover:shadow-verdeDestaque/20 transition-all duration-300 backdrop-blur-sm border border-slate-700/50'>
      {/* Banner/Header Image */}
      <div className='relative h-48 md:h-56 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden'>
        {project.banner ? (
          <img src={project.banner} alt={project.title} className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <Code2 className='w-16 h-16 text-slate-600' />
          </div>
        )}

        {/* Overlay gradient for better text readability if needed */}
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent' />
      </div>

      {/* Content Section */}
      <div className='p-5 md:p-6'>
        {/* Title */}
        <h3 className='text-verdeDestaque font-semibold text-xl md:text-2xl mb-3 line-clamp-2 hover:text-verdeDestaque/80 transition-colors cursor-pointer'>
          {project.title}
        </h3>

        {/* Description */}
        <p className='text-grisClaro text-sm md:text-base leading-relaxed mb-4 line-clamp-3'>
          {project.description}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mb-5'>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className='text-xs md:text-sm bg-slate-700/70 px-3 py-1.5 rounded-full text-slate-300 hover:bg-slate-600/70 transition-colors cursor-pointer border border-slate-600/30'
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer with stats and author */}
        <div className='flex items-center justify-between pt-4 border-t border-slate-700/50'>
          {/* Author and date */}
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-verdeDestaque to-teal-500 flex items-center justify-center text-white font-semibold text-sm'>
              {project.author.charAt(0).toUpperCase()}
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-slate-300 font-medium'>{project.author}</span>
              <span className='text-xs text-slate-500'>
                {new Date(project.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Action buttons/stats */}
          <div className='flex items-center gap-4 md:gap-5'>
            {/* Code/Tech likes button */}
            <button
              className='flex items-center gap-1.5 text-slate-400 hover:text-verdeDestaque transition-colors group'
              title='Code likes'
            >
              <Code2 className='w-4 h-4 md:w-5 md:h-5' />
              <span className='text-xs md:text-sm font-medium'>12</span>
            </button>

            {/* Comments button */}
            <button
              className='flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors group'
              title='Comentarios'
            >
              <MessageSquare className='w-4 h-4 md:w-5 md:h-5' />
              <span className='text-xs md:text-sm font-medium'>12</span>
            </button>

            {/* Share button */}
            <button
              className='flex items-center gap-1.5 text-slate-400 hover:text-purple-400 transition-colors group'
              title='Compartir'
            >
              <Share2 className='w-4 h-4 md:w-5 md:h-5' />
              <span className='text-xs md:text-sm font-medium'>12</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
