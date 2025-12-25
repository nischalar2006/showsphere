"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CityContextType {
  selectedCity: string
  setSelectedCity: (city: string) => void
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string>("Delhi")

  return <CityContext.Provider value={{ selectedCity, setSelectedCity }}>{children}</CityContext.Provider>
}

export function useCity() {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider")
  }
  return context
}
