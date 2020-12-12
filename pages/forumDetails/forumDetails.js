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
    topic_tag: '',
    token: '',
    postedReply: [],
    index: '',
    forumReply: [],
    hold: '',
    imageUrl: '',
    imageUrl2: '',
    imageUrl3: '',
    videoUrl: '',
    fileUrl:'',
    isShowImage: false,
    isShowVideo: false,
    isShowFile: false,
    image2Available: false,
    image3Available: false,
    profile_photo:'',
    file_photo:'',


    indicatorDots: true,  //小点
    autoplay1: true,  //是否自动轮播
    interval: 3000,  //间隔时间
    duration: 3000,  //滑动时间
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
  showBigger: function(e){
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
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
      imageUrl2: decodeURIComponent(options.imageUrl2),
      imageUrl3: decodeURIComponent(options.imageUrl3),
      videoUrl: decodeURIComponent(options.videoUrl),
      fileUrl: decodeURIComponent(options.fileUrl),
      topic_tag: options.topic_tag,//0:normal topic;1:naa topic
    })

    if (that.data.imageUrl != 'null') {
      that.setData({
        isShowImage: true
      })

      console.log("isShowImage: " + that.data.isShowImage)
    }

    if (that.data.imageUrl2 != 'null') {
      that.setData({
        image2Available: true
      })

      // console.log("isShowImage: " + that.data.isShowImage)
    }

    if (that.data.imageUrl3 != 'null') {
      that.setData({
        image3Available: true
      })

      // console.log("isShowImage: " + that.data.isShowImage)
    }


    if (that.data.videoUrl != 'null') {
      that.setData({
        isShowVideo: true
      })

      console.log("isShowVideo: " + that.data.isShowVideo)
    }

    if (that.data.fileUrl != 'null') {

      //choose the correct file icon
      //the second last character
      var fileLength = that.data.fileUrl.length-2;

      console.log("file character is " + that.data.fileUrl[fileLength]);

      var charcterLast2 = that.data.fileUrl[fileLength];

      if(charcterLast2 == 'd'){
        //file is pdf
        that.setData({
          file_photo: '../images/pdf.png'
        })
      } else if (charcterLast2 == 'p') {
        //file is ppt
        that.setData({
          file_photo: '../images/ppt.png'
        })
      } else if (charcterLast2 == 'c') {
        //file is docx
        that.setData({
          file_photo: '../images/word.png'
        })
      } else {
        //the file is xlsx
        that.setData({
          file_photo: '../images/excel.png'
        })
      }


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
          token: res.data.token,
          // profile_photo:res.data.photo
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
          postedReply: res.data.PostedReplyData,
          // profile_photo: res.data.PostedReplyData.photo
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
      url: '../forumReply/forumReply?id=' + 0 + '&index=' + that.data.index + '&index1=' + 0 + '&topic_tag=' + that.data.topic_tag,//0 = reply topic
    })
  },

  goToReplyPost: function (event) {
    var that = this;
    var index1 = event.currentTarget.dataset.index1;
    console.log("index=" + index1)
    wx.navigateTo({
      url: '../forumReply/forumReply?id=' + 1 + '&index=' + that.data.index + '&index1=' + index1 + '&topic_tag=' + that.data.topic_tag,//1 = reply post
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

  copy: function (e) {
    var that = this;
    wx.setClipboardData({
      data:  that.data.videoUrl,
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
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
    wx.reLaunch({
      url: '../forum/forum'
    })
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