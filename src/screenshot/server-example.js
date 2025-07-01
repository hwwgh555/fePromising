const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 启用 CORS 以支持跨域请求
app.use(cors());
app.use(express.json());

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 限制 10MB
    },
    fileFilter: function (req, file, cb) {
        // 只允许图片文件
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件！'));
        }
    }
});

// 静态文件服务（用于访问上传的图片）
app.use('/uploads', express.static(uploadDir));

// 图片上传接口
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '没有接收到图片文件'
            });
        }

        const { title, description, timestamp } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '图片标题不能为空'
            });
        }

        // 构造图片信息
        const imageInfo = {
            id: Date.now(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            title: title.trim(),
            description: description ? description.trim() : '',
            size: req.file.size,
            mimetype: req.file.mimetype,
            url: `/uploads/${req.file.filename}`,
            uploadTime: timestamp || new Date().toISOString(),
            status: 'success'
        };

        // 保存到数据库（这里简单地保存到 JSON 文件）
        saveImageInfo(imageInfo);

        console.log('图片上传成功:', imageInfo);

        res.json({
            success: true,
            message: '图片上传成功',
            data: imageInfo
        });

    } catch (error) {
        console.error('上传处理错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
            error: error.message
        });
    }
});

// 获取图片列表接口
app.get('/api/images', (req, res) => {
    try {
        const images = loadImageList();
        res.json({
            success: true,
            data: images,
            total: images.length
        });
    } catch (error) {
        console.error('获取图片列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取图片列表失败',
            error: error.message
        });
    }
});

// 删除图片接口
app.delete('/api/images/:id', (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        const images = loadImageList();
        const imageIndex = images.findIndex(img => img.id === imageId);

        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '图片不存在'
            });
        }

        const image = images[imageIndex];
        
        // 删除文件
        const filePath = path.join(uploadDir, image.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // 从列表中移除
        images.splice(imageIndex, 1);
        saveImageList(images);

        console.log('图片删除成功:', image);

        res.json({
            success: true,
            message: '图片删除成功'
        });

    } catch (error) {
        console.error('删除图片错误:', error);
        res.status(500).json({
            success: false,
            message: '删除图片失败',
            error: error.message
        });
    }
});

// 获取单个图片信息
app.get('/api/images/:id', (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        const images = loadImageList();
        const image = images.find(img => img.id === imageId);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: '图片不存在'
            });
        }

        res.json({
            success: true,
            data: image
        });

    } catch (error) {
        console.error('获取图片信息错误:', error);
        res.status(500).json({
            success: false,
            message: '获取图片信息失败',
            error: error.message
        });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: '文件大小不能超过 10MB'
            });
        }
    }
    
    console.error('服务器错误:', error);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: error.message
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// 辅助函数：保存图片信息到 JSON 文件
function saveImageInfo(imageInfo) {
    const images = loadImageList();
    images.unshift(imageInfo); // 最新的放在前面
    
    // 限制数量
    if (images.length > 1000) {
        images.splice(1000);
    }
    
    saveImageList(images);
}

// 辅助函数：加载图片列表
function loadImageList() {
    const dataFile = path.join(__dirname, 'images.json');
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('加载图片列表失败:', error);
    }
    return [];
}

// 辅助函数：保存图片列表
function saveImageList(images) {
    const dataFile = path.join(__dirname, 'images.json');
    try {
        fs.writeFileSync(dataFile, JSON.stringify(images, null, 2));
    } catch (error) {
        console.error('保存图片列表失败:', error);
    }
}

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 图片上传服务器已启动！`);
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`📁 上传目录: ${uploadDir}`);
    console.log(`🔗 API 接口:`);
    console.log(`   POST /api/upload-image  - 上传图片`);
    console.log(`   GET  /api/images        - 获取图片列表`);
    console.log(`   GET  /api/images/:id    - 获取单个图片`);
    console.log(`   DELETE /api/images/:id  - 删除图片`);
    console.log(`   GET  /uploads/:filename - 访问图片文件`);
});

module.exports = app; 