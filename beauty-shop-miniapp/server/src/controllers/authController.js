const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

// 微信小程序登录
exports.wechatLogin = async (req, res) => {
  try {
    const { code, nickname, avatar, phone } = req.body;

    if (!code) {
      return res.status(400).json({ error: '缺少登录凭证' });
    }

    // 调用微信接口获取用户信息
    const wechatUserInfo = await getWechatUserInfo(code);
    
    const { openid, unionid } = wechatUserInfo;

    // 查找或创建用户
    let user = await User.findOne({ where: { openid } });

    if (!user) {
      // 创建新用户
      user = await User.createWithMember({
        openid,
        unionid,
        phone,
        nickname: nickname || wechatUserInfo.nickname,
        avatar: avatar || wechatUserInfo.avatar,
        gender: wechatUserInfo.gender
      });
      logger.info(`新用户注册：${openid}`);
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user.id, openid: user.openid },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回用户信息
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        openid: user.openid,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        birthday: user.birthday
      },
      member: user.member
    });
  } catch (error) {
    logger.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
};

// 获取微信用户信息（需要微信 AppID 和 AppSecret）
async function getWechatUserInfo(code) {
  // 这里需要实现微信接口调用
  // 实际项目中应该调用：https://api.weixin.qq.com/sns/jscode2session
  return {
    openid: 'mock_openid_' + Date.now(),
    unionid: 'mock_unionid_' + Date.now(),
    nickname: '测试用户',
    avatar: 'https://example.com/avatar.jpg',
    gender: 0
  };
}