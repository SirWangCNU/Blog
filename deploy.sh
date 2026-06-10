#!/bin/bash
set -e
BLOG_DIR="/root/Blog"
DOMAIN="cnuwang.cn"
DOMAIN_WWW="www.cnuwang.cn"
PORT=3000
NODE_BIN="/home/ubuntu/.nvm/versions/node/v22.22.3/bin/node"
RED="\033[0;31m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"; NC="\033[0m"
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
[ "$EUID" -ne 0 ] && { log_error "请用 sudo 运行"; exit 1; }
[ ! -d "$BLOG_DIR" ] && { log_error "目录不存在: $BLOG_DIR"; exit 1; }
log_info "========== 开始部署 =========="
cd "$BLOG_DIR"
export PATH="/home/ubuntu/.nvm/versions/node/v22.22.3/bin:$PATH"
log_info "[1/4] 安装依赖..."
pnpm install --frozen-lockfile 2>&1 | tail -3
log_info "[2/4] 构建项目..."
pnpm build 2>&1 | tail -5
log_info "[3/4] 重启 PM2..."
pm2 restart blog 2>/dev/null || {
    cat > /tmp/blog-ecosystem.config.js << ENDOFPM2
module.exports = { apps: [{ name: "blog", script: "${BLOG_DIR}/node_modules/next/dist/bin/next", args: "start", cwd: "${BLOG_DIR}", interpreter: "${NODE_BIN}", env: { PORT: ${PORT}, NODE_ENV: "production" } }] };
ENDOFPM2
    pm2 start /tmp/blog-ecosystem.config.js
}
pm2 save
log_info "[4/4] 验证..."
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT} 2>/dev/null)
[ "$HTTP_CODE" = "200" ] && log_info "✅ 部署成功 https://${DOMAIN}" || log_error "❌ 异常 HTTP ${HTTP_CODE}"
