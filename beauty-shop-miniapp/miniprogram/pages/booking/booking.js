// pages/booking/booking.js
const app = getApp();
const { api } = require('../../utils/request');
const { formatPrice, formatDuration, formatDateTime, getWeekday } = require('../../utils/format');

Page({
  data: {
    projectId: null,
    project: null,
    staffs: [],
    selectedStaff: null,
    date: '',
    timeSlots: [],
    selectedTime: null,
    remark: '',
    isLoading: false
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({ projectId: parseInt(options.id) });
      this.loadProjectDetail();
    }
    // 设置默认日期为明天
    this.setDefaultDate();
  },

  // 设置默认日期为明天
  setDefaultDate: function () {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    this.setData({
      date: `${year}-${month}-${day}`,
      weekday: getWeekday(date)
    });
  },

  // 加载项目详情
  loadProjectDetail: async function () {
    this.setData({ isLoading: true });

    try {
      const result = await api.project.getDetail(this.data.projectId);
      const project = result.data;

      // 获取员工列表
      const staffs = await this.getStaffList();

      this.setData({
        project,
        staffs,
        isLoading: false
      });

      // 生成时间槽
      this.generateTimeSlots();
    } catch (error) {
      console.error('加载项目详情失败:', error);
      this.setData({ isLoading: false });
    }
  },

  // 获取员工列表
  getStaffList: async function () {
    // 模拟数据
    return [
      { id: 1, name: '张美容', avatar: '', description: '8 年美容经验' },
      { id: 2, name: '李护肤', avatar: '', description: '5 年护肤经验' },
      { id: 3, name: '王按摩', avatar: '', description: '10 年按摩经验' }
    ];
  },

  // 生成时间槽
  generateTimeSlots: function () {
    const slots = [];
    const startHour = 10; // 10:00 开始
    const endHour = 19;   // 19:00 结束

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }

    this.setData({ timeSlots: slots });
  },

  // 选择日期
  selectDate: function () {
    wx.showActionSheet({
      itemList: ['明天', '后天', '大后天'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.setDateOffset(1);
        } else if (res.tapIndex === 1) {
          this.setDateOffset(2);
        } else if (res.tapIndex === 2) {
          this.setDateOffset(3);
        }
      }
    });
  },

  // 设置日期偏移
  setDateOffset: function (offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    this.setData({
      date: `${year}-${month}-${day}`,
      weekday: getWeekday(date)
    });
  },

  // 选择美容师
  selectStaff: function (e) {
    const staffId = e.currentTarget.dataset.id;
    const staff = this.data.staffs.find(s => s.id === staffId);
    this.setData({ selectedStaff: staff });
  },

  // 选择时间
  selectTime: function (e) {
    const time = e.currentTarget.dataset.time;
    this.setData({ selectedTime: time });
  },

  // 输入备注
  inputRemark: function (e) {
    this.setData({ remark: e.detail.value });
  },

  // 提交预约
  submitBooking: async function () {
    const { projectId, project, selectedStaff, selectedTime, remark } = this.data;

    if (!selectedStaff) {
      wx.showToast({ title: '请选择美容师', icon: 'none' });
      return;
    }

    if (!selectedTime) {
      wx.showToast({ title: '请选择时间', icon: 'none' });
      return;
    }

    // 组合预约时间
    const appointmentTime = `${this.data.date} ${selectedTime}:00`;

    wx.showLoading({ title: '预约中...' });

    try {
      await api.booking.create({
        projectId,
        staffId: selectedStaff.id,
        appointmentTime,
        duration: project.duration,
        remark
      });

      wx.hideLoading();
      wx.showToast({ title: '预约成功', icon: 'success' });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.hideLoading();
      console.error('预约失败:', error);
      wx.showToast({ title: '预约失败，请重试', icon: 'none' });
    }
  }
});