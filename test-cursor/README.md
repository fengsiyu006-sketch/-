# 个人网站 - 单页面应用

一个简洁现代的个人网站，包含照片轮播、AI对话界面和社交媒体链接。

## 功能特点

- ✅ 响应式设计，适配各种设备
- ✅ 照片轮播展示（自动播放 + 手动控制）
- ✅ AI对话界面（类似OpenAI风格）
- ✅ 平滑滚动导航
- ✅ 现代化UI设计
- ✅ 纯前端实现，无需后端服务器

## 文件结构

```
.
├── index.html      # 主HTML文件
├── styles.css      # 样式文件
├── script.js       # JavaScript功能
└── README.md       # 说明文档
```

## 使用方法

1. **直接打开**：双击 `index.html` 文件即可在浏览器中查看

2. **本地服务器**（推荐）：
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 或使用Node.js
   npx http-server
   ```
   然后访问 `http://localhost:8000`

## 自定义内容

### 1. 修改个人信息

编辑 `index.html` 中的以下内容：
- **名字/Logo**：第24行的 `.logo` 部分
- **Hero标题**：第33行的 `.hero-title`
- **Hero副标题**：第34行的 `.hero-subtitle`
- **关于我内容**：第88-103行的 `.about-text` 部分

### 2. 更换照片

在 `script.js` 文件中修改 `carouselData` 数组（第3-20行）：
```javascript
const carouselData = [
    {
        image: '你的图片URL',
        caption: '图片说明文字'
    },
    // 添加更多照片...
];
```

**关于我**部分的照片在 `index.html` 第87行，修改 `src` 属性即可。

### 3. 更新社交媒体链接

在 `index.html` 第110-124行，修改 `href` 属性为你的实际链接：
```html
<a href="你的微信链接" class="social-link" title="微信">
    <i class="fab fa-weixin"></i>
</a>
```

### 4. 集成真实AI API

当前使用的是模拟AI回复。要集成真实的AI服务：

#### 方法1：使用OpenAI API

1. 在 `script.js` 中找到 `getAIResponse` 函数（第75行）
2. 取消注释文件末尾的 `getAIResponseWithOpenAI` 函数示例
3. 替换 `YOUR_API_KEY_HERE` 为你的OpenAI API密钥
4. 修改 `getAIResponse` 函数调用真实API：

```javascript
async function getAIResponse(userMessage) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY_HERE'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个友好的AI助手，帮助用户了解这个个人网站的主人。'
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API错误:', error);
        return '抱歉，我遇到了一些问题。请稍后再试。';
    }
}
```

**⚠️ 注意**：直接在客户端使用API密钥不安全，建议：
- 使用环境变量（但前端仍可能暴露）
- 创建后端代理API（推荐）
- 使用服务端渲染

#### 方法2：使用其他AI服务

可以替换为任何提供HTTP API的AI服务，如：
- Claude API
- 文心一言API
- 通义千问API
- 自定义后端API

## 技术栈

- **HTML5**：页面结构
- **CSS3**：样式和动画
- **JavaScript (ES6+)**：交互功能
- **Font Awesome**：图标（CDN）
- **Google Fonts**：字体（CDN）

## 浏览器支持

- Chrome/Edge（最新版本）
- Firefox（最新版本）
- Safari（最新版本）
- 移动浏览器

## 注意事项

1. **图片资源**：当前使用Unsplash占位图，请替换为你的实际图片
2. **API密钥**：如果使用AI API，注意保护你的密钥安全
3. **CDN依赖**：需要网络连接以加载Google Fonts和Font Awesome

## 许可证

MIT License - 可自由使用和修改
