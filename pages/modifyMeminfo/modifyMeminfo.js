// pages/modifyMeminfo/modifyMeminfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_detail:{},//花瓣积分
    customer_list:{},//用户详细信息
    BankName: ['中国工商银行', '中国农业银行', '中国银行', '中国建设银行', '交通银行', '中信银行', '平安银行', '广东发展银行', '中国民生银行', '招商银行', '华夏银行', '中国光大银行', '兴业银行', '上海浦东发展银行', '中国邮政储蓄银行']
  },
  //选择器事件
  bindChange(e){
    var id= e.target.id
    var data = this.data.customer_list;
    var value = e.detail.value;
    switch(id){
      case  'BirthDate':
        data.BirthDate = value;
        break;
      case 'region':
        data.Province = value[0];
        data.City = value[1];
        data.Area = value[2];
        break;
      case 'bank':
        data.BankName = this.data.BankName[value];
        break;
    }
    this.setData({
      customer_list: data
    })
  },
  //输入框事件
  bindInput(e){
    var value = e.detail.value;
    var data = this.data.customer_list;
    var id = e.target.id;
    switch (id){
      case 'name':
        data.Name = value;
        break;
      case 'tel':
        data.Mobile = value;
        break;
      case 'IDCard':
        data.IDCard = value;
        break;
      case 'Emai':
        data.QQ = value;
        break;
      case 'Address':
        data.Address = value;
        break;
      case 'BankAccount':
        data.BankAccount = value;
        break;
    }
    this.setData({
      customer_list:data
    })
  },
  //点击修改
  revise(){
    var data = this.data.customer_list;
    var uid = wx.getStorageSync('user').uid;
    data.customer_id = uid;
    var that = this;
    if (data.QQ==null){}
    else if (!data.QQ.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
      app.showToast({
        title: '邮箱格式不正确',
        duration: 1500
      })
      data.QQ = ''
      that.setData({
        customer_list:data
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确认修改',
      success:str=>{
        if (str.confirm) {
          that.revise_url(data)
        }
      }
    })
    
  },
  //修改个人资料接口
  revise_url(data){
    app.request({
      url: app.getApi('Customers/customer_save'),
      data: data,
      success: function (res) {
        app.showToast({
          title: '修改成功',
          duration: 1500,
          success: function () {
            
            var s = setTimeout(function () {
              clearTimeout(s)
              wx.navigateBack({
                delta: getCurrentPages() - 2
              })
            }, 1500)
          }
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
    var that = this;
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('Customers/customer_balance'),
      data: {
        customer_id: uid
      },
      success: function (res) {
        that.setData({
          customer_detail:res.detail
        })
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      }
    })
    this.customerData()
  },
  //获取用户详细信息
  customerData(){
    var that = this;
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('Customers/customer_edit'),
      data: {
        customer_id: uid
      },
      success: function (res) {
        var data = res.detail;
        data.BirthDate ? data.BirthDate = data.BirthDate.substr(0,10) : data.BirthDate = '';
        data.Province ? '' : data.Province = '';
        data.City ? '' : data.City = '';
        data.Area ? '' : data.Area = '';
        data.BankName ? '' : data.BankName = '';
        that.setData({
          customer_list: data
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