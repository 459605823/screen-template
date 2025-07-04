# 构建阶段
FROM node:20.17.0-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10.12.2

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 部署阶段
FROM nginx:stable-alpine

# 复制自定义的 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制构建后的文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
