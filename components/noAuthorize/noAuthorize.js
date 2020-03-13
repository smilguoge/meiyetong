// components/noAuthorize/noAuthorize.js
// Component({
//   /**
//    * 组件的属性列表
//    */
//   properties: {

//   },

//   /**
//    * 组件的初始数据
//    */
//   data: {
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },

//   /**
//    * 组件的方法列表
//    */
//   methods: {
//     /**
//      * 获取用户授权信息
//      */
//     getUserInfo: function (e) {
//       console.log(e)
//       app.globalData.userInfo = e.detail.userInfo
//       this.setData({
//         userInfo: e.detail.userInfo,
//         hasUserInfo: true
//       })
//     },
//   }
// })
