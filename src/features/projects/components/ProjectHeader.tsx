import { Code2 } from 'lucide-react'
import type { Project } from '../types'
import ActionButtonsStats from './ActionButtonsStats'
import ProfileProjectAuthor from './ProfileProjectAuthor'

type Props = { project: Project }

const ProjectHeader = ({ project }: Props) => {
  return (
    <div className='mb-8'>
      {/* Banner/Header Image */}
      <div className='relative h-64 md:h-80 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden rounded-t-xl'>
        {project.banner ? (
          <img 
            src={project.banner} 
            alt={project.title} 
            className='w-full h-full object-cover' 
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <Code2 className='w-20 h-20 text-slate-600' />
          </div>
        )}
        {/* Overlay gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#0d1d17] via-[#0d1d17]/40 to-transparent' />
      </div>

      {/* Content Section */}
      <div className='bg-[#0d1d17] rounded-b-xl p-6 md:p-8 -mt-1'>
        {/* Title */}
        <h1 className='text-verdeDestaque font-bold text-3xl md:text-4xl mb-4'>
          {project.title}
        </h1>

        {/* Description */}
        <p className='text-grisClaro text-base md:text-lg leading-relaxed mb-6'>
          {project.description}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className='text-sm bg-grisOscuro px-4 py-2 rounded-full text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-600/30'
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer with stats and author */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-grisOscuro'>
          <ProfileProjectAuthor project={project} />
          <ActionButtonsStats project={project} />
        </div>
      </div>
    </div>
  )
}

export default ProjectHeader
