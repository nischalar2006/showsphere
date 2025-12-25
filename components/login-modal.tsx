"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "verify" | "profile">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const { login } = useAuth()

  if (!isOpen) return null

  const handleContinue = () => {
    if (step === "phone" && phone.length === 10) {
      setStep("verify")
    }
  }

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      setStep("profile")
    }
  }

  const handleCompleteSignup = () => {
    if (name.trim()) {
      login(`${countryCode}${phone}`, name, email)
      setPhone("")
      setOtp("")
      setName("")
      setEmail("")
      setStep("phone")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-white font-bold text-2xl">ShowSphere</h2>
          <p className="text-white/90 text-sm mt-2">Experience the best in Movies and Events</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {step === "phone" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter your mobile number</h3>
                <p className="text-sm text-gray-600">If you don't have an account yet, we'll create one for you</p>
              </div>

              <div className="flex gap-2">
                <div className="relative w-24">
                  <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition">
                    <span className="text-sm font-medium">🇮🇳 {countryCode}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  maxLength="10"
                />
              </div>

              <Button
                onClick={handleContinue}
                disabled={phone.length !== 10}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Continue
              </Button>

              <p className="text-xs text-gray-600 text-center">
                By continuing, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter OTP</h3>
                <p className="text-sm text-gray-600">
                  We've sent a 4-digit OTP to {countryCode}
                  {phone}
                </p>
              </div>

              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold tracking-widest focus:outline-none focus:border-purple-500"
              />

              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 4}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Verify OTP
              </Button>

              <button
                onClick={() => setStep("phone")}
                className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Change number
              </button>
            </div>
          )}

          {step === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete your profile</h3>
                <p className="text-sm text-gray-600">Just a few details to get started</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />

                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <Button
                onClick={handleCompleteSignup}
                disabled={!name.trim()}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Create Account
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
