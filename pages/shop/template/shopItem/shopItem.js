// pages/shop/template/shopItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hotitem:{
      type:JSON,
      value:{}
    }
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

  },
  ready() {
    console.log(this.hotitem)
  }
})
