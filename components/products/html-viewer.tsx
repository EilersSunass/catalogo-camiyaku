'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Maximize2 } from 'lucide-react'

interface HtmlViewerProps {
  src: string
  title: string
  productId: string
  size?: number
  embed?: boolean
}

// El HTML se descarga en el navegador desde Blob (sin límite de tamaño de las funciones)
// y se muestra en un iframe aislado: sin allow-same-origin, sus scripts corren en un
// origen opaco y no pueden leer la sesión ni llamar a la API del catálogo.
// Se usa srcdoc y no una URL blob: porque una URL blob: creada aquí tendría el origen del
// catálogo y, abierta en una ventana nueva fuera del sandbox, quedaría sin aislamiento.
const SANDBOX = [
  'allow-scripts',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-forms',
  'allow-modals',
  'allow-downloads',
].join(' ')

const mb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1)

export function HtmlViewer({ src, title, productId, size, embed }: HtmlViewerProps) {
  const [html, setHtml] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const res = await fetch(src, { signal: controller.signal })
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

        const reader = res.body.getReader()
        const chunks: BlobPart[] = []
        let received = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          received += value.length
          setLoaded(received)
        }

        setHtml(await new Blob(chunks).text())
      } catch (e) {
        if (!controller.signal.aborted) setError('No se pudo cargar el archivo. Recarga la página para intentarlo de nuevo.')
      }
    })()

    return () => controller.abort()
  }, [src])

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {!embed && (
        <header className="flex items-center gap-3 border-b px-3 py-1.5 text-sm bg-[#054680] text-white">
          <Link href={`/products/${productId}`} className="flex items-center gap-1 hover:underline shrink-0">
            <ArrowLeft className="h-4 w-4" />
            Catálogo
          </Link>
          <span className="truncate font-medium">{title}</span>
        </header>
      )}

      {embed && html !== null && (
        <a
          href={`/ver/${productId}`}
          target="_blank"
          rel="noopener"
          className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-[#054680]/90 px-2 py-1 text-xs text-white hover:bg-[#054680]"
        >
          <Maximize2 className="h-3 w-3" />
          Pantalla completa
        </a>
      )}

      <div className="relative flex-1">
        {html !== null ? (
          <iframe
            srcDoc={html}
            title={title}
            sandbox={SANDBOX}
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            {error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-[#066EC8]" />
                <span>
                  Cargando… {loaded > 0 && `${mb(loaded)} MB`}
                  {size ? ` de ${mb(size)} MB` : ''}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
