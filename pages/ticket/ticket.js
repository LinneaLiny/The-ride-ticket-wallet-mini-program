const {
  formatClock,
  formatTicketTime,
  getColorSet,
  getDayPassState,
  getMovingOffset,
  makeQrRows
} = require("../../utils/ticket")

Page({
  data: {
    type: "day",
    isDay: true,
    isSingle: false,
    title: "Fixed Route (Regular) Day Pass",
    clock: "",
    ticketTime: "",
    activatedClock: "",
    colors: [],
    timeLeft: 50,
    qrRows: []
  },

  onLoad(options) {
    const type = options.type === "single" ? "single" : "day"

    this.setData({
      type,
      isDay: type === "day",
      isSingle: type === "single",
      title: type === "day" ? "Fixed Route (Regular) Day Pass" : "Fixed Route (Regular) Single Ride",
      qrRows: makeQrRows(type === "day" ? 11 : 23)
    })

    this.refresh()
    this.timer = setInterval(() => this.refresh(), 1000)
  },

  onUnload() {
    clearInterval(this.timer)
  },

  refresh() {
    const now = new Date()
    const dayPass = getDayPassState(now)

    this.setData({
      clock: formatClock(now),
      ticketTime: formatTicketTime(now),
      activatedClock: formatClock(dayPass.activatedAt),
      colors: getColorSet(now),
      timeLeft: getMovingOffset(now)
    })
  },

  closeTicket() {
    const pages = getCurrentPages()

    if (pages.length > 1) {
      wx.navigateBack()
      return
    }

    wx.redirectTo({
      url: "/pages/wallet/wallet"
    })
  }
})
