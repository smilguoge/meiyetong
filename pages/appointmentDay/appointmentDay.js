// pages/appointmentDay/appointmentDay.js
//获取应用实例
const app = getApp();
var uid = wx.getStorageSync('user').uid;
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendar: null,
    timeList:[],
    technicianList: [],
    chooseIcon: '../../images/chooseGray_2@2x.png',
    chooseIcon2: '../../images/choose_2@2x.png',
    technicianIdx:null,
    shopid: 0,
    shopname: '',
    ishow: true,
    start: '00:00',
    end: '00:00',
    timeclick: 1,
    start_index: '',
    end_index: '',
    Technicianid: false,
    Technicianname: false,
    isStar_service:false,  //是否从服务之星进来的

    BASE_url: app.globalData.BASE_url,
  },
  /**
   * 选择日期
   */
  bindDateChange: function(event) {
    let date = event.detail.value;
    date = date.split("-");
    let datechange = date.join('/');

    this.setData({
      calendar: datechange
    })
    var that = this;
    app.request({
      url: app.getApi('appointment/showtime'),
      async: false,
      success:function(res){
        that.collectTime(res.list);
        that.restore();
        that.inquireTechnician();
      },
      fail:function(error) {
        console.log(error);
      }
    })
  },
  //- 还原已选中时间数据
  restore: function(){
    var that = this;
    that.setData({
      start: '00:00',
      end: '00:00',
      timeclick: 1,
      start_index:'',
      end_index:'',
      Technicianid: false,
      Technicianname: false,
      technicianIdx:null
    })
  },
  /**
   * 选择时间
   */
  chooseTime: function (event) {
    let that = this;
    let index = event.target.dataset.index;   //- 选中的时间序号
    let start = event.target.dataset.stime;   //- 选中的时间起始值
    let end = event.target.dataset.etime;     //- 选中的时间末值
    let timeList = that.data.timeList;
    if(that.data.timeclick == 1){
      for(var i=0;i<timeList.length;i++){
        timeList[i].isselected = false;   
      }
      //- 一下代表第一次点击或者重新计算第一次点击
      //- 代表进入页面第一次点击
      that.setData({
        start: start,
        end: end,
        start_index: index,
        end_index: index,
        timeclick: 2
      })
      timeList[index].isselected = true;
      
    }else{
      //- 代表二次点击
      //- 先判断是否是之前点击的第一个元素
      if(index == that.data.start_index){
        //- 说明取消第一个选中状态,返回到初始状态
        that.restore();
        timeList[index].isselected = false;
      }else{
        //- 说明点击选中其他时间点（相对于oldindex可之前可之后)
        var nowindex = index;
        var oldindex = that.data.start_index;
        var differenceindex = +nowindex - +oldindex;
        if(differenceindex > 0){
          for(var i=0;i<=differenceindex;i++){
            var index_select = oldindex+i;
            timeList[index_select].isselected = true;//- false代表未选中true代表已选中
          }
          that.setData({
            end: end,
            end_index: nowindex,
            timeclick: 1
          })

        }else{
          for(var i=0;i<=Math.abs(differenceindex);i++){
            var index_select = oldindex-i;
            timeList[index_select].isselected = true;//- false代表未选中true代表已选中
          }
          that.setData({
            start: start,
            start_index: nowindex,
            timeclick: 1
          })

        }
      }
    }

    that.setData({
      timeList: timeList,
    })
    if (!that.data.isStar_service){
      that.inquireTechnician();
    }
  },
  //- 查询技师数据
  inquireTechnician: function(){
    var that = this;
    app.request({
      url: app.getApi('appointment/last_get_employee_list'),
      data: {
        start: that.data.calendar+" "+that.data.start,
        end: that.data.calendar+" "+that.data.end,
        shop_id: that.data.shopid,
      },
      success:function(res){
        let data = res.list;
        for (let key in data) {
          if (data[key].headImg){
            let HeadImg = data[key].headImg;
            HeadImg.substring(0, 4);
            if (HeadImg.substring(0, 4) != 'http') {
              HeadImg = that.data.BASE_url + HeadImg;
            }
            data[key].headImg = HeadImg;
          }
        }
        that.setData({
          technicianList: res.list
        });
      },
      fail:function(error) {
        console.log(error);
      }
    })
  },
  /**
   * 选择技师
   */
  chooseTechnician: function(event) {
    var idx = event.currentTarget.dataset.index;
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    var that = this;
    that.setData({
      technicianIdx: idx,
      Technicianid: id,
      Technicianname: name
    })
  },
  /**
   * 下一步
   */
  nextBtn: function() {
    var that = this;
    if(that.data.start == '00:00'){
      app.showToast({
        title: '请选择时间',
        duration: 1500,
      })
      return;
    }
    if(!that.data.Technicianid){
      app.showToast({
        title: '请选择技师',
        duration: 1500,
      })
      return;
    }
    wx.navigateTo({
      url: '../appointTechnician/appointTechnician',
      success: function(){
        var data = {
          start: that.data.start,
          end: that.data.end,
          shopid: that.data.shopid,
          shopname: that.data.shopname,
          calendar: that.data.calendar,
          Technicianid: that.data.Technicianid,
          Technicianname: that.data.Technicianname
        }
        app.setStorage({
          key: 'apponitmentdata',
          data: data
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    console.log(options)
    var that = this;
    let employeeId = options.employee
    let shopid = options.shopid;
    let shopname =  options.shopname;
    if (employeeId){
      var TIME = util.formatTime(new Date()).substr(0, 10);
      that.setData({
        shopid: shopid
      })
      app.request({
        url: app.getApi('Appointment/appoint_employee_time_list'),
        data:{
          employee_id: employeeId,
          customer_id:uid,
          date_time: TIME
        },
        success: function (res) {
          if(res.list){
            that.collectTime(res.list);
          }
          res.employeeList.headImg = app.getImgUrl(res.employeeList.headImg)
          var arr = [res.employeeList]
          that.setData({
            technicianList: arr,
            technicianIdx:0,
            Technicianid: res.employeeList.Id,
            Technicianname: res.employeeList.Name,
            isStar_service:true
          })
        },
        fail: function (error) {
          console.log(error);
        }
      })
    }else{
      that.setData({
        shopid: shopid,
        shopname: shopname
      })
      app.request({
        url: app.getApi('appointment/showtime'),
        async: false,
        success: function (res) {
          that.collectTime(res.list);
        },
        fail: function (error) {
          console.log(error);
        }
      })
    }
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
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth()+1;

    let date = today.getDate();
    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    this.setData({
      calendar:year+'/'+month+'/'+date
    })
    
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
    return (app.share());
  },
  //- 收集时间点数据
  collectTime: function (opt){
    var that = this;
    var data = opt;
    for(var i=0;i<data.length;i++){
      let ishow = that.checkTime(data[i].stime);
      if (ishow) {
         data[i].ishow = true;
         data[i].isselected = false;//- 0代表未选中1代表已选中
      }else{
        data[i].ishow = false;
      }
      
    }
    that.setData({
      timeList: data
    })
  },
  //- 比较时间
  compareDate: function(date) {
      // console.log(+new Date);//- 现在时间
      // console.log(+new Date(date));//- 展示时间
      return +new Date > +new Date(date);
  },
  //- 校验时间点函数
  checkTime: function (last) {
    var that = this;
    //- 当前日期
    var date = that.data.calendar + " " + last;
    return !that.compareDate(date);
  },
  //- 获取当前时间点时间戳
  getDate: function(addDayCount) {
      addDayCount = addDayCount || 0;
      var now = new Date();
      // 获取AddDayCount天后的日期
      // now.setDate(now.getDate() + addDayCount);
      var year = now.getFullYear(),
          month = now.getMonth() + 1,
          day = now.getDate(),
          clock = year + "-";
      if (month < 10) clock += "0"
      clock += month + "-";
      if (day < 10) clock += "0"
      clock += day;
      return clock;
  }
})