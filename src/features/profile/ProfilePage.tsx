import { useEffect, useState } from 'react'
import MainLayout from '../../components/MainLayout'
import { Camera, Edit2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import ProjectCard from '../projects/components/ProjectCard'
import {
  fetchUserProjects,
  fetchUserLikedProjects,
  fetchUserSharedProjects,
} from '../auth/thunks/userProfileThunks'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'proyectos' | 'aprobados' | 'compartidos'>('proyectos')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const dispatch = useAppDispatch()

  const userProfile = useAppSelector((state) => state.auth.user?.userProfile)
  // const status = useAppSelector((state) => state.auth.status)

  useEffect(() => {
    if (userProfile?.uid) {
      dispatch(fetchUserProjects())
      dispatch(fetchUserLikedProjects())
      dispatch(fetchUserSharedProjects())
    }
  }, [dispatch, userProfile?.uid])

  if (!userProfile) return <div className='text-white p-8'>Cargando perfil...</div>

  const proyectos =
    activeTab === 'proyectos'
      ? (userProfile.ownedProjects ?? [])
      : activeTab === 'aprobados'
        ? (userProfile.likedProjects?.list ?? [])
        : (userProfile.sharedProjects?.list ?? [])

  return (
    <MainLayout>
      <div className='min-h-screen bg-[#0a0a0a] text-white'>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          {/* Header */}
          <div className='flex items-start justify-between mb-8'>
            <div className='flex gap-6'>
              {/* Avatar */}
              <div className='relative'>
                {userProfile.photoURL ? (
                  <div className='w-40 h-40 rounded-full overflow-hidden border-4 border-[#00ff88] shadow-lg shadow-[#00ff88]/20'>
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-40 h-40 rounded-full bg-gradient-to-br from-verdeDestaque to-teal-500 flex items-center justify-center text-white font-semibold text-4xl'>
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button className='absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#00ff88] flex items-center justify-center hover:bg-[#00dd77] transition-colors shadow-lg'>
                  <Camera className='w-5 h-5 text-black' />
                </button>
              </div>

              {/* Info */}
              <div className='flex-1'>
                <h1 className='text-3xl font-bold text-[#00ff88]'>{userProfile.displayName}</h1>
                <p className='text-gray-300 mb-4 max-w-2xl leading-relaxed'>{userProfile.bio}</p>
                <div className='flex gap-8 mb-4'>
                  <div>
                    <span className='text-2xl font-bold text-white block'>
                      {userProfile.ownedProjects?.length ?? 0}
                    </span>
                    <span className='text-sm text-gray-400'>Proyectos</span>
                  </div>
                  <div>
                    <span className='text-2xl font-bold text-white block'>
                      {userProfile.followers}
                    </span>
                    <span className='text-sm text-gray-400'>Seguidores</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className='px-6 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:border-[#00ff88] hover:text-[#00ff88] transition-all flex items-center gap-2'
            >
              <Edit2 className='w-4 h-4' />
              Editar
            </button>
          </div>

          {/* Tabs */}
          <div className='flex gap-8 mb-8'>
            {['proyectos', 'aprobados', 'compartidos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`pb-3 text-lg font-medium transition-all relative ${
                  activeTab === tab ? 'text-[#00ff88]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff88]' />
                )}
              </button>
            ))}
          </div>

          {/* Grid de Proyectos */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {proyectos.length > 0 ? (
              proyectos.map((proyecto) => <ProjectCard key={proyecto.id} project={proyecto} />)
            ) : (
              <p className='text-gray-400'>No hay proyectos en esta sección.</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ProfilePage
