"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Lock, Shield, Eye } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="container mx-auto px-4 py-8 mt-20 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>

            <div className="space-y-6">
                {/* Notifications */}
                <Card className="bg-[#111827] border-white/10 text-[#E5E7EB]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-400" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                                <span>Email Notifications</span>
                                <span className="font-normal text-sm text-gray-400">Receive emails about new movies and offers</span>
                            </Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sms-notifications" className="flex flex-col gap-1">
                                <span>SMS Notifications</span>
                                <span className="font-normal text-sm text-gray-400">Get booking updates via SMS</span>
                            </Label>
                            <Switch id="sms-notifications" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy */}
                <Card className="bg-[#111827] border-white/10 text-[#E5E7EB]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            Privacy & Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <span>Change Password</span>
                            </div>
                            <span className="text-sm text-blue-400">Update</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition">
                            <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <span>Profile Visibility</span>
                            </div>
                            <span className="text-sm text-gray-400">Public</span>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
