import type React from "react"
import Link from "next/link"

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border shadow-md">
                <div className="p-4 border-b border-border">
                    <h1 className="text-xl font-bold text-primary">ShowSphere Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="block p-2 hover:bg-muted rounded text-foreground transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/movies" className="block p-2 hover:bg-muted rounded text-foreground transition-colors">
                        Movies
                    </Link>
                    <Link href="/admin/theaters" className="block p-2 hover:bg-muted rounded text-foreground transition-colors">
                        Theaters
                    </Link>
                    <Link href="/admin/shows" className="block p-2 hover:bg-muted rounded text-foreground transition-colors">
                        Shows
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
