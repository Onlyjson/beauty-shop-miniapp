const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 微信小程序登录
router.post('/wechat', authController.wechatLogin);

module.exports = router;