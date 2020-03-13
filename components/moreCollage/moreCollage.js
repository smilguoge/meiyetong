// components/moreCollage/moreCollage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    collageList:{
      type: JSON,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    componentCollagelist:'',    //组件内的数据
    diffTime: [],      //计时器
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭
    closeAllcollage () {
      this.triggerEvent("closeAllcollage");
    },
    /**倒计时 */
    countDownTime(intDiff) {
      if (intDiff > 0) {
        let day = Math.floor(intDiff / (60 * 60 * 24));
        let hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        let minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        let second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        intDiff--;

        let str = day + '天' + hour + '时' + minute + '分' + second + '秒';
        return str;
      } else {
        console.log('计时结束');
      }
    },
  },
  /**
   *节点树完成，可以用setData渲染节点，但无法操作节点
   */
  attached () {
    console.log(this.data.collageList);
    this.setData({
      componentCollagelist:this.data.collageList
    })
  },
  ready() {
    console.log('组件布局完成，这时可以获取节点信息，也可以操作节点');
    let that = this;
    let collageList = this.data.componentCollagelist;
    console.log(collageList);
    let diffTime = [];
    for (let i in collageList) {
      let value = collageList[i];
      let time = value.time;    //拼团结束剩余时间，单位：秒
      diffTime[i] = setInterval(() => {
        time--;
        let str = that.countDownTime(time);
        value.time = str;
        that.setData({
          componentCollagelist: collageList
        });
        if (time < 0) {
          clearInterval(diffTime);
        }
      }, 1000);
    }
    that.setData({
      diffTime: diffTime
    })
  },
  detached () {
    console.log('组件实例从节点树中移除');
    let diffTime = this.data.diffTime;
    for (let i = 0; i < diffTime.length; i++) {
      clearInterval(diffTime[i]);
    }
    this.setData({
      diffTime: diffTime
    })
  }
})
