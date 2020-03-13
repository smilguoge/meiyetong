// components/toCollageBtn/toCollageBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spelling_id:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    noaccredit:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toCollagePage () {
      let user = wx.getStorageSync('user');
      console.log(this.data.spelling_id);
      if(user==''){   //未授权登录
        this.setData({
          noaccredit:true
        })
      }else{
        wx.navigateTo({
          url: '../../pages/collagePage/collagePage?spelling_id=' + this.data.spelling_id,
          // url: '../../pages/collagePageShare/collagePageShare?spelling_id=' + this.data.spelling_id,
        })
      }
    },
    // 获取登录授权
    login () {
      this.setData({
        noaccredit: false
      })
    }
  },

  /**
   * 组件实例化，但节点树还未导入，因此这时不能用setData
   */
  created () {

  },

  /**
   * 节点树完成，可以用setData渲染节点，但无法操作节点
   */
  attached () {
    console.log(this.data.spelling_id);
  },

  /**
   * 组件布局完成，这时可以获取节点信息，也可以操作节点
   */
  ready () {

  },
  /**
   * 组件实例被移动到树的另一个位置
   */
  moved () {

  },

  /**
   * 组件实例从节点树中移除
   */
  detached () {

  }
})
