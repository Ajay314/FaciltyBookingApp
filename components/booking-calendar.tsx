"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getUnavailableSlots } from "@/lib/dummy-data"

interface BookingCalendarProps {
  machineData: any
  rulesData: any
  selectedSlots: any[]
  onSlotSelect: (slot: any) => void
}

export default function BookingCalendar({ machineData, rulesData, selectedSlots, onSlotSelect }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState<Date[]>([])
  const [unavailableData, setUnavailableData] = useState<any>(null)

  useEffect(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
    setWeekDates(dates)

    // Get unavailable slots data
    setUnavailableData(getUnavailableSlots())
  }, [currentDate])

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
      return newDate
    })
  }

  const generateTimeSlots = () => {
    const slots = []
    const startTime = Number.parseInt(rulesData.rules.machineStartTime.substring(0, 2))
    const endTime = Number.parseInt(rulesData.rules.machineEndTime.substring(0, 2))
    const lunchStart = Number.parseInt(rulesData.rules.lunchStartTime.substring(0, 2))
    const lunchEnd = Number.parseInt(rulesData.rules.lunchEndTime.substring(0, 2))
    const slotDuration = rulesData.rules.slot_duration

    for (let hour = startTime; hour < endTime; hour += slotDuration) {
      // Skip lunch hours
      if (hour >= lunchStart && hour < lunchEnd) continue

      const formattedHour = hour.toString().padStart(2, "0")
      const nextHour = (hour + slotDuration).toString().padStart(2, "0")

      slots.push({
        openingTime: `${formattedHour}0000`,
        closingTime: `${nextHour}0000`,
      })
    }

    return slots
  }

  const isSlotUnavailable = (date: Date, timeSlot: any) => {
    if (!unavailableData) return false

    // Check if the date is a holiday
    const isHoliday = unavailableData.holidays.some((holiday: any) => {
      const holidayDate = parseISODate(holiday.date)
      return isSameDay(date, holidayDate)
    })

    if (isHoliday) return true

    // Check if the specific slot is unavailable
    const formattedDate = format(date, "yyyyMMdd")
    return unavailableData.unavailableSlots.some(
      (slot: any) =>
        slot.machineId === machineData.machine.id &&
        formattedDate === unavailableData.date &&
        slot.openingTime === timeSlot.openingTime,
    )
  }

  const isSlotSelected = (date: Date, timeSlot: any) => {
    const formattedDate = format(date, "yyyyMMdd")
    return selectedSlots.some((slot) => slot.slotDate === formattedDate && slot.openingTime === timeSlot.openingTime)
  }

  const handleSlotClick = (date: Date, timeSlot: any) => {
    if (isSlotUnavailable(date, timeSlot)) return

    const formattedDate = format(date, "yyyyMMdd")
    const slot = {
      id: Math.floor(Math.random() * 1000),
      slotDate: formattedDate,
      machineId: machineData.machine.id,
      openingTime: timeSlot.openingTime,
      closingTime: timeSlot.closingTime,
    }

    onSlotSelect(slot)
  }

  const timeSlots = generateTimeSlots()

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Booking Calendar</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(weekDates[0] || new Date(), "MMM d")} - {format(weekDates[6] || new Date(), "MMM d, yyyy")}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="font-medium text-gray-500"></div>
              {weekDates.map((date, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium">{format(date, "EEE")}</div>
                  <div className="text-sm text-gray-500">{format(date, "MMM d")}</div>
                </div>
              ))}
            </div>

            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeIndex} className="grid grid-cols-8 gap-2 mb-2">
                <div className="flex items-center justify-end pr-2 text-sm text-gray-500">
                  {formatTime(timeSlot.openingTime)}
                </div>

                {weekDates.map((date, dateIndex) => {
                  const unavailable = isSlotUnavailable(date, timeSlot)
                  const selected = isSlotSelected(date, timeSlot)

                  return (
                    <div
                      key={dateIndex}
                      onClick={() => handleSlotClick(date, timeSlot)}
                      className={`
                        h-12 rounded-md border flex items-center justify-center cursor-pointer transition-colors
                        ${
                          unavailable
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-gray-50 hover:border-gray-300"
                        }
                      `}
                    >
                      {unavailable && <span className="text-xs">Unavailable</span>}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border rounded"></div>
            <span className="text-sm">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded"></div>
            <span className="text-sm">Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatTime(timeString: string) {
  const hours = Number.parseInt(timeString.substring(0, 2))
  const minutes = timeString.substring(2, 4)
  const period = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12

  return `${formattedHours}:${minutes} ${period}`
}

function parseISODate(dateString: string) {
  const year = Number.parseInt(dateString.substring(0, 4))
  const month = Number.parseInt(dateString.substring(4, 6)) - 1
  const day = Number.parseInt(dateString.substring(6, 8))
  return new Date(year, month, day)
}

