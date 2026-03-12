// pages/member/member.js
const app = getApp();
const { api } = require('../../utils/request');
const { formatMemberLevel, formatMemberDiscount, formatPrice } = require('../../utils/format');

Page({
  data: {
    userInfo: null,
    memberInfo: null,
    coupons: [],
    isLoading: false,
    showLoginModal: false
  },

  onLoad: function () {
    this.loadMemberInfo();
  },

  onShow: function () {
    if (app.globalData.token) {
      this.loadMemberInfo();
    } else {
      this.setData({ showLoginModal: true });
    }
  },

  // 加载会员信息
  loadMemberInfo: async function () {
    this.setData({ isLoading: true });

    try {
      const result = await api.member.getInfo();
      const { user, member } = result.data;

      this.setData({
        userInfo: user,
        memberInfo: member,
        isLoading: false
      });
    } catch (error) {
      console.error('加载会员信息失败:', error);
      this.setData({ isLoading: false });
    }
  },

  // 去登录
  goToLogin: function () {
    wx.navigateTo({
      url: '/pages/user/user'
    });
  },

  // 查看优惠券
  viewCoupons: function () {
    wx.navigateTo({
      url: '/pages/coupons/coupons'
    });
  },

  // 查看积分记录
  viewPoints: function () {
    wx.showToast({
      title: '积分记录开发中',
      icon: 'none'
    });
  },

  // 联系客服
  contactService: function () {
    wx.showModal({
      title: '联系客服',
      content: '客服微信：beauty_service',
      showCancel: false
    });
  },

  // 关闭登录提示
  closeLoginModal: function () {
    this.setData({ showLoginModal: false });
  }
});