"use client"

import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface CopyUrlButtonProps {
  url: string
}

export function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: 'URL copiada',
        description: 'La URL se ha copiado al portapapeles',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo copiar la URL',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
