// components/mineTab/mineTab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabMenu:{
      type:Array,
      value:["全部预约","未服务","已服务"]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabIdx:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseTab (event) {
      let idx = event.currentTarget.dataset.index;
      this.setData({
        tabIdx:idx
      })
      this.triggerEvent("chooseTab", {tabIdx:idx});
    }
  }
})
