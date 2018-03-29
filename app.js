//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    wx.login({
      success: function (loginCode) {
        // console.log(loginCode);
        //调用request请求api转换登录凭证  
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxae7e2fbef1e7e164&secret=6d61dc1d90f163034a35861e0955209f&grant_type=authorization_code&js_code=' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            // console.log(res)
            // 获取openid 
            getApp().globalData.openid = res.data.openid;
            var loginParam = wx.getStorageSync(res.data.openid);
            if(loginParam){
              getApp().globalData.companyId=loginParam[0];
              getApp().globalData.companyType = loginParam[1];
              getApp().globalData.accountId = loginParam[2];
              wx.switchTab({
                url: '../map/map'
              })
            }
          }
        })
      }
    })
 
  },
  globalData: {
    userInfo: null,
    url: "http://localhost:8080",
    weChatUrl:"ws://localhost:8080",
    token_id:'',
    template_id:'RD2t7PgG6sVmUuZTF2ZNMuETi_jFu5wytZd2iGo2J6g',
    openid:'',
    appid:'wxae7e2fbef1e7e164',
    secret:'eb7531eaec2a977cec8745b2146a5494'
  }
})