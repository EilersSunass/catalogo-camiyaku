'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, Shield } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/products" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-32 flex items-center">
              <img
                src="https://i.postimg.cc/bYTBzCDr/logo-camiyaku-(1).png"
                alt="Logo CAMI YAKU"
                className="h-10 w-auto object-contain brightness-110 group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tight hidden sm:inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Catálogo CAMI YAKU
            </span>
          </Link>

          {session && (
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/products"
                className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
              >
                Productos
              </Link>
              {session.user.role === 'ADMIN' && (
                <>
                  <Link
                    href="/audit"
                    className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                  >
                    Auditoría
                  </Link>
                  <Link
                    href="/users"
                    className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
                  >
                    Usuarios
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center pr-4 border-r border-muted h-8">
            <img
              src="https://i.postimg.cc/3rBcKS44/logo-sunass.png"
              alt="Logo SUNASS"
              className="h-8 w-auto object-contain opacity-90"
            />
          </div>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {session.user.role === 'ADMIN' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          <Shield className="h-3 w-3" />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-destructive focus:text-destructive focus:bg-destructive/5 font-medium">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="font-semibold shadow-sm">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
