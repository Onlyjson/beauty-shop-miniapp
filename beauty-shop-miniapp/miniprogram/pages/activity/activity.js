// pages/activity/activity.js
const app = getApp();
const { api } = require('../../utils/request');

Page({
  data: {
    type: 'all',
    activities: [],
    isLoading: false
  },

  onLoad: function (options) {
    if (options.type) {
      this.setData({ type: options.type });
    }
    this.loadActivities();
  },

  // 加载活动列表
  loadActivities: async function () {
    this.setData({ isLoading: true });

    try {
      // 模拟活动数据
      const activities = [
        {
          id: 1,
          type: 'group',
          title: '3 人拼团享 7 折',
          desc: '邀请好友一起变美，三人成团立享 7 折优惠',
          image: '/assets/activity-group.png',
          endTime: '2026-03-20 23:59:59'
        },
        {
          id: 2,
          type: 'seckill',
          title: '周三秒杀 9.9 元',
          desc: '每周三限量抢购，手慢无',
          image: '/assets/activity-seckill.png',
          endTime: '2026-03-19 10:00:00'
        },
        {
          id: 3,
          type: 'coupon',
          title: '新人礼包 100 元券',
          desc: '首次到店立减 100 元，限首次客户',
          image: '/assets/activity-coupon.png',
          endTime: '2026-03-31 23:59:59'
        }
      ];

      this.setData({
        activities: activities,
        isLoading: false
      });
    } catch (error) {
      console.error('加载活动失败:', error);
      this.setData({ isLoading: false });
    }
  },

  // 切换分类
  switchTab: function (e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ type });
    // 根据类型筛选活动
  },

  // 参与活动
  joinActivity: function (e) {
    const id = e.currentTarget.dataset.id;
    const activity = this.data.activities.find(a => a.id === id);
    
    wx.showToast({
      title: `${activity.title} 功能开发中`,
      icon: 'none'
    });
  },

  // 下拉刷新
  onPullDownRefresh: async function () {
    await this.loadActivities();
    wx.stopPullDownRefresh();
  }
});