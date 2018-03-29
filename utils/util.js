//index 组装数据
function processSubject(subject) {
  if (subject.companyname == null) {
    subject.companyname = subject.departmentname;
  }
  subject.deviceNum = subject.deviceList.length;

}


function processSubjects(subjects) {
  for (var index in subjects) {
    var subject = subjects[index];
    this.processSubject(subject);
  }
}

//listmode用于分离汉字和字符
function regSubject(subject) {
  var title = subject.gasType;
  var reg = /[^\u4e00-\u9fa5]/gi;
  var resultGasType = title.replace(reg, '');
  subject.gasType = resultGasType;
  subject.createTime = this.CurentTime();
  // subject.createTime = this.timestampToTime(subject.createTime);
}

function regSubjects(subjects) {
  for (var index in subjects) {
    var subject = subjects[index];
    this.regSubject(subject);
  }
}

//时间戳转成日期格式字符串
function timestampToTime(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  return this.DataTransfer(date);;
}

//队列
function Queue() {
  
}

//获取当前时间
function CurentTime() {
  var now = new Date();
  return this.DataTransfer(now)
}

//Date转日期格式
function DataTransfer(now) {
  var year = now.getFullYear();       //年  
  var month = now.getMonth() + 1;     //月  
  var day = now.getDate();            //日  

  var hh = now.getHours();            //时  
  var mm = now.getMinutes();          //分  
  var ss = now.getSeconds();          //秒

  var clock = year + "-";

  if (month < 10)
    clock += "0";
  clock += month + "-";

  if (day < 10)
    clock += "0";
  clock += day + " ";

  if (hh < 10)
    clock += "0";
  clock += hh + ":";

  if (mm < 10)
    clock += '0';
  clock += mm + ":";

  if (ss < 10)
    clock += '0';
  clock += ss;
  return clock;
}


module.exports = {
  processSubject: processSubject,
  processSubjects: processSubjects,
  regSubject: regSubject,
  regSubjects: regSubjects,
  timestampToTime: timestampToTime,
  Queue: Queue,
  CurentTime: CurentTime,
  DataTransfer: DataTransfer
}