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
    buyData: [{
      id: '',
      type: '',
      quantity: 1
    }],   //购买的数据
    detailList: [],      //商品类表
    hasGoods: false,         //是否包含产品，有产品则需要配送地址选择
    BASE_url: app.globalData.BASE_url
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
    let user = wx.getStorageSync('user');

    // 需请求接口获取以下字段参数
    let spellingDetial = this.data.spellingDetial;
    let that = this;
    let detailList = that.data.detailList;
    let money = detailList.moneyTotal < 0.01 ? 0.01 : detailList.moneyTotal;
    let payParam = {
      openid: user.openid,      //用户openid
      customer_id: user.uid,    //用户id
      buyData: that.data.buyData,   //购买的数据集合
      IsMinProgram: 1,    //小程序支付的特殊字段
      shipping_status: that.data.shipping_status,      //0的话是门店自取 1的时候是门店配送 
      address_id: that.data.address_id,     //选择地址配送
      shop_id: that.data.shop_id,       //选择门店自取
      total_amount: money,    //总金额
    }
    if (payParam.shipping_status == 0) {
      //0的话是门店自取 1的时候是门店配送 
      payParam.shop_id = that.data.shop_id;
      payParam.address_id = '';
    } else {
      payParam.address_id = that.data.address_id
      payParam.shop_id = '';
    }
    if (that.data.shipping_status == 1 && that.data.address_id == '') {
      wx.showToast({
        title: '您还没有设置收货地址，请前往设置!',
        icon: 'none'
      })
      return;
    }
    app.request({
      url: app.getApi('Wxpay/pay'),
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

            let _jsonData = {
              // access_token: _access_token,
              openid: user.openid,
              template_id: 'QWXCWbNFZwNfRSoLPG984vF7sKHTW23OzlILoJcljt8',
              formid: prepay_id,
              page: "",
              // spelling_name: spellingDetial.ProjectName + '拼团成功',
              customer_name: user.Name,
              price: detailList.moneyTotal
            }
            wx.request({
              url: app.getApi('message/MinSendPintuanSuccess'),
              data: _jsonData,
              success: function (res) {
                // wx.switchTab({      //跳转到“我的”页面
                //   url: '../mine/mine',
                // })
              },
              fail: function (err) {
                console.log('request fail ', err);
              }
            })
            wx.showModal({
              content: '是否立即前往预约',//提示文字
              showCancel: true,//是否显示取消按钮
              mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false
              confirmColor: 'skyblue',//确定文字的颜色
              success: function (res) {
                console.log(res);
                if (res.errMsg == "showModal:ok") {
                  //- 表示点击确认
                  wx.switchTab({      //跳转到“预约”页面
                    url: '../appointment/appointment',
                  })
                } else {
                  //- 表示点击取消
                  wx.switchTab({      //跳转到“我的”页面
                    url: '../mine/mine',
                  })
                }

              },//接口调用成功
              fail: function () { },//接口调用失败的回调函数
              complete: function () { } //接口调用结束的回调函数
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
  onLoad: function (options) {      //产品需要选择配送地址
    app.setTitle();
    let that = this;
    console.log(options);
    let user = wx.getStorageSync('user');
    let buyData = options.buyData;

    let dataParam = {
      customer_id: user.uid,
      buyData: buyData,
      AddressId: ''
    }
    app.request({
      // url: app.getApi('Order/submit_order_detail'),
      url: 'https://xmzxsc.meiyetongsoft.com/index.php/min_api/Order/submit_order_detail', 
      data: dataParam,
      success: function (res) {
        console.log(res);
        let list = res.list;
        let hasGoods = false;
        list.forEach(value => {
          if (value.type == 2 || value.type == '2') {
            hasGoods = true;
          }
        })
        that.setData({
          detailList: res,
          hasGoods: hasGoods
        })
      },
      fail: function (error) {
        wx.showToast({
          title: error.msg,
          icon: 'none',
          success: function () {
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