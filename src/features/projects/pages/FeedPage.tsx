import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { useEffect, useState } from 'react'
import FilterBar from '../components/FilterBar'
import ProjectCard from '../components/ProjectCard'
import MainLayout from '../../../components/MainLayout'
import { filterBySearch } from '../redux/projectsSlice'
import { fetchProjects } from '../thunks/projectThunks'

const FeedPage = () => {
  const dispatch = useAppDispatch()
  const { filtered, status, hasFetched } = useAppSelector((state) => state.projects)
  const location = useLocation()
  const navigate = useNavigate()
  const [showSearchBar, setShowSearchBar] = useState(false)

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchProjects())
    }
  }, [dispatch, hasFetched])

  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('q')

  useEffect(() => {
    if (searchQuery) dispatch(filterBySearch(searchQuery))
  }, [searchQuery, dispatch])

  return (
    <MainLayout showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar}>
      <main className='flex-1 p-6 md:p-10 text-offwhite '>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-medium text-verdeDestaque'>Proyectos</h1>
          <button
            onClick={() => navigate('/publicar')}
            className='bg-verdeDestaque text-black px-4 py-2 rounded-md hover:bg-verdePastel transition'
          >
            + Publicar
          </button>
        </div>

        <FilterBar />

        {status === 'loading' ? (
          <p className='text-grisClaro'>Cargando proyectos...</p>
        ) : (
          <div className='grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </MainLayout>
  )
}

export default FeedPage
