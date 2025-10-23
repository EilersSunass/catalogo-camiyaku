import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/products', req.url))
      }
      return null
    }

    // Proteger rutas de admin
    if (req.nextUrl.pathname.startsWith('/audit') || req.nextUrl.pathname.startsWith('/users')) {
      if (!isAuth || token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/products', req.url))
      }
    }

    // Proteger rutas que requieren autenticación
    if (
      req.nextUrl.pathname.startsWith('/products/new') ||
      req.nextUrl.pathname.includes('/edit')
    ) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login?callbackUrl=' + req.nextUrl.pathname, req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: () => true, // Manejamos la autorización en el middleware
    },
  }
)

export const config = {
  matcher: ['/products/:path*', '/audit/:path*', '/users/:path*', '/login'],
}
