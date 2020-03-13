// pages/myAppointment/myAppointment.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMenu: ["全部预约", "未服务", "已服务"],
    items: [],
    type: [0,1,2],
    itemsdata: [],
    tabIdx: 0
  },
  /**
   * 顶部tab回调函数
   */
  chooseTab (data) {
    var that = this;
    let tabIdx = data.detail.tabIdx;
    that.chooseappointment(tabIdx);
    that.setData({
      tabIdx: tabIdx
    })
  },
  /**
   * 取消预约数据
   */
  cancelappointment: function(event){
    var that = this;
    let id = event.currentTarget.dataset.id;
    app.request({
      url: app.getApi('appointment/cancel_appointment'),
      data: {
        id: id
      },
      success:function(res){
        app.showToast({
          title: '预约取消成功',
          duration: 1500,
          success: function(){
            setTimeout(function(){
              let tabIdx = that.data.tabIdx;
              that.chooseappointment(tabIdx);
            },1500)
          }
        })
      },
      fail:function(error) {
        console.log(error);
      }
    })

  },
  /**
   * 渲染预约数据
   */
   chooseappointment: function (opt) {
      var that = this;
      let userinfo = wx.getStorageSync('user');
      let uid = userinfo.uid;
      app.showToast({
         title: '加载中',//提示文字
         mask: true,//是否显示透明蒙层，防止触摸穿透，默认：true
         icon: 'loading', //图标，支持"success"、"loading"   
      })
      app.request({
        url: app.getApi('appointment/appointmentOrder'),
        data: {
          customerid: uid,
          type: opt
        },
        success:function(res){
          var data = res.list;
          if(data != null){
            for(var i=0;i<data.length;i++){
              data[i].PlanWakeUpDate = data[i].PlanWakeUpDate.substr(0, 16);
              data[i].PlanWakeUpDateEnd = data[i].PlanWakeUpDateEnd.substr(10, 6);
            }

          }
          app.hideToast();
          that.setData({
            itemsdata: data
          });
        },
        fail:function(error) {
          console.log(error);
        }
      })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    var that = this;
    that.chooseappointment(0);
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