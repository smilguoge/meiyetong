// pages/mine/myRecommend/myRecommend.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    detail:{},//用户详情
  },
  created: function (options) {
    var uid = wx.getStorageSync('user').uid;
    var that = this;
    app.request({
      url: app.getApi('Customers/son_list'),
      data: {
        customer_id: uid
      },
      success: function (res) {
        var list = res.list;
        list.forEach(value=>{
          value.Fmoney = parseFloat(value.Fmoney).toFixed(2)
        })
        that.setData({
          list:res.list,
          detail: res.detail,
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
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    closeSpec() {
      this.triggerEvent('closeSpec')
    },
  }
})
