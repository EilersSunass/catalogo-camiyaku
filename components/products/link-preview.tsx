'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface LinkPreviewProps {
    url: string
}

export function LinkPreview({ url }: LinkPreviewProps) {
    const [loadingImg, setLoadingImg] = useState(true)
    const [imgUrl, setImgUrl] = useState<string>('')

    useEffect(() => {
        if (!url) return

        // 1. Usamos Thum.io con el parámetro wait/10/
        // Esto le dice al servidor que espere 10 segundos después de cargar la página 
        // antes de tomar la captura, permitiendo que dashboards y animaciones carguen.
        const screenshotUrl = `https://image.thum.io/get/width/800/crop/600/wait/10/${url}`
        setImgUrl(screenshotUrl)

        // 2. Temporizador de seguridad ajustado (18 seg)
        // (10s de espera técnica + tiempo de carga del servidor Thum.io + red)
        const timer = setTimeout(() => {
            setLoadingImg(false)
        }, 18000)

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
            </a>
        </div>
    )
}
