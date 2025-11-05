import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { sortRecent } from '../redux/projectsSlice'
import Tag from './Tag'

const FilterBar = () => {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.projects.tags)
  return (
    <div className='pb-8 flex'>
      <Tag name='all' displayName='Todos' />
      {tags.map((tag) => (
        <Tag key={tag} name={tag} displayName={tag} />
      ))}
      <button onClick={() => dispatch(sortRecent())} className='filter-btn'>
        Recientes
      </button>
    </div>
  )
}

export default FilterBar
