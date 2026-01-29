// ===== 导航栏滚动效果 =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== 照片轮播功能 =====
// 本地图片路径（相对于 test-cursor 文件夹）
// 请将你的图片放在 images imgs 文件夹中，然后在这里添加文件名
const carouselData = [
    {
        image: '../images imgs/3cece2e959e04ca60dea36782e3c428a.jpg',
        caption: '精选照片 1'
    },
    {
        image: '../images imgs/3e7014efc9e1936f5070576b4f759cae.jpg',
        caption: '精选照片 2'
    }
    // 如果需要添加更多图片，可以继续添加：
    // {
    //     image: '../images imgs/你的图片文件名.jpg',
    //     caption: '精选照片 3'
    // }
];

let currentSlide = 0;

function initCarousel() {
    const slidesContainer = document.getElementById('carouselSlides');
    const indicatorsContainer = document.getElementById('indicators');
    const captionElement = document.getElementById('carouselCaption');
    
    // 创建幻灯片
    carouselData.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${item.image}" alt="照片 ${index + 1}">`;
        slidesContainer.appendChild(slide);
        
        // 创建指示器
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // 更新标题
    updateCaption();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(-${currentSlide * 100}%)`;
    });
    
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    updateCaption();
}

function updateCaption() {
    const captionElement = document.getElementById('carouselCaption');
    captionElement.textContent = carouselData[currentSlide].caption;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselData.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// 自动轮播
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// 初始化轮播
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // 鼠标悬停时停止自动播放
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
        carouselWrapper.addEventListener('mouseleave', startAutoSlide);
    }
    
    // 延迟启动自动播放，确保图片加载完成
    setTimeout(() => {
        if (carouselData.length > 0) {
            startAutoSlide();
        }
    }, 1000);
});

// ===== AI 对话功能 =====
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearChat');

// ===== 免费AI API 配置 =====
const API_CONFIG_STORAGE = 'free_ai_api_config';
const CHAT_HISTORY_STORAGE = 'chat_history';

// 默认API配置 - 已配置智谱AI
const DEFAULT_API_CONFIG = {
    type: 'zhipu', // 'free', 'zhipu' 或 'custom'
    apiKey: '74fc7a6ed54a44dda95cffcdf22c450f.ZdNkJMgRTUHjwIuw', // 智谱AI API Key
    model: 'glm-4' // 智谱AI模型
};

// 获取API配置
function getApiConfig() {
    const saved = localStorage.getItem(API_CONFIG_STORAGE);
    if (saved) {
        return JSON.parse(saved);
    }
    return DEFAULT_API_CONFIG;
}

// 保存API配置
function saveApiConfig(config) {
    localStorage.setItem(API_CONFIG_STORAGE, JSON.stringify(config));
}

// 获取保存的 API Key（兼容旧版本）
function getApiKey() {
    const config = getApiConfig();
    return config.apiKey || '';
}

// 获取对话历史
function getChatHistory() {
    const history = localStorage.getItem(CHAT_HISTORY_STORAGE);
    return history ? JSON.parse(history) : [];
}

// 保存对话历史
function saveChatHistory(messages) {
    // 只保存最近20条消息，避免超出token限制
    const recentMessages = messages.slice(-20);
    localStorage.setItem(CHAT_HISTORY_STORAGE, JSON.stringify(recentMessages));
}

// 清空对话历史
function clearChatHistory() {
    localStorage.removeItem(CHAT_HISTORY_STORAGE);
}

// 调用免费AI API
async function getAIResponse(userMessage) {
    const config = getApiConfig();
    
    // 调试信息：输出当前配置
    console.log('当前API配置:', {
        type: config.type,
        hasApiKey: !!config.apiKey,
        apiKeyLength: config.apiKey ? config.apiKey.length : 0,
        baseUrl: config.baseUrl
    });
    
    // 获取对话历史
    let messages = getChatHistory();
    
    // 如果是第一条消息，添加系统提示
    if (messages.length === 0) {
        messages.push({
            role: 'system',
            content: `你是一个友好的AI助手，帮助用户了解这个个人网站的主人思雨。以下是思雨的个人信息：

姓名：思雨
出生年份：1994年
星座：巨蟹座
职业：市场洞察工作人员
兴趣爱好：爬山

关于工作：思雨是一名市场洞察工作人员，专注于市场分析和数据洞察，致力于帮助企业做出更明智的决策。她擅长通过数据分析、市场调研和趋势研究，为企业提供有价值的市场洞察和战略建议。

关于兴趣：思雨喜欢爬山，在山间行走让她能够放松身心，感受大自然的魅力，同时也锻炼了她的毅力和耐力。

当用户问到关于思雨的问题时，请根据以上信息友好地回答。你可以回答关于她的工作、兴趣、性格特点等方面的问题。`
        });
    }
    
    // 添加用户消息
    messages.push({
        role: 'user',
        content: userMessage
    });
    
    try {
        let apiUrl, apiHeaders, requestBody;
        
        if (config.type === 'zhipu') {
            // 使用智谱AI API
            if (!config.apiKey || config.apiKey.trim() === '') {
                throw new Error('智谱AI API Key 未设置，请在设置中配置API Key');
            }
            // 智谱AI API端点：https://open.bigmodel.cn/api/paas/v4
            // 聊天接口完整路径：https://open.bigmodel.cn/api/paas/v4/chat/completions
            apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
            apiHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey.trim()}`
            };
            requestBody = {
                model: config.model || 'glm-4',
                messages: messages,
                stream: false,
                temperature: 0.7,
                max_tokens: 1000
            };
            console.log('使用智谱AI API，URL:', apiUrl);
        } else if (config.type === 'custom' && config.baseUrl) {
            // 使用自定义API
            apiUrl = config.baseUrl;
            apiHeaders = {
                'Content-Type': 'application/json'
            };
            if (config.apiKey) {
                apiHeaders['Authorization'] = `Bearer ${config.apiKey}`;
            }
            requestBody = {
                model: config.model || 'gpt-3.5-turbo',
                messages: messages,
                stream: false,
                temperature: 0.7,
                max_tokens: 1000
            };
        } else {
            // 使用免费API，尝试多个端点
            const freeEndpoints = [
                {
                    url: 'https://api.chatanywhere.tech/v1/chat/completions',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer sk-free'
                    },
                    body: {
                        model: 'gpt-3.5-turbo',
                        messages: messages,
                        stream: false,
                        temperature: 0.7,
                        max_tokens: 1000
                    }
                },
                {
                    url: 'https://aichat.api.ecylt.top/api/chat',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        q: userMessage
                    },
                    transformResponse: (data) => {
                        // 处理简单API的响应格式
                        if (data.text) return data.text;
                        if (data.content) return data.content;
                        if (data.message) return data.message;
                        return JSON.stringify(data);
                    }
                }
            ];
            
            // 尝试每个免费API端点
            let lastError = null;
            for (const endpoint of freeEndpoints) {
                try {
                    const response = await fetch(endpoint.url, {
                        method: 'POST',
                        headers: endpoint.headers,
                        body: JSON.stringify(endpoint.body)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    // 处理响应
                    let aiResponse;
                    if (endpoint.transformResponse) {
                        aiResponse = endpoint.transformResponse(data);
                    } else if (data.choices && data.choices[0] && data.choices[0].message) {
                        aiResponse = data.choices[0].message.content;
                    } else if (data.text) {
                        aiResponse = data.text;
                    } else if (data.content) {
                        aiResponse = data.content;
                    } else {
                        throw new Error('无法解析API响应');
                    }
                    
                    // 添加 AI 回复到历史记录
                    messages.push({
                        role: 'assistant',
                        content: aiResponse
                    });
                    
                    // 保存更新后的对话历史
                    saveChatHistory(messages);
                    
                    return aiResponse;
                } catch (error) {
                    lastError = error;
                    console.log(`API端点 ${endpoint.url} 失败:`, error);
                    continue;
                }
            }
            
            throw lastError || new Error('所有免费API端点都不可用');
        }
        
        // 调用智谱AI或自定义API
        console.log('发送API请求:', { url: apiUrl, method: 'POST' });
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify(requestBody)
        });
        
        console.log('API响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: await response.text().catch(() => '未知错误') };
            }
            console.error('API错误响应:', errorData);
            const errorMsg = errorData.error?.message || errorData.message || errorData.msg || `API 错误: ${response.status} ${response.statusText}`;
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        
        // 处理智谱AI和OpenAI格式的响应
        let aiResponse;
        if (data.choices && data.choices[0] && data.choices[0].message) {
            // OpenAI标准格式（智谱AI也使用此格式）
            aiResponse = data.choices[0].message.content;
        } else if (data.text) {
            aiResponse = data.text;
        } else if (data.content) {
            aiResponse = data.content;
        } else {
            throw new Error('无法解析API响应格式');
        }
        
        // 添加 AI 回复到历史记录
        messages.push({
            role: 'assistant',
            content: aiResponse
        });
        
        // 保存更新后的对话历史
        saveChatHistory(messages);
        
        return aiResponse;
        
    } catch (error) {
        console.error('AI API 错误详情:', {
            message: error.message,
            stack: error.stack,
            config: config
        });
        
        // 根据错误类型返回不同的提示
        if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('认证')) {
            return `API 认证失败：${error.message}。请检查API Key是否正确，或重新在设置中配置。`;
        } else if (error.message.includes('429')) {
            return 'API 调用频率过高，请稍后再试。';
        } else if (error.message.includes('network') || error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
            const config = getApiConfig();
            if (config.type === 'zhipu') {
                return `网络连接失败。当前使用智谱AI API。请检查：\n1. 网络连接是否正常\n2. API Key是否正确（当前配置类型：${config.type}）\n3. 浏览器控制台是否有CORS错误\n\n错误详情：${error.message}`;
            } else {
                return '网络连接失败，请检查你的网络连接。如果问题持续，可能是免费API服务暂时不可用，可以尝试在设置中切换到智谱AI或其他API。';
            }
        } else if (error.message.includes('未设置') || error.message.includes('未配置')) {
            return error.message + ' 请点击右上角的设置按钮（⚙️）进行配置。';
        } else {
            return `抱歉，发生了错误：${error.message}。\n\n当前配置：${config.type || 'free'}\n请检查API设置或稍后再试。`;
        }
    }
}

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${isUser ? 'user' : 'ai'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser 
        ? '<i class="fas fa-user"></i>' 
        : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    content.appendChild(textDiv);
    content.appendChild(timeDiv);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, true);
    chatInput.value = '';
    
    // 显示加载状态
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        // 获取AI回复
        const response = await getAIResponse(message);
        addMessage(response, false);
    } catch (error) {
        addMessage('抱歉，我遇到了一些问题。请稍后再试。', false);
        console.error('AI回复错误:', error);
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

// 发送按钮点击事件
sendBtn.addEventListener('click', sendMessage);

// 输入框回车事件
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 清空对话
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有对话吗？')) {
        chatMessages.innerHTML = `
            <div class="message message-ai">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">你好！我是思雨的AI助手，有什么可以帮你的吗？我可以回答关于思雨的工作、兴趣、生活等方面的问题。</div>
                    <div class="message-time">刚刚</div>
                </div>
            </div>
        `;
            // 同时清空对话历史
            clearChatHistory();
        }
    });
}

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 微信二维码模态框 =====
const wechatLink = document.getElementById('wechatLink');
const wechatModal = document.getElementById('wechatModal');
const closeModal = document.getElementById('closeModal');

// 打开模态框
if (wechatLink) {
    wechatLink.addEventListener('click', function(e) {
        e.preventDefault();
        wechatModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
}

// 关闭模态框
if (closeModal) {
    closeModal.addEventListener('click', function() {
        wechatModal.classList.remove('show');
        document.body.style.overflow = ''; // 恢复滚动
    });
}

// 点击模态框背景关闭
if (wechatModal) {
    wechatModal.addEventListener('click', function(e) {
        if (e.target === wechatModal) {
            wechatModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// ESC键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && wechatModal.classList.contains('show')) {
        wechatModal.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// ===== 微信二维码图片上传和管理 =====
const QRCODE_STORAGE_KEY = 'wechat_qrcode_image';

// 检查localStorage中是否已有保存的图片
function loadSavedQRCode() {
    const savedImage = localStorage.getItem(QRCODE_STORAGE_KEY);
    const qrcodeImage = document.getElementById('qrcodeImage');
    const qrcodeUpload = document.getElementById('qrcodeUpload');
    const qrcodePlaceholder = document.getElementById('qrcodePlaceholder');
    
    if (savedImage) {
        // 有保存的图片，显示图片，隐藏上传区域
        qrcodeImage.src = savedImage;
        qrcodeImage.style.display = 'block';
        qrcodeImage.onerror = function() {
            handleImageError(qrcodeImage);
        };
        if (qrcodeUpload) qrcodeUpload.style.display = 'none';
        if (qrcodePlaceholder) qrcodePlaceholder.style.display = 'none';
        return true;
    } else {
        // 尝试加载本地文件
        tryLoadLocalImage();
        return false;
    }
}

// 尝试加载本地图片文件
function tryLoadLocalImage() {
    const qrcodeImage = document.getElementById('qrcodeImage');
    const qrcodeUpload = document.getElementById('qrcodeUpload');
    
    // 可能的本地文件名
    const localFiles = ['weixin.jpg', 'wechat-qrcode.jpg', 'wechat-qrcode.png', '微信二维码.jpg'];
    let currentIndex = 0;
    
    function tryNext() {
        if (currentIndex >= localFiles.length) {
            // 所有文件都尝试过了，显示上传区域
            qrcodeImage.style.display = 'none';
            if (qrcodeUpload) qrcodeUpload.style.display = 'flex';
            return;
        }
        
        const img = new Image();
        img.onload = function() {
            // 找到图片了，保存到localStorage并显示
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            saveQRCode(dataUrl);
        };
        img.onerror = function() {
            // 这个文件不存在，尝试下一个
            currentIndex++;
            tryNext();
        };
        img.src = localFiles[currentIndex];
    }
    
    tryNext();
}

// 保存图片到localStorage
function saveQRCode(imageDataUrl) {
    localStorage.setItem(QRCODE_STORAGE_KEY, imageDataUrl);
    loadSavedQRCode();
}

// 删除保存的图片
function clearSavedQRCode() {
    localStorage.removeItem(QRCODE_STORAGE_KEY);
    loadSavedQRCode();
}

// 图片加载错误处理
function handleImageError(img) {
    img.style.display = 'none';
    const placeholder = document.getElementById('qrcodePlaceholder');
    const upload = document.getElementById('qrcodeUpload');
    if (placeholder) {
        placeholder.style.display = 'flex';
    }
    if (upload) {
        upload.style.display = 'none';
    }
}

// 初始化上传功能
function initQRCodeUpload() {
    const fileInput = document.getElementById('qrcodeFileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const reuploadBtn = document.getElementById('reuploadBtn');
    const previewImage = document.getElementById('previewImage');
    const uploadPreview = document.getElementById('uploadPreview');
    const qrcodeImage = document.getElementById('qrcodeImage');
    
    // 点击上传按钮触发文件选择
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    // 文件选择处理
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // 检查文件类型
            if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
                alert('请选择 JPG 或 PNG 格式的图片！');
                return;
            }
            
            // 检查文件大小（5MB）
            if (file.size > 5 * 1024 * 1024) {
                alert('图片大小不能超过 5MB！');
                return;
            }
            
            // 读取文件并显示预览
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                uploadPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 确认使用图片
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const imageDataUrl = previewImage.src;
            if (imageDataUrl) {
                saveQRCode(imageDataUrl);
                // 重置上传区域
                uploadPreview.style.display = 'none';
                if (fileInput) fileInput.value = '';
                alert('二维码图片已保存！');
            }
        });
    }
    
    // 取消选择
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            uploadPreview.style.display = 'none';
            if (fileInput) fileInput.value = '';
            previewImage.src = '';
        });
    }
    
    // 重新上传
    if (reuploadBtn) {
        reuploadBtn.addEventListener('click', function() {
            clearSavedQRCode();
        });
    }
}

// 更新API状态显示
function updateApiStatusBadge() {
    const badge = document.getElementById('apiStatusBadge');
    if (!badge) return;
    
    const config = getApiConfig();
    let text = '';
    let title = '';
    
    switch(config.type) {
        case 'zhipu':
            text = '智谱AI';
            title = '当前使用：智谱AI API';
            break;
        case 'custom':
            text = '自定义';
            title = '当前使用：自定义API';
            break;
        default:
            text = '免费';
            title = '当前使用：免费API模式';
    }
    
    badge.textContent = text;
    badge.title = title;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已有配置，如果没有则使用默认配置
    const existingConfig = localStorage.getItem(API_CONFIG_STORAGE);
    if (!existingConfig) {
        // 首次加载，使用默认的智谱AI配置
        saveApiConfig(DEFAULT_API_CONFIG);
        console.log('已自动配置智谱AI API');
    }
    
    // 初始化 API 设置（需要在 DOM 加载后）
    initApiSettings();
    // 更新API状态显示
    updateApiStatusBadge();
});

window.addEventListener('load', function() {
    loadSavedQRCode();
    initQRCodeUpload();
});

// ===== API 设置功能 =====
function initApiSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const apiSettingsModal = document.getElementById('apiSettingsModal');
    const closeApiModal = document.getElementById('closeApiModal');
    const apiTypeSelect = document.getElementById('apiTypeSelect');
    const zhipuApiGroup = document.getElementById('zhipuApiGroup');
    const zhipuApiKeyInput = document.getElementById('zhipuApiKeyInput');
    const customApiGroup = document.getElementById('customApiGroup');
    const apiUrlInput = document.getElementById('apiUrlInput');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const testApiKeyBtn = document.getElementById('testApiKey');
    const apiStatus = document.getElementById('apiStatus');
    
    // 加载已保存的配置
    function loadConfig() {
        const config = getApiConfig();
        if (apiTypeSelect) {
            apiTypeSelect.value = config.type || 'free';
        }
        if (zhipuApiKeyInput) {
            // 如果是智谱AI模式，显示保存的API Key
            zhipuApiKeyInput.value = config.type === 'zhipu' ? (config.apiKey || '') : '';
        }
        if (apiUrlInput) {
            apiUrlInput.value = config.baseUrl || '';
        }
        if (apiKeyInput) {
            // 只在自定义模式下显示API Key
            apiKeyInput.value = config.type === 'custom' ? (config.apiKey || '') : '';
        }
        updateApiVisibility();
    }
    
    // 更新API区域的显示
    function updateApiVisibility() {
        const apiType = apiTypeSelect ? apiTypeSelect.value : 'free';
        if (zhipuApiGroup) {
            zhipuApiGroup.style.display = apiType === 'zhipu' ? 'block' : 'none';
        }
        if (customApiGroup) {
            customApiGroup.style.display = apiType === 'custom' ? 'block' : 'none';
        }
    }
    
    // API类型切换
    if (apiTypeSelect) {
        apiTypeSelect.addEventListener('change', updateApiVisibility);
    }
    
    // 打开设置模态框
    if (settingsBtn && apiSettingsModal) {
        settingsBtn.addEventListener('click', () => {
            apiSettingsModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            loadConfig();
        });
    }
    
    // 关闭设置模态框
    if (closeApiModal && apiSettingsModal) {
        closeApiModal.addEventListener('click', () => {
            apiSettingsModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
    
    // 点击背景关闭
    if (apiSettingsModal) {
        apiSettingsModal.addEventListener('click', (e) => {
            if (e.target === apiSettingsModal) {
                apiSettingsModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && apiSettingsModal && apiSettingsModal.classList.contains('show')) {
            apiSettingsModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // 保存配置
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', () => {
            const apiType = apiTypeSelect ? apiTypeSelect.value : 'free';
            
            if (apiType === 'zhipu') {
                const apiKey = zhipuApiKeyInput ? zhipuApiKeyInput.value.trim() : '';
                if (!apiKey) {
                    showApiStatus('请输入智谱AI API Key', 'error');
                    return;
                }
                
                const config = {
                    type: 'zhipu',
                    apiKey: apiKey,
                    model: 'glm-4'
                };
                saveApiConfig(config);
            } else if (apiType === 'custom') {
                const apiUrl = apiUrlInput ? apiUrlInput.value.trim() : '';
                if (!apiUrl) {
                    showApiStatus('请输入API地址', 'error');
                    return;
                }
                
                const config = {
                    type: 'custom',
                    baseUrl: apiUrl,
                    apiKey: apiKeyInput ? apiKeyInput.value.trim() : '',
                    model: 'gpt-3.5-turbo'
                };
                saveApiConfig(config);
            } else {
                // 免费模式，使用默认配置
                saveApiConfig(DEFAULT_API_CONFIG);
            }
            
            showApiStatus('配置已保存！', 'success');
            
            // 更新状态显示
            updateApiStatusBadge();
            
            // 2秒后关闭模态框
            setTimeout(() => {
                if (apiSettingsModal) {
                    apiSettingsModal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }, 1500);
        });
    }
    
    // 测试 API 连接
    if (testApiKeyBtn) {
        testApiKeyBtn.addEventListener('click', async () => {
            const apiType = apiTypeSelect ? apiTypeSelect.value : 'free';
            let testUrl, testHeaders, testBody;
            
            if (apiType === 'zhipu') {
                const apiKey = zhipuApiKeyInput ? zhipuApiKeyInput.value.trim() : '';
                if (!apiKey) {
                    showApiStatus('请先输入智谱AI API Key', 'error');
                    return;
                }
                // 智谱AI API端点：https://open.bigmodel.cn/api/paas/v4
                // 聊天接口完整路径：https://open.bigmodel.cn/api/paas/v4/chat/completions
                testUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
                testHeaders = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                testBody = {
                    model: 'glm-4',
                    messages: [{ role: 'user', content: '你好' }],
                    stream: false,
                    max_tokens: 10
                };
            } else if (apiType === 'custom') {
                const apiUrl = apiUrlInput ? apiUrlInput.value.trim() : '';
                if (!apiUrl) {
                    showApiStatus('请先输入API地址', 'error');
                    return;
                }
                testUrl = apiUrl;
                testHeaders = {
                    'Content-Type': 'application/json'
                };
                const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
                if (apiKey) {
                    testHeaders['Authorization'] = `Bearer ${apiKey}`;
                }
                testBody = {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: '你好' }],
                    stream: false,
                    max_tokens: 10
                };
            } else {
                // 测试免费API
                testUrl = 'https://api.chatanywhere.tech/v1/chat/completions';
                testHeaders = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-free'
                };
                testBody = {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: '你好' }],
                    stream: false,
                    max_tokens: 10
                };
            }
            
            showApiStatus('正在测试连接...', 'loading');
            testApiKeyBtn.disabled = true;
            
            try {
                const response = await fetch(testUrl, {
                    method: 'POST',
                    headers: testHeaders,
                    body: JSON.stringify(testBody)
                });
                
                if (response.ok) {
                    showApiStatus('✓ API 连接成功！', 'success');
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMsg = errorData.error?.message || `连接失败 (${response.status})`;
                    showApiStatus(`✗ ${errorMsg}`, 'error');
                }
            } catch (error) {
                showApiStatus(`✗ 连接失败: ${error.message}`, 'error');
            } finally {
                testApiKeyBtn.disabled = false;
            }
        });
    }
    
    // 显示状态信息
    function showApiStatus(message, type) {
        if (!apiStatus) return;
        apiStatus.textContent = message;
        apiStatus.className = `api-status show ${type}`;
        
        // 3秒后自动隐藏（成功和错误消息）
        if (type !== 'loading') {
            setTimeout(() => {
                apiStatus.classList.remove('show');
            }, 3000);
        }
    }
    
    // 初始化
    loadConfig();
    
    // 点击状态徽章显示配置信息
    const apiStatusBadge = document.getElementById('apiStatusBadge');
    if (apiStatusBadge) {
        apiStatusBadge.addEventListener('click', () => {
            const config = getApiConfig();
            const info = `当前API配置：
类型：${config.type || 'free'}
${config.type === 'zhipu' ? `API Key：${config.apiKey ? config.apiKey.substring(0, 10) + '...' : '未设置'}` : ''}
${config.type === 'custom' ? `API地址：${config.baseUrl || '未设置'}` : ''}
${config.type === 'free' ? '使用免费API模式' : ''}

点击设置按钮可以修改配置。`;
            alert(info);
        });
    }
}

// ===== 真实AI API集成示例（需要替换API密钥） =====
/*
// 使用OpenAI API的示例代码（需要替换为你的API密钥）
async function getAIResponseWithOpenAI(userMessage) {
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
        throw error;
    }
}
*/
