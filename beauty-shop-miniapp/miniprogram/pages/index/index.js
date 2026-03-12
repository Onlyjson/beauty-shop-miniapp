// pages/index/index.js
const app = getApp();
const { api } = require('../../utils/request');
const { formatPrice, formatDuration, formatDistance } = require('../../utils/format');

Page({
  data: {
    banners: [],
    hotProjects: [],
    recommendProjects: [],
    activities: [],
    currentTab: 0,
    isLoading: false
  },

  onLoad: function () {
    this.loadData();
  },

  onShow: function () {
    // 每次显示时刷新数据
    this.loadData();
  },

  // 加载数据
  loadData: async function () {
    this.setData({ isLoading: true });

    try {
      // 获取热门项目
      const hotResult = await api.project.getList({ isHot: 1, limit: 4 });
      
      // 获取推荐项目
      const recommendResult = await api.project.getList({ isRecommend: 1, limit: 4 });

      this.setData({
        hotProjects: hotResult.data || [],
        recommendProjects: recommendResult.data || [],
        isLoading: false
      });
    } catch (error) {
      console.error('加载数据失败:', error);
      this.setData({ isLoading: false });
    }
  },

  // 切换分类
  switchTab: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index });
  },

  // 查看项目详情
  viewProject: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/project-detail/project-detail?id=${id}`
    });
  },

  // 去预约
  goToBooking: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/booking/booking?id=${id}`
    });
  },

  // 查看活动
  viewActivity: function (e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/activity/activity?type=${type}`
    });
  },

  // 下拉刷新
  onPullDownRefresh: async function () {
    await this.loadData();
    wx.stopPullDownRefresh();
  },

  // 搜索
  search: function () {
    wx.search({
      success: (res) => {
        console.log('搜索:', res);
      }
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