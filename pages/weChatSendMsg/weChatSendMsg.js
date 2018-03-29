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

    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxae7e2fbef1e7e164&secret=eb7531eaec2a977cec8745b2146a5494',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        //console.log('get AccessToken')
        //console.log(res.data.access_token)
        app.globalData.token_id = res.data.access_token;
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
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
  formSubmit: function (e) {
    console.log("=======" + app.globalData.token_id);
    console.log('form发生了submit事件，携带数据为：', e.detail)
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.globalData.token_id,
      data: {
        "touser": app.globalData.openid,
        "template_id": app.globalData.template_id,
        "form_id": e.detail.formId,
        "data": {
          "keyword1": {
            "value": "123456",
            "color": "#173177"
          },
          "keyword2": {
            "value": "甲烷",
            "color": "#173177"
          },
          "keyword3": {
            "value": "2018-2-26 19:57:22",
            "color": "#173177"
          },
          "keyword4": {
            "value": "超标报警",
            "color": "#173177"
          }
        },
        "emphasis_keyword": "keyword1.DATA"
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res)
      },
      fail: function (res) {
        // fail
        console.log(res)
      },
      complete: function () {
        // complete
      }
    })
  }
})