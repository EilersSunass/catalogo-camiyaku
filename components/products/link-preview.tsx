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
    const [data, setData] = useState<PreviewData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function fetchPreview() {
            if (!url) return
            setLoading(true)
            setError(false)
            try {
                const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`)
                if (!response.ok) throw new Error('Failed to fetch')
                const previewData = await response.json()
                setData(previewData)
            } catch (err) {
                console.error('Error loading preview:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchPreview()
    }, [url])

    if (loading) {
        return (
            <div className="mt-4 border rounded-lg overflow-hidden flex flex-col sm:flex-row h-24 sm:h-20 bg-muted/20">
                <Skeleton className="w-full sm:w-24 h-full" />
                <div className="p-2 flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        )
    }

    if (error || !data) {
        return null
    }

    const image = data.images?.[0] || data.favicons?.[0]
    const title = data.title || data.siteName || url
    const description = data.description

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 border rounded-lg overflow-hidden flex flex-col sm:flex-row h-auto sm:h-20 bg-card hover:bg-accent/50 transition-colors group"
        >
            {image && (
                <div className="w-full sm:w-24 h-24 sm:h-auto flex-shrink-0 bg-muted flex items-center justify-center overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <div className="p-2 flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="text-xs font-semibold truncate text-foreground leading-tight">
                    {title}
                </h4>
                {description && (
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                        {description}
                    </p>
                )}
                <span className="text-[9px] text-primary/70 mt-1 truncate">
                    {new URL(url).hostname}
                </span>
            </div>
        </a>
    )
}
