// pages/login/login.js
const app = getApp();
// 判断手机号码
function isMobile(val) {
  if (!(/^1[34578]\d{9}$/.test(val))) {
    return false;
  }else{
    return true;
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg:'',
    BASE_url: app.globalData.BASE_url,
    telphone:'',      //手机号码
    smgCode:'',       //验证码
    smgTime:60,   //重新发送倒计时
    isResend:false,
    def:null,     //倒计时
    shopid: '',                             //- 选择门店id
    shoplist: '',                           //- 选择门店列表
    index: 0
  },
  /**
   * 选择门店
   */
  bindPickerChange(e) {
    let val = e.detail.value;
    let list = this.data.shoplist;
    this.setData({
      index: val,
      shopid: list[val].id
    })
  },
  /**
   * 门店数据加载
   */
  shoplist: function () {
    var that = this;
    var user = wx.getStorageSync('user');         //已注册用户信息
    app.request({
      url: app.getApi("Shop/shop_list"),
      data: {
        customer_id: user.uid
      },
      error: function (error) {
      },
      success: function (res) {
        that.setData({
          shoplist: res.list,
          shopid: res.list[0].id
        });

      },
      complete: function () {

      }
    });
  },
  /**
   * 手机号码输入事件
   */
  telphoneIpt(e) {
    let that = this;
    that.setData({
      telphone:e.detail.value
    })
  },
  /**
   * 验证码输入
   */
  smgCodeIpt(e) {
    let that = this;
    that.setData({
      smgCode: e.detail.value
    })
  },
  /**
   * 倒计时
   */
  countdown() {
    let that = this;
    let smgTime = that.data.smgTime;
    let def = setInterval(()=>{
      smgTime --;
      that.setData({
        smgTime:smgTime,
        def:def,
        isResend:true
      });
      if (smgTime < 1) {
        clearInterval(def);
        that.setData({
          isResend: false
        });
      } else {
      }
    }, 1000);
    
  },
  /**
   * 发送验证码
   */
  sendCode() {
    let that = this;
    let telphone = that.data.telphone;
    if (!isMobile(telphone)){
      wx.showToast({
        title: '手机号码格式错误',
        icon:'none'
      });
      return;
    }
    app.request({
      url: app.getApi('login/sendMsg'),
      data:{
        IsMinProgram: 1,
        telphone: that.data.telphone
      },
      fail: function (error) {
        //- 1.该手机号码已绑定
        //- 2.发送异常
        //- 3.服务器异常，错误码
        wx.showToast({
          title: error.msg,
          icon:'none'
        })
      },
      success(res) {
        that.countdown();   //倒计时
        wx.showToast({
          title: '发送成功，请注意查收',
          icon:'none'
        })
      }
    })
  },
  /**
   * 登录请求
   */
  loginbtn() {
    let that = this;
    let user = wx.getStorageSync('user');
    let shareUid = wx.getStorageSync('shareUid');
    let telphone = that.data.telphone;
    let smgCode = that.data.smgCode;
    let openid = user.openid;
    
    if(telphone==''){
      wx.showToast({
        title: '手机号码不能为空',
        icon:'none'
      })
      return;
    }
    if (smgCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return;
    }
    let params = {
      mobile: telphone,
      shop: that.data.shopid,
      recode: smgCode,
      openid: openid,
      superiorid: shareUid
    }
    app.request({
      url: app.getApi('auth_Login/BindMobile'),
      data:params,
      success:function(res){
        console.log(res);
        user.telphone = telphone;
        user.uid = res.user.uid;
        user.shopid = that.data.shopid;
        wx.setStorageSync('user', user);//存储用户数据

        wx.showToast({
          title: '登录成功',
          icon:'none'
        });
        // 删除之前页面缓存数据
        wx.reLaunch({
          url: '../mine/mine'
        })
      },
      fail:function(error) {
        wx.showToast({
          title: error.msg,
          icon: 'none'
        });
        console.log(error.msg);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    that.shoplist();
    app.request({
      url: app.getApi('advertisement/ad_list'),
      data: { flag: 'register' },
      fail: function (error) {
        wx.showToast({
          title: error.msg,
          icon:'none'
        })
      },
      success: function (data) {
        if (data.list) {
          that.setData({
            bannerImg: data.list[0].plug_ad_pic
          })
        } else {
          that.setData({
            bannerImg: '../../img/reserve/reserve_banner.png'
          })
        }
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