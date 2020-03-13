// components/chooseLoginPopup/chooseLoginPopup.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取用户手机号授权
     */
    getPhoneNumber: function (e) {
      let that = this;
      let user = wx.getStorageSync('user');
      console.log(e);
      console.log(user);
      let encryptedData = e.detail.encryptedData;
      let iv = e.detail.iv;
      let openid = user.openid;
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '未授权',
          success: function (res) { }
        })
      } else if (!e.detail.encryptedData || !e.detail.iv){
        wx.showModal({
          title: '提示',
          content: e.detail.errMsg + ' 是否前往手动验证登录',
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login',
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '同意授权',
          success: function (res) {
            console.log(res);
            app.request({
              url: app.getApi('auth_Login/GetUserMobile'),
              data: {
                openid: openid,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                console.log(res);
                var user = wx.getStorageSync('user');//已注册用户信息
                user.telphone = res.user.mobile;
                user.uid = res.user.uid;
                wx.setStorageSync('user', user);//存储用户数据
                that.triggerEvent("loginPhone", res);
              },
              fail: function (error) {
                
              }
            })
          
          },
          fail(error){
            console.log(error);
            
          }
        })

      }

    },
    /**
     * 跳转到手工登录方式
     */
    toLogin() {
      let that = this;
      wx.navigateTo({
        url: '../login/login',
      })
    }
  }
})
