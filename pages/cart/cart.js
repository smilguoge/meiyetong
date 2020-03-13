// pages/cart/cart.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaccredit: false,//- 微信授权
    noaccreditPhone: false,//- 电话授权
    noaccreditshop: false,//- 门店授权
    user:'',
    isChoose:false,
    isEdit:true,      //显示 编辑
    pageNo:1,   //页码
    cartlist:[],      //数据列表
    acount_num:0,   //结算数量
    account:0,      //结算金额
    total:0,      //总数量
    isChooseAll:false,    //是否全选
    BASE_url: app.globalData.BASE_url,
    wxcode: '',//- 微信code
  },
  /**
   * 获取用户微信code
   */
  getCode: function (callback) {
    let that = this;
    let wxcode;
    wx.login({
      success: function (res) {
        wxcode = res.code;
        that.setData({
          wxcode: wxcode
        })
        callback && callback();
      }
    });

  },
  /**获取授权成功 */
  login() {
    var that = this;
    var user = wx.getStorageSync('user');
    if (user.telphone && user.shopid) {
      //- 说明已经注册过
      that.onLoad();
    } else {
      if (!user.telphone) {
        //- 说明没有电话
        that.setData({
          noaccreditPhone: true,
        })
      }

      if (!user.shopid) {
        //- 说明没有门店
        that.setData({
          noaccreditshop: true,
        })
      }

      that.setData({
        noaccredit: false
      })
    }
  },
  /**获取手机号授权成功 */
  loginPhone(e) {
    this.setData({
      noaccredit: false,
      noaccreditPhone: false,
    })
  },
  /**获取门店授权成功 */
  loginshop(e) {
    this.onLoad();

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    // console.log('options',options);
    var user = wx.getStorageSync('user');         //已注册用户信息
    var that = this;
    var error = 0;//- 授权是否正常：0正常，1不正常
    //- 以下判断用户数据是否注册
    if (user == '') {   //未授权登录过
      console.log("用户未注册");
      that.setData({
        noaccredit: true,
        noaccreditPhone: true,
        noaccreditshop: true,
      })
      return;
    }else{
      that.setData({
        noaccredit: false,
        noaccreditPhone: false,
        noaccreditshop: false,
      })
      if (user.telphone == undefined || !user.telphone || user.telphone == '') {
        //- 说明没有电话
        console.log("电话未授权");
        that.setData({
          noaccredit: true,
          noaccreditPhone: true,
        })
        error = 1;
      }

      if (user.shopid == undefined || !user.shopid || user.shopid == '') {
        //- 说明没有门店
        console.log("门店未授权");
        that.setData({
          noaccredit: true,
          noaccreditshop: true,
        })
        error = 1;
      }

    }
    //- 判断用户是否为实时用户
    that.getCode(function () {
      console.log(5)
      var user = wx.getStorageSync('user');
      let wxcode = that.data.wxcode;
      app.request({
        url: app.getApi('auth_Login/checkUserByCode'),
        data: {
          user_id: user.uid
        },
        success: function (res) {
          //- 以下授权登录过
          console.log(2)
          
          if (error == 1) {
            //- 代表授权数据异常需要重新执行
            return;
          } else {
            that.setData({
              //- 用户数据保存
              user: user,
            })
          }

          that.getCartlist();
        },
        fail: function (res) {
          // app.hint(res.msg);
          //- 没有注册过
          app.showToast({
            title: res.msg,//提示文字
            icon: 'none', //图标，支持"success"、"loading"  
            duration: 1500,
            success: function () {
              console.log(user);
              wx.removeStorageSync('user');
              that.onLoad();
            }
          })
        }
      });
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
    this.onLoad();
  },

  /**点击 编辑-显示 删除 完成 */
  editEvent() {
    this.setData({
      isEdit: false
    })
  },
  /**点击  完成-显示 编辑 */
  editHandle() {
    this.setData({
      isEdit: true
    })
  },
  /**
   * 选择选项图标 
   */
  chooseIcon(e) {
    let cartlist = this.data.cartlist;
    let idx = e.currentTarget.dataset.index;
    let ischoose = cartlist[idx].isChoose;
    cartlist[idx].isChoose = !ischoose;
    this.setData({
      cartlist: cartlist
    })
    this.chooseAccountTotal();    //处理已选项，个数和合计金额
  },
  /**减 */
  minusNum(e) {
    let idx = e.currentTarget.dataset.index;
    let cartlist = this.data.cartlist;
    let quantity = cartlist[idx].quantity;   //获取当前数据项的数量
    if (quantity <= 1) {
      quantity = 1;
    } else {
      quantity--;
    }
    cartlist[idx].quantity = quantity;
    this.setData({
      cartlist: cartlist
    })
    this.chooseAccountTotal();    //处理已选项，个数和合计金额
  },
  /**加 */
  addNum(e) {
    let idx = e.currentTarget.dataset.index;
    let cartlist = this.data.cartlist;
    let quantity = cartlist[idx].quantity;   //获取当前数据项的数量
    // if (quantity <= 1) {
    //   quantity = 1;
    // } else {
    quantity++;
    // }
    cartlist[idx].quantity = quantity;
    this.setData({
      cartlist: cartlist
    })
    this.chooseAccountTotal();    //处理已选项，个数和合计金额
  },
  /**输入，失去焦点的时候 */
  iptNum(e) {
    let idx = e.currentTarget.dataset.index;
    let cartlist = this.data.cartlist;
    let value = e.detail.value;   //输入的值
    if (value < 1) {
      value = 1;
    }
    cartlist[idx].quantity = value;
    this.setData({
      cartlist: cartlist
    })
    this.chooseAccountTotal();    //处理已选项，个数和合计金额
  },
  /**
   * 全选
   */
  chooseIconAll() {
    let that = this;
    let cartlist = that.data.cartlist;
    let isChooseAll = that.data.isChooseAll;
    if (isChooseAll == true || isChooseAll == 'true') {
      isChooseAll = false;
      cartlist.forEach(value => {
        value.isChoose = false;
      })
    } else {
      isChooseAll = true;
      cartlist.forEach(value => {
        value.isChoose = true;
      })
    }

    that.setData({
      cartlist: cartlist
    })
    that.chooseAccountTotal();
  },
  /**
   * 处理已选项，个数和合计金额
   */
  chooseAccountTotal() {
    let that = this;
    let cartlist = that.data.cartlist;
    let acount_num = 0, account = 0;
    let isChooseAll = false;
    for (let i in cartlist) {
      let isChoose = cartlist[i].isChoose;      //单个的选中状态
      if (isChoose == true || isChoose == 'true') {
        acount_num++;
        account += cartlist[i].quantity * cartlist[i].price;
      }
    }
    if (acount_num == cartlist.length) {
      isChooseAll = true;
    } else {
      isChooseAll = false;
    }
    that.setData({
      acount_num: acount_num,
      account: account,
      isChooseAll: isChooseAll
    })
  },
  /**
   * 获取购物车列表
   */
  getCartlist() {
    let that = this;
    var user = wx.getStorageSync('user');         //已注册用户信息
    let pageNo = that.data.pageNo;
    let param = {
      page: pageNo,
      list_rows: 10,
      customer_id: user.uid
    }
    app.request({
      url: app.getApi('Shopping_Cart/card_list'),
      data: param,
      success: function (res) {
        console.log(res);
        let _data = res.list.data;        //数据列表
        _data.forEach(value => {
          value.isChoose = false;
        })
        console.log(_data);

        that.setData({
          cartlist: _data,
          total: res.list.total
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 删除购物车
   */
  deleteCart() {
    let that = this;
    const user = wx.getStorageSync('user');

    let cartlist = that.data.cartlist;
    let ids = [];   //储存要删除的id，数组
    let indexs = [];    //记录删除的下标，方便数组删除元素
    // let user = that.data.user;
    cartlist.forEach((value, index) => {
      console.log(index);
      let isChoose = value.isChoose;
      if (isChoose == true || isChoose == 'true') {
        ids.push(value.id);
        indexs.push(index);
      }
    });
    if (ids.length < 1) {
      wx.showToast({
        title: '未选择',
        icon: 'none'
      })
      return false;
    }
    console.log(ids);
    let cartParam = {
      Ids: ids.join(','),
      customer_id: user.uid
    }
    app.request({
      url: app.getApi('Shopping_Cart/delete_cart'),
      data: cartParam,
      success: function (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        for (let i = indexs.length - 1; i >= 0; i--) {
          cartlist.splice(indexs[i], 1);
        }
        that.setData({
          cartlist: cartlist,
        })
        that.chooseAccountTotal();
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 结算
   */
  jiesuan() {
    //login/account
    let that = this;
    let cartlist = that.data.cartlist;
    let indexs = [];    //记录选中的下标
    cartlist.forEach((value, index) => {
      console.log(index);
      let isChoose = value.isChoose;
      if (isChoose == true || isChoose == 'true') {
        indexs.push(index);
      }
    });
    if (indexs.length < 1) {
      wx.showToast({
        title: '您还没有选择购买商品',
        icon: 'none'
      })
      return false;
    }
    let buyData = [];   //选择的商品信息json组
    for (let i in indexs) {
      let idx = indexs[i];
      buyData.push({
        Id: cartlist[idx].goods_id,
        type: cartlist[idx].type,       //产品2
        quantity: cartlist[idx].quantity
      })
    }
    wx.navigateTo({
      url: '../projectPayment/projectPayment?buyData=' + JSON.stringify(buyData)
    })
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