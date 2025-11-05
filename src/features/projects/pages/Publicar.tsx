import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/MainLayout'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { createNewProject } from '../thunks/projectThunks'
import { uploadImageToCloudinary } from '../services/projectService'
import { toast } from 'react-toastify'

interface FormData {
  title: string
  description: string
  banner: File | null
}

const Publicar = () => {
  const navigate = useNavigate()
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dispatch = useAppDispatch()

  const availableTags = useAppSelector((state) => state.projects.tags)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      banner: null,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('banner', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setValue('banner', null)
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()])
      setTagInput('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const filteredTags = availableTags.filter(
    (tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
  )

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    const projectData = {
      ...data,
      tags: selectedTags.map((tag) => {
        if (availableTags.includes(tag)) return tag
        else return tag.toLowerCase()
      }),
    }
    let bannerURL = ''

    try {
      // Subir imagen si existe
      if (projectData.banner) {
        const uploadToast = toast.loading('Subiendo imagen...')
        bannerURL = await uploadImageToCloudinary(projectData.banner)
        toast.dismiss(uploadToast)
      }

      // Crear el proyecto
      const createToast = toast.loading('Creando proyecto...')
      const resultAction = await dispatch(createNewProject({ ...projectData, banner: bannerURL }))

      toast.dismiss(createToast)

      // Verificar si fue exitoso y obtener el ID
      if (createNewProject.fulfilled.match(resultAction)) {
        const projectId = resultAction.payload.id

        // Mostrar mensaje de éxito
        toast.success('¡Proyecto creado exitosamente! 🎉', {
          position: 'top-center',
          autoClose: 2000,
        })

        // Esperar un momento para que el usuario vea el mensaje
        setTimeout(() => {
          navigate(`/project/${projectId}`)
        }, 1500)
      } else {
        // Manejar el error
        const errorMessage = resultAction.payload as string
        toast.error(errorMessage || 'Error al crear el proyecto')
        setIsSubmitting(false)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al procesar el proyecto')
      setIsSubmitting(false)
    }
  }

  const handleDiscard = () => {
    if (confirm('¿Estás seguro de que deseas descartar este proyecto?')) {
      navigate('/feed')
    }
  }

  return (
    <MainLayout showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar}>
      <main className='flex-1 p-6 md:p-10 text-offwhite'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-3xl font-semibold text-verdeDestaque mb-8'>Nuevo proyecto</h1>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid lg:grid-cols-2 gap-8'>
              {/* Columna izquierda - Vista previa */}
              <div className='space-y-4'>
                <div className='bg-grisOscuro rounded-lg p-6 border border-grisClaro/20'>
                  {imagePreview ? (
                    <div className='relative'>
                      <img
                        src={imagePreview}
                        alt='Preview'
                        className='w-full h-80 object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={removeImage}
                        disabled={isSubmitting}
                        className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className='w-full h-80 border-2 border-dashed border-grisClaro/30 rounded-lg flex items-center justify-center'>
                      <div className='text-center text-grisClaro'>
                        <svg
                          className='mx-auto h-12 w-12 mb-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                        <p>Vista previa del proyecto</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2 text-grisClaro'>
                    Subir imagen
                  </label>
                  <div className='relative'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                      className='hidden'
                      id='image-upload'
                    />
                    <label
                      htmlFor='image-upload'
                      className={`flex items-center justify-center w-full px-4 py-3 bg-grisOscuro border border-grisClaro/30 rounded-lg cursor-pointer hover:bg-grisClaro/10 transition ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <svg
                        className='w-5 h-5 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                        />
                      </svg>
                      Subir imagen
                    </label>
                  </div>
                  {imagePreview && (
                    <p className='text-xs text-grisClaro mt-2 flex items-center'>
                      <span className='mr-2'>📎</span>
                      image_proyecto.png
                    </p>
                  )}
                </div>
              </div>

              {/* Columna derecha - Formulario */}
              <div className='space-y-6'>
                {/* Nombre del proyecto */}
                <div>
                  <label className='block text-sm font-medium mb-2 text-grisClaro'>
                    Nombre del proyecto
                  </label>
                  <input
                    type='text'
                    {...register('title', { required: 'El nombre es requerido' })}
                    disabled={isSubmitting}
                    placeholder='React zero to hero'
                    className='w-full px-4 py-3 bg-grisClaro/20 border border-grisClaro/30 rounded-lg focus:outline-none focus:border-verdeDestaque focus:ring-1 focus:ring-verdeDestaque text-offwhite placeholder-grisClaro/50 disabled:opacity-50 disabled:cursor-not-allowed'
                  />
                  {errors.title && (
                    <p className='text-red-400 text-sm mt-1'>{errors.title.message}</p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className='block text-sm font-medium mb-2 text-grisClaro'>
                    Descripción
                  </label>
                  <textarea
                    {...register('description', { required: 'La descripción es requerida' })}
                    disabled={isSubmitting}
                    rows={6}
                    placeholder='Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...'
                    className='w-full px-4 py-3 bg-grisClaro/20 border border-grisClaro/30 rounded-lg focus:outline-none focus:border-verdeDestaque focus:ring-1 focus:ring-verdeDestaque text-offwhite placeholder-grisClaro/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed'
                  />
                  {errors.description && (
                    <p className='text-red-400 text-sm mt-1'>{errors.description.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className='block text-sm font-medium mb-2 text-grisClaro'>Tags</label>

                  {/* Tags existentes */}
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {selectedTags.map((tag, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-3 py-1.5 bg-grisClaro/20 text-offwhite rounded-md text-sm'
                      >
                        {tag}
                        <button
                          type='button'
                          onClick={() => removeTag(tag)}
                          disabled={isSubmitting}
                          className='ml-2 text-grisClaro hover:text-offwhite disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input para agregar tags con autocomplete */}
                  <div className='relative'>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={tagInput}
                        onChange={(e) => {
                          setTagInput(e.target.value)
                          setShowSuggestions(true)
                        }}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter' && filteredTags.length > 0) {
                            addTag(filteredTags[0])
                          }
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        disabled={isSubmitting}
                        placeholder='Buscar o escribir etiqueta...'
                        className='flex-1 px-4 py-2 bg-grisClaro/20 border border-grisClaro/30 rounded-lg focus:outline-none focus:border-verdeDestaque focus:ring-1 focus:ring-verdeDestaque text-offwhite placeholder-grisClaro/50 disabled:opacity-50 disabled:cursor-not-allowed'
                      />
                      <button
                        type='button'
                        onClick={() => addTag(tagInput)}
                        disabled={isSubmitting || !tagInput.trim()}
                        className='px-4 py-2 bg-grisOscuro border border-grisClaro/30 rounded-lg hover:bg-grisClaro/10 transition text-offwhite disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Agregar
                      </button>
                    </div>

                    {/* Sugerencias de tags */}
                    {showSuggestions && tagInput && filteredTags.length > 0 && (
                      <div className='absolute z-10 w-full mt-1 bg-grisOscuro border border-grisClaro/30 rounded-lg shadow-lg max-h-48 overflow-y-auto'>
                        {filteredTags.slice(0, 10).map((tag, index) => (
                          <button
                            key={index}
                            type='button'
                            onClick={() => addTag(tag)}
                            className='w-full px-4 py-2 text-left text-offwhite hover:bg-grisClaro/20 transition first:rounded-t-lg last:rounded-b-lg'
                          >
                            <span className='text-verdeDestaque mr-2'>#</span>
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Mensaje cuando no hay resultados */}
                    {showSuggestions && tagInput && filteredTags.length === 0 && (
                      <div className='absolute z-10 w-full mt-1 bg-grisOscuro border border-grisClaro/30 rounded-lg shadow-lg p-3'>
                        <p className='text-grisClaro text-sm'>
                          No se encontró "{tagInput}". Presiona "Agregar" para crear una nueva
                          etiqueta.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className='flex justify-end gap-4 pt-4'>
              <button
                type='button'
                onClick={handleDiscard}
                disabled={isSubmitting}
                className='px-6 py-3 bg-transparent border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                🗑️ Desechar
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='px-6 py-3 bg-verdeDestaque text-black rounded-lg hover:bg-verdePastel transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className='animate-spin h-5 w-5'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Publicando...
                  </>
                ) : (
                  <>⬆️ Publicar</>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </MainLayout>
  )
}

export default Publicar
