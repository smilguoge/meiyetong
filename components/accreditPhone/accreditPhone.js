// components/accredit/accredit.js
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
      
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '未授权',
          success: function (res) { }
        })
      } else if (!e.detail.encryptedData || !e.detail.iv) {
        wx.showModal({
          title: '提示',
          content: e.detail.errMsg + ' 是否前往验证登录',
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login',
              })
            }
          }
        })
      }else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '同意授权',
          success: function (res) {
            
            
          },
          fail:function(err) {
            console.log('授权失败');
          }
        })
        
      }
    },
  },

  /**
   * 组件实例化，但节点树还未导入，因此这时不能用setData
   */
  created() {

  },

  /**
   * 节点树完成，可以用setData渲染节点，但无法操作节点
   */
  attached() {
    console.log(app.globalData.noaccredit);
  },

  /**
   * 组件布局完成，这时可以获取节点信息，也可以操作节点
   */
  ready() {

  },
  /**
   * 组件实例被移动到树的另一个位置
   */
  moved() {

  },

  /**
   * 组件实例从节点树中移除
   */
  detached() {

  }
})
