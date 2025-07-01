import html2canvas from "html2canvas";

// 截图配置选项接口
interface ScreenshotOptions {
  backgroundColor?: string;
  width?: number;
  height?: number;
  scale?: number;
  useCORS?: boolean;
  allowTaint?: boolean;
  filename?: string;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
}

// 截取整个页面的截图
export const captureFullPage = async (options: ScreenshotOptions = {}) => {
  try {
    const canvas = await html2canvas(document.body, {
      backgroundColor: options.backgroundColor || '#ffffff',
      width: options.width,
      height: options.height,
      scale: options.scale || 1,
      useCORS: options.useCORS || true,
      allowTaint: options.allowTaint || false,
      logging: false, // 关闭日志输出
    });
    
    return canvas;
  } catch (error) {
    console.error('截取页面失败:', error);
    throw error;
  }
};

// 截取指定元素的截图
export const captureElement = async (element: HTMLElement, options: ScreenshotOptions = {}) => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: options.backgroundColor || '#ffffff',
      width: options.width,
      height: options.height,
      scale: options.scale || 1,
      useCORS: options.useCORS || true,
      allowTaint: options.allowTaint || false,
      logging: false,
    });
    
    return canvas;
  } catch (error) {
    console.error('截取元素失败:', error);
    throw error;
  }
};

// 将 canvas 转换为 Blob
export const canvasToBlob = (canvas: HTMLCanvasElement, format: 'png' | 'jpeg' | 'webp' = 'png', quality = 1): Promise<Blob | null> => {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, `image/${format}`, quality);
  });
};

// 下载图片
export const downloadImage = (canvas: HTMLCanvasElement, filename = 'screenshot', format: 'png' | 'jpeg' | 'webp' = 'png', quality = 1) => {
  const link = document.createElement('a');
  const dataURL = canvas.toDataURL(`image/${format}`, quality);
  
  link.href = dataURL;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 主要的截图函数（保持原有函数名）
const screenshot = async (target?: HTMLElement | string, options: ScreenshotOptions = {}) => {
  try {
    let element: HTMLElement;
    
    // 确定截图目标
    if (typeof target === 'string') {
      const el = document.querySelector(target) as HTMLElement;
      if (!el) {
        throw new Error(`找不到选择器为 "${target}" 的元素`);
      }
      element = el;
    } else if (target instanceof HTMLElement) {
      element = target;
    } else {
      element = document.body; // 默认截取整个页面
    }
    
    // 执行截图
    const canvas = await captureElement(element, options);
    
    // 如果指定了文件名，则自动下载
    if (options.filename) {
      downloadImage(
        canvas, 
        options.filename, 
        options.format || 'png', 
        options.quality || 1
      );
    }
    
    return canvas;
  } catch (error) {
    console.error('截图失败:', error);
    throw error;
  }
};

// 一些便捷的预设方法
export const screenshotUtils = {
  // 截取并下载整个页面
  downloadFullPage: async (filename = 'fullpage-screenshot') => {
    const canvas = await captureFullPage();
    downloadImage(canvas, filename);
    return canvas;
  },
  
  // 截取并下载指定元素
  downloadElement: async (selector: string, filename = 'element-screenshot') => {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      throw new Error(`找不到选择器为 "${selector}" 的元素`);
    }
    const canvas = await captureElement(element);
    downloadImage(canvas, filename);
    return canvas;
  },
  
  // 高质量截图（放大2倍）
  highQualityScreenshot: async (target?: HTMLElement | string, filename = 'hq-screenshot') => {
    return await screenshot(target, {
      scale: 2,
      filename,
      format: 'png'
    });
  },
  
  // 截图为 JPEG 格式（文件更小）
  screenshotAsJPEG: async (target?: HTMLElement | string, filename = 'screenshot', quality = 0.9) => {
    return await screenshot(target, {
      filename,
      format: 'jpeg',
      quality,
      backgroundColor: '#ffffff' // JPEG 需要背景色
    });
  }
};

export default screenshot;