# CFBLOG-Plus

CFBLOG-Plus 是一个基于 Cloudflare Workers 和 KV 存储的轻量级博客系统，无需传统服务器和数据库，完全运行在 Cloudflare 的边缘网络上。

## 特性

- 🚀 基于 Cloudflare Workers，无需服务器，低延迟全球部署
- 📝 支持 Markdown 编辑，内置高级编辑器
- 🗂️ 文章分类、标签、置顶功能
- 🔍 自动生成 sitemap.xml 和 search.xml
- 🌓 支持多种主题切换
- 💻 响应式设计，完美适配移动设备
- 🔒 后台登录认证系统
- 🔄 数据导入导出功能
- ⚡ 代码高亮、复制功能增强
- 🖥️ 简洁易用的管理后台

## 快速开始

### 前置要求

- Cloudflare 账号
- Cloudflare Workers 订阅（免费版即可）
- Wrangler CLI 工具

### 安装步骤

1. 克隆本仓库
   ```bash
   git clone https://github.com/yourusername/cfblog-plus.git
   cd cfblog-plus
   ```

2. 创建 KV 命名空间
   ```bash
   wrangler kv:namespace create "CFBLOG"
   ```

3. 修改 wrangler.toml 配置文件
   ```toml
   name = "cfblog-plus"
   type = "javascript"
   
   account_id = "your_account_id"
   workers_dev = true
   route = "your-blog-domain.com/*"
   zone_id = "your_zone_id"
   
   kv_namespaces = [
     { binding = "CFBLOG", id = "your_kv_namespace_id" }
   ]
   
   [vars]
   BLOG_USER = "your_username"
   BLOG_PASSWORD = "your_password"
   BLOG_THIRD_TOKEN = "your_token"  # 可选
   BLOG_CACHE_ZONE_ID = ""  # 可选，用于自动清理缓存
   BLOG_CACHE_TOKEN = ""  # 可选，用于自动清理缓存
   ```

4. 部署到 Cloudflare Workers
   ```bash
   wrangler publish
   ```

5. 访问 `https://your-blog-domain.com/admin/login` 登录后台

### 环境变量说明

| 变量名 | 说明 | 是否必须 |
|-------|------|---------|
| BLOG_USER | 后台登录用户名 | 是 |
| BLOG_PASSWORD | 后台登录密码 | 是 |
| BLOG_THIRD_TOKEN | 第三方API访问令牌 | 否 |
| BLOG_CACHE_ZONE_ID | Cloudflare区域ID，用于清理缓存 | 否 |
| BLOG_CACHE_TOKEN | Cloudflare API令牌，用于清理缓存 | 否 |

## 配置与自定义

博客的主要配置位于 `worker.js` 文件中的 `OPT` 对象：

- `siteDomain`: 博客域名
- `siteName`: 博客名称
- `themeURL`: 主题地址
- `pageSize`: 每页文章数量
- `readMoreLength`: 摘要长度

更多配置选项请查看代码中的注释说明。

## 主题

CFBLOG-Plus 支持多主题切换，默认内置了 JustNews 主题，您可以基于现有主题创建自己的主题：

- 创建新的主题目录结构
- 修改 `OPT.themeURL` 指向您的主题

## 使用技巧

1. **文章置顶**：在编辑文章时可以选择是否置顶
2. **文章隐藏**：可以临时隐藏文章不在首页显示
3. **导入导出**：通过后台可以导出所有文章数据，便于备份和迁移
4. **代码高亮**：自动为代码块添加语言标识和复制按钮
5. **键盘快捷键**：编辑器内支持多种快捷键操作

## 高级功能

### 清理缓存

当配置了 `BLOG_CACHE_ZONE_ID` 和 `BLOG_CACHE_TOKEN` 后，系统会在文章发布或更新后自动清理 Cloudflare 缓存。

### 多语言支持

主题文件支持多种语言，可以基于主题进行本地化定制。

### 自定义代码

您可以通过 `codeBeforHead` 和 `codeBeforBody` 配置选项添加自定义 CSS 和 JavaScript 代码。

## 常见问题

**Q: 如何添加自定义域名？**
A: 在 Cloudflare 控制台添加域名解析，然后在 wrangler.toml 中配置 route 指向您的域名。

**Q: 文章图片如何处理？**
A: 推荐使用图床服务，如 GitHub + jsDelivr 的组合或其他免费图床。

**Q: 如何备份数据？**
A: 使用后台的导出功能，定期导出所有文章数据并保存。

## 贡献

欢迎贡献代码、报告问题或提出新功能建议！

## 许可证

CFBLOG-Plus 采用 MIT 许可证。

## 鸣谢

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare KV](https://www.cloudflare.com/products/workers-kv/)
- [Editor.md](https://github.com/pandao/editor.md)
- [Mustache.js](https://github.com/janl/mustache.js) 
