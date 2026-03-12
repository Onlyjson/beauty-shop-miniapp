const express = require('express');
const router = express.Router();
const { User, Member } = require('../models');
const auth = require('../middleware/auth');

// 获取会员信息（需要登录）
router.get('/info', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Member,
        as: 'member',
        attributes: ['id', 'level', 'points', 'balance', 'total_consumption', 'order_count']
      }]
    });

    if (!user || !user.member) {
      return res.status(404).json({ error: '会员信息不存在' });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          birthday: user.birthday
        },
        member: user.member
      }
    });
  } catch (error) {
    console.error('获取会员信息失败:', error);
    res.status(500).json({ error: '获取会员信息失败' });
  }
});

// 积分明细（需要登录）
router.get('/points-log', auth, async (req, res) => {
  try {
    // TODO: 实现积分日志表
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('获取积分明细失败:', error);
    res.status(500).json({ error: '获取积分明细失败' });
  }
});

module.exports = router;