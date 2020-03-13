// pages/withdraw/withdraw.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'../../images/flower-icon2@2x.png',
    array: ['建设银行', '农业银行', '中国银行', '中国工商银行', '交通银行', '中信银行','中国邮政储蓄银行'],
    index: 0,
    Now_Petal:0,
    Wait_Withdraw:0,
    Withdraw_data:{
      OpenBand:'',
      accNo:'',
      name:'',
      money:''
    },
    disabled:false, // 防止重复点击
    rule:'',
    show_Rule:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.writhdraw_detail();
    that.writhdraw_rule();
  },
  //获取提现规则
  writhdraw_rule:function(){
    var that = this;
    app.request({
      url: app.getApi('Customers/Withdraw_Rules'),
      success: function (res) {
        WxParse.wxParse('article', 'html', res.list.Rules_content, that, 5);   //插件，转换html标签
        // that.setData({
        //   rule: res.list.Rules_content
        // })
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 3000
        })
      }
    })
  },
  //获取用户提现信息
  writhdraw_detail:function(){
    app.setTitle();
    var that = this;
    let _uid = wx.getStorageSync('user').uid;
    app.request({
      url: 'https://xmzxsc.meiyetongsoft.com/index.php/weixin/Withdraw/Withdraw_list',
      async: false,
      data: {
        CustomerID: _uid
      },
      success: function (res) {
        that.setData({
          Now_Petal: res.total,
          Wait_Withdraw: res.money
        })
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 3000
        })
      }
    })
  },
  //点击提现规则
  showRule:function(){
    var showRule = !this.data.show_Rule;
    this.setData({
      show_Rule: showRule
    })
  },
  //点击提现
  withdraw:function(){
    let _uid = wx.getStorageSync('user').uid;
    var that = this;
    var data = that.data.Withdraw_data;
    data.CustomerID = _uid;
    data.depositBank = that.data.array[that.data.index];
    if (!data.OpenBand || !data.accNo || !data.name || !data.money){
      app.showToast({
        title: '请完善信息',
        duration: 1500
      })
      return;
    } else if (data.money > that.data.Now_Petal){
      app.showToast({
        title: '花瓣数量不足',
        duration: 1500
      })
      return;
    }
    that.setData({
      disabled: true
    })
    app.request({
      url: 'https://xmzxsc.meiyetongsoft.com/index.php/weixin/Withdraw/insertInfo',
      data: data,
      success: function (res) {
        console.log(res)
        app.showToast({
          title: '申请提交成功，请耐心等待',
          duration: 3000
        })
        that.writhdraw_detail();
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      },
      error: function (err) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      },
      complete:function(){
        data.money = ''
        that.setData({
          disabled: false,
          Withdraw_data:data
        })
      }
    })
  },

  //input输入
  bindKeyInput: function (e) {
    var text = e. detail.value;
    var id = e.target.id;
    var that = this;
    switch(id){
      case 'OpenBand':
        that.data.Withdraw_data.OpenBand = text;
        break;
      case 'Account':
        that.data.Withdraw_data.accNo = text;
        break;
      case 'user_name':
        that.data.Withdraw_data.name = text;
        break;
      case 'cash':
        that.data.Withdraw_data.money = text;
        break;
    }
  },

  //选择银行
  bindPickerChange:function(e){
    this.setData({
      index:e.detail.value
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