import type React from "react"
import { AuthProvider } from "@/context/auth-context"
import { CityProvider } from "@/context/city-context"
import { AIChatbot } from "@/components/ai-chatbot"
import { Navigation } from "@/components/navigation"
import { Analytics } from "@vercel/analytics/next"
// Fonts and globals are in root layout now, or check where they should be.
// Usually root layout has <html><body>. (main) layout just wraps children.

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <AuthProvider>
            <CityProvider>
                <Navigation />
                {children}
                <AIChatbot />
                <Analytics />
            </CityProvider>
        </AuthProvider>
    )
}
