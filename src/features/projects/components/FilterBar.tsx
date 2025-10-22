import { useAppDispatch } from '../../../hooks/reduxHooks'
import { sortRecent } from '../projectsSlice'
import Tag from './Tag'

const FilterBar = () => {
  const dispatch = useAppDispatch()
  return (
    <div className='pb-8 flex'>
      <Tag name='all' displayName='Todos' />
      <Tag name='React' />
      <Tag name='Spring boot' />
      <button onClick={() => dispatch(sortRecent())} className='filter-btn'>
        Recientes
      </button>
    </div>
  )
}

export default FilterBar
