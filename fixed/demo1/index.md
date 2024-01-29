# position:fixed; 组件封装技巧
DOM元素通过 **position: fixed;** 修饰特点：
1. 总是保持在视口的某个固定位置（通过设置top/bottom/left/right）
2. 该元素不再占用正常流的空间

# 问题
当页面内容，没有超出可视范围时，显示不会有异常；
当页面内容，超出可视范围时，即出现滚动条时，会导致内容部分被fixed修饰的元素遮挡。


因此，需要解决遮挡问题

## 解决方式一：
最直接的方式是给fixed内容预留一部分空间，最容易想到就是padding-bottom或margin-bottom等留白方式。

```
<div>
  <div class="content" style="padding-bottom: footerHeight">content</div>
  <div class="footer">footer</div>
</div>
```
 footerHeight，表示div.footer的高度

缺陷：一旦使用到fixed组件时，便必须专门其设置一个预留空间的css样式


## 解决方式二：
解决方式一的优化

```
<div>
  <div class="content">content</div>
  <div class="footer">
    <div class="footer-content">footer</div>
  </div>
</div>
```
div.footer 设置的样式高度恰好好为footer-content高度
div.footer-content 为原来position:fixed；

div.footer这样就为div.footer-content占据了空间，这样内容元素div.class就不再需要因此使用div.footer预留空间了

此外，div.footer也可以写成（不一定必须要是父子级形式）
```
  <div class="footer">
    <div class="space-for-footer"></div>
    <div class="footer-content">footer</div>
  </div>
```
div.space-for-footer只是作为一个空元素，样式的高度调为footer高度，仅仅提供position:fixed;需要的空间





