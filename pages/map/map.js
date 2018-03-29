var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [], //地图标点集合
    show: 'block',
    warnDataList: [],
    hidden: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.getLocation({
      success: function (res) {
        page.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      }
    })
    var companyId = app.globalData.companyId;
    var companyType = app.globalData.companyType;
    var accountId = app.globalData.accountId;
    this.loadMapMaker(companyId, companyType, accountId);
    //报警数据查询
    // this.loadWarnData(companyId);
    //获取报警数据
    this.webSocketWarningData();
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
    var page = this;
    var companyId = app.globalData.companyId;
    var companyType = app.globalData.companyType;
    var accountId = app.globalData.accountId;
    page.loadMapMaker(companyId, companyType, accountId);
    this.acceptData();
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

  /**
   * 加载地图标点
   */
  loadMapMaker: function (companyId, companyType, accountId) {
    var page = this;
    wx.request({
      url: app.globalData.url + '/rest/weChat/mapMaker',
      method: 'POST',
      data: {
        "companyid": companyId,
        "type": companyType,
        "id": accountId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var markers_new = [];
        var subjects = res.data;
        for (var index in subjects) {
          var subject = subjects[index];
          console.log(subject);
          markers_new.push({
            id: subject.id,
            latitude: subject.latitude,
            longitude: subject.longitude,
            width: 40,
            height: 44,
            iconPath: "../../assets/img/maker.png"
          })
        }
        page.setData({ markers: markers_new, hidden: true });
      }
    })
  },
  regionchange(e) {
    // console.log(e.type)
  },
  //marker点击添加下级部门位置
  markertap(e) {
    this.loadMapMaker(e.markerId, 2, 0);
  },
  controltap(e) {
    // console.log(e.controlId)
  },
  close: function (e) {
    var dataId = e.target.dataset.id;
    var warnTeams = this.data.warnDataList;
    var newWarnTeams = [];
    for (var i in warnTeams) {
      var item = warnTeams[i];
      if (item.deviceId != dataId) {
        newWarnTeams.push(item);
      }
    }
    this.setData({
      warnDataList: newWarnTeams
    });
  },
  //报警数据查询
  loadWarnData: function (companyId) {
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
        // console.log(subjects);
        page.setData({ warnDataList: subjects, hidden: true });
      }
    })
  },
  //更多报警数据
  moreWarnData: function (e) {
    var companyId = e.currentTarget.id;
    wx.navigateTo({
      url: '../devicewarning/devicewarning?companyId=' + companyId
    })
  },
  webSocketWarningData: function () {
    var page = this;
    var socketOpen = false
    //注册信息
    var openId = app.globalData.openid;//微信用户id
    var companyId = app.globalData.companyId;//公司或部门id
    var accountId = app.globalData.accountId;//账户id
    var companyType = app.globalData.companyType;//公司类型
    var data = { openId: openId, companyid: companyId, id: accountId, 'type': companyType }
    var socketMsgQueue = JSON.stringify(data)
    console.log(socketMsgQueue)



    //建立连接
    var socketTask = wx.connectSocket({
      url: app.globalData.weChatUrl + '/weChatWarningWebSocketServer',
    })
    console.info(socketTask);
    //
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true
      console.log('数据发送中' + socketMsgQueue)
      sendSocketMessage(socketMsgQueue)
    })

    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    page.acceptData();
  },
  acceptData:function(){
    var page = this;
    wx.onSocketMessage(function (res) {
      var subjects = JSON.parse(res.data);
      var subjectList = [];
      for (var index in subjects) {
        var subjectTemp = subjects[index];
        for (var indexTemp in subjectTemp) {
          var subject = subjectTemp[indexTemp];
          if (subject.status == true && subjectList.length < 10) {
            subjectList.push(subject);
          }
        }
      }
      console.log(subjectList);
      var hidden = true;
      if (subjectList.length == 10) {
        hidden = false;
      } else {
        hidden = true;
      }
      page.setData({ warnDataList: subjectList, hidden: hidden });
    })
  }
})