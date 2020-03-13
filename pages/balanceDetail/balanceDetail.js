// pages/balanceDetail/balanceDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    difcountImg: '../../images/discount.png',      //储值卡的背景图
    courseImg: '../../images/course.png',      //疗程卡的背景图
    productImg: '../../images/product.png',      //赠品寄存卡的背景图
    nopayImg: '../../images/nopay.png',      //未结算卡的背景图
    list:{},
  },
  /**
   * 展开
   */
  showAllcards(e) {
    let idx = e.currentTarget.dataset.index;
    let list = this.data.list;
    list.LiaochengCard[idx].isShow = !list.LiaochengCard[idx].isShow;
    this.setData({
      list: list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    var that = this
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('Card/cardDetail'),
      data: {
        CustomerId: uid
      },
      success: function (res) {
        var data = res;
        if (data.LiaochengCard && data.LiaochengCard.length>0){
          for (var i = 0; i<data.LiaochengCard.length;i++){
            if (data.LiaochengCard[i]){
              data.LiaochengCard[i].isShow = false;
            }
          }
        }
        
        that.setData({
          list: data
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