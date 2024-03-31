// 模拟点击百度搜索
// 根据元素的坐标位置，找到该元素，并模拟点击
// https://www.baidu.com/s
const searchBtn = document.querySelector("#su");
const locationInfo = searchBtn.getBoundingClientRect();

const x = locationInfo.left + 10;
const y = locationInfo.top + 10;
const element = document.elementFromPoint(x, y); // get the element at the specified coordinates
if (element) {
  const clickEvent = new MouseEvent('click', {
  view: window,
  bubbles: true,
  cancelable: true,
  clientX: x,
  clientY: y
  });
  element.dispatchEvent(clickEvent); // dispatch a click event on the element
} else {
  console.log('No element found at the specified coordinates');
}