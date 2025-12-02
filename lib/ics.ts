export function generateICS({
  uid,
  title,
  description,
  date, // YYYY-MM-DD
  time, // HH:mm
  durationMinutes = 60,
  location = "Gießener Str. 10, 35457 Lollar",
}: {
  uid: string
  title: string
  description: string
  date: string
  time: string
  durationMinutes?: number
  location?: string
}) {
  // Build DTSTART/DTEND in Europe/Berlin
  const [year, month, day] = date.split("-")
  const [hh, mm] = time.split(":")
  const startLocal = `${year}${month}${day}T${hh}${mm}00`

  // End time calculation (simple, no cross-day handling for now)
  const endDate = new Date(`${date}T${time}:00+01:00`) // CET/CEST approximation
  endDate.setMinutes(endDate.getMinutes() + durationMinutes)
  const endY = endDate.getFullYear()
  const endM = String(endDate.getMonth() + 1).padStart(2, "0")
  const endD = String(endDate.getDate()).padStart(2, "0")
  const endH = String(endDate.getHours()).padStart(2, "0")
  const endMin = String(endDate.getMinutes()).padStart(2, "0")
  const endLocal = `${endY}${endM}${endD}T${endH}${endMin}00`

  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DermaFuss//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=Europe/Berlin:${startLocal}`,
    `DTEND;TZID=Europe/Berlin:${endLocal}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return ics
}

function escapeText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}

export function buildICSDataUrl(args: {
  uid: string
  title: string
  description: string
  date: string
  time: string
  durationMinutes?: number
  location?: string
}) {
  const ics = generateICS(args)
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics)
}

export function icsFilename(title: string, date: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
  return `${slug || "event"}-${date}.ics`
}

export function buildGoogleCalendarUrl({
  title,
  description,
  date,
  time,
  durationMinutes = 60,
  location,
}: {
  title: string
  description: string
  date: string
  time: string
  durationMinutes?: number
  location?: string
}) {
  const start = new Date(`${date}T${time}:00+01:00`)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + durationMinutes)
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}` +
    `T${String(d.getUTCHours()).padStart(2, "0")}${String(d.getUTCMinutes()).padStart(2, "0")}${String(d.getUTCSeconds()).padStart(2, "0")}Z`
  const dates = `${fmt(start)}/${fmt(end)}`
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details: description,
    location: location || "",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}