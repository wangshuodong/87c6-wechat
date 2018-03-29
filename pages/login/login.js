var app = getApp();
Page({
  data: {
    phone: '',
    password: ''
  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    // wx.login({
    //   success: function (loginCode) {
    //     if (loginCode.code) {
    //       var code = loginCode.code;
    //       wx.getUserInfo({//getUserInfo流程
    //         success: function (loginCode) {//获取userinfo成功
    //           console.log(loginCode);
    //           var encryptedData = encodeURIComponent(loginCode.encryptedData);//一定要把加密串转成URI编码
    //           var iv = loginCode.iv;
    //           //请求自己的服务器
    //           console.log(encryptedData);
    //           //Login(code, encryptedData, iv);
    //         }
    //       })

    //     } else {
    //       console.log('获取用户登录态失败！' + loginCode.errMsg)
    //     } 

    //     //调用request请求api转换登录凭证  
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.appid + '&secret=' + app.globalData.secret +'&grant_type=authorization_code&js_code=' + loginCode.code,
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       success: function (res) {
    //         console.log(res) //获取openid 
    //         getApp().globalData.openid = res.data.openid;

    //       }
    //     })
    //   }
    // })

    // return;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.request({
        url: app.globalData.url + '/rest/weChat/login', //仅为示例，并非真实的接口地址
        data: {
          username: this.data.phone,
          password: this.data.password
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function (res) {
          if (res.data.success == true) {
            var companyId = res.data.data.companyid;
            var accountId = res.data.data.id;
            var companyType = res.data.data.company.type;
            app.globalData.companyId = companyId;
            app.globalData.companyType = companyType;
            app.globalData.accountId = accountId;
            
            //将数据存入缓存中
            var loginParm = [];
            loginParm.push(companyId);
            loginParm.push(companyType);
            loginParm.push(accountId);
            var key = app.globalData.openid;
            wx.setStorageSync(key, loginParm);

            wx.switchTab({
              url: '../map/map'
            })
          } else if (res.data.statusCode == 1) {
            wx.showToast({
              title: '用户不存在！',
              icon: 'none',
              duration: 2000
            })
          } else if (res.data.statusCode == 2) {
            wx.showToast({
              title: '密码错误！',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '系统错误',
              icon: 'none',
              duration: 2000
            })
          }

        }
      })

    }
  }
})