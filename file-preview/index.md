# 前端预览：
## 文件类型
1. 音频
2. 视频
3. 图片
4. 文件
   1. pdfdoc、
   2. xls、
   3. ppt、
   4. txt

## 实现
### 音视、视频、图片
直接使用html提供的标签img、video、audio

### txt
直接使用textarea或其它标签展示即可
```
<div id="txt" />

axios({ method: 'get', responseType: 'blob', url: 'txt文件地址' }).then((res) => {
  res.data.text().then(res => {
    document.querySelector("#txt").innerText = res
  })
})
```

### pdf
简单方式，直接使用iframe，借助浏览器本身对于pdf的解析能力

更复杂的通常借助于[pdfJS](https://mozilla.github.io/pdf.js/getting_started/#download)


### Excel
#### 纯前端实现
[纯前端实现 Excel在线解析和预览（兼容APP、Web、小程序）](https://juejin.cn/post/7211805251216031801?from=search-suggest)

总体过程：
1. 文件下载
2. excel文件解析 // SheetJS
3. 数据渲染 // canvas-datagrid、handsonsoft、

其它：
x-spreadsheet、exceljs-renderer、exceljs


#### 在线预览
xls/xlsx、word、ppt 在线预览功能最简单的实现方式就是调用微软 联机查看 或或者谷歌的在线预览功能。（）

微软接口实现
必须为 http:// 或 https:// 形式，文档必须是 Word、Excel 或 PowerPoint 文档
```
// 文件的下载地址(可直接访问的)
const fileUrl = 'https://xxx.com/xxx.docx'

// 将 URL encode 一下；
let newFileUrl = encodeURIComponent(fileUrl)

// 预览
window.open(`https://view.officeapps.live.com/op/view.aspx?src=${newFileUrl}`, '_blank')

```

谷歌接口实现
```
window.open(`https://docs.google.com/viewer?url=${fileUrl}`, '_blank')

```

### PPT
PPTXJs
需在官网下周对应压缩包，里面会有相关css和js文件，然后在html中引入相关文件，在逻辑处通过pptxToHtml方法渲染即可，主要代码如下：
```
<link rel="stylesheet" href="./PPTXJs/pptxjs.css">
<script type="text/javascript" src="./PPTXJs/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="./PPTXJs/jszip.min.js"></script>
<script type="text/javascript" src="./PPTXJs/filereader.js"></script>
<script type="text/javascript" src="./PPTXJs/pptxjs.js"></script>

<div id="ppt" />

$('#ppt').pptxToHtml({ pptxFileUrl: 'ppt文件地址' })
```


