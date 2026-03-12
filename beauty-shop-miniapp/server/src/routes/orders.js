const express = require('express');
const router = express.Router();
const { Order, Booking, User, Member } = require('../models');
const auth = require('../middleware/auth');

// 创建订单（需要登录）
router.post('/', auth, async (req, res) => {
  try {
    const { items, bookingId, discountCode } = req.body;
    const userId = req.user.id;

    // 获取或创建会员
    const member = await User.findByPk(userId, { include: [{ model: Member, as: 'member' }] });
    
    // 计算订单金额
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // 应用会员折扣
    const memberDiscount = member.member ? member.member.getDiscount() : 0.95;
    totalAmount = parseFloat((totalAmount * memberDiscount).toFixed(2));

    // 创建订单
    const order = await Order.createOrder({
      user_id: userId,
      type: 'service',
      totalAmount,
      discountAmount: 0,
      finalAmount: totalAmount,
      items,
      status: 'unpaid'
    });

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    res.status(500).json({ error: '创建订单失败' });
  }
});

// 获取用户的订单列表（需要登录）
router.get('/my', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const where = { user_id: userId };
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
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
    console.error('获取订单列表失败:', error);
    res.status(500).json({ error: '获取订单列表失败' });
  }
});

// 支付订单（需要登录）
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, user_id: userId, status: 'unpaid' }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在或已支付' });
    }

    // 模拟支付（实际应该调用微信支付接口）
    await order.pay(paymentMethod);

    res.json({
      success: true,
      message: '支付成功'
    });
  } catch (error) {
    console.error('支付失败:', error);
    res.status(500).json({ error: '支付失败' });
  }
});

module.exports = router;