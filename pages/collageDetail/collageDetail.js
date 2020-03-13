// pages/collageDetail/collageDetail.js
var WxParse = require('../../wxParse/wxParse.js')
var wxUser = wx.getStorageSync('wxUser');     //授权信息
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaccredit: false,//未授权
    noaccreditPhone: false,    //未注册

    collageList:new Array(),  //正在参与拼团列表
    showAllcollage:false,     //显示更多拼团弹窗
    showConfirm: false,       //显示弹出框
    failPayConfirm:false,     //支付失败弹窗显示
    showPaytype: false,       //显示支付方式
    spellingDetial:'',      //详情数据
    // userid : wx.getStorageSync('user'),
    user: wx.getStorageSync('user'),      //用户info
    payData:{},     //微信支付需要的参数

    diffTime:[],      //计时器
    _id:'',//产品id
  },
  /**获取手机号授权成功 */
  loginPhone(e) {
    this.setData({
      noaccreditPhone: false,
      user: e.detail
    })
    // this.onLoad();    //刷新页面
  },
  /**
   * 查看更多拼团
   */
  showAllcollage () {
    this.setData({
      showAllcollage:true
    })
  },
  /**
   * 关闭更多拼团的弹窗
   */
  closeAllcollage () {
    this.setData({
      showAllcollage: false
    })
  },
  /**
   * 单独购买点击-显示弹窗
   */
  buyAlone () {
    let that = this;
    console.log(that.data.user);
    let user = that.data.user;
    let details = that.data.spellingDetial;
    // this.setData({
    //   showConfirm: true
    // })

    //- 拼团详情type所指 1：卡项 2：项目 3：产品
    let type = parseInt(details.Type);//- 拼团详情type
    console.log(type);
    //正常流程详情type所指：产品2、项目1、卡项3
    if (type == 3){
      console.log("走了吗")
      type = 2;//- 转化为正常流程type 产品
    }else if (type == 2){
      type = 1;//- 转化为正常流程type 项目
    }else if (type == 1){
      type = 3;//- 转化为正常流程type 卡项
    }
    let buyData = [{
      Id: details.ProjectId,
      type: type,      //详情类型：产品2、项目1、卡项3
      quantity: 1
    }];
    // console.log(buyData)

    wx.navigateTo({
      url: '../projectPayment/projectPayment?buyData=' + JSON.stringify(buyData),
    })
  },
  /**
   * 单独购买弹窗-取消
   */
  cancelEvent () {
    this.setData({
      showConfirm: false
    })
  },
  /**
   * 单独购买弹窗-确定
   */
  sureEvent () {
    let user = wx.getStorageSync('user');
    let goods_type;
    let Type = this.data.spellingDetial.Type;   //商品类型
    
    let payData = {
      openid: user.openid,
      customer_id: user.uid,   //商品id
      price: this.data.spellingDetial.OriginalPrice,    //单独购买的价格
      _type: Type,      //商品类型
      ProjectId: this.data.spellingDetial.ProjectId,      //
    }
    console.log(payData)
    this.setData({
      showConfirm: false,
      showPaytype: true,
      payData: payData
    })
  },
  /**微信支付成功 */
  successPay() {
    this.setData({
      showConfirm: false,
    })
  },
  /**支付失败 */
  failPay () {
    this.setData({
      failPayConfirm: true,      //显示提示框
      showConfirm: false,
    })
  },
  /**
   * 取消支付方式
   */
  cancelPay () {
    this.setData({
      showPaytype: false
    })
  },
  toCollagepage() {
    let user = wx.getStorageSync('user');
    if (user == '') {
      this.setData({
        noaccreditPhone: true
      })
      return false;
    }

    wx.navigateTo({
      // url: '../payment/payment?spellingDetial=' + JSON.stringify(this.data.spellingDetial),
      url: '../payment/payment?spellingId=' + this.data.spellingDetial.id,
    })
  },
  /**
   * 跳转到拼团页面
   */
  toCollageDetail () {
    console.log('点击去拼团');
    
  },
  /**
 * 绑定上下级
 */
  bingdRelation: function (shareUid) {
    var uid = wx.getStorageSync('user').uid;
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
    app.setTitle();
    console.log(wxUser);
    this.setData({
      noaccredit: false,
      noaccreditPhone: true,
      user: wxUser,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var wxUser = wx.getStorageSync('wxUser');     //授权信息
    var user = wx.getStorageSync('user');         //已注册用户信息
    // if (wxUser == '') {   //未授权登录
    //   this.setData({
    //     noaccredit: true
    //   });
    //   if (options && options.shareUid) {
    //     wx.setStorage({//用户未注册情况下  存到缓存
    //       key: 'shareUid',
    //       data: options.shareUid
    //     })
    //   }
    // } else {
    //   if (options && options.shareUid) {
    //     that.bingdRelation(options.shareUid);
    //   }
    //   this.setData({
    //     user: wxUser.userInfo,
    //   })
    //   if (user == '') {
    //     this.setData({
    //       noaccreditPhone: true
    //     })
    //   } else {
    //     this.setData({
    //       // user: user,
    //       noaccreditPhone: false
    //     })
    //   }
    // }
    
    let _id = options.id;    //拼团id
    that.setData({
      _id: _id
    })
    app.request({
      url: app.getApi('spelling/detail'),
      data: {
        id: _id,
        IsMinProgram: 1,
        CustomerId: user.uid ? user.uid:""
      },
      success: function (res) {
        console.log(res);
        let _data = res.detail;        //详情数据
        _data.BigPic = _data.BigPic ? _data.BigPic : "../../images/coverDefault.jpg";
        WxParse.wxParse('article', 'html', _data.Content, that, 5);   //插件，转换html标签
        let diffTime = [];
        let collageList = _data.list;
        for(let i in collageList) {
          let value = collageList[i];
          let time = value.time;    //拼团结束剩余时间，单位：秒
          diffTime[i] = setInterval(() => {
            time--;
            let str = that.countDownTime(time);
            value.time = str;
            that.setData({
              collageList: collageList
            });
            if (time < 0) {
              clearInterval(diffTime);
              value.time = '拼团结束';
              that.setData({
                collageList: collageList
              });
            }
          }, 1000);
        }
        that.setData({
          spellingDetial:_data,
          diffTime: diffTime
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**倒计时 */
  countDownTime(intDiff) {
    if (intDiff > 0) {
      let day = Math.floor(intDiff / (60 * 60 * 24));
      let hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
      let minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
      let second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;

      intDiff --;

      let str = day + '天' + hour + '时' + minute + '分' + second + '秒';
      return str;
    }else {
      console.log('计时结束');
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
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
    console.log('页面卸载');
    
    let collageList = this.data.collageList;
    let diffTime = this.data.diffTime;
    for (let i = 0; i < collageList.length; i++){
      clearInterval(diffTime[i]);
    }
    this.setData({
      diffTime: diffTime
    })
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
    let user = wx.getStorageSync('user');
    var that=this;
    console.log(user.uid);
    return {
      title: '',        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/collageDetail/collageDetail?id=' + that.data._id + '&shareUid=' + user.uid, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  }
})