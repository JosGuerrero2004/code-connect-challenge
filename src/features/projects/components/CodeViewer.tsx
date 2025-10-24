import { useState } from 'react'
import { Copy, Check, Code2 } from 'lucide-react'

interface CodeViewerProps {
  code: string
  language?: string
}

const CodeViewer = ({ code, language = 'javascript' }: CodeViewerProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar código:', err)
    }
  }

  return (
    <div className='bg-[#0d1d17] rounded-xl overflow-hidden'>
      {/* Header del código */}
      <div className='flex items-center justify-between px-6 py-4 bg-grisOscuro border-b border-slate-700/50'>
        <div className='flex items-center gap-2'>
          <Code2 className='w-5 h-5 text-verdeDestaque' />
          <span className='text-white font-medium'>Código del proyecto</span>
          <span className='text-xs text-grisClaro bg-slate-700/50 px-2 py-1 rounded'>
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className='flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-grisClaro hover:text-white rounded-lg transition-colors text-sm'
          title='Copiar código'
        >
          {copied ? (
            <>
              <Check className='w-4 h-4 text-verdeDestaque' />
              <span className='text-verdeDestaque'>Copiado</span>
            </>
          ) : (
            <>
              <Copy className='w-4 h-4' />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Código */}
      <div className='overflow-x-auto'>
        <pre className='p-6 text-sm md:text-base'>
          <code className='text-grisClaro font-mono leading-relaxed whitespace-pre'>{code}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodeViewer
