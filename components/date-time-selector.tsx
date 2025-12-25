"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function DateTimeSelector({ onSelect }: { onSelect: (date: Date, time: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateDays = () => {
    const days: Array<{ date: number; isCurrentMonth: boolean; fullDate: Date }> = []
    const firstDay = getFirstDayOfMonth(currentDate)
    const daysInMonth = getDaysInMonth(currentDate)
    const daysInPrevMonth = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))

    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i)
      days.push({ date: daysInPrevMonth - i, isCurrentMonth: false, fullDate: prevMonthDate })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      days.push({ date: i, isCurrentMonth: true, fullDate: currentMonthDate })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      days.push({ date: i, isCurrentMonth: false, fullDate: nextMonthDate })
    }

    return days
  }

  const handleDateSelect = (day: { date: number; isCurrentMonth: boolean; fullDate: Date }) => {
    if (!day.isCurrentMonth) {
      setCurrentDate(day.fullDate)
    }
    setSelectedDate(day.fullDate)
    onSelect(day.fullDate, "02:30 PM")
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    return date < today
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const days = generateDays()

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Select Date</h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground">{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold text-muted-foreground text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const isToday = new Date().toDateString() === day.fullDate.toDateString()
            const isSelected = selectedDate?.toDateString() === day.fullDate.toDateString()
            const isPast = isPastDate(new Date(day.fullDate))

            return (
              <button
                key={idx}
                onClick={() => !isPast && day.isCurrentMonth && handleDateSelect(day)}
                disabled={isPast && day.isCurrentMonth}
                className={`py-2 rounded-lg font-medium transition ${
                  !day.isCurrentMonth || (isPast && day.isCurrentMonth)
                    ? "text-muted-foreground bg-muted/50 cursor-not-allowed opacity-50"
                    : isSelected
                      ? "bg-accent text-accent-foreground"
                      : isToday
                        ? "border-2 border-accent text-accent"
                        : "bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                }`}
              >
                {day.date}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="pb-6">
          <p className="text-sm text-muted-foreground mb-2">Selected Date:</p>
          <p className="text-lg font-bold text-foreground">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-accent mt-2">Proceeding to cinema selection...</p>
        </div>
      )}
    </div>
  )
}
