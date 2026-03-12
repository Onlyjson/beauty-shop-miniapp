const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth');

// 获取用户信息（需要登录）
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nickname', 'avatar', 'phone', 'gender', 'birthday']
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息（需要登录）
router.put('/profile', auth, async (req, res) => {
  try {
    const { nickname, avatar, phone, birthday } = req.body;
    
    await User.update(
      { nickname, avatar, phone, birthday },
      { where: { id: req.user.id } }
    );

    res.json({
      success: true,
      message: '个人信息更新成功'
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

module.exports = router;