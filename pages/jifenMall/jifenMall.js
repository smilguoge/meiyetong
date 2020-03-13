// pages/jifenMall/jifenMall.js
const app = getApp()
var item_type = 0//type=0 全部可兑换项目 type=1 当前用户可兑换项目
var sta=0//	1: 产品 ；2 : 项目 ；3: 卡
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    Integral:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    this.getIntegral()
  },
  //访问积分接口
  getIntegral(){
    var that= this;
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('min_Intergral/getIntegralProjectsList'),
      data: {
        CustomerId: uid,
        type: item_type,
        sta: sta,
      },
      success: function (res) {
        if (res.list) {
          var list = res.list
          list.forEach(value => {
            if (value.project_avatar) {
              value.project_avatar = app.getImgUrl(value.project_avatar);
            }else{
              value.project_avatar = 'http://xmzxsc.meiyetongsoft.com/data/upload/2018-10-18/5bc89ca522d74.jpg'
            }
          })
          that.setData({
            list: res.list,
            Integral:res.change
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
  //获取到标题栏的数据
  getTab(e){
    console.log(e)
    item_type = e.detail.item_type;
    sta = e.detail.sta;
    this.getIntegral()
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