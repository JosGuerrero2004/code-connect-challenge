import { useEffect, useState, useRef, type ChangeEvent } from 'react'
import MainLayout from '../../components/MainLayout'
import { Camera, Edit2, Loader2, X, Check } from 'lucide-react'
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
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Estados para edición de perfil
  const [editDisplayName, setEditDisplayName] = useState('')
  const [editBio, setEditBio] = useState('')

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

  // Inicializar campos de edición cuando se abre el modo edición
  useEffect(() => {
    if (isEditingProfile && userProfile) {
      setEditDisplayName(userProfile.displayName || '')
      setEditBio(userProfile.bio || '')
    }
  }, [isEditingProfile, userProfile])

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
      const uploadedPhotoURL = await uploadImageToCloudinary(file)

      // 2. Actualizar en cascada (perfil, proyectos y comentarios)
      await dispatch(
        updateUserCascade({
          authorPhoto: uploadedPhotoURL,
        })
      ).unwrap()

      console.log('Foto de perfil actualizada exitosamente')
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error)
      alert('Hubo un error al actualizar tu foto de perfil. Intenta nuevamente.')
    } finally {
      setIsUploadingPhoto(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSaveProfile = async () => {
    if (!userProfile) return

    try {
      setIsSavingProfile(true)

      const updates: {
        authorDisplayName?: string
        bio?: string
      } = {}

      // Solo incluir campos que cambiaron
      if (editDisplayName !== userProfile.displayName) {
        updates.authorDisplayName = editDisplayName.trim()
      }

      if (editBio !== userProfile.bio) {
        updates.bio = editBio.trim()
      }

      // Si no hay cambios, solo cerrar el modo edición
      if (Object.keys(updates).length === 0) {
        setIsEditingProfile(false)
        return
      }

      // Actualizar perfil
      // Si cambió el displayName, usar cascadeUserUpdate
      if (updates.authorDisplayName) {
        await dispatch(updateUserCascade({ authorDisplayName: updates.authorDisplayName })).unwrap()
        console.log('Actualizando displayName en cascada:', updates.authorDisplayName)
      }

      // Si cambió la bio, actualizar solo el perfil
      if (updates.bio) {
        // await dispatch(updateUserProfile({ bio: updates.bio })).unwrap()
        console.log('Actualizando bio:', updates.bio)
      }

      setIsEditingProfile(false)
      console.log('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      alert('Hubo un error al actualizar tu perfil. Intenta nuevamente.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setEditDisplayName(userProfile?.displayName || '')
    setEditBio(userProfile?.bio || '')
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
            <div className='flex gap-6 flex-1'>
              {/* Avatar */}
              <div className='relative flex-shrink-0'>
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

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handlePhotoChange}
                  className='hidden'
                />
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                {isEditingProfile ? (
                  <div className='space-y-4'>
                    {/* Campo de nombre */}
                    <div>
                      <label className='block text-sm text-gray-400 mb-1'>Nombre de usuario</label>
                      <input
                        type='text'
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        maxLength={50}
                        className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#00ff88] focus:outline-none transition-colors'
                        placeholder='Tu nombre de usuario'
                      />
                      <p className='text-xs text-gray-500 mt-1'>
                        {editDisplayName.length}/50 caracteres
                      </p>
                    </div>

                    {/* Campo de bio */}
                    <div>
                      <label className='block text-sm text-gray-400 mb-1'>Biografía</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        maxLength={200}
                        rows={3}
                        className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#00ff88] focus:outline-none transition-colors resize-none'
                        placeholder='Cuéntanos sobre ti...'
                      />
                      <p className='text-xs text-gray-500 mt-1'>{editBio.length}/200 caracteres</p>
                    </div>

                    {/* Botones de acción */}
                    <div className='flex gap-3'>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile || !editDisplayName.trim()}
                        className='px-4 py-2 rounded-lg bg-[#00ff88] text-black font-medium hover:bg-[#00dd77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                      >
                        {isSavingProfile ? (
                          <>
                            <Loader2 className='w-4 h-4 animate-spin' />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Check className='w-4 h-4' />
                            Guardar
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSavingProfile}
                        className='px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                      >
                        <X className='w-4 h-4' />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className='text-3xl font-bold text-[#00ff88] mb-2 truncate'>
                      {userProfile.displayName}
                    </h1>
                    <p className='text-gray-300 mb-4 max-w-2xl leading-relaxed'>
                      {userProfile.bio || 'Sin biografía'}
                    </p>
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
                  </>
                )}
              </div>
            </div>

            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className='px-6 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:border-[#00ff88] hover:text-[#00ff88] transition-all flex items-center gap-2 flex-shrink-0'
              >
                <Edit2 className='w-4 h-4' />
                Editar
              </button>
            )}
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
