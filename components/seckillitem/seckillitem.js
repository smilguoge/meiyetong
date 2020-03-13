// components/seckillitem.js
const app = getApp();
Component({

  /**
   * 页面的初始数据
   */
  properties: {
    List: {
      type: Object,
      value: {}
    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    BASE_url: app.globalData.BASE_url,
  },
  ready() {
    console.log(this.data.BASE_url);
    console.log(this.List);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 触发父级方法传值跳转
   */
    goPage: function (event) {
      let idx = event.currentTarget.dataset.index;
      let seckillId = event.currentTarget.dataset.id;
      let ProjectId = event.currentTarget.dataset.ProjectId;
      this.triggerEvent("sonPage_go", { type: idx, seckillId: seckillId, ProjectId: ProjectId });
    },
  }


})