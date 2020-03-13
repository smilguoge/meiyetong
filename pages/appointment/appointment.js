// pages/appointment/appointment.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaccredit: false,//- 微信授权
    noaccreditPhone: false,//- 电话授权
    noaccreditshop: false,//- 门店授权
    listArr:new Array(1),
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [],
    BASE_url: app.globalData.BASE_url,
    wxcode: '',//- 微信code
    user: '',
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

          app.showToast({
            title: '加载中',//提示文字
            mask: true,//是否显示透明蒙层，防止触摸穿透，默认：true
            icon: 'loading', //图标，支持"success"、"loading"   
          })
          app.request({
            url: app.getApi('Appointment/get_shop_list'),
            data: {},
            success: function (res) {
              app.hideToast();
              that.setData({
                items: res.list
              });
            },
            fail: function (error) {
              console.log(error);
            }
          })
          // wx.getLocation({
          //   type: 'gcj02',
          //   altitude: true,
          //   success(res) {
          //     //- 用户点击确认地理位置授权
          //     app.request({
          //       url: app.getApi('Appointment/get_min_shop_list'),
          //       data: {
          //         customer_id: user.uid,
          //         lat: res.latitude,
          //         lng: res.longitude
          //       },
          //       success: function (res) {
          //         app.hideToast();
          //         that.setData({
          //           items: res.list
          //         });
          //       },
          //       fail: function (error) {
          //         console.log(error);
          //       }
          //     })
          //   },
          //   fail(res) {
          //     //- 用户点击拒绝，取消地理位置授权
          //     app.request({
          //       url: app.getApi('Appointment/get_min_shop_list'),
          //       data: {
          //         customer_id: user.uid,
          //         lat: '',
          //         lng: ''
          //       },
          //       success: function (res) {
          //         app.hideToast();
          //         that.setData({
          //           items: res.list
          //         });
          //       },
          //       fail: function (error) {
          //         console.log(error);
          //       }
          //     })
          //   }
          // })
          

         
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
   * 拨打电话
   */
  makePhoneCall: function (event) {
    let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        console.log('拨打成功');
      },
      fail: () => {
        console.log('拨打失败');
      }
    })
  },
  /**
   * 跳转到地图导航
   */
  toMap(e) {
    let idx = e.currentTarget.dataset.index;
    let location = e.currentTarget.dataset.location;
    //- 前往微信地图
    wx.openLocation({
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lng),
      scale: 28
    })

    // wx.navigateTo({
    //   url: '../mapShopaddr/mapShopaddr?location=' + JSON.stringify(this.data.items[idx].location),
    // })
  },
  /**
   * 点击预约
   */
  toAppointBtn: function (event) {
    let shopid = event.currentTarget.dataset.id;
    let shopname = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../appointmentDay/appointmentDay?shopid=' + shopid + '&shopname=' + shopname,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    setTimeout(()=>{
      wx.stopPullDownRefresh();
      console.log('关闭下拉刷新');
    },500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉触底加载');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return (app.share());
  }
})