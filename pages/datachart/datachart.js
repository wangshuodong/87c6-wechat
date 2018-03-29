var wxCharts = require('../../utils/wxcharts.js');
var util = require("../../utils/util.js")
var app = getApp();
var lineChart = null;
Page({
  data: {
    categories:[],
    data:[]
  },
  touchHandler: function (e) {
    // console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.data
      }
    });
  },
  updateData: function () {
    // var simulationData = this.createSimulationData();
    // var series = [{
    //   name: 'CH4',
    //   data: simulationData.data,
    //   format: function (val, name) {
    //     return val.toFixed(2) + 'ppm';
    //   }
    // }];
    // lineChart.updateData({
    //   categories: simulationData.categories,
    //   series: series
    // });
  },
  onLoad: function (e) {
    this.weChatLoadData(e);
    // this.loadData(e);
  },
  loadData:function(e){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var deviceId = e.deviceId;
    var categories = [];
    var data = [];
    wx.request({
      url: app.globalData.url + '/rest/weChat/dataChartData',
      method: 'POST',
      data: {
        "deviceId": deviceId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var subjects = res.data;
        for (var index in subjects) {
          var subject = subjects[index];
          categories.push(subject.createTime);
          data.push(subject.probeData);
        }
        var gasName = subjects[0].gasType;
        lineChart = new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: categories,
          animation: true,
          background: '#f5f5f5',
          series: [{
            name: gasName,
            data: data,
            format: function (val, name) {
              return val.toFixed(2) + subjects[0].scopeUnit;
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '值',
            format: function (val) {
              return val.toFixed(2);
            },
            min: 0
          },
          width: windowWidth,
          height: 200,
          dataLabel: false,
          dataPointShape: true,
          extra: {
            lineStyle: 'curve'
          }
        });
      }
    })
  },
  weChatLoadData:function(e){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var deviceId = e.deviceId;

    var queue = new this.Queue(10);
    var gasName = '';
    wx.onSocketMessage(function (res) {
      var subjects = JSON.parse(res.data);
      var subjectList = [];
      for (var index in subjects) {
        var subjectTemp = subjects[index];
        console.log(subjectTemp);
        for (var indexTemp in subjectTemp) {
          var subject = subjectTemp[indexTemp];
          subjectList.push(subject);
        }
      }
      for (var index in subjectList) {
        var subject = subjectList[index];
        if(subject.deviceId == deviceId){
          subjectList[index].createTime = util.CurentTime();
          queue.push(subjectList[index]);
        }        
      }
      var subjectsQueue = queue.quere();
      var data = [];
      var categories = [];
      //将值push到chart参数中
      for (var index in subjectsQueue) {
        var subject = subjectsQueue[index];
        categories.push(subject.createTime);
        data.push(subject.probeData);
      }
      gasName = subjectsQueue[0].gasType;
      lineChart = new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: categories,
        animation: true,
        background: '#f5f5f5',
        series: [{
          name: gasName,
          data: data,
          format: function (val, name) {
            return val.toFixed(2) + subjectsQueue[0].scopeUnit;
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '值',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
    })
  },
  Queue:function(size){
    var list = [];
    
    //向队列中添加数据
    this.push = function (data) {
      if (data == null) {
        return false;
      }
      //如果传递了size参数就设置了队列的大小
      if (size != null && !isNaN(size)) {
        if (list.length == size) {
          this.pop();
        }
      }
      list.unshift(data);
      return true;
    }
    //从队列中取出数据
    this.pop = function () {
      return list.pop();
    }
    //返回队列的大小
    this.size = function () {
      return list.length;
    }
    //返回队列的内容
    this.quere = function () {
      var newList = [];
      for(var index in list){
        newList.push(list[list.length-index-1]);
      }
      return newList;
    }
  }
  
});