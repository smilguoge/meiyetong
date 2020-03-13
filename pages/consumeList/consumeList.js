// pages/consumeList/consumeList.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startdate:'2018-08-08',
    enddate:'',
    list:[],
  },
  /**
   * 选择日期
   */
  bindDateChange(e) {
    console.log(e);
    var id = e.target.id;
    if (id == 'star'){
      this.setData({
        startdate: e.detail.value
      })
    }
    if (id == 'end') {
      this.setData({
        enddate: e.detail.value
      })
    }
    this.consumeList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    console.log(util.formatTime(new Date()))
    var TIME = util.formatTime(new Date()).substr(0,10);
    this.setData({
      startdate: TIME,
      enddate: TIME
    })
    this.consumeList()
  },
  //访问消费详情接口
  consumeList(){
    var that =this
    var uid = wx.getStorageSync('user').uid;
    var startdate = this.data.startdate+' 00:00:00';
    var enddate = this.data.enddate+' 23:59:59'
    app.request({
      url: app.getApi('Consume/accountDetail'),
      data: {
        customer_id: uid,
        start: startdate,
        end: enddate
      },
      success: function (res) {
        if(res.list.length > 0){
          var list = res.list
          list.forEach(value => {
            if (value.RegisterDate) {
              value.RegisterDate = value.RegisterDate.substr(0,10);
            }
          })
          that.setData({
            list: list
          })
        }
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
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
    return (app.share());
  }
})