// miniprogram/pages/browses/talks/talks.js
var util = require('../../utils/util.js');
const app = getApp()
const db=wx.cloud.database();
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    id:null,
    img_name:null,
    once_talk:null,
        talks: [
          /*{
            avatarUrl: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3782128483,794367969&fm=26&gp=0.jpg',
            nickName: '小4',
            content:'好',
            talkTime: '15分钟前'
          },*/
        ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    if(options.img_name)
    {
      console.log('菜名：',options.img_name)
      that.setData({
        img_name:options.img_name,
      })
    }
    console.log('传过来的菜品id',options.dishid)
    db.collection('dishes').where({
      'img_name':_.eq(that.data.img_name),
      '_id':options.dishid
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的一条记录的数组
        console.log("搜索成功",res.data)
        that.setData({
          talks:res.data[0]['talks'],//返回改菜品的_id
          id:res.data[0]['_id']
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  loadTalks: function() {
    wx.showNavigationBarLoading();
    let that = this;
    this.setData({
     
    })
    wx.hideNavigationBarLoading();
    },
    onScrollLoad: function() {
      // 加载新的数据
      //this.loadTalks();
      },

      bindInputBlur: function(e) {
        console.log(e)
        this.data.inputValue = e.detail.value;
        },
        //点击发布，发布评论
       
  fabu: function (e) {
    if(getApp().globalData.userInfo==''){
      wx.showToast({
        image	:'../../../images/index/outline.png',
        title: '请先登录',
      })
    }else{
        const that = this;
        var time = util.formatTime(new Date());
        let temp=that.data.talks;  
        temp.unshift({
        avatarUrl: getApp().globalData.userInfo.avatarUrl,
        nickName: getApp().globalData.userInfo.nickName,
        content: this.data.inputValue,
        talkTime: time,
        })
        console.log("评论",this.data.inputValue)
        if(that.data.inputValue != ''||that.data.inputValue!=null)
        {  
          that.setData({
            talks: temp,
            inputValue: that.data.inputValue,
          })
          console.log("本次输入的值",this.data.inputValue)
          this.setData({
            once_talk:{
              avatarUrl: getApp().globalData.userInfo.avatarUrl,
              nickName: getApp().globalData.userInfo.nickName,
              content: this.data.inputValue,
              talkTime: time}
          })
          console.log("本次发表的评论",this.data.once_talk)
          db.collection('dishes').doc(this.data.id).update({
            data: {
              talks: _.push(this.data.once_talk)
            },
            success: function(res) {
              console.log("传入评论数据成功",res)
            }
          })
          this.setData({
            inputValue:''
          })
        }
    }
   
   },


})