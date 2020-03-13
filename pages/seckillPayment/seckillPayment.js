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
    failPayConfirm: false,
    shipping_status: 0,      //0的话是门店自取 1的时候是门店配送 
    address_id: '',          //选择地址配送
    shop_id: '',              //门店id
    buyData: '',   //购买的数据
    detailList:[],      //商品类表
    num: '',//- 单次购买数量
    BASE_url: app.globalData.BASE_url,
    orderid: '',//- 订单id
  },
  /**
   * 配送方式改变 
   */
  typeChange(e) {
    console.log(e.detail);
    let typeVal = e.detail.value;
    let isGetbyself;
    let shipping_status = 0;     //0的话是门店自取 1的时候是门店配送 
    if (typeVal == "门店配送") {
      isGetbyself = true;
      shipping_status = 1;
      this.getAddressDef();   //获取默认地址
    } else if (typeVal == "到店自提") {
      isGetbyself = false;
      shipping_status = 0;
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
      data: {},
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
    wx.showToast({
      title: '支付请求中....',
      icon: 'none',
      duration: 10000,
      mask: true
    })
    let that = this;
    let user = wx.getStorageSync('user');
    let buyData = that.data.buyData;
    let detailList = that.data.detailList;
    let shipping_status = that.data.shipping_status;
    let moneyTotal = parseFloat(detailList.Price) * parseInt(that.data.num);
    

    // 需请求接口获取以下字段参数
    let payParam = {
      openid: user.openid,
      customer_id: user.uid,
      quantity: that.data.num,
      price: detailList.Price,
      sub_activity_id: buyData.seckillid,
      shipping_status: shipping_status,
      shop_id: '',
      address_id: '',
      goods_id: '',
      CardClassId: '',
      order_id: that.data.orderid
    }
    console.log(detailList);
    if (detailList.Type == 3 || detailList.Type == '3'){
      //- 产品
      payParam.goods_id = buyData.Id;
    } else if (detailList.Type == 1 || detailList.Type == '1'){
      //- 卡项
      payParam.CardClassId = buyData.Id;
    }

    if (shipping_status == 0){
      //0的话是门店自取 1的时候是门店配送 
      payParam.shop_id = that.data.shop_id;
      payParam.address_id = '';
    }else{
      payParam.address_id = that.data.address_id
      payParam.shop_id = '';
    }
    if (that.data.shipping_status == "1" && that.data.address_id == '') {
      wx.hideToast();
      wx.showToast({
        title: '您还没有设置收货地址，请前往设置!',
        icon: 'none'
      })
      return;
    }
    payParam.IsMinProgram=1;
    payParam.weid = app.globalData.userAppid;
    app.request({
      url: app.getApi('Wxpay/activity_pay'),
      data: payParam,
      success: function (res) {
        console.log(res);
        // console.log(res.jsApiParameters.package);
        let prepay_id = res.jsApiParameters.package.split("=")[1];
        console.log(prepay_id);
        // 微信支付接口
        wx.requestPayment({
          timeStamp: res.jsApiParameters.timeStamp,
          nonceStr: res.jsApiParameters.nonceStr,
          package: res.jsApiParameters.package,
          signType: res.jsApiParameters.signType,
          paySign: res.jsApiParameters.paySign,
        
          success: function (res) {    //支付成功
            wx.hideToast();
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              success: function(){
                //- 跳转'我的'页面
                wx.switchTab({
                  url: '../mine/mine',
                })

              }
            })
          },
          fail: function (error) {   //支付失败
            console.log(error);
            wx.hideToast();
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
   * 是否可以进行支付
   */
  whetherpay() {
    let that = this;
    let user = wx.getStorageSync('user');
    let buyData = that.data.buyData;
    let detailList = that.data.detailList;
    app.request({
      url: app.getApi('order/settlement_activity_detail'),
      data: {
        customer_id: user.uid,
        AddressId: that.data.address_id,
        quantity: that.data.num,
        goods_id: buyData.Id,
        price: detailList.Price,
        sub_activity_id: buyData.seckillid
      },
      success: function (res) {
        that.wxpayment();
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {      //产品需要选择配送地址
    app.setTitle();
    console.log(options);
    let that = this;
    let user = wx.getStorageSync('user');
    let buyData = wx.getStorageSync('buyData');
    let uid = user.uid;
    if (buyData.orderid) {
      this.setData({
        orderid: buyData.orderid
      })
    }
    app.request({
      url: app.getApi('Activity/goods_activity_detail'),
      data: {
        CustomerId: uid,
        id: parseInt(buyData.seckillid)
      },
      success: function (res) {
        let list = res.list;

        console.log(res);
        that.setData({
          detailList: list,
          num: buyData.quantity,
        })
        console.log(that.data.detailList)
      },
      fail: function (error) {
        wx.showToast({
          title: error.msg,
          icon: 'none',
          success:function(){
            //- 错误
            console.log("错误");
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    });
    that.setData({
      buyData: buyData
    })

    this.getShopList();   //请求门店列表

    // 缓存中获取地址goodsAddr，有存在则表示从地址列表中选择地址
    // 页面卸载的时候把对应的地址缓存clear
    let goodsAddr = wx.getStorageSync('goodsAddr');
    console.log(goodsAddr);
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
    let buyData = wx.getStorageSync('buyData');
    if (buyData.orderid){
      this.setData({
        orderid: buyData.orderid
      })
    }
    // 缓存中获取地址goodsAddr，有存在则表示从地址列表中选择地址
    // 页面卸载的时候把对应的地址缓存clear
    let goodsAddr = wx.getStorageSync('goodsAddr');
    console.log(goodsAddr);
    if (goodsAddr) {
      this.setData({
        addressDef: goodsAddr,
        address_id: goodsAddr.Id,
        noAddr: false,
      })
    }
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
    wx.removeStorage({
      key: 'goodsAddr',
      success(res) {
        console.log(res.data)
      }
    })
    wx.removeStorage({
      key: 'buyData',
      success(res) {
        console.log(res.data)
      }
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
    return (app.share());
  }
})