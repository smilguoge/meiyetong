// pages/collageDetail/collageDetail.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')     //html转换成小程序标签模板
var canvasTem = require('../../template/canvas.js')   //canvas生成图片模板
let user = wx.getStorageSync('user');
var wxUser = wx.getStorageSync('wxUser');     //授权信息
let _Detailtime = 0;//- 记录倒计时定时器时间
let timeDetailFun = null;//- 记录倒计时定时器方法
let linshi_id = '';//- 临时保存商品id
let linshi_seckillid = '';//- 临时秒杀id

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    noaccredit: false,//未授权
    noaccreditPhone: false,    //未注册
    num: 1,    //购买数量
    detail: '',    //详情内容
    BASE_url: app.globalData.BASE_url,
    id: '',//- 卡项或者产品id
    seckillid: '',//- 砍价id
    status: '',//- 活动状态
    isCanvas: false,
    day: '',//- 天
    hour: '',//- 小时
    minute: '',//- 分钟
    second: '',//- 秒

  },

  /**获取手机号授权成功 */
  loginPhone(e) {
    this.setData({
      noaccreditPhone: false,
      user: e.detail
    })
    //刷新页面
    this.onLoad({
      GoodId: linshi_seckillid,
      seckillId: linshi_seckillid
    });
  },
  
  /**获取授权成功 */
  login() {
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
    console.log(options);
    app.setTitle();
    let that = this;
    var user = wx.getStorageSync('user');         //已注册用户信息

    this.setData({
      user: user,
    })
    app.showToast({
      title: '加载中',//提示文字
      icon: 'loading', //图标，支持"success"、"loading"   
    })
    linshi_id = options.GoodId;
    linshi_seckillid = options.seckillId;

    that.setData({
      id: options.GoodId,
      seckillid: options.seckillId,
      uid: user.uid
    })
    that.judge();

    if (options && options.shareUid) {
      wx.setStorage({//用户未注册情况下  存到缓存
        key: 'shareUid',
        data: options.shareUid
      });
      that.bingdRelation(options.shareUid);
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
  onShow: function (options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 隐藏canvas层
   */
  closeCanvas() {
    this.setData({
      isCanvas: false,
    })
  },
  /**
   * 显示canvas层
   */
  showCanvas() {
    canvasTem.showCanvas(this.data.detail, this);
  },
  /**
   * 长按 canvas生成图片
   */
  canvas2img(e) {
    canvasTem.canvas2img();
  },

  /**
   * 输入购买数量
   */
  inputNum(e) {
    console.log(e);
    let value = e.detail.value;
    if (value < 1) {
      value = 1;
    }
    this.setData({
      num: value
    })
  },
  /**
   * 数量减少
   */
  minusNum() {
    let that = this;
    let num = that.data.num;
    if (num < 2) { } else {
      num--;
      that.setData({
        num: num
      })
    }

  },
  /**
   * 数量增加
   */
  addNum() {
    let that = this;
    let num = that.data.num;
    num++;
    that.setData({
      num: num
    })
  },
  /**
   * 卡项，产品秒杀前往秒杀支付页
   */
  goPage() {
    let that = this;
    let buyData = {
      seckillid: that.data.seckillid,
      Id: that.data.id,       //产品2
      quantity: that.data.num
    };
    wx.setStorage({
      key: 'buyData',
      data: buyData,
    })
    wx.navigateTo({
      url: '../seckillPayment/seckillPayment',
    })

  },

  /**
   * 产品、卡项详情
   */
  getDetail(param, _url) {
    let that = this;
    app.request({
      url: app.getApi('Activity/goods_activity_detail'),
      data: {
        id: that.data.seckillid,
        CustomerId: that.data.uid
      },
      success: function (res) {
        app.hideToast();
        let data = res.list.PtContent;
        if (data) {
          console.log(data);
          WxParse.wxParse('article', 'html', data, that, 5);   //插件，转换html标签
        }
        that.setData({
          detail: res.list,
          id: res.list.ProjectId
        })
        let _Detailtime = res.list.remain_time;//-秒
        timeDetailFun = setInterval(function () {
          _Detailtime--;
          that.count(_Detailtime);
        }, 1000);
      },
      fail: function (error) {
        app.hideToast();
        console.log(error);
      }
    })
  },
  /**
   * 判断是否超过活动时间
   */
  judge() {
    let that = this;
    app.request({
      url: app.getApi('activity/goods_activity_time'),
      data: {
        id: that.data.seckillid
      },
      success: function (res) {
        let _sta = res.list.sta;
        if (_sta == 0) {
          //- 秒杀中
          that.getDetail();
        } else if (_sta == -1 || _sta == 1) {
          app.hideToast();
          //- 秒杀结束或即将开始
          wx.showToast({
            title: '秒杀已经结束',//提示文字
            duration: 1500,//显示时长
            mask: true,//是否显示透明蒙层，防止触摸穿透，默认：true
            icon: 'none', //图标，支持"success"、"loading"
            success: function () {
              wx.redirectTo({
                url: '../seckillList/seckillList'
              })
            }
          })
        }
        that.setData({
          status: _sta
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 倒计时计算
   */
  count: function (time) {
    let that = this;
    let d,
      h,
      m,
      s;
    //定义变量 d,h,m,s保存倒计时的时间  
    if (time >= 0) {
      d = Math.floor(time / 60 / 60 / 24); //- 日
      h = Math.floor(time / 60 / 60 % 24); //- 时  
      m = Math.floor(time / 60 % 60);    //- 分  
      s = Math.floor(time % 60);      //- 秒
    } else {
      clearInterval(timeDetailFun);
    }
    //将0-9的数字前面加上0，例1变为01
    d = checkTime(d);
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }
    that.setData({
      day: d,
      hour: h,
      minute: m,
      second: s
    })
    //递归每秒调用countTime方法，显示动态时间效果
    time--;
  },

  /**
 * 绑定上下级
 */
  bingdRelation: function (shareUid) {
    console.log(shareUid)
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('login/updateIntroducer'),
      data: { superiorid: shareUid, Id: uid },
      sync: true,
      success: function (data) {

      },
      fail: function (error) {
        console.log(error.msg);
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('页面卸载');
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
  onShareAppMessage: function (res) {
    // let user = wx.getStorageSync('user');
    // let goodsid = this.data.goodsid;
    // let _type = this.data._type;
    // console.log(goodsid);
    // console.log(_type);
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // return {
    //   title: '',        // 默认是小程序的名称(可以写slogan等)
    //   path: '/pages/projectDetail/projectDetail?shareUid=' + user.uid + '&goodsid=' + goodsid + '&_type=' + _type,        // 默认是当前页面，必须是以‘/’开头的完整路径
    //   imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    // }
  }
})