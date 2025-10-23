import { useState, type ReactNode } from 'react'
import Navbar from './Navbar/Navbar'

type Props = {
  children: ReactNode
  showSearchBar?: boolean
  setShowSearchBar?: (value: boolean) => void
}

const MainLayout = ({ children, showSearchBar, setShowSearchBar }: Props) => {
  const [localShowSearcBar, setLocalShowSearchBar] = useState(false)

  return (
    <div
      className={`flex md:ml-0 min-h-screen bg-grafito transition-all duration-200 ${showSearchBar ? 'pt-[112px] md:pt-0' : 'pt-[57px] md:pt-0'}`}
    >
      <Navbar
        showSearchBar={showSearchBar ?? localShowSearcBar}
        setShowSearchBar={setShowSearchBar ?? setLocalShowSearchBar}
      />
      <main className='flex-1 text-offwhite md:pt-0'>{children}</main>
    </div>
  )
}

export default MainLayout
