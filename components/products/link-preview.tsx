'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface PreviewData {
    title?: string
    description?: string
    images?: string[]
    favicons?: string[]
    url: string
    siteName?: string
}
interface LinkPreviewProps {
    url: string
}

export function LinkPreview({ url }: LinkPreviewProps) {
    const [loading, setLoading] = useState(true)
    const [imgUrl, setImgUrl] = useState<string>('')

    useEffect(() => {
        if (!url) return

        // Usamos el servicio de mshots de WordPress para obtener un screenshot de la página
        const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=600`
        setImgUrl(screenshotUrl)

        // Como mshots a veces tarda en generar la primera vez, 
        // simplemente lo mostramos y dejamos que el navegador gestione la carga
        const img = new Image()
        img.src = screenshotUrl
        img.onload = () => setLoading(false)
        img.onerror = () => setLoading(false)

    }, [url])

    if (!url) return null

    return (
        <div className="mt-4 space-y-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted shadow-sm group">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-muted/50">
                        <Skeleton className="h-full w-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs text-muted-foreground animate-pulse">Capturando sitio...</span>
                        </div>
                    </div>
                )}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full w-full group-hover:scale-[1.02] transition-transform duration-500"
                >
                    <img
                        src={imgUrl}
                        alt="Website preview"
                        className={`h-full w-full object-cover object-top transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setLoading(false)}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white font-medium truncate">
                            {url}
                        </p>
                    </div>
                </a>
            </div>
        </div>
    )
}
