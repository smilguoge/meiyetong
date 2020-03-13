// pages/beauticianList/beauticianList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctorList:[],
    pageNo:1,
    BASE_url:app.globalData.BASE_url,
  },
  /**
   * 跳转美容师详情页
   */
  toBeauticianDetail(e) {
    let that = this;
    let employee_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../beauticianDetail/beauticianDetail?employee_id=' + employee_id,
    })
  },
  getList(pageNo) {
    let that = this;
    let doctorList = that.data.doctorList;
    let param = {
      page:pageNo,
      list_rows:10
    }
    app.request({
      url: app.getApi('doctor/doctor_list'),
      data: param,
      success: function (res) {
        
        if(pageNo==1) {
          doctorList = res.list.data
        }else{
          console.log(pageNo);
          doctorList = doctorList.concat(res.list.data);
        }
        console.log(doctorList);
        for (let key in doctorList) {
          let HeadImg = doctorList[key].HeadImg;
          HeadImg.substring(0, 4);
          if (HeadImg.substring(0, 4) != 'http') {
            HeadImg = that.data.BASE_url + HeadImg;
          }
          doctorList[key].HeadImg = HeadImg;
        }
        that.setData({
          doctorList: doctorList
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let pageNo = this.data.pageNo;
    this.getList(pageNo);
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
    this.getList(1);
    this.setData({
      pageNo: 1
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageNo = this.data.pageNo;
    pageNo ++;
    this.getList(pageNo);
    this.setData({
      pageNo:pageNo
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return (app.share());
  }
})