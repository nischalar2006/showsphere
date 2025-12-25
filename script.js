// Current booking state
let currentStep = 1
let bookingData = {
  movie: "Thaamma",
  date: null,
  time: null,
  cinema: null,
  seats: [],
  totalPrice: 0,
}

// Initialize calendar
const currentDate = new Date(2025, 10, 9) // November 9, 2025

// Show section
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"))
  document.getElementById(sectionId).classList.add("active")

  if (sectionId === "booking") {
    renderCalendar()
  }
}

// Render calendar
function renderCalendar() {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Update header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  document.getElementById("monthYear").textContent = `${monthNames[month]} ${year}`

  // Get first day and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const calendarDays = document.getElementById("calendarDays")
  calendarDays.innerHTML = ""

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement("button")
    day.className = "calendar-day other-month"
    day.textContent = daysInPrevMonth - i
    calendarDays.appendChild(day)
  }

  // Current month days
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("button")
    day.className = "calendar-day"
    day.textContent = i
    day.dataset.date = new Date(year, month, i).toISOString().split("T")[0]

    // Highlight today
    if (i === 9 && month === 10 && year === 2025) {
      day.classList.add("today")
    }

    day.addEventListener("click", () => selectDate(day))
    calendarDays.appendChild(day)
  }

  // Next month days
  const totalCells = calendarDays.children.length
  const remainingCells = 42 - totalCells
  for (let i = 1; i <= remainingCells; i++) {
    const day = document.createElement("button")
    day.className = "calendar-day other-month"
    day.textContent = i
    calendarDays.appendChild(day)
  }
}

// Select date
function selectDate(element) {
  if (element.classList.contains("other-month")) return

  document.querySelectorAll(".calendar-day.selected").forEach((d) => d.classList.remove("selected"))
  element.classList.add("selected")

  const dateStr = element.dataset.date
  bookingData.date = dateStr

  const date = new Date(dateStr)
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  document.getElementById("sidebarDate").textContent = date.toLocaleDateString("en-US", options)
}

// Month navigation
document.getElementById("prevMonth")?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1)
  renderCalendar()
})

document.getElementById("nextMonth")?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1)
  renderCalendar()
})

// Select time slot
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".time-slot").forEach((slot) => {
    slot.addEventListener("click", () => {
      document.querySelectorAll(".time-slot.selected").forEach((s) => s.classList.remove("selected"))
      slot.classList.add("selected")
      bookingData.time = slot.dataset.time

      const dateTime = document.getElementById("sidebarDate").textContent + " at " + slot.dataset.time
      document.getElementById("sidebarTime").textContent = slot.dataset.time
    })
  })
})

// Select cinema
function selectCinema(element) {
  document.querySelectorAll(".cinema-item.selected").forEach((c) => c.classList.remove("selected"))
  element.classList.add("selected")

  const cinemaName = element.querySelector(".cinema-name").textContent
  bookingData.cinema = cinemaName
  document.getElementById("sidebarCinema").textContent = cinemaName
}

// Select seat
function selectSeat(event) {
  const seat = event.target

  if (seat.classList.contains("sold")) return

  if (seat.classList.contains("selected")) {
    seat.classList.remove("selected")
    bookingData.seats = bookingData.seats.filter((s) => s !== seat.dataset.seat)
  } else {
    seat.classList.add("selected")
    bookingData.seats.push(seat.dataset.seat)
  }

  updateSummary()
}

// Update booking summary
function updateSummary() {
  const seatsText = bookingData.seats.join(", ") || "Select Seats"
  document.getElementById("sidebarSeats").textContent = seatsText

  // Calculate price
  const pricePerSeat = 400
  const ticketPrice = bookingData.seats.length * pricePerSeat
  const convenience = 50
  const gst = (ticketPrice + convenience) * 0.05
  const total = ticketPrice + convenience + gst

  document.getElementById("sidebarTotal").textContent = total.toFixed(2)

  // Update summary section
  document.getElementById("summarySeats").textContent = seatsText
  document.getElementById("ticketPrice").textContent = "₹" + ticketPrice
  document.getElementById("gstAmount").textContent = "₹" + gst.toFixed(2)
  document.getElementById("totalAmount").textContent = "₹" + total.toFixed(2)

  bookingData.totalPrice = total
}

// Navigation
function nextStep() {
  currentStep++
  showBookingStep()
}

function prevStep() {
  currentStep--
  showBookingStep()
}

function showBookingStep() {
  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById(`step${i}`)
    if (step) {
      step.classList.toggle("active", i === currentStep)
    }
  }
}

// Book movie
function bookMovie(movieName, imagePath) {
  bookingData.movie = movieName
  document.getElementById("sidebarMovie").textContent = movieName
  document.getElementById("summaryMovie").textContent = movieName

  showSection("booking")
  currentStep = 1
  showBookingStep()
}

// Complete booking
function completeBooking() {
  alert(
    `Booking confirmed!\n\nMovie: ${bookingData.movie}\nSeats: ${bookingData.seats.join(", ")}\nTotal: ₹${bookingData.totalPrice.toFixed(2)}\n\nThank you for booking with ShowSphere!`,
  )

  // Reset booking
  currentStep = 1
  bookingData = {
    movie: "Thaamma",
    date: null,
    time: null,
    cinema: null,
    seats: [],
    totalPrice: 0,
  }
  showSection("home")
}
