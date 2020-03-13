// components/proCartListITem/proCartListItem.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listByKind:{
      type:JSON,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    BASE_url:''
  },
  ready () {
    this.setData({
      BASE_url: app.globalData.BASE_url
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
