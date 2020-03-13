// pages/jifenMall/template/jifenTab.js
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
    allAct: false,
    personAct: false,
    tabarr: [
      {
        title: '收入',
        select: true
      },
      {
        title: '支出',
        select: false
      }
    ],
    isshow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择综合类型
    chooseAll(e) {
      var that = this;
      var index = e.currentTarget.dataset.id;
      var tabarr = that.data.tabarr;
      for (var i = 0; i < tabarr.length;i++){
        tabarr[i].select=false;
      }
      tabarr[index].select=true;
      that.setData({
        tabarr: tabarr
      })
      that.triggerEvent('getIntegral', { index: index})
    },
  }
})