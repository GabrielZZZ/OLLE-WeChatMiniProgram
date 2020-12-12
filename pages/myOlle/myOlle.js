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
    name: '',//user name
    surname:'',
    username: '',
    user_id: '',
    role: '',
    profile_photo: '',
    
  },

  logout: function(){
    wx.clearStorage();
    wx.redirectTo({
      url: '../login/login',
    })
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

      console.log("profile_photo:" + app.globalData.profile_photo)


      const requestTask = wx.request({
        method: 'POST',
        url: baseUrl + 'updatePhoto',
        data: {
          
          'user_id': that.data.user_id,
          'photo': app.globalData.profile_photo

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);


          //update local data
          wx.setStorage({
            key: 'userData',
            data: res.data.userData,
          })

          
          if (res.data.userData) {
            wx.showModal({
              title: 'Success',
              content: 'Image uploaded successfully!',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {

                  //update getposted reply
       
                  wx.reLaunch({
                    url: '../myOlle/myOlle',
                  })

                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          } else if (res.data.error) {
            wx.showModal({
              title: 'Caution',
              content: 'Something wrong with connection to the server :(',
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
    }
  },

  simpleUpload_image: function (e) {
    var that = this;
    
    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // original or compressed
      sourceType: ['album', 'camera'], // from album or camera
      success: function (res) {


        var filePath = res.tempFilePaths[0]
        console.log(filePath);
        var Key = 'profile/' + filePath.substr(filePath.lastIndexOf('/') + 1);
        // the first index is the folder in bucket
        console.log("key: " + Key)
        console.log("filepath: " + filePath)
        console.log(res.tempFilePaths)

        app.globalData.profile_photo =  'http://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key
          // that.setData({
          //   profile_photo: 'http://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key
          // })
        
        console.log("Success! url is " + app.globalData.profile_photo);





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


  changeName: function(e){
    var that = this;
    console.log("chanegName: " + that.data.name);
    wx.navigateTo({
      url: '../accountUpdateData/accountUpdateData?' + 'kind=' + 0 + '&user_id=' + that.data.user_id,
    })
  },

  changeSurname: function (e) {
    var that = this;
    console.log("chanegSurname: " + that.data.surname);
    wx.navigateTo({
      url: '../accountUpdateData/accountUpdateData?' + 'kind=' + 1 + '&user_id=' + that.data.user_id,
    })
  },

  changeUsername: function (e) {
    var that = this;
    console.log("chanegUsername: " + that.data.username);
    wx.navigateTo({
      url: '../accountUpdateData/accountUpdateData?' + 'kind=' + 2 + '&user_id=' + that.data.user_id,
    })
  },

  changePassword: function(e){
    var that = this;
    
    wx.navigateTo({
      url: '../accountUpdatePassword/accountUpdatePassword?user_id=' + that.data.user_id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    var that = this;
    wx.getStorage({
      key: 'userData',
      success: function(res) {

        console.log(res)

        that.setData({
          name: res.data.name,
          surname: res.data.surname,
          username: res.data.username,
          user_id: res.data.user_id,
          profile_photo: res.data.profile_photo
        })
      },
    })

    console.log("MYOLLE_ROLE: " + app.globalData.role);

    if (app.globalData.role == 666){
      var user_role = 'Administrator'
    } else if (app.globalData.role == 3){
      var user_role = 'Master'
    } else if (app.globalData.role == 1){
      var user_role = 'NAA USER'
    } else if (app.globalData.role == 0){
      var user_role = 'NORMAL USER'
    }

    that.setData({
      role: user_role
    })



    that.saveFormIds();

    

    
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },




  saveFormIds: function () {
    var formIds = app.globalData.globalFormIds; // 获取gloabalFomIds
    
    console.log("formIDs: "+formIds)

    if (formIds && formIds != 'the formId is a mock one') {//gloabalFomIds存在的情况下 将数组转换为JSON字符串
      formIds = JSON.stringify(formIds);
      app.globalData.globalFormIds = false;
    }

    // var date_now = util.formatDate(new Date());

    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var year = date.getFullYear();
    //获取月份  
    var month = date.getMonth() + 1;
    //获取当日日期 
    var day = date.getDate();

    //roughly calculate
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      if (day + 7 > 31) {
        //move to next month
        month++;
        day = day + 7 - 31;
      } else {
        day += 7;

      }

      if (month == 12) {
        //move to next year
        month = 1;
        year++;

      }
    } else if (month == 2) {
      if (day + 7 > 27) {
        //move to next month
        month++;
        day = day + 7 - 27;
      } else {
        day += 7;

      }
    } else {
      if (day + 7 > 30) {
        //move to next month
        month++;
        day = day + 7 - 30;
      } else {
        day += 7;

      }

    }



    var date_expire = year + '-' + month + '-' + day
    console.log("expire_date:" + date_expire);



    if (formIds && formIds != 'the formId is a mock one') {
      wx.request({//通过网络请求发送openId和formIds到服务器
        url: baseUrl + 'saveFormId',
        method: 'POST',
        data: {
          'openId': app.globalData.openId,
          'formIds': formIds,
          'expire_date': date_expire
        },
        success: function (res) {
          console.log(res.data)
        }
      });
    }

  },

  sendNotification: function () {
    var that = this;

    console.log("sendNotification-accesstoken:" + app.globalData.access_token)

    wx.request({
      url: baseUrl + 'sendTemplateMessage',
      method: 'POST',
      data: {
        'access_token': app.globalData.access_token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
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
    wx.reLaunch({
      url: 'myOlle'
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