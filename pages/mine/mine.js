// pages/mine/mine.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    noaccredit: false,//- 微信授权
    noaccreditPhone: false,//- 电话授权
    noaccreditshop: false,//- 门店授权
    user:'',      //用户信息
    orderMenu:[{
      imgUrl:'../../images/orderPay-icon@2x.png',
      text:'待付款'
    },{
      imgUrl:'../../images/orderSend-icon@2x.png',
      text:'待发货'
    },{
      imgUrl:'../../images/orderShou-icon@2x.png',
      text:'待收货'
    },{
      imgUrl:'../../images/orderAll-icon@2x.png',
      text:'所有订单'
    }],
    fixedTop:70,
    fixedLeft:70,
    isMyrecommend:false,      //是否显示我的团队
    show_Service_Star:false,   //是否显示服务之星
    star_array:[],
    Reward:0,
    Integral:0,
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
    var that=this;
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
          
          if (options && options.shareUid) {
            console.log(options)
            wx.setStorage({
              key: 'shareUid',
              data: options.shareUid
            })
            that.bingdRelation(options.shareUid);
          }
          that.customer_data();//获取个人的花瓣和积分
          that.Petal_integral();//各种订单数量
          that.server_star();//服务之星的数据获取
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
  fixedMove(e) {
    let moveX = e.changedTouches[0].pageX;
    let moveY = e.changedTouches[0].pageY;
    this.setData({
      fixedTop: moveY - 40,
      fixedLeft: moveX - 40
    })
  },
  /**
   * 我的团队
   */
  showMyrecommend() {
    this.setData({
      isMyrecommend: true
    })
  },
  //显示隐藏服务之星
  Service_Star() {
    var that = this
    var Star = that.data.show_Service_Star;
    that.setData({
      show_Service_Star: !Star
    })
  },
  //服务之星->预约
  go_appoint(e) {
    var data = e.target.dataset;
    console.log(data)
    wx.navigateTo({
      url: '../appointmentDay/appointmentDay?shopid=' + data.shop + '&employee=' + data.id,
    })
  },
  // 跳转到积分详情页面
  go_IntegralDetail() {
    wx.navigateTo({
      url: '../IntegralDetail/IntegralDetail',
    })
  },
  /**关闭我的团队 */
  closeSpec() {
    this.setData({
      isMyrecommend: false
    })
  },
  /**
   * 跳转到我的订单
   */
  toMyOrders(e) {
    wx.navigateTo({
      url: '../myOrders/myOrders?type=' + e.currentTarget.dataset.type,
    })
  },


  /**
 * 绑定上下级
 */
  bingdRelation: function (shareUid) {
    console.log('shareUid', shareUid)
    var uid = wx.getStorageSync('user').uid;
    console.log('uid', uid)
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
  //获取个人的花瓣和积分
  customer_data:function(){
    var that = this;
    var user = wx.getStorageSync('user');         //已注册用户信息
    app.request({
      url: app.getApi('Customers/customer_balance'),
      data: {
        customer_id: user.uid
      },
      success: function (res) {
        if (res.detail){
          that.setData({
            Reward: res.detail.Integral,
            Integral: res.detail.Reward
          })
        }
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      }
    })
  },
  //各种订单数量
  Petal_integral:function(){
    var that = this
    var user = wx.getStorageSync('user');         //已注册用户信息
    var orderMenu = that.data.orderMenu;
    app.request({
      url: app.getApi('Customers/ordernum_list'),
      data:{
        customer_id:user.uid
      },
      success: function (res) {
        orderMenu[0].num = res.nopayNum;
        orderMenu[1].num = res.shipnum;
        orderMenu[2].num = res.receiptnum;
        orderMenu[3].num = res.allNum;
        that.setData({
          orderMenu: orderMenu
        })
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      }
    })
  },
  //服务之星的数据获取
  server_star(){
    var that=this;
    var user = wx.getStorageSync('user');         //已注册用户信息
    app.request({
      url: app.getApi('Appointment/point_score_list'),
      data: {
        user_id: user.uid
      },
      success: function (res) {
        var list = res.list
        // list.forEach(value => {
        //   if (value.headImg){
        //     value.headImg = value.headImg;
        //   }
        // })
        that.setData({
          star_array: list
        })
      },
      fail: function (error) {
        // app.showToast({
        //   title: error.msg,
        //   duration: 1500
        // })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          fixedTop: res.windowHeight-100,
          fixedLeft: res.windowWidth-100
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();    //刷新页面
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