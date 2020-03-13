// pages/mapShopaddr/mapShopaddr.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:'',      //经纬度
    markers: [{
      iconPath: "../../images/addr@2x.png",
      id: 0,
      title:'标记',
      latitude: 23.099994,
      longitude: 113.324520,
      width: 30,
      // height: 30
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let location = JSON.parse(options.location);
    // console.log(options);
    let markers = this.data.markers;
    markers[0].latitude = location.lat;
    markers[0].longitude = location.lng;
    this.setData({
      location: location,
      markers: markers
    })
    //- 获取个人位置信息（较高精确度）
    app.showToast({
      duration: 1500,
      icon: 'loading'
    })


    wx.openLocation({
      latitude: location.lat,
      longitude: location.lng,
      scale: 28
    })

    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   altitude: true,
    //   success: function(res){
    //     console.log(res);
    //     console.log("可以吗")
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 28
    //     })
    //   }
    // });
  },
  /**
   * 点击标记点时触发
   */
  bindmarkertap(e) {
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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