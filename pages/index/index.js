//index.js
const app = getApp()
var baseUrl = app.globalData.host;

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //check whether the version is available

    isHide: false
  },

  onLoad: function () {
    var that = this;
    // check whether it is authorized
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              
              wx.login({
                success: res => {
                  
                  console.log("client's code:" + res.code);
                  
                  //get open_id
                  wx.request({
                    //method: 'POST',
                    url: baseUrl+'wxlogin.php',
                    data: { code: res.code },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(res.data)
                      //app.globalData.session_key = res.data;
                      app.globalData.openId = res.data;

                    }
                  });
                }
              });

              wx.login({
                success: res => {

                  //get access_token
                  wx.request({
                    url: baseUrl + 'wxlogin1.php',
                    data: { code: res.code },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(res.data)
                      app.globalData.access_token = res.data.access_token;

                      wx.redirectTo({
                        url: '../login/login',
                      })
                    }
                  });
                }
              });
            }
          });
        } else {
          //user is not authorized
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //user click yes
      var that = this;
      // get user's info
      console.log("client's info:");
      console.log(e.detail.userInfo);
      
      wx.reLaunch({
        url: 'index',
      })
     
     
    } else {
      //
      wx.showModal({
        title: 'Caution',
        content: 'You cannot enter the program unless you accept it.',
        showCancel: false,
        confirmText: 'Back',
        success: function (res) {
          // fail authorized
          if (res.confirm) {
            console.log('click yes”');
          }
        }
      });
    }
  }
})