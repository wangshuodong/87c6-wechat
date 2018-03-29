// pages/personal/personal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    var accountId = app.globalData.accountId;
    wx.request({
      url: app.globalData.url + '/rest/weChat/personal',
      method: 'POST',
      data: {
        "id": accountId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var subjects = res.data;
        page.setData({ personalData: subjects, hidden: true });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loginOut: function () {
    wx.closeSocket();
    wx.onSocketOpen(function () {
      wx.closeSocket()
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
    var openid = app.globalData.openid;
    wx.removeStorageSync(openid);
    wx.clearStorage()
    wx.redirectTo({
      url: '../login/login'
    })
  }
})