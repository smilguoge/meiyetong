// pages/collageDetail/collageDetail.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')     //html转换成小程序标签模板
var canvasTem = require('../../template/canvas.js')   //canvas生成图片模板
let user = wx.getStorageSync('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaccredit: false,//未授权
    noaccreditPhone: false,    //未注册
    num: 1,    //购买数量
    isSpec: false,   //是否显示规格弹窗
    detail: '',    //详情内容
    _type: 1,      //详情类型：产品2、项目1、卡项3
    goodsid: '',     //产品id
    projectCard: [],     //项目下的卡项
    cardProject: [],     //项目下的卡项的子项目
    showPaytype: false,       //显示支付方式
    payData: {},     //微信支付需要的参数
    BASE_url: app.globalData.BASE_url,

    isCanvas: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    app.setTitle();
    let that = this;
    var user = wx.getStorageSync('user');         //已注册用户信息
    let goodsid = options.goodsid;
    let _type = options._type;
    let CardClassId = options.CardClassId;  //卡项
    let GoodId = options.GoodId;        //产品
    let ProjectId = options.ProjectId;    //项目
    if (CardClassId) {
      goodsid = CardClassId;
      _type = '3';
    } else if (GoodId) {
      goodsid = GoodId;
      _type = '2';
    } else if (ProjectId) {
      goodsid = ProjectId;
      _type = '1';
    }
    console.log(_type);
    this.setData({
      goodsid: goodsid,
      _type: _type
    })

    let _url = '';
    let param = {};
    switch (_type) {
      case '2':    //产品
        _url = app.getApi('goods/goods_detail');
        param = {
          GoodsId: goodsid,
          CustomerId: user.uid || ''
        }
        break;
      case '1':    //项目
        _url = app.getApi('project/project_detail');
        param = {
          ProjectId: goodsid,
          CustomerId: user.uid || ''
        }
        break;
      case '3':    //卡项
        _url = app.getApi('card/card_detail');
        param = {
          CardClassId: goodsid,
          CustomerId: user.uid || ''
        }
        break;
      default:
        break;
    }
    that.getDetail(param, _url);
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
   * 选择规格-立即购买也是弹窗选择规格
   */
  showSpec() {
    let that = this;
    let user = wx.getStorageSync('user');     //手机号授权登录注册后的用户信息
    if (user == '') {
      this.setData({
        noaccreditPhone: true
      })
      return false;
    }
    that.projectHasCard(that.data.goodsid, function (res) {
      if (res.length > 0) {
        that.setData({
          projectCard: res,
          isSpec: true
        })
      } else {    //没有对应的卡项
        let detail = that.data.detail;
        let isPay = detail.IsPay;     //1可以加入购物车，也可以付款；其他值“到店支付”
        if (isPay !== '1') {
          wx.showToast({
            title: '请到店支付',
            icon: 'none'
          });
          return false;
        }
        console.log(detail);
        let buyData = [{
          Id: that.data.goodsid,
          type: that.data._type,       //产品2
          quantity: that.data.num
        }];
        console.log(buyData)
        // if(that.data._type==2) {    //产品需要跳转选择地址，产品没有卡项选择

        wx.navigateTo({
          url: '../projectPayment/projectPayment?buyData=' + JSON.stringify(buyData),
        })
        // }else {     // 项目和卡项直接支付
        //   let payData = {
        //     openid: user.openid,
        //     customer_id: user.uid,   //商品id
        //     price: that.data.detail.OriginalPrice,    //单独购买的价格
        //     _type: that.data._type,      //商品类型
        //     ProjectId: that.data.detail.ProjectId,      //
        //   }
        //   that.setData({
        //     showConfirm: false,
        //     showPaytype: true,
        //     payData: payData
        //   })
        // }

      }

    });
  },
  /**
   * 加入购物车
   */
  addTocart() {
    // 加入购物车需要判断项目的大类是否可以直接购买
    let that = this;
    let user = wx.getStorageSync('user');     //手机号授权登录注册后的用户信息
    if (user == '') {
      this.setData({
        noaccreditPhone: true
      })
      return false;
    }
    let detail = that.data.detail;
    let isPay = detail.IsPay;     //1可以加入购物车，也可以付款；其他值“到店支付”
    if (isPay !== '1') {
      wx.showToast({
        title: '请到店支付',
        icon: 'none'
      });
      return false;
    }
    console.log(that.data.detail);
    let cardParam = {   // 加入购物车
      goods_id: that.data.goodsid,
      type: that.data._type,
      quantity: that.data.num,
      customer_id: user.uid
    }
    app.request({
      url: app.getApi('Shopping_Cart/add_card'),
      data: cardParam,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '已添加购物车，请前往购物车结算',
          icon: 'none'
        });
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 关闭规格弹窗
   */
  closeSpec() {
    this.setData({
      isSpec: false
    })
  },
  /**
   * 产品、项目详情
   */
  getDetail(param, _url) {
    let that = this;
    app.request({
      url: _url,
      data: param,
      success: function (res) {
        console.log(res);
        let detail = res.detail || res.list;
        let _type = that.data._type;
        if (_type == 2 || _type == 3) {    //产品2   //卡项3
          detail.pic = detail.pic ? detail.pic : "../../images/coverDefault.jpg";
        } else if (_type == 1) {   //项目
          detail.cover = detail.cover ? detail.cover : "../../images/coverDefault.jpg";
        }

        let goodsDetail = detail.Detail || detail.content;
        if (goodsDetail) {
          WxParse.wxParse('article', 'html', goodsDetail, that, 5);   //插件，转换html标签
        }

        that.setData({
          detail: detail
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 判断项目 是否有卡项
   */
  projectHasCard(ProjectId, callback) {
    let that = this;
    let param = {
      ProjectId: ProjectId
    }
    app.request({
      url: app.getApi('project/project_has_card'),
      data: param,
      success: function (res) {
        console.log(res);
        let projectCard = res.list;
        // return projectCard;
        callback(projectCard)
        // that.setData({
        //   projectCard: projectCard
        // })
      },
      fail: function (error) {
        console.log(error);
      }
    })
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
    let user = wx.getStorageSync('user');
    let goodsid = this.data.goodsid;
    let _type = this.data._type;
    console.log(goodsid);
    console.log(_type);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '',        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/projectDetail/projectDetail?shareUid=' + user.uid+'&goodsid=' + goodsid + '&_type=' + _type,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  }
})