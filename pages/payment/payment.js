// pages/payment/payment.js
const app = getApp();
let user = wx.getStorageSync('user');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noAddr: false,
    addressDef: '',    //默认地址
    shoplist: [],    //提取门店列表
    index: 0,    //选择的门店序号
    isGetbyself: false,     //是否到店自提
    spellingDetial: '',      //拼团详情信息
    failPayConfirm: false,
    customer_spelling_id: '',      //团长id
    shipping_status: 0,      //0的话是门店自取 1的时候是门店配送 
    address_id: '',          //选择地址配送
    shop_id: '',              //门店id
    order_sn: '',      //订单号
  },
  /**
   * 配送方式改变 
   */
  typeChange(e) {
    let typeVal = e.detail.value;
    let isGetbyself;
    let shipping_status = 0;     //0的话是门店自取 1的时候是门店配送 
    if (typeVal == "门店配送") {
      isGetbyself = true;
      shipping_status = 1;
      this.getAddressDef();   //获取默认地址
    } else if (typeVal == "到店自提") {
      shipping_status = 0;
      isGetbyself = false
    }
    this.setData({
      isGetbyself: isGetbyself,
      shipping_status: shipping_status
    })
  },
  /**
   * 获取默认地址
   */
  getAddressDef() {
    let that = this;
    let user = wx.getStorageSync('user');
    let param = {
      CustomerId: user.uid,
      State: '0'
    }
    app.request({
      url: app.getApi('Goods/addressListOne'),
      data: param,
      success: function (res) {
        if (res == '') {
          that.setData({
            noAddr: true
          })
        } else {
          that.setData({
            addressDef: res,
            noAddr: false,
            address_id: res.Id
          })
        }

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 跳转地址管理页面
   */
  toAddresslist() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  /**
   * 获取门店列表
   */
  getShopList() {
    let that = this;
    app.request({
      url: app.getApi('Appointment/get_shop_list'),
      data: '',
      success: function (res) {
        that.setData({
          shoplist: res.list,
          shop_id: res.list[0].id     //门店id
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 提取门店选择
   */
  shopChange(e) {
    let idx = e.detail.value;
    this.setData({
      index: idx,
      shop_id: this.data.shoplist[idx].id     //门店id
    })
  },
  /**
   * 订单支付 
   */
  wxpayment() {
    // 需请求接口获取以下字段参数
    let spellingDetial = this.data.spellingDetial;
    let user = wx.getStorageSync("user");
    let that = this;
    var payParam = '';
    switch (spellingDetial.Type) {//CardClassId卡项1  project_id项目2 goods_id产品3
      case '1':
        payParam = {
          openid: user.openid,      //用户openid
          customer_id: user.uid,    //用户id
          quantity: 1,   //购买数量，1
          price: spellingDetial.Price,     //价格
          CardClassId: spellingDetial.ProjectId,//CardClassId卡项  project_id项目 goods_id产品
          IsMinProgram: 1,
          spelling_id: spellingDetial.id,
          customer_spelling_id: that.data.customer_spelling_id,
          order_sn: that.data.order_sn,
        }
        break;
      case '2':
        payParam = {
          openid: user.openid,      //用户openid
          customer_id: user.uid,    //商品id
          quantity: 1,   //购买数量，1
          price: spellingDetial.Price,     //价格
          project_id: spellingDetial.ProjectId,//CardClassId卡项  project_id项目 goods_id产品
          IsMinProgram: 1,
          spelling_id: spellingDetial.id,
          customer_spelling_id: that.data.customer_spelling_id,
          order_sn: that.data.order_sn,
        }
        break;
      case '3':
        payParam = {
          openid: user.openid,      //用户openid
          customer_id: user.uid,    //用户id
          quantity: 1,   //购买数量，1
          price: spellingDetial.Price,     //价格
          goods_id: spellingDetial.ProjectId,//CardClassId卡项  project_id项目 goods_id产品
          IsMinProgram: 1,
          spelling_id: spellingDetial.id,
          customer_spelling_id: that.data.customer_spelling_id,
          shipping_status: that.data.shipping_status,      //0的话是门店自取 1的时候是门店配送 
          address_id: that.data.address_id,     //选择地址配送
          shop_id: that.data.shop_id,       //选择门店自取
          order_sn: that.data.order_sn,
        }
        if (payParam.shipping_status == 0) {
          //0的话是门店自取 1的时候是门店配送 
          payParam.shop_id = that.data.shop_id;
          payParam.address_id = '';
        } else {
          payParam.address_id = that.data.address_id
          payParam.shop_id = '';
        }
        break;
      default:
        console.log('2')
        break;
    }
    if (spellingDetial.Type == '3' && payParam.shipping_status == 1 && payParam.address_id == '') {
      wx.showToast({
        title: '您还没有设置收货地址，请前往设置!',
        icon: 'none'
      })
      return;
    }
    app.request({
      url: app.getApi('Wxpay/pintuan_pay'),
      data: payParam,
      success: function (res) {
        let order_sn = that.data.order_sn || res.order_sn;    //订单号
        console.log(res.jsApiParameters.package);
        let prepay_id = res.jsApiParameters.package.split("=")[1];
        console.log(payParam);
        // 微信支付接口
        wx.requestPayment({
          timeStamp: res.jsApiParameters.timeStamp,
          nonceStr: res.jsApiParameters.nonceStr,
          package: res.jsApiParameters.package,
          signType: res.jsApiParameters.signType,
          paySign: res.jsApiParameters.paySign,
          success: function (res) {    //支付成功

            // 开团或参团  消息推送
            let _jsonData = {
              openid: user.openid,
              // template_id: 'QWXCWbNFZwNfRSoLPG984vF7sKHTW23OzlILoJcljt8',
              formid: prepay_id,
              page: "",
              spelling_name: spellingDetial.Name,
              project_name: spellingDetial.ProjectName,
              price: spellingDetial.Price,
              OriginalPrice: spellingDetial.OriginalPrice,
              endtime: spellingDetial.EndTime,
              order_sn: order_sn,
              number: spellingDetial.Number,
              weid: app.globalData.userAppid
            }
            wx.request({
              url: app.getApi('message/MinSendPintuanSuccess'),
              data: _jsonData,
              success: function (res) {
                console.log(res)
                wx.navigateTo({            //跳转到分享页面
                  url: '../../pages/collagePage/collagePage?order_sn=' + order_sn,
                })
              },
              fail: function (err) {
                console.log('request fail ', err);
              }
            })

          },
          fail: function (error) {   //支付失败
            console.log(error);
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    // let spellingDetial = JSON.parse(options.spellingDetial);
    let spellingId = options.spellingId;    //拼团id
    let customer_spelling_id = options.customer_spelling_id ? options.customer_spelling_id : '';    //团长id
    let order_sn = options.order_sn ? options.order_sn : '';     //订单号

    app.request({
      url: app.getApi('spelling/detail'),
      data: {
        id: spellingId,
        IsMinProgram: 1,
        CustomerId: user.uid ? user.uid : ""
      },
      success: function (res) {
        let _data = res.detail;        //详情数据
        _data.BigPic = _data.BigPic ? _data.BigPic : "../../images/coverDefault.jpg";
        _data.Cover = _data.Cover ? _data.Cover : "../../images/coverDefault.jpg";
        that.setData({
          spellingDetial: _data,
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })

    this.setData({
      customer_spelling_id: customer_spelling_id,
      order_sn: order_sn
    })
    this.getShopList();   //请求门店列表


    // 缓存中获取地址goodsAddr，有存在则表示从地址列表中选择地址
    // 页面卸载的时候把对应的地址缓存clear
    let goodsAddr = wx.getStorageSync('goodsAddr');
    if (goodsAddr) {
      this.setData({
        addressDef: goodsAddr
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
    wx.removeStorage('goodsAddr');      //从本地缓存中移除key=goodsAddr
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