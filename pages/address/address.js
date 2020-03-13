// pages/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noneAddrlist:false,
    addresslist:[],       //地址列表
    startX:0,
    startY:0,
    isInfinity:false,
    delIndex:0,
    isDelete:false,
    isGoodsIn:false,      //是否从产品页面进入
  },
  /**
   * 滑动开始
   */
  addrTouchstart(event) {
    let pageX = event.touches[0].pageX;
    let pageY = event.touches[0].pageY;
    this.setData({
      startX: pageX,
      startY: pageY
    });
  },
  /**
   * 滑动结束
   */
  addrTouchend (event) {
    console.log(event)
    let delIndex = event.currentTarget.dataset.index;
    let endX = event.changedTouches[0].pageX;
    let endY = event.changedTouches[0].pageY;
    let startX = this.data.startX;
    let startY = this.data.startY;
    console.log(startY + ',' + endY);
    if (endY > (startY + 20) || endY < (startY-20)) {
      return false;
    }else{
      //- 显示删除
      if (startX > endX + 30) {
        this.setData({
          isInfinity: true,
          delIndex: delIndex
        })
      } else {
        //-隐藏删除
        this.setData({
          isInfinity: false,
          delIndex: delIndex
        })
      }
    }
    
  },
  /**
   * 删除按钮事件
   */
  deleteEvent () {
    this.setData({
      isDelete:true
    })
  },
  /**
   * 删除弹窗回调事件
   */
  sureEvent() {
    let that = this;
    let user = wx.getStorageSync('user');
    let delIndex = this.data.delIndex;    //删除的列表序号
    let addresslist = this.data.addresslist;      //所有地址列表
    let delAddr = addresslist[delIndex];        //要删除的地址数据
    app.request({
      url: app.getApi('Goods/deleteAddress'),
      data: {
        Id:delAddr.Id,
        State: delAddr.State,
        CustomerId: user.uid
      },
      success: function (res) {
        addresslist.splice(delIndex,1);
        that.setData({
          addresslist: addresslist
        })
        wx.showToast({
          title: '删除成功',
          icon:'none'
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
    this.setData({
      isDelete:false
    })
  },
  cancelEvent () {
    this.setData({
      isDelete: false
    })
  },
  /**跳转到编辑地址 */
  editAddress(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../addAddress/addAddress?item=' + JSON.stringify(item),
    })
  },
  /**获取地址列表 */
  getAddresslist () {
    let user = wx.getStorageSync('user');
    let that = this;
    let param = {
      CustomerId: user.uid     //用户id
    }
    app.request({
      url: app.getApi('Goods/addressList'),
      data: param,
      success: function (res) {
        that.setData({
          addresslist: res
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 点击单项返回产品页面
   */
  backtoPayment (e) {
    let isGoodsIn = this.data.isGoodsIn;
    console.log(this.data)
    if (isGoodsIn) {
      let idx = e.currentTarget.dataset.index;
      let addresslist = this.data.addresslist;
      wx.setStorageSync('goodsAddr', addresslist[idx]);
      wx.navigateBack({
        success:function(res) {
          console.log(res);
          
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    this.getAddresslist();    //获取地址列表
    var pages = getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2];//上一页面指针
    let prepageName = prepage.route;
    if (prepageName == 'pages/payment/payment' || prepageName == 'pages/projectPayment/projectPayment' || prepageName == 'pages/seckillPayment/seckillPayment'){
      console.log('产品页面进入');
      this.setData({
        isGoodsIn:true
      })
    }
  },
  /**
   * 跳转添加新地址
   */
  addAddress () {
    wx.navigateTo({
      url: '../addAddress/addAddress',
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
    this.getAddresslist();
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