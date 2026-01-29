# GitHub Pages 部署指南

## 需要部署的文件和文件夹

将以下内容复制到你的GitHub仓库：

### 必需文件（在 test-cursor 文件夹中）：
- ✅ `index.html` - 主页面文件
- ✅ `styles.css` - 样式文件
- ✅ `script.js` - JavaScript功能文件
- ✅ `images imgs/` - 图片文件夹（包含轮播照片）
- ✅ `weixin.jpg` - 微信二维码图片（如果有）

### 可选文件：
- `README.md` - 说明文档
- `DEPLOY.md` - 本部署指南

## 部署步骤

### 方法1：直接部署到仓库根目录（推荐）

1. **复制文件**：
   - 将 `test-cursor` 文件夹中的所有文件复制到GitHub仓库的根目录
   - 确保 `images imgs` 文件夹也被复制

2. **调整路径**（如果需要）：
   - 如果图片路径有问题，将代码中的 `../images imgs/` 改为 `images imgs/`

3. **提交到GitHub**：
   ```bash
   git add .
   git commit -m "部署个人网站"
   git push
   ```

4. **启用GitHub Pages**：
   - 进入仓库 Settings
   - 找到 Pages 设置
   - Source 选择 `main` 分支（或你的主分支）
   - 点击 Save

### 方法2：使用子文件夹部署

如果你想保持 `test-cursor` 文件夹结构：

1. 将整个 `test-cursor` 文件夹复制到GitHub仓库
2. 在 GitHub Pages 设置中，Source 选择 `main` 分支，文件夹选择 `/test-cursor`
3. 访问地址会是：`https://你的用户名.github.io/仓库名/test-cursor/`

## 注意事项

1. **图片路径**：确保图片文件夹名称是 `images imgs`（注意中间有空格）
2. **文件大小**：GitHub对单个文件有100MB限制
3. **访问地址**：部署成功后，网站地址为 `https://你的用户名.github.io/仓库名/`

## 快速检查清单

- [ ] index.html 已复制
- [ ] styles.css 已复制
- [ ] script.js 已复制
- [ ] images imgs 文件夹已复制
- [ ] weixin.jpg 已复制（如果有）
- [ ] GitHub Pages 已启用
- [ ] 路径正确（检查图片是否能正常显示）

## 如果图片不显示

如果部署后图片不显示，检查：
1. 图片文件夹路径是否正确
2. 文件名是否匹配（包括大小写）
3. GitHub Pages 是否已完全部署（可能需要几分钟）
