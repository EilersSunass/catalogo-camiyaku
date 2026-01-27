import { NextResponse } from 'next/server'
import { getLinkPreview } from 'link-preview-js'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {
        const data = await getLinkPreview(url, {
            timeout: 5000,
            headers: {
                'user-agent': 'googlebot', // Some sites block generic users
            },
        })
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching link preview:', error)
        return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 })
    }
}
