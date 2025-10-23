import { Code2 } from 'lucide-react'
import type { Project } from '../types'
import { Link } from 'react-router-dom'
import ActionButtonsStats from './ActionButtonsStats'
import ProfileProjectAuthor from './ProfileProjectAuthor'

type Props = { project: Project }

const ProjectCard = ({ project }: Props) => {
  return (
    <div className='bg-slate-800/90 rounded-xl overflow-hidden shadow-lg hover:shadow-verdeDestaque/20 transition-all duration-300 backdrop-blur-sm border border-slate-700/50'>
      {/* Banner/Header Image */}
      <Link to={`/project/${project.id}`} state={{ project }}>
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
      </Link>

      {/* Content Section */}
      <div className='p-5 md:p-6'>
        <Link to={`/project/${project.id}`} state={{ project }}>
          {/* Title */}
          <h3 className='text-verdeDestaque font-semibold text-xl md:text-2xl mb-3 line-clamp-2 hover:text-verdeDestaque/80 transition-colors cursor-pointer'>
            {project.title}
          </h3>

          {/* Description */}
          <p className='text-grisClaro text-sm md:text-base leading-relaxed mb-4 line-clamp-3'>
            {project.description}
          </p>
        </Link>

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
          <ProfileProjectAuthor project={project} />
          <ActionButtonsStats project={project} />
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
