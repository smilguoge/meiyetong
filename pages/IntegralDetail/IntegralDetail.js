// pages/IntegralDetail/IntegralDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Integral: 0,
    list:[],
    page:1,
    _row:10,
    type:0,  //0为收入  1位支出
    load:false, // 用于判断是否在进行分页加载 false继续  true结束
  },

  //获取用户的积分详情
  getIntegralDetail(type,cb){
    var that = this;
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('Intergral/change_list'),
      data: {
        customer_id: uid,
        type: type,
        page: that.data.page,
        list_rows: that.data._row
      },
      success: function (res) {
        var data = res.list.data;
        for (var i = 0; i < data.length;i++){
          data[i].issuetime = data[i].issuetime.substr(0,16)
        }
        that.setData({
          Integral: res.TotalChange,
          type: type,
        })
        cb(data,res.list.total)
        
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      }
    })
  },

  //获取点击收入还是支出
  getTab(e){
    var that = this
    console.log(e.detail.index)//0为收入  1为支出
    if (e.detail.index == 0){
      that.getIntegralDetail(0, this.htmlData)
    }else{
      that.getIntegralDetail(-1, this.htmlData)
    }
  },
  //重新加载数据
  htmlData(data){
    var that=this;
    that.setData({
      list: data,
      page:1
    })
  },

  //下拉加载
  appendData(data,total){
    var that = this;
    var list = that.list;
    list = list.concat(data);
    var load = (total <= that.data.page * that.data._row);
    that.setData({
      list: list,
      load:load
    })
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    this.getIntegralDetail(0, this.htmlData);
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
    if(this.data.load){return};
    var page = this.data.page+1;
    this.setData({
      page: page
    })
    this.getIntegralDetail(this.data.type, this.appendData);
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