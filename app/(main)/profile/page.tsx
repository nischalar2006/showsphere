"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Calendar } from "lucide-react"

export default function ProfilePage() {
    const { user } = useAuth()

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 mt-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
            </div>
        )
    }

    // Fallback data if fields are missing in user object
    // Note: Adjust according to actual User type in auth-context
    const joinDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="container mx-auto px-4 py-8 mt-20 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-foreground">My Profile</h1>

            <Card className="bg-[#111827] border-white/10 text-[#E5E7EB]">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center text-3xl font-bold text-white">
                        {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <CardTitle className="text-2xl">{user.full_name || "User"}</CardTitle>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">

                    <div className="grid gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Full Name</p>
                                <p className="font-medium">{user.full_name || "Not set"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Email Address</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Phone Number</p>
                                <p className="font-medium">{user.phone_number || "Not set"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Member Since</p>
                                <p className="font-medium">{joinDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end">
                        <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/10">
                            Edit Profile
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
