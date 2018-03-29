var util = require("../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      companyDeviceList:[],
      hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.loadCompanDevice();
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
    page.loadData(companyId, companyType, accountId);
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
  loadCompanDevice:function(){
    var page = this;
    var companyId = app.globalData.companyId;
    var companyType = app.globalData.companyType;
    var accountId = app.globalData.accountId;
    page.loadData(companyId,companyType,accountId);
  },
  nextDetail :function(e){
    var companyId = e.currentTarget.id;
    this.loadData(companyId,2,0);
  },
  loadData: function (companyId, companyType, accountId){
    var page = this;
    wx.request({
      url: app.globalData.url + '/rest/weChat/index',
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
        if(res.data.length==0){
          page.loadMode(companyId);
        }
        var subjects = res.data;
        util.processSubjects(subjects);
        page.setData({ companyDeviceList: subjects, hidden: true });
        // console.log(res.data)
      }
    })
  },
  loadMode: function (companyId){
    wx.navigateTo({
      url: '../listmode/listmode?companyId='+companyId
    })
  }
})