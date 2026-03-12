const express = require('express');
const router = express.Router();
const { Booking, Project, User, Member } = require('../models');
const auth = require('../middleware/auth');

// 创建预约（需要登录）
router.post('/', auth, async (req, res) => {
  try {
    const { projectId, staffId, appointmentTime, duration, remark } = req.body;
    const userId = req.user.id;

    // 验证项目是否存在
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // 验证预约时间
    const appointmentDate = new Date(appointmentTime);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ error: '预约时间不能早于当前时间' });
    }

    // 创建预约
    const booking = await Booking.create({
      user_id: userId,
      project_id: projectId,
      staff_id: staffId,
      appointmentTime: appointmentDate,
      duration: duration || project.duration,
      remark
    });

    // 返回预约信息
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('创建预约失败:', error);
    res.status(500).json({ error: '创建预约失败' });
  }
});

// 获取用户的预约列表（需要登录）
router.get('/my', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const where = { user_id: userId };
    if (status) where.status = status;

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [{
        model: Project,
        attributes: ['id', 'name', 'price', 'duration']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('获取预约列表失败:', error);
    res.status(500).json({ error: '获取预约列表失败' });
  }
});

// 取消预约（需要登录）
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id, user_id: userId }
    });

    if (!booking) {
      return res.status(404).json({ error: '预约不存在' });
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({ error: '该预约无法取消' });
    }

    await booking.cancel();

    res.json({
      success: true,
      message: '预约已取消'
    });
  } catch (error) {
    console.error('取消预约失败:', error);
    res.status(500).json({ error: '取消预约失败' });
  }
});

module.exports = router;