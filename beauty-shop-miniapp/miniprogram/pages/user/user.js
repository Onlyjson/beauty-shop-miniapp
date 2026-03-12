// pages/user/user.js
const app = getApp();
const { api } = require('../../utils/request');
const { login, getUserInfo, getPhoneNumber, setLoginStatus } = require('../../utils/auth');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    memberInfo: null,
    showLogin: false,
    isLoading: false
  },

  onLoad: function () {
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const isLoggedIn = !!app.globalData.token;
    this.setData({ 
      isLoggedIn,
      userInfo: app.globalData.userInfo,
      memberInfo: app.globalData.memberInfo
    });

    if (isLoggedIn) {
      app.getUserInfo();
    }
  },

  // 开始登录
  startLogin: async function () {
    this.setData({ isLoading: true });

    try {
      // 获取微信登录凭证
      const code = await login();
      
      // 获取用户信息
      const userInfo = await getUserInfo();

      // 调用微信登录接口
      const result = await api.auth.wechatLogin({
        code,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl
      });

      // 设置登录状态
      setLoginStatus(
        result.token,
        result.user,
        result.member
      );

      // 刷新状态
      this.checkLoginStatus();

      // 返回上一页或首页
      wx.navigateBack();
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
      this.setData({ isLoading: false });
    }
  },

  // 获取手机号
  getPhone: function (e) {
    if (e.detail.code) {
      this.submitPhone(e.detail.code);
    } else {
      wx.showToast({ title: '获取手机号失败', icon: 'none' });
    }
  },

  // 提交手机号
  submitPhone: async function (code) {
    try {
      const result = await api.auth.bindPhone({
        code,
        phone: e.detail.phoneNumber
      });
      
      setLoginStatus(result.token, result.user, result.member);
      this.checkLoginStatus();
      wx.navigateBack();
    } catch (error) {
      console.error('绑定手机号失败:', error);
      wx.showToast({ title: '绑定失败', icon: 'none' });
    }
  },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearLoginInfo();
          this.checkLoginStatus();
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  },

  // 查看订单
  viewOrders: function () {
    wx.navigateTo({
      url: '/pages/order/order'
    });
  },

  // 查看预约
  viewBookings: function () {
    wx.navigateTo({
      url: '/pages/bookings/bookings'
    });
  },

  // 联系客服
  contactService: function () {
    wx.showModal({
      title: '联系客服',
      content: '客服微信：beauty_service',
      showCancel: false
    });
  }
});