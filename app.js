//app.js

var md5 = require('utils/md5.js');

App({
  onLaunch: function () {
    
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        console.log('未过期')
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        that.login() // 重新登录
      }
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        // if (!res.authSetting['scope.writePhotosAlbum']){
        //   wx.authorize({
        //     scope: 'scope.writePhotosAlbum',
        //     success() {
        //       console.log('图片授权成功')
        //     }
        //   })
        // }
      }
    })

    //获取标题
    that.getTitle();
  },
  onShow: function (options) {
    // Do something when show.
    var that = this;
    that.getStorage({
      key: 'user',
      success: function (res) {
        that.globalData.noaccredit = false
      },
      fail: function (res) {
        that.globalData.noaccredit = true
      }
    })
  },
  globalData: {
    userInfo: null,
    noaccredit: 0,
    noaccreditPhone: false,
    //通用版
    BASE_url: 'https://xmzxsc.meiyetongsoft.com/',     //通用版域名
    // BASE_url: 'https://xqqkj.meiyetongsoft.com/',     //星期七域名
    userAppid: md5.hexMD5('wx724830c4e026bb48'),       //通用版AppID
    // userAppid: md5.hexMD5('wx2a330b50a1cb7861'),       //星期七AppID
    title:'厦门美业通在线商城',

  },
  //获取标题
  getTitle(){
    var that =this;
    this.request({
      url: that.getApi('appointment/wechatTitle'),
      success: function (res) {
        console.log(res)
        that.globalData.title=res.title;
        that.setTitle();
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  //设置标题
  setTitle(){
    wx.setNavigationBarTitle({
      title: this.globalData.title
    })
  },
  //- 请求路径
  getApi: function (control) {
    return this.globalData.BASE_url+'index.php/api/' + control;
  },
  // 拼接图片地址
  getImgUrl: function (control) {
    return this.globalData.BASE_url + control;
  },
  //- 用户微信授权与后台接口传输数据
  DataTransmission: function (code,callback){
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        let avatarUrl = res.userInfo.avatarUrl;//- 头像
        let nickName = res.userInfo.nickName;//- 名称
        let province = res.userInfo.province;//- 省
        let city = res.userInfo.city;//- 市
        let country = res.userInfo.country;//- 区
        let iv = res.iv;
        let encryptedData = res.encryptedData;
        that.request({
          url: that.getApi('auth_Login/min_login'),
          data: {
            avatarUrl: avatarUrl,
            nickName: nickName,
            province: province,
            city: city,
            country: country,
            encryptedData: encryptedData,
            iv: iv,
            code: code
          },
          // header: {}, // 设置请求的 header  
          success: function (res) {
            console.log(res.user)
            var obj = {
              openid: res.user.openid,
              uid: res.user.uid,
              Name: nickName,
              avatarUrl: avatarUrl,
              telphone: res.user.Mobile,
              shopid: res.user.Shop,
            };
            wx.setStorageSync('user', obj);//存储用户数据+
            callback && callback('Transfer the user', res.user.uid)
          }
        });
      }
    });
  },
  //- 自定义更新sessionKey接口
  update_sessionKey: function (code) {
    let that = this;
    this.request({
      url: that.getApi('auth_Login/UpdateSessionKey'),
      data: {
        code: code
      },
      success: function (res) {
        //- 更新sessionKey成功
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  //- 授权登录
  login: function (userinfo, callback) {
    var that = this;
    // 现在，调用 wx.login 是一个可选项了。只有当你需要使用微信登录鉴别用户，才需要用到它，用来获取用户的匿名识别符
    let code;
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        console.log("session_key未过期");
        wx.login({
          success: function (res) {
            code = res.code;
            that.DataTransmission(code, callback);
          }
        });
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        // 重新登录
        wx.login({
          success: function (res) {
            console.log("session_key已过期");
            code = res.code;
            that.update_sessionKey(code);
            that.DataTransmission(code, callback);
          }
        });
      }
    })

    console.log(userinfo);
    if (userinfo.detail.errMsg == 'getUserInfo:ok') {
      // wx.request({}) 
      // 将用户信息、匿名识别符发送给服务器，调用成功时执行 callback(null, res)
      console.log("用户点击确认授权");
    }else if (userinfo.detail.errMsg == 'getUserInfo:fail auth deny') {
      // 当用户点击拒绝时
      this.showModal({
        // 提示用户，需要授权才能登录
        title: "无法完成登录",
        content: "小程序需要获取您的基本信息用于登录。请重新登录并允许小程序获取基本信息。",
        success: function () { console.log("用户拒绝授权");},
      })
      callback('fail to modify scope', null)
    }
  },
  //- 请求接口
  request: function (opt) {
    
    let nullData = {      //没有data参数的情况
      weid: this.globalData.userAppid
    }
    opt = opt || {};
    //- 访问地址
    opt.url = opt.url || '';
    //- 请求类型
    opt.type = opt.type || 'POST';
    //- 请求参数
    opt.data = opt.data || nullData;
    if(opt.data){         //传入data参数，并拼接weid
      opt.data.weid = this.globalData.userAppid;
    }

    //- 异步请求
    opt.async = opt.async || true;

    //- 请求失败/错误
    opt.error = opt.error || function () { };
    //- 操作失败
    opt.fail = opt.fail || function () { };
    //- 操作成功
    opt.success = opt.success || function () { };
    //- 请求完成 - 请求成功或失败时均调用
    opt.complete = opt.complete || function () { };
    wx.showNavigationBarLoading() //在标题栏中显示加载

    wx.request({
      url: opt.url, //仅为示例，并非真实的接口地址
      data: opt.data,
      type: opt.type,
      dataType: "json",
      async: opt.async,
      method: opt.type,
      header: {
        'content-type': 'application/json' // 默认值
      },
      error(e) {
        var response = e.responseText;
        response = $.parseJSON(response);
        opt.error(response);
      },
      success(res) {
        if (res.statusCode == 200 && res.data.code==0) {
          //- 正确情况的处理
          opt.success(res.data.data);
        } else {
          //- 错误情况的处理
          //- 返回状态码和错误信息
          opt.fail(res.data);
        }
      },
      fail(res) {
      },
      complete(XMLHttpRequest, textStatus) {
        wx.hideNavigationBarLoading() //完成停止加载
        opt.complete(XMLHttpRequest, textStatus);
      }
    })
  },
  //- 设置本地数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容。数据存储生命周期跟小程序本身一致
  //，即除用户主动删除或超过一定时间被自动清理，否则数据都一直可用。数据存储上限为 10MB。
  setStorage: function (opt) {
    opt = opt || {};
    //- 本地缓存中指定的 key
    opt.key = opt.key || '';
    //- 需要存储的内容
    opt.data = opt.data || '';
    //- 接口调用成功
    opt.success = opt.success || function () { };
    //- 接口调用失败的回调函数
    opt.fail = opt.fail || function () { };
    //- 接口调用结束的回调函数（调用成功、失败都会执行）
    opt.complete = opt.complete || function () { };
    wx.setStorage({
      key: opt.key,
      data: opt.data,
      success: opt.success,
      fail: opt.fail,
      complete: opt.complete
    })
  },
  //- 从本地缓存中异步获取指定 key 的内容
  getStorage: function (opt) {
    opt = opt || {};
    //- 本地缓存中指定的 key
    opt.key = opt.key || '';
    //- 接口调用成功
    opt.success = opt.success || function () { };
    //- 接口调用失败的回调函数
    opt.fail = opt.fail || function () { };
    //- 接口调用结束的回调函数（调用成功、失败都会执行）
    opt.complete = opt.complete || function () { };
    wx.getStorage({
      key: opt.key,
      success: opt.success,
      fail: opt.fail,
      complete: opt.complete
    })
  },
  //- 显示状态框（几秒后消失）
  showToast: function (opt) {
    opt = opt || {};
    //- 提示文字
    opt.title = opt.title || '加载中';
    //- 显示时长（毫秒）
    opt.duration = opt.duration || 100000;
    //- 是否显示透明蒙层，防止触摸穿透，默认：true 
    opt.mask = opt.mask || true;
    //- 图标，支持"success"、"loading"、 
    opt.icon = opt.icon || 'none';
    //- 接口调用成功
    opt.success = opt.success || function () { };
    //- 接口调用失败的回调函数
    opt.fail = opt.fail || function () { };
    //- 接口调用结束的回调函数（调用成功、失败都会执行）
    opt.complete = opt.complete || function () { };
    wx.showToast({
      title: opt.title,//提示文字
      duration: opt.duration,//显示时长
      mask: opt.mask,//是否显示透明蒙层，防止触摸穿透，默认：true
      icon: opt.icon, //图标，支持"success"、"loading"  
      success: opt.success,//接口调用成功
      fail: opt.fail,  //接口调用失败的回调函数  
      complete: opt.complete //接口调用结束的回调函数  
    })
  },
  //- 确认点击框
  showModal: function(opt) {
      opt = opt || {};
      //- 标题
      opt.title = opt.title || '提示';
      //- 内容
      opt.content = opt.content || '';
      //- 按钮点击方法(包含确定取消)
      opt.success = opt.success || function () {};
      //- 接口调用失败的回调函数
      opt.fail = opt.fail || function () {};
      //- 接口调用结束的回调函数（调用成功、失败都会执行）
      opt.complete = opt.complete || function () {};
      //- 是否显示取消按钮
      opt.showCancel = opt.showCancel || false;
      //- 取消按钮文字（默认是“取消”）
      opt.cancelText = opt.cancelText || '取消';
      //- 取消文字的颜色
      opt.cancelColor = opt.cancelColor || 'black';
      //- 确定按钮文字（默认是“确定”）
      opt.confirmText = opt.confirmText || '确定';
      //- 确定文字的颜色
      opt.confirmColor = opt.confirmColor || 'black';
      wx.showModal({
        title: opt.title,
        content: opt.content,
        showCancel: opt.showCancel,//是否显示取消按钮
        cancelText: opt.cancelText,//默认是“取消”
        cancelColor: opt.cancelColor,//取消文字的颜色
        confirmText: opt.confirmText,//默认是“确定”
        confirmColor: opt.confirmColor,//确定文字的颜色
        success: opt.success  ,
        fail: opt.fail,
        complete: opt.complete
      })
  },
  //- 隐藏状态框
  hideToast: function () {
    wx.hideToast();
  },
  //- 分享成为上下级
  share:function(res){
    let user = wx.getStorageSync('user');
    console.log(user.uid);
    return {
      title: '',        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/mine/mine?shareUid=' + user.uid,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  }
})