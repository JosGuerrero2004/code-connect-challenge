import { useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import MainLayout from '../../../components/MainLayout'
import ProjectCard from '../components/ProjectCard'
import { fetchProjectById, setSelectedProject } from '../projectsSlice'
import { useEffect } from 'react'

const ProjectPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.projects)
  if (!location.state?.project) dispatch(setSelectedProject(location.state?.project))

  const projectFromRedux = useAppSelector((state) => state.projects.selectedProject)

  // Fetch solo si no viene por state ni está en el store
  useEffect(() => {
    if (id && !projectFromRedux) {
      dispatch(fetchProjectById(id))
    }
  }, [dispatch, id, projectFromRedux])

  const project = projectFromRedux

  return (
    <MainLayout>
      <div className='m-6'>
        {status === 'succeeded' && project && <ProjectCard project={project} />}
        {status === 'loading' && <p className='text-grisClaro'>Cargando proyecto...</p>}
        {status === 'failed' && <p className='text-grisClaro'>{error}</p>}
      </div>
    </MainLayout>
  )
}

export default ProjectPage
