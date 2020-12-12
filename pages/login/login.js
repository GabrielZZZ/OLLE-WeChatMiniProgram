const app = getApp();
var baseUrl = app.globalData.host;
var imageUtil = require('../../utils/util.js');

Page({

  /**
   * original data
   */
  data: {
    
  },


  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },


  navigation: function (){
    wx.navigateTo({
      url: '../signUp/signUp',
    })
  },
 

  dealFormIds: function (formId) {
    
    // if(app.globalData.gloabalFomIds){
    //   app.gloabalData.gloabalFomIds = '';
    // }

    app.globalData.globalFormIds = formId; //保存推送码并赋值给全局变量
  },



  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    var that = this;

    let formId = e.detail.formId;
    console.log("formID: " + e.detail.formId);

    this.dealFormIds(formId); //处理保存推送码


    if(e.detail.value.username && e.detail.value.password)
    {
      const requestTask = wx.request({
        method: 'POST',
        url: baseUrl + 'login',
        data: {
          'username': e.detail.value.username,
          'password': e.detail.value.password
        },
        header: {
          'content-type': 'application/json' // 
        },
        success: function (res) {
          console.log(res.data);

          
          //store the data in local
          wx.setStorage({
            key: 'userData',
            data: res.data.userData,
          })


          //setting global variable: user_id and token
          app.globalData.user_id = res.data.userData.user_id;
          app.globalData.token = res.data.userData.token;

          var user_id = res.data.userData.user_id;
          var token = res.data.userData.token;

          // console.log(app.globalData.user_id)
          
          wx.request({
            method: 'POST',
            url: baseUrl + 'isAdminUser',
            data: {
              'user_id': res.data.userData.user_id,
              'token': res.data.userData.token
            },
            header: {
              'content-type': 'application/json' // 
            },
            success: function (res) {
              console.log(res.data);
              
              wx.setStorage({
                key: 'role',
                data: res.data,
              })



              if(res.data.true){
                app.globalData.role = 666;//admin
              } else if(res.data.isMaster){
                app.globalData.role = 3;//master
              } else if(res.data.isValidated){
                app.globalData.role = 1;//NAA or Validated
              } else if(res.data.false){
                app.globalData.role = 0;//Non NAA or Registered
              } else if (res.data.NotRegistered){
                app.globalData.role = 999;//not registered
              }

              console.log("The role is: " + app.globalData.role)

              if(!res.data.NotRegistered){
                wx.switchTab({
                  url: '../homePage/homePage'
                })
                
              } else {
                wx.showModal({
                  title: 'Caution',
                  content: 'Register uncompleted. Please enter the validation code again.',
                  showCancel: false,

                  confirmText: "Confirm",
                  confirmColor: "#0f0",
                  success: function (res) {
                    if (res.confirm) {
                      console.log("confirm");
                      wx.navigateTo({
                        url: '../verification/verification',
                      })
                    } else if (res.cancel) {
                      console.log("cancle")
                    }
                  }
                })
              }

            },
            fail: function (res) {
              console.log("err: " + res)
            }
          })




          if (!res.data.userData) {
            // wx.switchTab({
            //   url: '../homePage/homePage'
            // })
          } else {
            wx.showModal({
              title: 'Caution',
              content: 'Incorrect Username or Password',
              showCancel: false,

              confirmText: "Confirm",
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

        confirmText: "Confirm",
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

  goToUpdateHistory: function (e) {
    console.log("hahah")
    wx.navigateTo({
      url: '../updateHistory/updateHistory'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_role = wx.getStorageSync('role');
    console.log(user_role);
    if (user_role.true) {
      app.globalData.role = 666;//admin
    } else if (user_role.isMaster) {
      app.globalData.role = 3;//master
    } else if (user_role.isValidated) {
      app.globalData.role = 1;//NAA or Validated
    } else if (user_role.false) {
      app.globalData.role = 0;//Non NAA or Registered
    } else if (user_role.NotRegistered){
      app.globalData.role = 999;//not registered
    }



    var value = wx.getStorageSync('userData');
    
    console.log(value)

    if(value)
    {
      app.globalData.user_id = value.user_id;
      app.globalData.token = value.token;
      app.globalData.profile_photo = value.photo;
      
      wx.switchTab({
        url: '../homePage/homePage'
      })
    }
  },

  
  onReady: function () {
    
  },

  
  onShow: function () {
    
  },

  
  onHide: function () {
    
  },

  
  onUnload: function () {
    
  },

  
  onPullDownRefresh: function () {
    
  },

  
  onReachBottom: function () {
    
  },

  
  onShareAppMessage: function () {
    
  }
})