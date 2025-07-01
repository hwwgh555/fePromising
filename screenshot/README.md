# 浏览器原生截图能力示例

## 概述

本示例展示了三种不使用第三方库的浏览器原生截图方法：

1. **Screen Capture API** - 捕获屏幕/窗口/标签页
2. **Canvas API** - 手动绘制内容并导出
3. **SVG 转换** - 将SVG内容转换为图片

## 文件说明

- `browser-screenshot-demo.html` - 完整的演示页面（三种方法综合展示）
- `self-page-capture.html` - 专门演示截图自己页面的示例
- `troubleshooting.html` - 故障排除指南（解决无法选择自己页面的问题）
- `index.html` - 另一个实现版本（如果存在）
- `README.md` - 本说明文档

## 三种方法详解

### 1. Screen Capture API (getDisplayMedia)

**优点：**
- 最直接的截图方式
- 可以捕获整个屏幕、应用窗口或浏览器标签页
- 质量高，包含所有视觉效果

**缺点：**
- 需要用户手动选择捕获内容
- 需要用户授权
- 不能自动化执行

**代码示例：**
```javascript
// 开始屏幕捕获
const mediaStream = await navigator.mediaDevices.getDisplayMedia({
    video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
    audio: false
});

// 将流绑定到video元素
videoElement.srcObject = mediaStream;

// 截图
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = videoElement.videoWidth;
canvas.height = videoElement.videoHeight;
ctx.drawImage(videoElement, 0, 0);

// 导出为图片
const dataURL = canvas.toDataURL('image/png');
```

### 2. Canvas API

**优点：**
- 可以精确控制截图内容
- 可以程序化生成图片
- 不需要用户交互

**缺点：**
- 需要手动绘制所有内容
- 无法直接截取DOM元素
- 复杂布局实现困难

**代码示例：**
```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// 绘制渐变背景
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#ff6b6b');
gradient.addColorStop(1, '#4ecdc4');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 绘制文字
ctx.fillStyle = 'white';
ctx.font = 'bold 20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Hello World', canvas.width/2, canvas.height/2);

// 导出图片
const dataURL = canvas.toDataURL('image/png');
```

### 3. SVG 转换

**优点：**
- 矢量图形，可缩放
- 支持复杂的图形和文字
- 文件体积小

**缺点：**
- 功能有限，不支持所有CSS样式
- 字体兼容性问题
- 某些浏览器支持不完全

**代码示例：**
```javascript
const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b6b"/>
            <stop offset="100%" style="stop-color:#4ecdc4"/>
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20">Hello World</text>
</svg>`;

// 转换为图片
const img = new Image();
img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
};

const blob = new Blob([svgString], {type: 'image/svg+xml'});
img.src = URL.createObjectURL(blob);
```

## 浏览器兼容性

| 方法 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Screen Capture API | ✅ 72+ | ✅ 66+ | ✅ 13+ | ✅ 79+ |
| Canvas API | ✅ 全部 | ✅ 全部 | ✅ 全部 | ✅ 全部 |
| SVG 转换 | ✅ 全部 | ✅ 全部 | ✅ 全部 | ✅ 全部 |

## 使用建议

1. **全屏截图** - 使用 Screen Capture API
2. **自动化截图** - 使用 Canvas API 或 SVG 转换
3. **简单图形** - 使用 SVG 转换
4. **复杂内容** - 使用 Canvas API

## Screen Capture API 可以截图自己页面吗？

**答案：完全可以！** 这是一个常见且实用的功能。

### 📋 如何截图自己页面

1. **调用API**：使用 `navigator.mediaDevices.getDisplayMedia()` 
2. **用户选择**：在弹出的选择框中选择 "浏览器标签页" 或当前标签页
3. **开始捕获**：浏览器开始捕获当前页面内容
4. **生成截图**：将视频流绘制到Canvas并导出为图片

### ✨ 优势特点

- **动态内容**：可以捕获CSS动画、JavaScript动态更新的内容
- **高质量**：截图质量与屏幕分辨率一致
- **完整页面**：包含所有可见的UI元素和样式
- **实时状态**：捕获截图时刻的页面状态

### ⚠️ 注意事项

- **递归镜像**：如果页面显示自己的截图预览，会产生无穷镜像效果
- **用户授权**：必须由用户手动选择要捕获的内容
- **隐私提示**：浏览器会显示正在录制的提示
- **性能影响**：大页面截图可能影响性能

### 🔧 实际应用场景

- **页面演示**：制作产品功能演示截图
- **错误报告**：生成包含完整页面状态的bug报告
- **用户手册**：自动生成操作步骤截图
- **自动化测试**：验证页面渲染效果
- **内容分享**：快速生成页面快照分享到社交媒体

### 💻 示例代码

```javascript
// 截图自己页面的完整示例
async function captureCurrentPage() {
    try {
        // 请求屏幕捕获权限
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        
        // 创建video元素
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        // 等待视频加载
        video.onloadedmetadata = () => {
            // 创建canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // 绘制视频帧到canvas
            ctx.drawImage(video, 0, 0);
            
            // 导出为图片
            const dataURL = canvas.toDataURL('image/png');
            
            // 下载截图
            const link = document.createElement('a');
            link.download = 'page-screenshot.png';
            link.href = dataURL;
            link.click();
            
            // 停止捕获
            stream.getTracks().forEach(track => track.stop());
        };
        
    } catch (error) {
        console.error('截图失败:', error);
    }
}
```

## 通用注意事项

1. **安全限制**：出于安全考虑，浏览器对截图功能有严格限制
2. **用户授权**：Screen Capture API 需要用户明确授权
3. **跨域限制**：某些内容可能因跨域策略无法截图
4. **性能考虑**：大尺寸截图可能影响性能

## 运行示例

### 综合演示
1. 在浏览器中打开 `browser-screenshot-demo.html`
2. 尝试三种不同的截图方法
3. 查看生成的截图效果
4. 可以下载生成的截图文件

### 自页面截图演示
1. 在浏览器中打开 `self-page-capture.html`
2. 点击"截图当前页面"按钮
3. 在弹出框中选择"浏览器标签页"或当前标签页
4. 观察页面被自己截图的效果（包含动态内容）
5. 截图会自动下载到本地

### 故障排除
如果遇到问题，打开 `troubleshooting.html` 查看详细的解决方案。

## 扩展功能

示例中还包含了以下功能：
- 实时时间显示
- 状态提示
- 错误处理
- 批量下载
- 响应式布局

## 常见问题解答 (FAQ)

### ❓ 选择分享页面列表中没有自己的页面标签？

**这是最常见的问题！** 原因可能是：

1. **协议限制**：使用 `http://` 而不是 `https://`
2. **浏览器安全策略**：某些浏览器不允许页面截图自己
3. **浏览器版本**：老版本浏览器支持有限

**解决方案**：
- ✅ 使用 HTTPS 协议访问页面
- ✅ 尝试不同浏览器（推荐Chrome）
- ✅ 选择"整个屏幕"而不是标签页
- ✅ 查看详细的故障排除指南：`troubleshooting.html`

### ❓ 为什么会产生无穷镜像效果？

当页面显示自己的截图预览时，就会产生递归镜像效果。这是正常现象。

**解决方案**：
- 在开始截图前隐藏预览区域
- 或者享受这个有趣的视觉效果！

### ❓ 截图质量不好怎么办？

**解决方案**：
- 调整 `getDisplayMedia` 的视频质量参数
- 使用更高的分辨率设置
- 确保显示器分辨率足够高

```javascript
const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { 
        width: { ideal: 2560 },  // 更高分辨率
        height: { ideal: 1440 },
        frameRate: { ideal: 30 }
    }
});
```

### ❓ 可以自动化截图吗？

**不可以**。Screen Capture API 出于安全考虑，必须由用户手动授权和选择。

**自动化替代方案**：
- 使用 Canvas API 手动绘制
- 使用 html2canvas 等第三方库
- 服务端截图方案（如 Puppeteer）

### ❓ 支持移动设备吗？

**支持有限**。移动浏览器对 Screen Capture API 的支持不完整。

**移动端替代方案**：
- 使用 Canvas API
- 使用 SVG 转换
- 提示用户使用桌面浏览器 