import { useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import MainLayout from '../../../components/MainLayout'
import { fetchProjectById, setSelectedProject } from '../projectsSlice'
import { useEffect } from 'react'
import { fetchComments } from '../comments/commentsSlice'
import CommentsSection from '../comments/components/CommentsSection'
import ProjectHeader from '../components/ProjectHeader'
import CodeViewer from '../components/CodeViewer'

const ProjectPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { status: projectStatus, error: projectError } = useAppSelector((state) => state.projects)
  const { status: commentStatus } = useAppSelector((state) => state.comments)

  if (!location.state?.project) dispatch(setSelectedProject(location.state?.project))

  const projectFromRedux = useAppSelector((state) => state.projects.selectedProject)
  const project = projectFromRedux
  const projectId = id ?? project?.id

  // Fetch solo si no viene por state ni está en el store
  useEffect(() => {
    if (projectId && !projectFromRedux) {
      dispatch(fetchProjectById(projectId))
    }
  }, [dispatch, projectId, projectFromRedux])

  useEffect(() => {
    if (projectId) {
      dispatch(fetchComments(projectId))
    }
  }, [dispatch, projectId])

  if (!projectId) {
    return (
      <MainLayout>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <p className='text-grisClaro text-lg'>Error: no hay ID de proyecto dado</p>
        </div>
      </MainLayout>
    )
  }

  if (projectStatus === 'loading') {
    return (
      <MainLayout>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <p className='text-grisClaro text-lg'>Cargando proyecto...</p>
        </div>
      </MainLayout>
    )
  }

  if (projectStatus === 'failed' || !project) {
    return (
      <MainLayout>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <p className='text-red-400 text-lg'>{projectError || 'No se pudo cargar el proyecto'}</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header del proyecto */}
        <ProjectHeader project={project} />

        {/* Código del proyecto */}
        {project.code && (
          <div className='mb-8'>
            <CodeViewer code={project.code} language='javascript' />
          </div>
        )}

        {/* Sección de comentarios */}
        <CommentsSection projectId={projectId} />

        {commentStatus === 'loading' && (
          <div className='text-center py-4'>
            <p className='text-grisClaro'>Cargando comentarios...</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default ProjectPage
