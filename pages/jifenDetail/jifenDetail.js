// pages/jifenDetail/jifenDetail.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var wxUser = wx.getStorageSync('wxUser');     //授权信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaccredit: true,
    noaccreditPhone: true,
    noaccreditshop: true,
    list:{},
    ProjectId:'',//产品id  用于分享
    sta:''//用于分享传参
  },

  /**
 * 绑定上下级
 */
  bingdRelation: function (shareUid) {
    console.log('shareUid', shareUid)
    var uid = wx.getStorageSync('user').uid;
    console.log('uid', uid)
    app.request({
      url: app.getApi('login/updateIntroducer'),
      data: { superiorid: shareUid, Id: uid },
      sync: true,
      success: function (data) {
        console.log('success', data)
      },
      fail: function (error) {
        console.log('err', error);
      }
    });
  },
  /**获取授权成功 */
  login() {
    this.onLoad();    //刷新页面
  },
  /**获取手机号授权成功 */
  loginPhone(e) {
    this.onLoad();    //刷新页面
  },
  /**获取门店授权成功 */
  loginshop(e) {
    this.onLoad();    //刷新页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    app.setTitle();
    console.log(e)
    var uid = wx.getStorageSync('user').uid;
    var that = this
    var user = wx.getStorageSync('user');         //已注册用户信息
    var that = this;
    if (user == '') {   //未授权登录过
      that.setData({
        noaccredit: true,
        noaccreditPhone: true,
        noaccreditshop: true,
      })
    } else {
      //- 以下授权登录过
      //- 说明没有电话
      if (user.telphone == undefined || !user.telphone || user.telphone == '') {
        that.setData({
          noaccredit: false,
          noaccreditPhone: true,
        })
      }
      //- 说明有电话
      if (user.telphone) {
        that.setData({
          noaccredit: false,
          noaccreditPhone: false,
        })
      }
      //- 说明有门店
      if (user.shopid) {
        that.setData({
          noaccreditshop: false,
        })
      }
      //- 说明没有门店
      if (user.shopid == undefined || !user.shopid || user.shopid == '') {
        that.setData({
          noaccreditshop: true,
        })
      }
      that.setData({
        //- 用户数据保存
        user: user,
      })
    }

    if (e && e.shareUid) {
      console.log(e)
      wx.setStorage({
        key: 'shareUid',
        data: e.shareUid
      })
      that.bingdRelation(e.shareUid);
    }
    that.setData({
      ProjectId: e.ID,
      sta: e.sta
    });
    app.request({
      url: app.getApi('min_Intergral/getIntegralProjectsDetail'),
      data: {
        CustomerId: uid,
        ProjectId: e.ID,
        sta: e.sta,
      },
      success: function (res) {
        var list = res.list
        list.project_avatar ? list.project_avatar = app.getImgUrl(list.project_avatar) : list.project_avatar ='http://xmzxsc.meiyetongsoft.com/data/upload/2018-10-18/5bc89ca522d74.jpg'
        that.setData({
          list : list
        })
        WxParse.wxParse('article', 'html', res.list.project_content, that, 5);   //插件，转换html标签
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      }
    })
  },
  //确认兑换
  addTocart(e){
    var that = this
    console.log(e.target.dataset)
    wx.showModal({
      title: '提示',
      content: '确认兑换',
      success:res=>{
        if (res.confirm) {
          that.exchange_url(e)
        }
      }
    })
  },
  //确认兑换接口
  exchange_url(e){
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('min_Intergral/change_apply'),
      data: {
        CustomerId: uid,
        ProjectId: e.target.dataset.id,
        sta: e.target.dataset.sta,
      },
      success: function (res) {
        app.showToast({
          title: res.msg,
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
    var that=this;
    let user = wx.getStorageSync('user');
    console.log(user.uid);
    return {
      title: '',        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/jifenDetail/jifenDetail?shareUid=' + user.uid + '&ID=' + that.data.ProjectId +'&sta='+that.data.sta,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  }
})