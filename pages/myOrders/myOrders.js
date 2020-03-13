// pages/myOrders/myOrders.js
const app = getApp();
var list_rows=10;
var page=1;
var index;
var load_page = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    momentTab: ['待付款', '待发货', '待收货', '所有订单'],
    list:[],
  },
  /**
   * 跳转到订单详情
   */
  toOrderDetail(e) {
    let idx = e.currentTarget.dataset.index;
    let list = this.data.list;

    wx.navigateTo({
      url: '../orderDetail/orderDetail?order_id=' + list[idx].id,
    })
  },
  //获取到tab数据
  tabEvent(e){
    index = e.detail;
    page = 1;
    this.setData({
      type_num:index,
      list:[],
    })
    this.get_Order_data();
  },
  //-删除后重新更新数据
  updateData () {
    page = 1;
    this.setData({
      type_num: index,
      list: [],
    })
    this.get_Order_data();
  },
  //订单接口访问
  get_Order_data(){
    var that = this;
    var uid = wx.getStorageSync('user').uid;
    if (index == 3) {
      index = '';
    }
    app.request({
      url: app.getApi('Order/pay_list'),
      data: {
        customer_id: uid,
        type: index,
        list_rows: list_rows,
        page: page
      },
      success: function (res) {
        load_page = (res.list.total < page * list_rows)
        var list = res.list.data;
        list.forEach(value => {
          value.add_date = value.add_date.substr(0,10)
          var pay_data = []//后面支付要用的JSON字符串
          if (value.goodsInfo){
            value.goodsInfo.forEach(key => {
              var data = { 
                Id:key.Id,
                type:key.type,
                quantity: key.quantity
              }
              pay_data.push(data)
              if (key.pic) {
                // key.pic = app.getImgUrl(key.pic);
              } else {
                key.pic = '/data/upload/2018-09-20/5ba33d467bb0f.jpg'
              }
            })
            value.pay_data = JSON.stringify(pay_data)
          }
        })
        var old_list = that.data.list;
        list = old_list.concat(list);
        that.setData({
          list: list
        })
      },
      fail: function (error) {
        wx.showToast({
          title: error.msg,
        })
        // app.showToast({
        //   title: error.msg,
        //   duration: 1500
        // })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    index = options.type
    console.log(index)
    this.setData({
      type_num: index
    })
    this.get_Order_data();
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
    // this.get_Order_data();
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
    if(load_page) return;
    page++;
    this.get_Order_data()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return (app.share());
  }
})