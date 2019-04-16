const app = getApp();
var baseUrl = app.globalData.host;

var array = [];
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#8696a7' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#8696a7' }
    ],

    description: 'NA',
    startTime: 'NA',
    endTime: 'NA',
    title: 'NA',
    event_id: '',
    eventData1: [],
    day: '',
    year: '',
    month: '',
    role: app.globalData.role



  },

  createEvent: function(){
    wx.navigateTo({
      url: '../calendarCreate/calendarCreate?id='+0,
    })
  },

  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#2c3646",
      day: event.detail.day,
      year: event.detail.year,
      month: event.detail.month
    })

    var that = this;
    console.log(event.detail);
    
    //clear the array
    // console.log("length: "+ array.length);
    // console.log(array);
    // for(let i = 0; i < array.length; i++){
    //   array.pop();
    // }

    console.log("array after clear:");

    array = [];
    console.log(array)

    that.setData({
      day: event.detail.day,
      month: event.detail.month,
      year: event.detail.year
    })



    that.getEvent();

    // wx.getStorage({
    //   key: '',
    //   success: function(res) {},
    // })

  },

  getEvent: function(){
    var that = this;
    array = [];//clear array here to prevent duplicate matrices
    console.log("year: "+that.data.year);
    console.log("month: " + that.data.month);

    console.log("day: " + that.data.day);

    //everytime click the day, then refresh the local eventData
    wx.request({
      method: 'POST',
      url: baseUrl + 'getCalendarEvents',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        var index = res.data.length;

        wx.setStorage({
          key: 'eventData',
          data: res.data,
        })
      }
    })



    wx.getStorage({
      key: 'eventData',
      success: function (res) {
        console.log(res)

        var index = res.data.fData.length;

        for (index in res.data.fData) {
          //recursively split the date out
          //and compare with the choosen date

          var year = parseInt(res.data.fData[index].endTime.substring(0, 4));
          var month = parseInt(res.data.fData[index].endTime.substring(5, 7));
          var date = parseInt(res.data.fData[index].endTime.substring(8, 10));

          var year1 = parseInt(res.data.fData[index].startTime.substring(0, 4));
          var month1 = parseInt(res.data.fData[index].startTime.substring(5, 7));
          var date1 = parseInt(res.data.fData[index].startTime.substring(8, 10));
          console.log("year: " + year);
          console.log("month: " + month);
          console.log("date: " + date);


          if ((that.data.year < year || (that.data.year == year && that.data.month < month) || (that.data.year == year && that.data.month == month && that.data.day <= date))  && (that.data.year > year1 || (that.data.year == year1 && that.data.month > month1) || (that.data.year == year1 && that.data.month == month1 && that.data.day >= date1))){
            
            
            
              //found the day
              that.setData({
                title: res.data.fData[index].title,
                startTime: res.data.fData[index].startTime,
                endTime: res.data.fData[index].endTime,
                description: res.data.fData[index].description,
                event_id: res.data.fData[index].event_id,


              })
              var obj = res.data.fData[index];
              array.push(obj);
              that.setData({
                eventData1: array
              })

            
                
          } 
          else {
            //set to empty
            
            that.setData({
              title: '',
              startTime: '',
              endTime: '',
              eventData1: array
            })
          }
        }

        
        console.log(that.data.eventData1);
       
      },
    })
  },



  showDetails: function(e){
    var that = this;

    var index = e.currentTarget.id;
    console.log(e.currentTarget.id);
    wx.navigateTo({
      url: '../calandarDetails/calandarDetails?title=' + that.data.eventData1[index].title + '&startTime=' + that.data.eventData1[index].startTime + '&endTime=' + that.data.eventData1[index].endTime + '&description=' + that.data.eventData1[index].description + '&event_id=' + that.data.eventData1[index].event_id
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;

    that.setData({
      role: app.globalData.role
    })


    wx.request({
      method: 'POST',
      url: baseUrl + 'getCalendarEvents',
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        var index = res.data.length;

        wx.setStorage({
          key: 'eventData',
          data: res.data,
        })

        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        var Y = date.getFullYear();

        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);;
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

        console.log("year month day:" + Y + M + D);

        that.setData({
          day: D,
          month: M,
          year: Y
        })


        that.getEvent();
      },
      fail: function (res) {
        console.log("err: " + res)
      }
    })

    //automatic get today's events

    //submit formID
    that.saveFormIds();



  },

  saveFormIds: function () {
    var formIds = app.globalData.globalFormIds; // 获取gloabalFomIds



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
    // var that = this;
    // that.setData({
    //   day: '2',
    //   month: '3',
    //   year: '2019'
    // })


    // that.getEvent();
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
    // 显示顶部刷新图标
    //wx.showNavigationBarLoading();

  wx.reLaunch({
  url: 'calander'
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