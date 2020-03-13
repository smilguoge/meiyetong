// pages/orderDetail/orderDetail.js
const app = getApp();
const user = wx.getStorageSync('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:'',     //订单详情
    shopdata: '',//- 商品详情数据
    BASE_url: app.globalData.BASE_url,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    const user = wx.getStorageSync('user');
    let order_id = options.order_id;
    let param = {
      order_id: order_id,
      customer_id: user.uid
    }
    app.request({
      url: app.getApi('order/activity_order_detail'),
      data: param,
      success: function (res) {
        console.log(res);
        let orderDetail = res.list;
        let shopdata = res.list.goodsData;
        that.setData({
          orderDetail: orderDetail,
          shopdata: shopdata
        })
        console.log(that.data.shopdata)
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