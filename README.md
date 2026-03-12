# 美容院微信小程序

一个完整的美容院预约管理系统微信小程序，包含前端小程序和后端服务。

## 🎯 功能特点

### 核心功能
- ✅ **微信一键登录** - 快速注册/登录
- ✅ **项目展示** - 服务项目分类展示
- ✅ **在线预约** - 选择日期、美容师、时间
- ✅ **订单系统** - 创建订单、支付（模拟）
- ✅ **会员中心** - 会员等级、积分、余额
- ✅ **营销活动** - 拼团、秒杀、优惠券

### 会员体系
- **银卡会员** - 消费满¥1000，享 95 折
- **金卡会员** - 消费满¥3000，享 9 折 + 生日礼包
- **钻石会员** - 消费满¥10000，享 85 折 + 专属客服 + 优先预约

## 📱 项目结构

```
beauty-shop-miniapp/
├── server/                    # 后端服务
│   ├── src/
│   │   ├── config/           # 配置文件
│   │   ├── models/           # 数据模型
│   │   ├── controllers/      # 控制器
│   │   ├── routes/           # 路由
│   │   ├── middleware/       # 中间件
│   │   ├── utils/            # 工具函数
│   │   └── server.js         # 入口文件
│   ├── database/             # 数据库脚本
│   ├── logs/                 # 日志目录
│   ├── package.json
│   └── README.md
│
├── miniprogram/              # 小程序前端
│   ├── pages/                # 页面
│   │   ├── index/            # 首页
│   │   ├── booking/          # 预约页
│   │   ├── member/           # 会员中心
│   │   ├── activity/         # 活动页
│   │   ├── user/             # 用户中心
│   │   └── order/            # 订单页
│   ├── utils/                # 工具函数
│   ├── app.js
│   ├── app.json
│   └── app.wxss
│
└── database/                 # 数据库
    ├── migrations/           # 迁移脚本
    └── seeds/                # 种子数据
```

## 🛠 技术栈

### 后端
- **Node.js** + Express
- **MySQL** + Sequelize ORM
- **JWT** 认证
- **Winston** 日志

### 前端
- **微信小程序** 原生开发
- **WXML** + **WXSS** + **JavaScript**

## 🚀 快速开始

### 1. 后端启动

```bash
cd server
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，修改数据库配置

# 初始化数据库
mysql -u root -p beauty_shop < database/migrations/001_init.sql
mysql -u root -p beauty_shop < database/seeds/initial_data.sql

# 启动服务
npm run dev
```

### 2. 小程序开发

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入 `miniprogram` 目录
3. 配置你的小程序 AppID
4. 修改 `app.js` 中的 `baseUrl` 为你的后端地址
5. 编译运行

## 📋 API 接口

### 认证接口
- `POST /api/auth/wechat` - 微信登录

### 项目接口
- `GET /api/projects` - 获取项目列表
- `GET /api/projects/:id` - 获取项目详情

### 预约接口
- `POST /api/bookings` - 创建预约
- `GET /api/bookings/my` - 获取我的预约
- `PUT /api/bookings/:id/cancel` - 取消预约

### 订单接口
- `POST /api/orders` - 创建订单
- `GET /api/orders/my` - 获取我的订单
- `PUT /api/orders/:id/pay` - 支付订单

### 会员接口
- `GET /api/members/info` - 获取会员信息

## 📊 数据库表

- **users** - 用户表
- **members** - 会员表
- **projects** - 服务项目表
- **bookings** - 预约记录表
- **orders** - 订单表
- **coupons** - 优惠券表
- **staffs** - 员工表
- **reviews** - 评价表

## 📝 开发计划

### 第一阶段（已完成）✅
- 用户系统
- 项目展示
- 预约系统
- 订单系统
- 会员管理

### 第二阶段（待开发）
- 拼团系统
- 优惠券系统
- 秒杀活动
- 评价系统
- 数据统计

## 🔧 配置说明

### 环境变量 (.env)

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=beauty_shop
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your-secret-key
```

### 小程序配置

修改 `miniprogram/app.js`:
```javascript
globalData: {
  baseUrl: 'http://localhost:3000' // 修改为你的后端地址
}
```

## 📄 许可证

MIT License

## 👨‍💻 作者

- 开发：[Onlyjson](https://github.com/Onlyjson)

## 📧 联系方式

如有问题，欢迎提交 Issue 或 Pull Request。

---

**开发时间**: 2026-03-12  
**版本**: 1.0.0 (MVP)