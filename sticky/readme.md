## postion: sticky；特性
背景：position: sticky 又称为粘性定位，粘性定位的元素是依赖于用户的滚动，在 position:relative 与 position:fixed 定位之间切换。元素根据正常文档流进行定位，然后相对它的最近滚动祖先（nearest scrolling ancestor）和 containing block (最近块级祖先 nearest block-level ancestor)，包括table-related 元素，基于 top, right, bottom, 和 left的值进行偏移。

粘性定位可以被认为是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位。例如：
```
#one { position: sticky; top: 10px; }
```

设置了以上样式的元素，在 viewport 视口滚动到元素 top 距离小于 10px 之前，元素为相对定位。之后，元素将固定在与顶部距离 10px 的位置，直到 viewport 视口回滚到阈值以下。


注意：
* 元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。
* 须指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。
* 偏移值不会影响任何其他元素的位置。该值总是创建一个新的层叠上下文（stacking context）。
* 一个 sticky元素 会 固定 在离它最近的一个拥有 滚动机制 的祖先上（当该祖先的 overflow 是 hidden, scroll, auto, 或 overlay时），即便这个祖先不是最近的真实可滚动祖先。


## 参照
[position:sticky 粘性定位的几种巧妙应用]( https://juejin.cn/post/6953145161895378951)