// pages/jifenMall/jifenItem/jifenItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    project:{
      type:Object,
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
    go_detail(e){
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: '../jifenDetail/jifenDetail?ID=' + e.currentTarget.dataset.id + '&sta=' + e.currentTarget.dataset.sta,
      })
    }
  }
})
