"use client"


import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface BookingFormProps {
  isOpen: boolean
  onClose: () => void
  selectedSlots: any[]
  machineId: number
  slotCost: string
}

export default function BookingForm({ isOpen, onClose, selectedSlots, machineId, slotCost }: BookingFormProps) {
  console.log("BookingForm rendered", { isOpen, selectedSlots })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    remarks: "",
    extraTimeNeeded: "no",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, extraTimeNeeded: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create the booking object as per the required format
    const totalAmount = (Number.parseFloat(slotCost) * selectedSlots.length).toFixed(2)

    // Get the first and last slot to determine start and end times
    const sortedSlots = [...selectedSlots].sort(
      (a, b) => a.slotDate.localeCompare(b.slotDate) || a.openingTime.localeCompare(b.openingTime),
    )

    const firstSlot = sortedSlots[0]
    const lastSlot = sortedSlots[sortedSlots.length - 1]

    // Format dates for the output
    const startAt = `${firstSlot.slotDate}T${firstSlot.openingTime}Z`
    const endAt = `${lastSlot.slotDate}T${lastSlot.closingTime}Z`
    const createdAt = format(new Date(), "yyyyMMdd'T'HHmmss'Z'")

    const bookingData = {
      id: 100,
      studentId: 1,
      machineId: machineId,
      status: "PENDING",
      amountToBePaid: totalAmount,
      remarks: formData.remarks,
      startAt: startAt,
      endAt: endAt,
      createdAt: createdAt,
      slots: selectedSlots,
      answers: [
        {
          id: 300,
          ques_id: 2,
          bookingId: 100,
          answer: formData.extraTimeNeeded === "yes" ? "Yes, I need extra time for setup" : "No extra time needed",
        },
      ],
    }

    // Log the booking data to console as required
    console.log("Booking submitted successfully:", bookingData)

    // Show a success message (in a real app, you might use a toast notification)
    alert("Booking submitted successfully!")

    // Close the form
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Selected Slots</h3>
              <div className="space-y-1">
                {selectedSlots.map((slot, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {formatSlotDate(slot.slotDate)}, {formatTime(slot.openingTime)} - {formatTime(slot.closingTime)}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm font-medium">
                Total Cost: ₹{(Number.parseFloat(slotCost) * selectedSlots.length).toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Reason for Booking</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Please describe the purpose of your booking"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Do you need extra time for setup?</Label>
              <RadioGroup value={formData.extraTimeNeeded} onValueChange={handleRadioChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Confirm Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatTime(timeString: string) {
  const hours = Number.parseInt(timeString.substring(0, 2))
  const minutes = timeString.substring(2, 4)
  const period = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12

  return `${formattedHours}:${minutes} ${period}`
}

function formatSlotDate(dateString: string) {
  const year = Number.parseInt(dateString.substring(0, 4))
  const month = Number.parseInt(dateString.substring(4, 6)) - 1
  const day = Number.parseInt(dateString.substring(6, 8))
  const date = new Date(year, month, day)

  return format(date, "MMM d, yyyy")
}

