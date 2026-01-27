'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface PreviewData {
    title?: string
    description?: string
    siteName?: string
}

interface LinkPreviewProps {
    url: string
}

export function LinkPreview({ url }: LinkPreviewProps) {
    const [loadingImg, setLoadingImg] = useState(true)
    const [metadata, setMetadata] = useState<PreviewData | null>(null)
    const [imgUrl, setImgUrl] = useState<string>('')

    useEffect(() => {
        if (!url) return

        // 1. Obtener metadatos (rápido para dar contexto)
        fetch(`/api/preview?url=${encodeURIComponent(url)}`)
            .then(res => res.json())
            .then(data => setMetadata(data))
            .catch(() => console.log('Sin metadatos para:', url))

        // 2. Preparar captura de WordPress MShots
        const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=600`
        setImgUrl(screenshotUrl)

        // 3. Temporizador de seguridad (Timeout de 6 seg)
        // WordPress MShots puede ser lento la primera vez que genera la imagen
        const timer = setTimeout(() => {
            setLoadingImg(false)
        }, 6000)

        const img = new Image()
        img.src = screenshotUrl
        img.onload = () => {
            clearTimeout(timer)
            setLoadingImg(false)
        }
        img.onerror = () => {
            clearTimeout(timer)
            setLoadingImg(false)
        }

        return () => clearTimeout(timer)
    }, [url])

    if (!url) return null

    return (
        <div className="mt-4 border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300 group">
            <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                {/* Sección de Imagen/Captura */}
                <div className="relative aspect-video w-full bg-slate-50 overflow-hidden">
                    {loadingImg && (
                        <div className="absolute inset-0 z-10">
                            <Skeleton className="h-full w-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-[10px] text-muted-foreground font-medium">Capturando sitio...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <img
                        src={imgUrl}
                        alt="Preview"
                        className={`h-full w-full object-cover object-top transition-all duration-700 ${loadingImg ? 'scale-110 blur-sm' : 'scale-100 blur-0'
                            }`}
                        onLoad={() => setLoadingImg(false)}
                    />

                    {/* Overlay de URL en hover */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[10px] text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-full truncate">
                            {new URL(url).hostname}
                        </span>
                    </div>
                </div>

                {/* Sección de Texto (Si hay metadatos, los mostramos para dar contexto) */}
                {(metadata?.title || metadata?.description) && (
                    <div className="p-3 border-t bg-white/50 dark:bg-slate-900/50">
                        {metadata.title && (
                            <h4 className="text-xs font-bold text-foreground line-clamp-1 mb-1">
                                {metadata.title}
                            </h4>
                        )}
                        {metadata.description && (
                            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed italic">
                                {metadata.description}
                            </p>
                        )}
                    </div>
                )}
            </a>
        </div>
    )
}
