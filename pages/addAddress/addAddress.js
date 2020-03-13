// pages/addAddress/addAddress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:{
      Name: '',
      Phone: '',
      CustomerId: '',
      Area: '',
      Address: '',
      State: 1,
      Id:'',    //修改地址时 传地址id
      Province: '',
      City: '',
    },
    region:['选择地区','',''],
  },
  /**联系人,确认或者失去焦点的时候触发 */
  addressName (e) {
    let addressInfo = this.data.addressInfo;
    addressInfo.Name = e.detail.value;
    this.setData({
      addressInfo: addressInfo
    })
  },
  /**手机号码,确认或者失去焦点的时候触发 */
  addressPhone(e) {
    let addressInfo = this.data.addressInfo;
    addressInfo.Phone = e.detail.value;
    this.setData({
      addressInfo: addressInfo
    })
  },
  /**详情地址,确认或者失去焦点的时候触发 */
  addressCont(e) {
    let addressInfo = this.data.addressInfo;
    addressInfo.Address = e.detail.value;
    this.setData({
      addressInfo: addressInfo
    })
  },
  /**
   * 选择省市区
   */
  bindRegionChange (e) {
    console.log(e);
    let region = e.detail.value;
    let addressInfo = this.data.addressInfo;
    addressInfo.Province = region[0];
    addressInfo.City = region[1];
    addressInfo.Area = region[2];

    this.setData({
      region: region,
      addressInfo: addressInfo
    })
  },
  /**
   * 设置是否默认
   */
  isStateChange (e) {
    console.log(e);
    let addressInfo = this.data.addressInfo;
    addressInfo.State = e.detail.value ? 0 : 1;
    console.log(addressInfo.State);
    this.setData({
      addressInfo: addressInfo
    })
  },
  /**
   * 保存
   */
  saveEvent() {
    let that = this;
    let user = wx.getStorageSync('user');
    let addressInfo = this.data.addressInfo;
    addressInfo.CustomerId = user.uid;
    console.log(addressInfo);
    console.log(addressInfo.State);
    for (let value in addressInfo) {
      if (addressInfo[value] == '') {   //当对象值为空
        console.log(value);
        if (value == "Id" || value == "State") {}else{
          wx.showToast({
            title: '请完整填写地址信息',
            icon:'none',
          });
          return false;
        }
        
      }
    }
    app.request({
      url: app.getApi('Goods/address'),
      data: addressInfo,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '地址设置成功',
          icon:'none'
        });
        wx.navigateBack({})
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
    let item = options.item;
    let user = wx.getStorageSync('user');
    console.log(typeof (item));
    if (typeof (item) == undefined || typeof (item) == 'undefined'){
      console.log(1);
      let CustomerId = user.uid;
      let addressInfo = this.data.addressInfo;
      addressInfo.CustomerId = CustomerId;
      this.setData({
        addressInfo: addressInfo
      })
    }else{
      console.log(options);
      this.setData({
        addressInfo: JSON.parse(options.item),
        region: [JSON.parse(options.item).Province, JSON.parse(options.item).City, JSON.parse(options.item).Area]
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