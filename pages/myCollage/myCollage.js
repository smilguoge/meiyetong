// pages/myCollage/myCollage.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMenu: ["待分享", "拼团成功", "拼团失败"],
    items: [],
    type: [0,1,-1],
    itemsdata: [],
    tabIdx: 0,
    BASE_url: app.globalData.BASE_url,
  },
  /**
    * 顶部tab回调函数
    */
  chooseTab(data) {
    var that = this;
    let tabIdx = data.detail.tabIdx;
    that.chooseCollage(tabIdx);
    that.setData({
      tabIdx: tabIdx
    })
  },
  /**
   * 待分享，跳转分享页面
   */
  toCollageShare (event) {
    console.log(event);
    let spelling_id = event.currentTarget.dataset.spelling_id;
    wx.navigateTo({
      url: '../collagePageShare/collagePageShare?spelling_id=' + spelling_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    var that = this;
    that.chooseCollage(0);
  },
  /**
   * 渲染预约数据
   */
   chooseCollage: function (opt) {
      var that = this;
      let userinfo = wx.getStorageSync('user');
      let uid = userinfo.uid;
      app.showToast({
         title: '加载中',//提示文字
         mask: true,//是否显示透明蒙层，防止触摸穿透，默认：true
         icon: 'loading', //图标，支持"success"、"loading"   
      })
      app.request({
        url: app.getApi('customer_spelling/index'),
        data: {
          customer_id: uid,
          state: that.data.type[opt]
        },
        success:function(res){
          var data = res.list;
          // var data = res.list
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