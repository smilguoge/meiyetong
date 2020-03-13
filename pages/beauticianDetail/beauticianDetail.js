// pages/beauticianDetail/beauticianDetail.js
let app = getApp();
var WxParse = require('../../wxParse/wxParse.js')     //html转换成小程序标签模板
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    BASE_url: app.globalData.BASE_url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    let employee_id = options.employee_id;
    let param = {
      employee_id: employee_id
    }
    app.request({
      url: app.getApi('doctor/doctor_detail'),
      data: param,
      success: function (res) {
        console.log(res);
        let detail = res.detail;
        let headImg = detail.headImg;
        
        if (headImg.substring(0, 4) != 'http') {
          console.log(headImg.substring(0, 4));
          detail.headImg = that.data.BASE_url + headImg;
        }
        WxParse.wxParse('article', 'html', detail.Remark, that, 5);   //插件，转换html标签
        
        that.setData({
          detail: detail
        })
      },
      fail: function (error) {
        console.log(error);
      }
    });
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