const app = getApp();
var baseUrl = app.globalData.host;
var imageUtil = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '',
    imageUrl2:'',
    imageUrl3:'',
    title: '',
    detail: '',
    page_id: '',
    index: '',
    post_username: '',
    imagewidth: 0,
    imageheight: 0,
    videoUrl: '',
    isShowImage: false,
    isShowVideo: false,
    isShowFile: false,
    role: app.globalData.role,
    image2Available: false,
    image3Available: false,
    file_photo: '',
    fileUrl:'null',
    
    indicatorDots: true,  //小点
    autoplay1: true,  //是否自动轮播
    interval: 3000,  //间隔时间
    duration: 3000,  //滑动时间

    profile_photo: ''
  },
  
  pageEdit: function(e){
    wx.redirectTo({
      url: '../pageUpload/pageUpload',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  downloadFile: function () {
    var that = this;
    console.log("filePath in downloadFile: " + that.data.fileUrl)
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

  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  showBigger: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;


    that.setData({
      role: app.globalData.role,
      imageUrl: decodeURIComponent(options.imageUrl),
      imageUrl2: decodeURIComponent(options.imageUrl2),
      imageUrl3: decodeURIComponent(options.imageUrl3),
      title: decodeURIComponent(options.title),
      detail: decodeURIComponent(options.detail),
      page_id: decodeURIComponent(options.page_id),
      index: decodeURIComponent(options.index),
      post_username: decodeURIComponent(options.post_username),
      videoUrl: decodeURIComponent(options.videoUrl),
      fileUrl: decodeURIComponent(options.fileUrl),
      profile_photo: decodeURIComponent(options.profile_photo),
    })

    if(that.data.imageUrl != 'null'){
      that.setData({
        isShowImage: true
      })

      console.log("isShowImage: "+that.data.isShowImage)
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

      console.log("isShowVideo: "+that.data.isShowVideo)
    }


    if (that.data.fileUrl != 'null') {

      //choose the correct file icon
      //the second last character
      var fileLength = that.data.fileUrl.length - 2;

      console.log("file character is " + that.data.fileUrl[fileLength]);

      var charcterLast2 = that.data.fileUrl[fileLength];

      if (charcterLast2 == 'd') {
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



  },

  copy: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.videoUrl,
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