import type { ChangeEvent } from 'react'

type Props = {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function SearchBar({ value, onChange }: Props) {
  return (
    <div className='w-full flex items-center bg-grisOscuro rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-verdeDestaque transition'>
      <input
        type='text'
        placeholder='Busca proyectos...'
        value={value}
        onChange={onChange}
        className='bg-transparent w-full text-sm focus:outline-none placeholder-grisMedio'
      />
    </div>
  )
}

export default SearchBar
