// pages/awardDetail/awardDetail.js
var util = require('../../utils/util.js')
const app = getApp()
var list_rows = 50;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startdate: '2018-08-08',
    enddate: '2018-08-08',
    reward_data:{},
  },
  /**
   * 选择日期
   */
  bindDateChange(e) {
    console.log(e);
    var id = e.target.id;
    if (id == 'star') {
      this.setData({
        startdate: e.detail.value
      })
    }
    if (id == 'end') {
      this.setData({
        enddate: e.detail.value
      })
    }
    this.reward()
    console.log(e.detail.value)
  },
  //奖励详情接口
  reward() {
    var that = this
    var uid = wx.getStorageSync('user').uid;
    var startdate = this.data.startdate + ' 00:00:00';
    var enddate = this.data.enddate + ' 23:59:59'
    app.request({
      url: app.getApi('Customers/share_list'),
      data: {
        customer_id: uid,
        start: startdate,
        end: enddate,
        page:page,
        list_rows: list_rows
      },
      success: function (res) {
        that.setData({
          reward_data:res
        })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    console.log(util.formatTime(new Date()))
    var TIME = util.formatTime(new Date()).substr(0, 10);
    this.setData({
      startdate: TIME,
      enddate: TIME
    })
    this.reward()
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