// pages/consumeList/consumeItem/consumeItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    consumeData:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready() {
    console.log(this.data.consumeData)
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
