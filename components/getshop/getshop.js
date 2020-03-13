// components/getshop.js
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
    shopid: '',                             //- 选择门店id
    shoplist: '',                           //- 选择门店列表
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 选择门店
   */
    bindPickerChange(e) {
      let val = e.detail.value;
      let list = this.data.shoplist;
      this.setData({
        index: val,
        shopid: list[val].id
      })
    },
    /**
     * 门店数据加载
     */
    shoplist: function () {
      var that = this;
      var user = wx.getStorageSync('user');         //已注册用户信息
      app.request({
        url: app.getApi("Shop/shop_list"),
        data: {
          customer_id: user.uid
        },
        error: function (error) {
        },
        success: function (res) {
          that.setData({
            shoplist: res.list,
            shopid: res.list[0].id
          });

        },
        complete: function () {

        }
      });
    },
    /**
     * 选择门店绑定
     */
    chooseshop: function(){
      let that = this;
      let user = wx.getStorageSync('user');         //已注册用户信息
      let openid = user.openid;
      app.request({
        url: app.getApi('auth_Login/BindShop'),
        data: {
          shopid: that.data.shopid,
          openid: openid
        },
        success: function (res) {
          user.shopid = that.data.shopid;
          console.log(user);
          wx.setStorageSync('user', user);//存储用户数据+
          that.triggerEvent("loginshop", res);
        },
        fail: function (error) {
          app.showToast({
            title: error.msg,
            duration: 1500
          })
        }
      })
    }

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
    this.shoplist();
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
