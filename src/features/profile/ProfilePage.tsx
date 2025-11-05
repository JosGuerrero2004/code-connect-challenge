import { useEffect, useState, useRef } from 'react'
import MainLayout from '../../components/MainLayout'
import { Camera, Edit2, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import ProjectCard from '../projects/components/ProjectCard'
import {
  fetchUserProjects,
  fetchUserLikedProjects,
  fetchUserSharedProjects,
  updateUserCascade,
} from '../auth/thunks/userProfileThunks'
import { uploadImageToCloudinary } from '../projects/services/projectService'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'proyectos' | 'aprobados' | 'compartidos'>('proyectos')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dispatch = useAppDispatch()

  const userProfile = useAppSelector((state) => state.auth.user?.userProfile)
  const updateStatus = useAppSelector((state) => state.auth.status)

  useEffect(() => {
    if (userProfile?.uid) {
      dispatch(fetchUserProjects())
      dispatch(fetchUserLikedProjects())
      dispatch(fetchUserSharedProjects())
    }
  }, [dispatch, userProfile?.uid])

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB')
      return
    }

    try {
      setIsUploadingPhoto(true)

      // 1. Subir imagen a Cloudinary
      const photoURL = await uploadImageToCloudinary(file)

      // 2. Actualizar en cascada (perfil, proyectos y comentarios)
      await dispatch(
        updateUserCascade({
          authorPhoto: photoURL,
        })
      ).unwrap()

      // Opcional: Mostrar mensaje de éxito
      console.log('Foto de perfil actualizada exitosamente')
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error)
      alert('Hubo un error al actualizar tu foto de perfil. Intenta nuevamente.')
    } finally {
      setIsUploadingPhoto(false)
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

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

                {/* Botón de cámara con loader */}
                <button
                  onClick={handlePhotoClick}
                  disabled={isUploadingPhoto}
                  className='absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#00ff88] flex items-center justify-center hover:bg-[#00dd77] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isUploadingPhoto ? (
                    <Loader2 className='w-5 h-5 text-black animate-spin' />
                  ) : (
                    <Camera className='w-5 h-5 text-black' />
                  )}
                </button>

                {/* Input oculto para seleccionar archivo */}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handlePhotoChange}
                  className='hidden'
                />
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

          {/* Indicador de actualización */}
          {updateStatus === 'loading' && (
            <div className='mb-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-300 text-sm'>
              Actualizando perfil...
            </div>
          )}

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
