import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type Props = {
  to: string
  label: string
  icon: ReactNode
}

function NavbarLink({ to, label, icon }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-150
        ${isActive ? 'text-verdeDestaque bg-grisOscuro' : 'text-grisClaro hover:text-verdeDestaque'}`
      }
    >
      {icon}
      <span className='hidden md:inline text-sm font-medium'>{label}</span>
    </NavLink>
  )
}

export default NavbarLink
