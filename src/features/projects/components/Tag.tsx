import { X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { addFilterTag, removeFilterTag } from '../redux/projectsSlice'

type Props = {
  name: string
  displayName?: string
}

const Tag = ({ name, displayName }: Props) => {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.projects.activeTags)

  const isActive = tags.includes(name)

  const handleClick = () => {
    if (isActive) {
      dispatch(removeFilterTag(name))
      return
    }
    dispatch(addFilterTag(name))
  }

  return (
    <button
      onClick={handleClick}
      className={`filter-btn ${isActive ? 'bg-grisClaro text-black border border-grisOscuro' : ''}`}
    >
      <span>{displayName ?? name}</span>
      {isActive && <X size={16} />}
    </button>
  )
}

export default Tag
