// pages/orderDetail/orderDetail.js
const app = getApp();
const user = wx.getStorageSync('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:'',     //订单详情
    BASE_url: app.globalData.BASE_url,
  },
  /**
   * 跳转项目详情
   */
  // toProjectDetail() {
  //   wx.navigateTo({
  //     url: '../projectDetail/projectDetail',
  //   })
  // },
  //点击取消订单
  canal_order(e) {
    var that = this
    var orderId = e.target.dataset.id;
    const user = wx.getStorageSync('user');
    wx.showModal({
      title: '提示',
      content: '确定取消订单',
      success:res=>{
        if (res.confirm) {
          app.request({
            url: app.getApi('Order/order_del'),
            data: {
              customer_id: user.uid,
              order_id: orderId
            },
            success: function (res) {
              app.showToast({
                title: '操作成功',
                duration: 1500
              })
              that.triggerEvent("del_order");
              wx.navigateBack()
            },
            fail: function (error) {
              app.showToast({
                title: error.msg,
                duration: 1500
              })
            }
          })
        }
      }
    })

  },
  //点击付款
  pay_order(e) {
    let that = this;
    let orderDetail = that.data.orderDetail;
    if (orderDetail.istrueorder == 0) {
      app.showToast({
        title: '请到店支付',
        duration: 1500
      })
    } else {
      let buyData = [];
      let goodsInfo = orderDetail.goodsInfo;
      goodsInfo.forEach(value=>{
        buyData.push({
          Id: value.Id,
          type: value.type,
          quantity: value.quantity
        })
      })
      wx.navigateTo({
        url: '../projectPayment/projectPayment?buyData=' + JSON.stringify(buyData),
      })
    }
  },
  //点击确认收货
  sure_order(e) {
    var id = e.target.dataset.id
    
    wx.showModal({
      title: '提示',
      content: '确认收货',
      success:res=>{
        if (res.confirm) {
          app.request({
            url: app.getApi('Order/order_del'),
            data: {
              customer_id: user.uid,
              order_id: id
            },
            success: function (res) {
              app.showToast({
                title: '确认收货',
                duration: 1500
              })
              that.triggerEvent("del_order");
            },
            fail: function (error) {
              app.showToast({
                title: error.msg,
                duration: 1500
              })
            }
          })
        }
      }
    })
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
      url: app.getApi('order/order_detail'),
      data: param,
      success: function (res) {
        console.log(res);
        let orderDetail = res.list.data;
        that.setData({
          orderDetail: orderDetail
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