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
       * 用户授权登陆
       */
    login: function (userinfo) {
      var that = this;
      app.login(userinfo, (err, res) => { // 呃…… 框架死掉了 🤣 只能屈服于回调地狱
        if (err == 'fail to modify scope') {
          return console.log('login function has error') // 如果登录方法出错则报错
        } else if (err == 'Transfer the user') {
          that.triggerEvent("login", res);
          that.triggerEvent("cancel");
        }
        // 登录完毕后，调用用户数据等信息，使用 that.setData 写入
      })
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
