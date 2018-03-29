var util = require("../../utils/util.js")
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

    var companyId = options.companyId;
    this.webSocketData(companyId);
    // this.loadListMode(companyId);
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
  loadListMode: function (companyId) {
    var page = this;
    wx.request({
      url: app.globalData.url + '/rest/weChat/listMode',
      method: 'POST',
      data: {
        "companyid": companyId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var subjects = res.data;
        util.regSubjects(subjects);
        // console.log(res.data);
        page.setData({ deviceDataList: subjects, hidden: true });
      }
    })
  },
  deviceDetail: function (e) {
    var deviceId = e.currentTarget.id;
    wx.navigateTo({
      url: '../devicedetail/devicedetail?deviceId=' + deviceId
    })
  },
  // mapMode: function (e) {
  //   var companyId = e.currentTarget.id;
  //   wx.navigateTo({
  //     url: '../map/map?companyId=' + companyId
  //   })
  // },
  webSocketData: function (companyId) {
    var page = this;
    // var socketOpen = false
    // //注册信息
    // var openId = app.globalData.openid;
    // var data = { openId: openId, companyid: companyId }
    // var socketMsgQueue = JSON.stringify(data)
    // console.log(socketMsgQueue)

    // wx.onSocketOpen(function () {
    //   wx.closeSocket()
    // })
    // wx.onSocketClose(function (res) {
    //   console.log('WebSocket 已关闭！')
    // })

    // //建立连接
    // wx.connectSocket({
    //   url: app.globalData.weChatUrl + '/weChatWebSocketServer',
    // })
    // //
    // wx.onSocketOpen(function (res) {
    //   console.log('WebSocket连接已打开！')
    //   socketOpen = true
    //   console.log('数据发送中' + socketMsgQueue)
    //   sendSocketMessage(socketMsgQueue)
    // })
    // function sendSocketMessage(msg) {
    //   if (socketOpen) {
    //     wx.sendSocketMessage({
    //       data: msg
    //     })
    //   } else {
    //     socketMsgQueue.push(msg)
    //   }
    // }
    // wx.onSocketError(function (res) {
    //   console.log('WebSocket连接打开失败，请检查！')
    // })
    wx.onSocketMessage(function (res) {
      // console.log(res.data);
      var subjects = JSON.parse(res.data);
      var subjectList = [];
      // console.log(subjects);
      for (var index in subjects) {
        var subjectTemp = subjects[index];
        console.log(subjectTemp);
        for (var indexTemp in subjectTemp) {
          var subject = subjectTemp[indexTemp];
          if (subject.companyId == companyId) {
            subjectList.push(subject);
          }
        }
      }
      util.regSubjects(subjectList);
      page.setData({ deviceDataList: subjectList, hidden: true });
      //console.log('收到服务器内容：' + JSON.stringify(res))
    })
  }
})