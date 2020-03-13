// componets/dialogTem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    dialogTitle:{
      type:String,
      value:'标题'
    },
    dialogCont:{
      type:JSON,
      value:''
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
    closeDialog:function(){
      let dialogData = {};      //子组件的数据，可以传递给父组件
      this.triggerEvent("dialogEvent");   //触发回调
    },
    closeDialog_close:function(){
      this.triggerEvent("dialogEvent_close");   //触发回调
    },
  }
})
