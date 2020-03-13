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
    allAct:false,
    personAct:false,
    tabidx:0,//选择项目产品卡项
    tabidx2:0,//选择兑换项目 或 可兑换项目
    tabarr: ['综合', '产品', '项目','卡项'],
    tabarr2: ['综合','可兑换产品', '可兑换项目'],
    isshow:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择综合类型
    chooseAll() {
      let isshow = this.data.isshow;
      let allAct = this.data.allAct;
      if(!allAct) {
        isshow = true;
      }else{
        isshow = !isshow;
      }
      this.setData({
        allAct:true,
        personAct:false,
        isshow: isshow
      })
    },
    choosePerson() {
      let isshow = this.data.isshow;
      let personAct = this.data.personAct;
      if (!personAct) {
        isshow = true;
      } else {
        isshow = !isshow;
      }
      this.setData({
        allAct: false,
        personAct: true,
        isshow: isshow
      })
    },
    //选择项目产品卡项
    changeItem(e){
      let index = parseInt(e.target.dataset.index);//	1: 产品 ；2 : 项目 ；3: 卡;综合 0
      console.log(index);
      this.setData({
        tabidx: index,
        tabidx2: 0,
        allAct: true,
        isshow:false
      })
      console.log(index)
      this.triggerEvent('getIntegral', { sta : this.data.tabidx, item_type:this.data.tabidx2})
    },
    //选择可兑换产品 或 可兑换项目
    changeExchange(e){
      let index = e.target.dataset.index;
      let idx;
      let type;
      if (index == 1){
        //选择可兑换产品
        idx = 1;
        type = 1;
      } else if(index == 2){
        //选择可兑换项目
        idx = 2;
        type = 1;
      }
      this.setData({
        tabidx2: index,
        tabidx: 0,
        personAct: true,
        isshow: false,
      })
      console.log(index)
      this.triggerEvent('getIntegral', { sta: idx, item_type: type})
    }
  }
})
