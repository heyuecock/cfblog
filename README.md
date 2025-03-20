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

### 安装步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 Workers & Pages

2. 创建 Worker
   - 点击 "Create Worker"
   - 在编辑器中删除默认代码
   - 将 `worker.js` 的全部内容复制粘贴到编辑器中
   - 点击 "Save and Deploy"

3. 创建 KV 命名空间
   - 在左侧导航栏选择 "KV"
   - 点击 "Create namespace"
   - 输入命名空间名称 "CFBLOG"，点击创建

4. 绑定 KV 到 Worker
   - 返回刚创建的 Worker
   - 点击 "Settings" 选项卡
   - 在 "Variables" 部分，点击 "KV Namespace Bindings"
   - 点击 "Add binding"
   - 变量名输入 "CFBLOG"，选择刚创建的 KV 命名空间
   - 点击 "Save"

5. 配置环境变量
   - 同样在 "Variables" 部分，点击 "Environment Variables"
   - 添加以下环境变量：
     - `BLOG_USER`: 后台登录用户名
     - `BLOG_PASSWORD`: 后台登录密码
     - `BLOG_THIRD_TOKEN`: 第三方访问令牌（可选）
     - `BLOG_CACHE_ZONE_ID`: Cloudflare区域ID（可选，用于清理缓存）
     - `BLOG_CACHE_TOKEN`: Cloudflare API令牌（可选，用于清理缓存）
   - 点击 "Save"

6. 配置自定义域名（可选）
   - 在 Cloudflare Dashboard 中，确保已添加您的域名
   - 在 Worker 的 "Triggers" 选项卡中，点击 "Add Custom Domain"
   - 选择您的域名并设置路由，如 `blog.example.com/*`
   - 点击 "Add Custom Domain"

7. 访问博客
   - 如果设置了自定义域名：访问 `https://blog.example.com/admin/login`
   - 如果使用 Workers 默认域名：访问 `https://your-worker-name.your-subdomain.workers.dev/admin/login`
   - 使用配置的用户名和密码登录后台

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
A: 在 Cloudflare 控制台添加域名解析，然后在 Worker 的 "Triggers" 中添加自定义域名。

**Q: 文章图片如何处理？**
A: 推荐使用图床服务，如 GitHub + jsDelivr 的组合或其他免费图床。

**Q: 如何备份数据？**
A: 使用后台的导出功能，定期导出所有文章数据并保存。

**Q: 如何更新 Worker 代码？**
A: 在 Cloudflare Dashboard 中打开您的 Worker，点击 "Quick Edit"，更新代码后点击 "Save and Deploy"。

## 贡献

欢迎贡献代码、报告问题或提出新功能建议！

## 许可证

CFBLOG-Plus 采用 MIT 许可证。

## 鸣谢

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare KV](https://www.cloudflare.com/products/workers-kv/)
- [Editor.md](https://github.com/pandao/editor.md)
- [Mustache.js](https://github.com/janl/mustache.js) 
