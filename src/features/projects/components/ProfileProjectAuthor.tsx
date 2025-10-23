import type { Project } from '../types'

type Props = { project: Project }

const ProfileProjectAuthor = ({ project }: Props) => {
  return (
    <>
      {/* Author and date */}
      <div className='flex items-center gap-3'>
        {project.authorPhoto ? (
          <img
            src={project.authorPhoto}
            alt={`Foto de perfil de ${project.authorDisplayName}`}
            className='w-8 h-8 md:w-10 md:h-10 rounded-full'
          />
        ) : (
          <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-verdeDestaque to-teal-500 flex items-center justify-center text-white font-semibold text-sm'>
            {project.authorDisplayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className='flex flex-col'>
          <span className='text-sm text-slate-300 font-medium'>{project.authorDisplayName}</span>
          <span className='text-xs text-slate-500'>
            {new Date(project.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </>
  )
}

export default ProfileProjectAuthor
