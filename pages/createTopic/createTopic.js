const app = getApp();
var baseUrl = app.globalData.host;

var COS = require('../lib/cos-wx-sdk-v5')
var config = require('./config')

var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数

    // 方法一（推荐）服务器提供计算签名的接口
    /*
    wx.request({
        url: 'SIGN_SERVER_URL',
        data: {
            Method: params.Method,
            Key: params.Key
        },
        dataType: 'text',
        success: function (result) {
            callback(result.data);
        }
    });
    */

    // 异步获取签名
    wx.request({
      url: baseUrl + 'sts.php', // 步骤二提供的签名接口
      data: {
        Method: params.Method,
        Key: params.Key
      },
      dataType: 'text',
      success: function (result) {
        console.log("Look here!");
        console.log(result);
        var data = result.data;
        callback({
          TmpSecretId: data.credentials && data.credentials.tmpSecretId,
          TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
          XCosSecurityToken: data.credentials && data.credentials.sessionToken,
          ExpiredTime: data.expiredTime,
        });
      }
    });
  }

  // 方法二（适用于前端调试）
  //   var authorization = COS.getAuthorization({
  //     SecretId: config.SecretId,
  //     SecretKey: config.SecretKey,
  //     Method: params.Method,
  //     Key: params.Key
  //   });
  //   callback(authorization);
  // }
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    endDate: '',
    title: '',
    detail: '',
    week: '',
    user_id: '',
    post_username: '',
    token: '',
    tempFilePaths: '',
    imageUrl: 'null',
    videoUrl: 'null',
    topic_tag: '',
    fileUrl: 'null'
  },

  requestCallback: function (err, data) {
    var that = this;
    console.log(err || data);

    if (err && err.error) {
      wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
    } else if (err) {
      wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
    } else {
      wx.showToast({ title: '请求成功', icon: 'success', duration: 3000 });



    }
  },

  simpleUpload_image: function () {
    var that = this;
    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // original or compressed
      sourceType: ['album', 'camera'], // from album or camera
      success: function (res) {


        var filePath = res.tempFilePaths[0]
        console.log(filePath);
        var Key = 'topics/' + filePath.substr(filePath.lastIndexOf('/') + 1);
        // the first index is the folder in bucket
        console.log("key: " + Key)
        console.log("filepath: " + filePath)
        console.log(res.tempFilePaths)


        that.setData({
          imageUrl: 'http://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key

        })


        console.log("Success! url is " + that.data.imageUrl);





        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: filePath,
          onProgress: function (info) {
            console.log(JSON.stringify(info));

          }
        }, that.requestCallback);
      }
    })
  },

  simpleUpload_video: function () {
    var that = this;
    // 选择文件
    wx.chooseVideo({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // original or compressed
      sourceType: ['album', 'camera'], // from album or camera
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath
        console.log(filePath);

        var Key = 'topics/' + filePath.substr(filePath.lastIndexOf('/') + 1);
        // the first index is the folder in bucket
        console.log("key: " + Key)
        console.log("filepath: " + filePath)
        console.log(res.tempFilePaths)


        that.setData({
          videoUrl: 'http://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key

        })


        console.log("Success! url is " + that.data.videoUrl);


        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: filePath,
          onProgress: function (info) {
            console.log(JSON.stringify(info));

          }
        }, that.requestCallback);
      }
    })
  },

/////upload file///////////////////////////////////
  simpleUpload_file: function () {
    var that = this;
    // 选择文件
    wx.chooseMessageFile({
      count: 1, // 默认9
      type: 'file',
      success: function (res) {
        console.log(res);
        var filePath = res.tempFiles[0].path
        console.log(filePath);

        var Key = 'topics/' + filePath.substr(filePath.lastIndexOf('/') + 1);
        // the first index is the folder in bucket
        console.log("key: " + Key)
        console.log("filepath: " + filePath)
        console.log(res.tempFilePaths)


        that.setData({
          fileUrl: 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key

        })


        console.log("Success! url is " + that.data.fileUrl);


        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: filePath,
          onProgress: function (info) {
            console.log(JSON.stringify(info));

          }
        }, that.requestCallback);
      }
    })
  },
  ///////////////////////////////////////







sendNotification: function () {
    var that = this;

    console.log("sendNotification-accesstoken:" + app.globalData.access_token)

    wx.request({
      url: baseUrl + 'sendTemplateMessage',
      method: 'POST',
      data: {
        'access_token': app.globalData.access_token,
        'type': 111
        //111: create a new topic
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },

  bindEndDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    var that = this;

    // startTimeNew = util.formatTime(new Date(startTimeNew));
    // endTimeNew = util.formatTime(new Date(endTimeNew));

    // startTimeNew = new Date(startTimeNew).toISOString();
    // endTimeNew = new Date(endTimeNew).toISOString();

    // startTimeNew = util.formatTime(startTimeNew);
    // endTimeNew = util.formatTime(endTimeNew);

    // console.log("startTimeNew: "+startTimeNew);
    // console.log("endTimeNew: " + endTimeNew);


    if (e.detail.value.title && e.detail.value.detail) {



      const requestTask = wx.request({
        method: 'POST',
        url: baseUrl + 'postNewTopic',
        data: {
          'topic_title': e.detail.value.title,
          'topic_detail': e.detail.value.detail,
          'topic_id': '',
          'topic_week': e.detail.value.week,
          'topic_date': e.detail.value.endDate,
          'user_id': that.data.user_id,
          'post_username': that.data.post_username,
          'token': that.data.token,
          'imageUrl': that.data.imageUrl,
          'videoUrl': that.data.videoUrl,
          'fileUrl': that.data.fileUrl,
          'topic_tag': that.data.topic_tag


        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);

          if(res.data.topicData){
            wx.showModal({
              title: 'Success',
              content: 'Topic created successfully!',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                
                  //success: send notifications to all users
                  that.sendNotification();


                  wx.reLaunch({
                    url: '../forum/forum',
                  })

                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          } else if (res.data.error3){
            wx.showModal({
              title: 'Caution',
              content: 'Invalid detail',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm")
                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          } else if (res.data.error2){
            wx.showModal({
              title: 'Caution',
              content: 'Invalid title.',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm")
                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          } else if (res.data.error1){
            wx.showModal({
              title: 'Caution',
              content: 'Invalid week number.',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm")
                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          }

        },
        fail: function (res) {
          console.log('err' + ':' + res);

        }
      })
    } else {
      wx.showModal({
        title: 'Caution',
        content: 'Please complete all input fields.',
        showCancel: false,

        confirmText: "确定",
        confirmColor: "#0f0",
        success: function (res) {
          if (res.confirm) {
            console.log("confirm")
          } else if (res.cancel) {
            console.log("cancle")
          }
        }
      })
    }




  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userData',
      success: function (res) {
        that.setData({
          post_username: res.data.username,
          user_id: res.data.user_id,
          token: res.data.token
        })
      },
    })

    that.setData({
      topic_tag: options.id
      //1: NAA TOPIC
      //0: NORMAL TOPIC
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