const app = getApp();
var baseUrl = app.globalData.host;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',//user name
    surname:'',
    username: '',
    user_id: '',
   role: ''
  },

  logout: function(){
    wx.clearStorage();
    wx.redirectTo({
      url: '../login/login',
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
    var that = this;
    wx.getStorage({
      key: 'userData',
      success: function(res) {
        that.setData({
          name: res.data.name,
          surname: res.data.surname,
          username: res.data.username,
          user_id: res.data.user_id,
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