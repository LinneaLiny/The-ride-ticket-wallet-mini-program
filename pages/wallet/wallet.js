const {
  formatWalletExpiry,
  getDayPassState
} = require("../../utils/ticket")

Page({
  data: {
    tickets: []
  },

  onLoad() {
    this.singlePassExpiresAt = new Date(Date.now() + 5 * 60 * 1000)
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
          expiresLabel: formatWalletExpiry(this.singlePassExpiresAt)
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
