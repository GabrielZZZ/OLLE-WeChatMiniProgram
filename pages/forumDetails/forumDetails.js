const app = getApp();
var baseUrl = app.globalData.host;
var imageUtil = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    week: '',
    title: '',
    date: '',
    detail: '',
    topic_id: '',
    user_id: '',
    token: '',
    postedReply: [],
    index: '',
    forumReply: [],
    hold: '',
    imageUrl: '',
    videoUrl: '',
    fileUrl:'',
    isShowImage: false,
    isShowVideo: false,
    isShowFile: false

  },

  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },

  downloadFile: function(){
    var that = this;
    console.log("filePath in downloadFile: "+that.data.fileUrl)
    wx.downloadFile({
      url: that.data.fileUrl,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },

  //logic in parent post and children post:
  // Parent.topic_id = topic.topic_id(parent => parent_id = 0)
  // Children.topic_id = topic.topic_id 
  // Children.parent_id = parent.post_id
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      week: decodeURIComponent(options.week),
      title: decodeURIComponent(options.title),
      detail: decodeURIComponent(options.detail),
      date: decodeURIComponent(options.date),
      topic_id: decodeURIComponent(options.topic_id),
      index: decodeURIComponent(options.index),
      imageUrl: decodeURIComponent(options.imageUrl),
      videoUrl: decodeURIComponent(options.videoUrl),
      fileUrl: decodeURIComponent(options.fileUrl),

    })

    if (that.data.imageUrl != 'null') {
      that.setData({
        isShowImage: true
      })

      console.log("isShowImage: " + that.data.isShowImage)
    }

    if (that.data.videoUrl != 'null') {
      that.setData({
        isShowVideo: true
      })

      console.log("isShowVideo: " + that.data.isShowVideo)
    }

    if (that.data.fileUrl != 'null') {
      that.setData({
        isShowFile: true
      })

      console.log("isShowVideo: " + that.data.isShowVideo)
    }


    wx.getStorage({
      key: 'userData',
      success: function (res) {
        console.log("THis is a test")
        console.log(res)
        that.setData({
          user_id: res.data.user_id,
          token: res.data.token
        })
      },
    })

    console.log("topic_id: "+that.data.topic_id)

    wx.request({
      method: 'POST',
      url: baseUrl + 'getPostedReply',
      data: {
        'topic_id': that.data.topic_id,
        'parent_id': '0'//parent posts
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        // var index = res.data.length;

        that.setData({
          postedReply: res.data.PostedReplyData
        })

        wx.setStorage({
          key: 'postedReply',
          data: that.data.postedReply,
        })

        //console.log(that.data.postedReply)

        // console.log(that.data.topicsData);
      },
      fail: function (res) {
        console.log("err: " + res)
      }
    })



  },

  goToReplyTopic: function(event){
    var that = this;
    wx.navigateTo({
      url: '../forumReply/forumReply?id=' + 0 + '&index=' + that.data.index + '&index1=' + 0,//0 = reply topic
    })
  },

  goToReplyPost: function (event) {
    var that = this;
    var index1 = event.currentTarget.dataset.index1;
    console.log("index=" + index1)
    wx.navigateTo({
      url: '../forumReply/forumReply?id=' + 1 + '&index=' + that.data.index+'&index1=' + index1,//1 = reply post
    })
  },

  getComments: function(e){
    var that = this;
    var index1 = e.currentTarget.dataset.index1;

    that.setData({
      hold: e.currentTarget.dataset.index1
    })

    
    console.log("hold: "+that.data.hold)
    console.log("index1: " + index1)
    console.log("parent_id: " + that.data.postedReply[index1].post_id);
    console.log("topic_id: " + that.data.topic_id)

    wx.request({
      method: 'post',
      url: baseUrl + 'getPostedReply',
      data: {
        'topic_id': that.data.topic_id,
        'parent_id': that.data.postedReply[index1].post_id//parent posts
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        // var index = res.data.length;

        that.setData({
          forumReply: res.data.PostedReplyData
        })

        // wx.setStorage({
        //   key: 'postedReply',
        //   data: that.data.postedReply,
        // })

        //console.log(that.data.postedReply)

        // console.log(that.data.topicsData);
      },
      fail: function (res) {
        console.log("err: " + res)
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
    
  }
})