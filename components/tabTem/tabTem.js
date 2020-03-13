// components/tabTem/tabTem.js
var uid = wx.getStorageSync('user').uid;
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    momentTab:{
      type: Array,
      value:[]
    },
    type_num:{
      type: Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabIdx: 0,
  },
  /**
   * attached 节点树完成，可以用setData渲染节点，但无法操作节点
  */
  ready(){
    console.log(this.data.type_num);
    this.setData({
      tabIdx: this.data.type_num
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**tab事件 */
    tabEvent(e) {
      let idx = e.target.dataset.index;
      this.setData({
        tabIdx: idx
      })
      this.triggerEvent("tabEvent", idx);
    },
  }
  
})
