const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const auth = require('../middleware/auth');

// 获取项目列表（支持筛选和分页）
exports.getProjects = async (req, res) => {
  try {
    const { category, isHot, isRecommend, page = 1, limit = 10 } = req.query;
    
    const where = { status: 1 }; // 只显示上架的项目
    
    if (category) where.category = category;
    if (isHot) where.isHot = isHot === 'true';
    if (isRecommend) where.isRecommend = isRecommend === 'true';

    const { count, rows } = await Project.findAndCountAll({
      where,
      attributes: ['id', 'name', 'description', 'price', 'originalPrice', 
                    'duration', 'image', 'category', 'isHot', 'sortOrder'],
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({ error: '获取项目列表失败' });
  }
};

// 获取项目详情
exports.getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      attributes: { exclude: ['status', 'sortOrder'] }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.status(500).json({ error: '获取项目详情失败' });
  }
};

module.exports = {
  router,
  getProjects,
  getProjectDetail
};