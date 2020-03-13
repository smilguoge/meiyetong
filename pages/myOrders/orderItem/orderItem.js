// pages/myOrders/orderItem/orderItem.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: {
      type: JSON,
      value: {}
    },
    type_num:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    BASE_url: app.globalData.BASE_url,
  },
  ready() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    //点击取消订单
    canal_order(e){
      var uid = wx.getStorageSync('user').uid;
      var that = this
      var orderId = e.target.dataset.id;
      wx.showModal({
        title: '提示',
        content: '确定删除订单',
        success:res=>{
          if (res.confirm) {
            app.request({
              url: app.getApi('Order/order_del'),
              data: {
                customer_id: uid,
                order_id: orderId
              },
              success: function (res) {
                app.showToast({
                  title: '操作成功',
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
    //点击付款
    pay_order(e){
      var istrueorder = e.target.dataset.istrueorder
      var id = e.target.dataset.id
      var pay_data = e.target.dataset.pay_data
      if (istrueorder == 0){
        app.showToast({
          title: '请到店支付',
          duration: 1500
        })
      }else{
        wx.navigateTo({
          url: '../projectPayment/projectPayment?buyData=' + pay_data,
        })
      }
    },
    //点击确认收货
    sure_order(e){
      var id = e.target.dataset.id;
      var uid = wx.getStorageSync('user').uid;
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确认收货',
        success:res=>{
          if (res.confirm) {
            app.request({
              url: app.getApi('Order/update_order_status'),
              data: {
                customer_id: uid,
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
    }

  }
})
