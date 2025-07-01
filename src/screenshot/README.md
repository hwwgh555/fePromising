# html2canvas 截图功能使用指南

## 安装

```bash
pnpm install html2canvas
```

## 基础用法

### 1. 导入功能

```typescript
import screenshot, { 
  captureFullPage, 
  captureElement, 
  downloadImage, 
  screenshotUtils 
} from './screenshot';
```

### 2. 基本截图

```typescript
// 截取整个页面
const canvas = await captureFullPage();

// 截取指定元素
const element = document.getElementById('target');
const canvas = await captureElement(element);

// 截取并自动下载
await screenshot('#target-element', { 
  filename: 'my-screenshot' 
});
```

### 3. 便捷方法

```typescript
// 快速下载整个页面截图
await screenshotUtils.downloadFullPage('页面截图');

// 快速下载指定元素截图
await screenshotUtils.downloadElement('#chart', '图表截图');

// 高质量截图（2倍缩放）
await screenshotUtils.highQualityScreenshot('#target', 'hq-screenshot');

// JPEG 格式截图（更小文件）
await screenshotUtils.screenshotAsJPEG('#target', 'compressed-screenshot');
```

## 配置选项

```typescript
interface ScreenshotOptions {
  backgroundColor?: string;    // 背景颜色，默认 '#ffffff'
  width?: number;             // 截图宽度
  height?: number;            // 截图高度
  scale?: number;             // 缩放比例，默认 1
  useCORS?: boolean;          // 是否启用 CORS，默认 true
  allowTaint?: boolean;       // 是否允许污染画布，默认 false
  filename?: string;          // 文件名（指定后自动下载）
  format?: 'png' | 'jpeg' | 'webp'; // 图片格式，默认 'png'
  quality?: number;           // 图片质量（0-1），默认 1
}
```

## 高级用法示例

### 自定义背景色

```typescript
await screenshot('#target', {
  backgroundColor: '#ff6b6b', // 红色背景
  filename: 'red-background'
});
```

### 透明背景

```typescript
await screenshot('#target', {
  backgroundColor: null, // 透明背景
  filename: 'transparent-bg'
});
```

### 高质量截图

```typescript
await screenshot('#target', {
  scale: 2,              // 2倍缩放
  format: 'png',         // PNG 格式
  filename: 'high-quality'
});
```

### 压缩 JPEG 格式

```typescript
await screenshot('#target', {
  format: 'jpeg',
  quality: 0.8,          // 80% 质量
  backgroundColor: '#ffffff', // JPEG 需要背景色
  filename: 'compressed'
});
```

### 自定义尺寸

```typescript
await screenshot('#target', {
  width: 1200,
  height: 800,
  filename: 'custom-size'
});
```

## 错误处理

```typescript
try {
  const canvas = await screenshot('#target');
  console.log('截图成功');
} catch (error) {
  console.error('截图失败:', error.message);
}
```

## 常见问题

### 1. 跨域图片问题

如果页面包含来自其他域的图片，可能会出现跨域错误：

```typescript
await screenshot('#target', {
  useCORS: true,
  allowTaint: false
});
```

### 2. 图片无法加载

确保所有图片已完全加载：

```typescript
// 等待图片加载完成
await new Promise(resolve => {
  const images = document.querySelectorAll('img');
  let loaded = 0;
  
  images.forEach(img => {
    if (img.complete) {
      loaded++;
    } else {
      img.onload = () => {
        loaded++;
        if (loaded === images.length) resolve();
      };
    }
  });
  
  if (loaded === images.length) resolve();
});

// 然后进行截图
const canvas = await screenshot('#target');
```

### 3. 样式问题

某些 CSS 样式可能不会被正确渲染：

- 使用 `transform` 属性的元素
- `position: fixed` 的元素
- 某些 CSS3 特效

解决方法：
```typescript
// 可以尝试调整缩放比例
await screenshot('#target', {
  scale: 1.5,
  useCORS: true
});
```

## 演示页面

打开 `demo.html` 查看完整的功能演示和交互示例。

## API 参考

### 主要函数

- `screenshot(target?, options?)` - 主截图函数
- `captureFullPage(options?)` - 截取整个页面
- `captureElement(element, options?)` - 截取指定元素
- `downloadImage(canvas, filename, format, quality)` - 下载图片
- `canvasToBlob(canvas, format, quality)` - 转换为 Blob

### 便捷工具

- `screenshotUtils.downloadFullPage(filename?)` - 快速下载页面截图
- `screenshotUtils.downloadElement(selector, filename?)` - 快速下载元素截图
- `screenshotUtils.highQualityScreenshot(target?, filename?)` - 高质量截图
- `screenshotUtils.screenshotAsJPEG(target?, filename?, quality?)` - JPEG 格式截图

## 注意事项

1. **性能考虑**：大页面或高分辨率截图可能需要较长时间
2. **内存使用**：高质量截图会消耗更多内存
3. **浏览器兼容性**：现代浏览器支持良好，IE 需要 polyfill
4. **移动端**：某些移动浏览器可能有限制

## 许可证

此示例代码可自由使用和修改。html2canvas 库遵循 MIT 许可证。 