# 思雨的个人网站

个人网站，包含照片轮播、AI对话助手和社交媒体链接。

## 🚀 快速部署到GitHub Pages

### 需要复制的文件夹

**复制整个 `test-cursor` 文件夹的所有内容到你的GitHub仓库根目录**

### 文件结构

```
你的GitHub仓库/
├── index.html
├── styles.css
├── script.js
├── images imgs/
│   ├── 3cece2e959e04ca60dea36782e3c428a.jpg
│   └── 3e7014efc9e1936f5070576b4f759cae.jpg
└── weixin.jpg (可选)
```

### 部署步骤

1. **复制文件**：将 `test-cursor` 文件夹中的所有文件复制到GitHub仓库根目录

2. **提交代码**：
   ```bash
   git add .
   git commit -m "部署个人网站"
   git push
   ```

3. **启用GitHub Pages**：
   - 进入仓库 Settings
   - 找到 Pages
   - Source 选择 `main` 分支
   - Folder 选择 `/ (root)`
   - 点击 Save

4. **访问网站**：等待1-2分钟后访问 `https://你的用户名.github.io/仓库名/`

## ✨ 功能特点

- 📸 照片轮播展示
- 🤖 AI对话助手（使用智谱AI）
- 📱 响应式设计
- 🔗 社交媒体链接
- 💬 微信二维码展示

## 📝 注意事项

- 确保 `images imgs` 文件夹已正确复制
- 图片路径已调整为GitHub Pages兼容格式
- API配置保存在浏览器本地存储中
