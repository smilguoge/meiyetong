// components/showConfirm/showConfirm.js
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
    // 取消事件
    cancelEvent () {
      this.triggerEvent("cancelEvent");
    },
    // 确定事件
    sureEvent () {
      this.triggerEvent('sureEvent');
    }
  }
})
