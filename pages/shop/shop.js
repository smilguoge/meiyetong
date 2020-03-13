// pages/shop/shop.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaccredit: false,//- 微信授权
    noaccreditPhone: false,//- 电话授权
    noaccreditshop: false,//- 门店授权
    indicatorDots: true,
    indicatorDotsActive:'white',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banner_list: [],
    navMenu:[],//- 导航栏列表数据
    spelling_list:[],
    doctor_list:[],
    project_list:[],
    goods_list:[],
    BASE_url: app.globalData.BASE_url,
    middle_list:[],
    user: '',
    user_state: true,
    wxcode: '',//- 微信code
  },
  officialload(detail) {    //关联的公众号
    console.log(detail)
  },
  officialerror(err) {    //关联的公众号W
    console.log(err)
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
    var user = wx.getStorageSync('user');         //已注册用户信息
    var that = this;
    console.log(user);
    var error = 0;//- 授权是否正常：0正常，1不正常
    //- 以下判断用户数据是否注册
    if (user == '') {   //未授权登录过
      console.log("用户未注册");

      that.getAdList('index');    //首页顶部广告
      that.getAdList('index_middle');    //首页中间广告
      that.getSpellingHot();
      that.getDoctorList();
      that.getProjectList();
      that.getGoodsList();
      that.menuData();

      that.setData({
        // noaccredit: true,
        // noaccreditPhone: true,
        // noaccreditshop: true,
        user_state: false
      })
      return;
    }else{
      // that.setData({
      //   noaccredit: false,
      //   noaccreditPhone: false,
      //   noaccreditshop: false,
      // })
      if (user.telphone == undefined || !user.telphone || user.telphone == '') {
        //- 说明没有电话
        console.log("电话未授权");
        that.setData({
          noaccredit: true,
          noaccreditPhone: true,
          user_state: false
        })
        error = 1;
      }

      if (user.shopid == undefined || !user.shopid || user.shopid == '') {
        //- 说明没有门店
        console.log("门店未授权");
        that.setData({
          noaccredit: true,
          noaccreditshop: true,
          user_state: false
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
            icon: 'loading', //图标，支持"success"、"loading"   
          })

          that.getAdList('index');    //首页顶部广告
          that.getAdList('index_middle');    //首页中间广告
          that.getSpellingHot();
          that.getDoctorList();
          that.getProjectList();
          that.getGoodsList();
          that.menuData();
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
  * menu数据加载
  */
  menuData() {
    let that = this;
    app.request({
      url: app.getApi('home/navigation'),
      data: { IsMinProgram: 1 },
      success: function (res) {
        let data = res.list;
        that.setData({
          navMenu: data
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  /**
   * menu跳转分类
   */
  chooseMenu(e) {
    let idx = e.currentTarget.dataset.index;
    let _url = this.data.navMenu[idx].url;
    wx.navigateTo({
      url: _url,
    })
  },
  getSpellingHot() {    //获取热销拼团
    let that = this;
    let spellingParam = {
      IsHot: 0 // 0热门  1非热门
    }
    app.request({
      url: app.getApi('spelling/index'),
      data: spellingParam,
      success: function (res) {
        let data = res.list.data;
        that.setData({
          spelling_list: data
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  // 广告图
  getAdList(adTag) {
    let that = this;

    app.request({
      url: app.getApi('advertisement/ad_list'),
      data: {
        flag: adTag
      },
      success: function (res) {
        app.hideToast();
        let bannerlist = res.list;
        let middle_list
        if (adTag == 'index') {
          that.setData({
            banner_list: res.list
          })
        } else if (adTag == 'index_middle') {
          that.setData({
            middle_list: res.list
          })
        }

      },
      fail: function (error) {
        console.log(error);
      }
    });
  },
  // 广告图连接-跳转到详情页面
  toProjectdetail(e) {
    let _url = e.currentTarget.dataset.url;
    console.log(_url);
    wx.navigateTo({
      url: _url,
    })
  },
  // 获取金牌美容师
  getDoctorList() {
    let that = this;
    let doctorParam = {
      page: 1,
      list_rows: 10
    }
    app.request({
      url: app.getApi('doctor/doctor_list'),
      data: doctorParam,
      success: function (res) {
        let data = res.list.data;
        for (let key in data) {
          if (data[key].HeadImg) {
            let HeadImg = data[key].HeadImg;
            HeadImg.substring(0, 4);
            if (HeadImg.substring(0, 4) != 'http') {
              HeadImg = that.data.BASE_url + HeadImg;
            }
            data[key].HeadImg = HeadImg;
          }
        }
        that.setData({
          doctor_list: data
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  // 获取热销项目
  getProjectList() {
    let that = this;
    let param = {
      page: 1,
      row: 10000
    }
    app.request({
      url: app.getApi('Project/indexproject_list'),
      data: param,
      success: function (res) {
        let data = res.list.data;
        that.setData({
          project_list: data
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  // 获取热销产品
  getGoodsList() {
    let that = this;
    let param = {
      page: 1,
      row: 4
    }
    app.request({
      url: app.getApi('goods/goods_list'),
      data: param,
      success: function (res) {
        console.log(res);
        let data = res.list.data;
        // data.forEach(value => {
        //   value.project_avatar = app.getImgUrl(value.pic);
        // })
        that.setData({
          goods_list: data
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 拼团详情页面
   */
  toCollagDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../collageDetail/collageDetail?id=' + id,
    })
  },
  /**
   * 跳转拼团
   */
  toCollage(e) {

    wx.navigateTo({
      url: '../collage/collage',
    })
  },
  /**
   * 跳转到美容师列表
   */
  toBeauticianList(e) {

    wx.navigateTo({
      url: '../beauticianList/beauticianList',
    })
  },
  /**
   * 跳转美容师详情页
   */
  toBeauticianDetail(e) {
    let that = this;
    let employee_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../beauticianDetail/beauticianDetail?employee_id=' + employee_id,
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