import MainLayout from '../components/MainLayout'

export default function SobreNosotros() {
  return (
    <MainLayout>
      <div className='flex min-h-screen bg-gradient-to-br from-[#0a1612] via-[#0d1d17] to-[#0a1612] text-offwhite'>
        {/* Main content */}
        <div className='flex-1 md:ml-0 md:pt-0 pb-20 md:pb-0'>
          {/* Hero Section */}
          <section className='relative overflow-hidden'>
            {/* Background Image with overlay */}
            <div className='relative h-[400px] md:h-[500px]'>
              <img
                src='/sobre-nosotros-banner.png'
                alt='Digital Revolution'
                className='w-full h-full object-cover opacity-60'
              />
              <div className='absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1612]/50 to-[#0a1612]' />

              {/* Hero Content */}
              <div className='absolute inset-0 flex flex-col items-center justify-center px-6 text-center'>
                <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                  <span className='text-white'>¡Bienvenido a </span>
                  <span className='text-verdeDestaque'>CodeConnect</span>
                  <span className='text-white'>!</span>
                </h1>
                <p className='text-xl md:text-2xl text-grisClaro max-w-3xl'>
                  ¡Donde la comunidad y el código se unen!
                </p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className='max-w-6xl mx-auto px-6 py-12 md:py-16'>
            {/* Introduction */}
            <div className='mb-16'>
              <p className='text-base md:text-lg text-grisClaro leading-relaxed'>
                En el corazón de la revolución digital está la colaboración. CodeConnect nació con
                la visión de crear un espacio donde desarrolladores, programadores y entusiastas de
                la tecnología puedan conectarse, aprender y colaborar de manera sin igual. Somos una
                comunidad global apasionada por el código y estamos comprometidos a ofrecer un
                entorno inclusivo e inspirador para todos los niveles de habilidad.
              </p>
            </div>

            {/* Mission Section */}
            <div className='grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16'>
              <div>
                <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>Nuestra Misión</h2>
                <p className='text-base md:text-lg text-grisClaro leading-relaxed'>
                  En CodeConnect, creemos que la colaboración es la esencia de la innovación.
                  Nuestra misión es ofrecer una plataforma donde las mentes creativas puedan unirse,
                  compartir conocimientos y desarrollar proyectos extraordinarios. Ya seas un
                  principiante con ganas de aprender o un veterano con experiencia, aquí encontrarás
                  un hogar para tus aspiraciones tecnológicas.
                </p>
              </div>

              <div className='relative'>
                <img
                  src='/mission-image.png'
                  alt='Collaboration'
                  className='rounded-lg shadow-2xl shadow-verdeDestaque/20 w-full h-[300px] md:h-[400px] object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[#0a1612]/60 to-transparent rounded-lg' />
              </div>
            </div>

            {/* Call to Action */}
            <div className='bg-gradient-to-r from-grisOscuro/50 to-verdeDestaque/10 rounded-2xl p-8 md:p-12 border border-verdeDestaque/20'>
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>¡Únete a Nosotros!</h2>
              <p className='text-base md:text-lg text-grisClaro leading-relaxed mb-8'>
                Estamos emocionados de tenerte con nosotros en este emocionante viaje. Únete a
                nuestra vibrante comunidad y descubre el poder de la colaboración en el mundo del
                código.
              </p>

              <div className='flex items-center gap-4'>
                <div className='flex-shrink-0'>
                  <svg
                    className='w-16 h-16 md:w-20 md:h-20 text-verdeDestaque'
                    viewBox='0 0 100 100'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M30 20L50 40L30 60M40 50H70'
                      stroke='currentColor'
                      strokeWidth='6'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M20 10H80C85.5228 10 90 14.4772 90 20V80C90 85.5228 85.5228 90 80 90H20C14.4772 90 10 85.5228 10 80V20C10 14.4772 14.4772 10 20 10Z'
                      stroke='currentColor'
                      strokeWidth='4'
                      strokeLinecap='round'
                    />
                  </svg>
                </div>
                <p className='text-lg md:text-xl text-grisClaro italic'>
                  Juntos, vamos a transformar ideas en innovaciones y a moldear el futuro digital.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Spacer */}
          <div className='h-20 md:h-32' />
        </div>
      </div>
    </MainLayout>
  )
}
