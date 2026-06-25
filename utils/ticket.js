const COLOR_SETS = [
  ["#97b79f", "#f3a53c", "#f4ed45"],
  ["#3f21bd", "#d7f125", "#c01e5b"],
  ["#bfc0c3", "#a8f86b", "#61caca"],
  ["#b9db84", "#67c7d6", "#8b4de6"]
]

function pad(value) {
  return String(value).padStart(2, "0")
}

function formatClock(date = new Date(), withSeconds = false) {
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return withSeconds ? `${time}:${pad(date.getSeconds())}` : time
}

function formatDate(date = new Date()) {
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`
}

function formatTicketTime(date = new Date()) {
  return `${formatClock(date, true)} ${formatDate(date)}`
}

function formatWalletExpiry(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let hours = date.getHours()
  const suffix = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${pad(date.getMinutes())} ${suffix}`
}

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function getDayPassState(now = new Date()) {
  const key = dayKey(now)
  const storageKey = "theRideDayPass"
  let state = wx.getStorageSync(storageKey)

  if (!state || state.key !== key) {
    state = {
      key,
      activatedAt: now.getTime()
    }
    wx.setStorageSync(storageKey, state)
  }

  const expiresAt = new Date(now)
  expiresAt.setHours(23, 59, 0, 0)

  return {
    activatedAt: new Date(state.activatedAt),
    expiresAt
  }
}

function getSinglePassState(now = new Date()) {
  const activatedAt = new Date(now.getTime() - 7 * 60 * 1000)
  const expiresAt = new Date(activatedAt.getTime() + 2 * 60 * 60 * 1000)
  return {
    activatedAt,
    expiresAt
  }
}

function getColorSet(date = new Date()) {
  const index = Math.floor(date.getHours() / 6) % COLOR_SETS.length
  return COLOR_SETS[index]
}

function getMovingOffset(date = new Date()) {
  const secondsInCycle = 24
  const phase = (date.getSeconds() % secondsInCycle) / secondsInCycle
  const triangle = phase <= 0.5 ? phase * 2 : (1 - phase) * 2
  return 18 + Math.round(triangle * 64)
}

function makeQrRows(seed) {
  const size = 29
  const rows = []

  for (let y = 0; y < size; y += 1) {
    const cells = []
    for (let x = 0; x < size; x += 1) {
      const inCenter = x >= 11 && x <= 17 && y >= 11 && y <= 17
      const ring = inCenter && (x === 11 || x === 17 || y === 11 || y === 17 || x === 13 || x === 15 || y === 13 || y === 15)
      const dot = inCenter && x >= 14 && x <= 14 && y >= 14 && y <= 14
      const value = ((x * 31 + y * 17 + seed * 13 + x * y) % 7) < 3 || ring || dot
      cells.push({ key: `${x}-${y}`, dark: value && !((x + y + seed) % 19 === 0) })
    }
    rows.push({ key: `row-${y}`, cells })
  }

  return rows
}

module.exports = {
  formatClock,
  formatTicketTime,
  formatWalletExpiry,
  getColorSet,
  getDayPassState,
  getMovingOffset,
  getSinglePassState,
  makeQrRows
}
