import Navbar from '../components/Navbar/Navbar'

export default function SobreNosotros() {
  return (
    <div className='flex min-h-screen bg-grafito text-offwhite'>
      <Navbar />

      <main className='flex-1 p-8 md:p-12'>
        <h1 className='text-3xl font-medium text-verdeDestaque mb-4'>Sobre nosotros</h1>
        <p className='text-grisClaro max-w-2xl leading-relaxed mb-8'>
          En <span className='text-verdeDestaque font-medium'>CodeConnect</span> creemos en el poder
          de compartir conocimiento. Esta red social fue creada para que desarrolladores de todo el
          mundo puedan publicar, descubrir y colaborar en proyectos open source.
        </p>

        <section className='grid md:grid-cols-3 gap-8'>
          {/* Ejemplo de perfil de colaborador */}
          <div className='bg-verdePetroleo/60 rounded-lg p-4 flex flex-col items-center text-center'>
            <img
              src='/avatar1.png'
              alt='Avatar'
              className='w-20 h-20 rounded-full mb-3 border-2 border-verdeDestaque'
            />
            <h3 className='text-lg font-medium text-verdeDestaque'>Josías Guerrero</h3>
            <p className='text-sm text-grisMedio'>Desarrollador Front-End</p>
            <p className='mt-3 text-sm text-grisClaro'>
              Apasionado por el código limpio, las arquitecturas escalables y las soluciones que
              realmente ayudan a las personas.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
