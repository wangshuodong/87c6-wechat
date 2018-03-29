var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreWarnDataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // this.loadMoreWarnData(options.companyId);
    this.weChatLoadMoreWarnData();
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
  //报警数据查询
  loadMoreWarnData: function (companyId) {
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
        page.setData({ moreWarnDataList: subjects, hidden: true });
      }
    })
  },
  weChatLoadMoreWarnData:function(){
    var page = this;
    wx.onSocketMessage(function (res) {
      var subjects = JSON.parse(res.data);
      var subjectList = [];
      for (var index in subjects) {
        var subjectTemp = subjects[index];
        for (var indexTemp in subjectTemp) {
          var subject = subjectTemp[indexTemp];
          if (subject.status == true) {
            subjectList.push(subject);
          }
        }
      }
      console.log(subjectList);
      page.setData({ moreWarnDataList: subjectList});
    })
  }
  
})