// pages/mineseckill/mineseckill.js
const app = getApp();
var list_rows = 10;
var page = 1;
var index = '';
var load_page = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    momentTab: ['所有订单', '已完成', '未完成', '已失效'],
    list: [],
    type_num: ''
  },
  /**
   * 跳转到订单详情
   */
  toOrderDetail(e) {
    let idx = e.currentTarget.dataset.index;
    let list = this.data.list;

    wx.navigateTo({
      url: '../seckillorderDetail/seckillorderDetail?order_id=' + list[idx].id,
    })
  },
  //获取到tab数据
  tabEvent(e) {
    let that = this;
    index = e.detail;
    page = 1;
    //- 所有订单 不传， 未完成 0，已完成 1， 已失效 5
    switch (index) {
      case 0:
        that.setData({
          type_num: '',
          list: [],
        })
        break;
      case 1:
        that.setData({
          type_num: 1,
          list: [],
        })
        break;
      case 2:
        that.setData({
          type_num: 0,
          list: [],
        })
        break;
      case 3:
        that.setData({
          type_num: 5,
          list: [],
        })
        break;
      
    }
    this.getOrderData();
  },
  /**
   * 获取订单数据
   */
  getOrderData(){
    var that = this;
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('order/activity_order_list'),
      data: {
        customer_id: uid,
        pay_status: that.data.type_num,
        list_rows: list_rows,
        page: page
      },
      success: function (res) {
        load_page = (res.list.total < page * list_rows)
        var list = res.list.data;
        list.forEach((value, index) => {
          value.add_date = value.add_date.substr(0, 10);
          value.useindex = index;
          var pay_data =  []//后面支付要用的JSON字符串
          if (value.goodsData) {
            let goodsData = value.goodsData;

            var data = {
              Id: goodsData.goods_id,
              type: goodsData.type,
              quantity: goodsData.quantity,
              seckillid: goodsData.sub_activity_id,
              
            }
            pay_data.push(data)
            // if (key.pic) {
            //   // key.pic = app.getImgUrl(key.pic);
            // } else {
            //   key.pic = '/data/upload/2018-09-20/5ba33d467bb0f.jpg'
            // }

            value.pay_data = JSON.stringify(pay_data)
          }
        })
        var old_list = that.data.list;
        list = old_list.concat(list);
        that.setData({
          list: list
        })
        console.log(that.data.list)
      },
      fail: function (error) {
        wx.showToast({
          title: error.msg,
        })
      }
    })
  },
  /**
   * 删除订单数据
   */
  del_order_father(e){
    // let that = this;
    // let idx = e.detail.delIdx;
    // let list = that.data.list;
    // console.log(idx);
    // list.splice(idx, 1);
    
    this.setData({
      list: []
    })
    this.getOrderData();


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  scrollbottom() {
    console.log(load_page + "||" + "执行了")
    if (load_page) return;
    page++;
    this.getOrderData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorage({
      key: 'buyData',
      success(res) {
        console.log(res.data)
      }
    })
    app.setTitle();
    index = options.type
    console.log(index)
    this.setData({
      type_num: index
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
    this.getOrderData();
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

  }
})