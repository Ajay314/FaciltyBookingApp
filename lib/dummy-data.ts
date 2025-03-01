// Machine and rules data
export const machineData = {
  machine: {
    id: 1,
    name: "Dummy Machine A",
    image: "dummy_machine_a.png",
    description: "This is a dummy machine for demonstration purposes.",
    lab_id: 10,
  },
  rules: {
    id: 1,
    machineStartTime: "080000",
    machineEndTime: "180000",
    lunchStartTime: "120000",
    lunchEndTime: "130000",
    bookingBeforeHr: 2,
    cancelBeforeHr: 1,
    slot_duration: 1,
    machinePerSlotCost: "20.00",
    machine_id: 1,
  },
}

export const rulesData = machineData

// Unavailable slots data
export function getUnavailableSlots() {
  return {
    date: "20250310",
    unavailableSlots: [
      {
        slotId: 101,
        machineId: 1,
        openingTime: "090000",
        closingTime: "100000",
        reason: "Booked",
      },
      {
        slotId: 102,
        machineId: 1,
        openingTime: "100000",
        closingTime: "110000",
        reason: "Maintenance",
      },
      {
        slotId: 103,
        machineId: 1,
        openingTime: "140000",
        closingTime: "150000",
        reason: "Booked",
      },
    ],
    holidays: [
      {
        holidayId: 1,
        date: "20250312",
        name: "National Holiday",
        description: "Public holiday for national celebration.",
      },
    ],
  }
}

