#!/bin/bash

# ============================================
# 博客部署脚本
# 用法: ./deploy.sh user@your-server-ip
# ============================================

set -e

SERVER=$1
REMOTE_DIR="/var/www/blog"

if [ -z "$SERVER" ]; then
  echo "❌ 请提供服务器地址"
  echo "用法: ./deploy.sh user@your-server-ip"
  exit 1
fi

echo "🔨 正在本地构建..."
npm run build

echo "📦 正在打包..."
tar -czf blog-deploy.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.next/cache \
  -C . .

echo "📤 正在上传到服务器..."
ssh $SERVER "mkdir -p $REMOTE_DIR"
scp blog-deploy.tar.gz $SERVER:$REMOTE_DIR/

echo "🔧 正在服务器上部署..."
ssh $SERVER << 'EOF'
cd /var/www/blog
tar -xzf blog-deploy.tar.gz
rm blog-deploy.tar.gz

# 安装依赖（生产环境）
npm ci --omit=dev

# 重启 PM2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# 保存 PM2 进程列表（开机自启）
pm2 save

echo "✅ 部署完成！"
EOF

# 清理本地打包文件
rm blog-deploy.tar.gz

echo "🎉 部署成功！访问 http://$SERVER"
