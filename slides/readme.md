# 问题：
## 1. 轮播图如果使用了图片，如何保障比例性？


## 期望效果
1. 屏幕宽度小于图片的宽度时，图片等比例绽放；
2. 屏幕宽度大于图片的宽度时，图片居中，周围补充背景色（这里的图片边缘需要方便与背景色融化，从而没有违合感 或者 图片背景是透明的）

# 具体技术解决办法
1. 容器padding + 内容div aboslute + image
可参见：padding.html

```html
<div class="wrapper">
<div class="ratio-box">
    <div class="slides-container" id="slideContainer">
      <!-- 轮播项目 -->
      <div class="slide">
        <img src="./image.png" alt="轮播图片1" />
      </div>
    </div>
</div>
</div>
```

```css
.wrapper {
  background-color: #000000; /* 补充屏幕超过图片大小时的背景色 */
}
.ration-box {
  max-width: 1200px;
  margin: 0 auto; /* 以上2行实现，超过图片大小时，居中显示；*/
  position: relative;
  padding-top: padding-top: 56.25%; /* 16:9比例  ---- 根据图片比例需要动态调整 height / width */
}
.slides-container {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
}
```

2. css的属性object-fit: cotainer; // 该属性，可以让图片保持尺寸
可参见：object-fit.html

```css
.container {
  width: 300px;
  height: 300px;
}
.ratio-box{
  object-fit: container;
}
.img {
  width: 100%;
  height: 100%;
}
```

```html
<div class="container">
  <img class="img" src="xx" />
</div>
```