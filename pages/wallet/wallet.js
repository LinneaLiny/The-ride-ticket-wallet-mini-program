const {
  formatClock,
  formatWalletExpiry,
  getDayPassState,
  getSinglePassState
} = require("../../utils/ticket")

Page({
  data: {
    clock: "",
    tickets: []
  },

  onLoad() {
    this.refresh()
    this.timer = setInterval(() => this.refresh(), 1000)
  },

  onUnload() {
    clearInterval(this.timer)
  },

  refresh() {
    const now = new Date()
    const dayPass = getDayPassState(now)
    const singlePass = getSinglePassState(now)

    this.setData({
      clock: formatClock(now),
      tickets: [
        {
          id: "day",
          type: "day",
          name: "Day Pass",
          expiresLabel: formatWalletExpiry(dayPass.expiresAt)
        },
        {
          id: "single",
          type: "single",
          name: "Single Ride",
          expiresLabel: formatWalletExpiry(singlePass.expiresAt)
        }
      ]
    })
  },

  openTicket(event) {
    const type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/ticket/ticket?type=${type}`
    })
  },

  goBack() {
    wx.navigateBack({
      fail() {}
    })
  }
})
