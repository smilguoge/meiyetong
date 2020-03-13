// pages/friendMoment/friendMoment.js
const app = getApp();
const user = wx.getStorageSync('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    momentTab:['语音课程','视频','图片'],
    type: 0,     // 0:语音课程；1：视频；2：图片
    pageNo: 1,    //分页
    videolist:[],  
    BASE_url: app.globalData.BASE_url,
  },
  /**
   * tab事件
   */
  tabEvent(e){
    console.log(e);
    this.setData({
      type:e.detail
    })
    this.getList();
  },
  /**
   * 获取列表
   */
  getList() {
    let that = this;
    let pageNo = that.data.pageNo;
    let type = that.data.type;
    
    let param = {
      page: pageNo,
      list_rows:10,
      type: type
    }
    app.request({
      url: app.getApi('Friends_Circle/video_list'),
      data: param,
      success: function (res) {
        console.log(res);
        let listdata = res.list.data;
        that.setData({
          videolist:listdata
        })
      },
      fail: function (error) {
        console.log(error);
      },
      complete() {
        app.hideToast();    //请求完成，隐藏加载提示
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    app.showToast({
      title: '加载中',//提示文字
      icon: 'loading', //图标，支持"success"、"loading"   
    })
    that.getList();
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