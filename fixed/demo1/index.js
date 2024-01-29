const $main = document.querySelector('.main');
const $itemsWrapper = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const $item = document.createElement("div");
  // textContent与innerText区别？
  $item.textContent = i + 1;
  $itemsWrapper.appendChild($item);
}
// append与appendChild区别？
$main.appendChild($itemsWrapper)