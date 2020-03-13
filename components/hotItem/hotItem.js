// pages/shop/template/hotItem/hotItem.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hotitem: {
      type: Object,
      value: {}
    },
    isGoods: {
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    BASE_url: app.globalData.BASE_url,
  },
  ready() {
    console.log(this.data.BASE_url)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toProjectdetail(e) {
      let goodsid = e.currentTarget.dataset.goodsid;
      let _type = 0;
      let isGoods = this.data.isGoods;
      if (isGoods==0) {       //项目1
        _type = 1;
      } else if (isGoods==1) {    //产品2
        _type = 2;
      } else if (isGoods == 2) {    //卡项3
        _type = 3;
      }
      wx.navigateTo({
        url: '../projectDetail/projectDetail?goodsid=' + goodsid + '&&_type=' + _type,
      })
    }
  }
})
