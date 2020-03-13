// pages/projectAppraise/projectAppraise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    momentTab:['待评价','已评价'],
    isShow:false,
    list:[],
    had_common:false
  },
  /**
   * 关闭弹窗
   */
  closeAllcollage(e) {
    console.log(e)
    this.setData({
      isShow:false,
    })
    if (e.detail) {//提交评价的情况
      this.wait_appraise(2)
    }
  },
  /**显示评价弹窗 */
  showAppraiseCont(e) {
    var that = this
    this.setData({
      isShow:true,
      MDID: e.target.dataset.mdid
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    this.wait_appraise(2)
  },
  //导航栏点击事件
  tabEvent(e){
    this.wait_appraise(e.detail+2)
  },
  //2待评价 3已评价
  wait_appraise(Dstate){
    var that = this;
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('consume/consume_project_search'),
      data: {
        CustomerId: uid,
        Dstate: Dstate
      },
      success: function (res) {
        if (res) {
          res.forEach(value => {
            value.IssueDate = value.IssueDate.substr(0, 16);
            if (value.projectList) {
              value.projectList.forEach(key => {
                if (key.cover) {
                  key.cover = key.cover;
                } else {
                  key.cover = 'http://xmzxsc.meiyetongsoft.com/data/upload/2018-10-18/5bc89ca522d74.jpg'
                }
              })
            }
            if (Dstate == 3){
              value.PointScore = parseInt(value.PointScore);
              value.ProScore = parseInt(value.ProScore)
              value.ServiceScore = parseInt(value.ServiceScore)
            }
          })
          that.setData({
            list: res
          })
        }
        
        
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      }
    })
    if (Dstate == 2){
      that.setData({
        had_common:false
      })
    }else{
      that.setData({
        had_common: true
      })
    }
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