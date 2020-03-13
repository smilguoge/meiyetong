// pages/projectDetail/template/spec/spec.js
let user = wx.getStorageSync('user');
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    projectCard:{
      type:JSON,
      value:{}
    },
    _type: {     // 3：卡项 1：项目 2：产品
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    specIdx:0,
    chooseProject:'',
    baseUrl:'https://xmzxsc.meiyetongsoft.com',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseSpecCont(e) {
      let idx = e.target.dataset.index;
      let chooseProject = this.data.chooseProject;    // 已选择的规格
      this.setData({
        specIdx: idx,
        chooseProject:this.data.projectCard[idx]
      })
    },
    // 关闭弹窗
    closeSpec() {
      this.triggerEvent('closeSpec')
    },
    //  加入购物车
    toCart() {
      let chooseProject = this.data.chooseProject || this.data.projectCard[0];
      let _type = this.data._type;
      console.log(chooseProject);
      let IsPay = chooseProject.IsPay;
      if(IsPay !== '1') {
        wx.showToast({
          title: '请到店支付',
          icon:'none'
        })
        return false;
      }
      let cardParam = {   // 加入购物车
        goods_id: chooseProject.id,
        type: 3,    //都是属于  卡项3
        quantity: 1,
        customer_id: user.uid
      }
      app.request({
        url: app.getApi('Shopping_Cart/add_card'),
        data: cardParam,
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: '已添加购物车，请前往购物车结算',
            icon: 'none'
          });
        },
        fail: function (error) {
          console.log(error);
        }
      })
    },
    // 立即购买
    toPayment() {
      let chooseProject = this.data.chooseProject || this.data.projectCard[0];
      console.log(chooseProject);
      let IsPay = chooseProject.IsPay;
      
      if (IsPay !== '1') {
        wx.showToast({
          title: '请到店支付',
          icon: 'none'
        })
        return false;
      }

      //立即支付
      let buyData = [{
        Id: chooseProject.id,
        // type: this.data._type,       //产品2
        type:3,//都是项目里面的卡项  3
        quantity: 1
      }];
      console.log(buyData)
      wx.navigateTo({
        url: '../projectPayment/projectPayment?buyData=' + JSON.stringify(buyData),
      })
    }
  },
  ready () {
    console.log(this.data.projectCard)
  },
})
