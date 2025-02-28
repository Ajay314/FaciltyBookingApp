"use client"

import { useState } from "react"
import BookingCalendar from "@/components/booking-calendar"
import BookingForm from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import { machineData, rulesData } from "@/lib/dummy-data"

export default function Home() {
  const [selectedSlots, setSelectedSlots] = useState<any[]>([])
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)

  const handleSlotSelect = (slot: any) => {
    // Check if slot is already selected
    const isSelected = selectedSlots.some((s) => s.slotDate === slot.slotDate && s.openingTime === slot.openingTime)

    if (isSelected) {
      setSelectedSlots(
        selectedSlots.filter((s) => !(s.slotDate === slot.slotDate && s.openingTime === slot.openingTime)),
      )
    } else {
      setSelectedSlots([...selectedSlots, slot])
    }
  }

  const openBookingForm = () => {
    console.log("Opening booking form")
    setIsBookingFormOpen(true)
  }

  const closeBookingForm = () => {
    setIsBookingFormOpen(false)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <div className="aspect-square bg-gray-200 rounded-md overflow-hidden">
              <img
                src={`/placeholder.svg?height=300&width=300`}
                alt={machineData.machine.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{machineData.machine.name}</h1>
            <p className="text-gray-600 mb-4">{machineData.machine.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-gray-700">Operating Hours</h3>
                <p className="text-gray-600">
                  {formatTime(rulesData.rules.machineStartTime)} - {formatTime(rulesData.rules.machineEndTime)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-gray-700">Lunch Break</h3>
                <p className="text-gray-600">
                  {formatTime(rulesData.rules.lunchStartTime)} - {formatTime(rulesData.rules.lunchEndTime)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-gray-700">Slot Duration</h3>
                <p className="text-gray-600">{rulesData.rules.slot_duration} hour</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-gray-700">Cost per Slot</h3>
                <p className="text-gray-600">₹{rulesData.rules.machinePerSlotCost}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedSlots.length > 0 && (
        <div className="sticky top-0 z-10 bg-white shadow-md p-4 mb-6 rounded-lg flex justify-between items-center">
          <div>
            <span className="font-medium">
              {selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""} selected
            </span>
            <span className="ml-2 text-gray-600">
              Total: ₹{(Number(rulesData.rules.machinePerSlotCost) * selectedSlots.length).toFixed(2)}
            </span>
          </div>
          <Button onClick={openBookingForm}>Create Booking</Button>
        </div>
      )}

      <BookingCalendar
        machineData={machineData}
        rulesData={rulesData}
        selectedSlots={selectedSlots}
        onSlotSelect={handleSlotSelect}
      />

      <BookingForm
        key={isBookingFormOpen ? "open" : "closed"}
        isOpen={isBookingFormOpen}
        onClose={closeBookingForm}
        selectedSlots={selectedSlots}
        machineId={machineData.machine.id}
        slotCost={rulesData.rules.machinePerSlotCost}
      />
    </main>
  )
}

function formatTime(timeString: string) {
  const hours = Number.parseInt(timeString.substring(0, 2))
  const minutes = timeString.substring(2, 4)
  const period = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12

  return `${formattedHours}:${minutes} ${period}`
}

