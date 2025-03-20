# 包含的功能
1. 添加/删除 整行；
2. 添加/删除 整列；
3. 单元格式操作
   1. 划选的单元格式操作：合并、拆分
   2. 整行/整列的单元格合并

# 技术实现
## 灵活Table可能主要用到的技术
1. window.getSelection()接口
2. div元素的contenteditable="true"

选区的实现：
1. addRange的API https://developer.mozilla.org/zh-CN/docs/Web/API/Selection/addRange
2. 通过给所有单元格，添加坐标，根据划动鼠标时，起、始位置，找到坐标，从而进一步找到矩形范围内的所有tableCell

如何判断单元格是否可以拆分？


## 实现降级--退路
简化Table操作
1. Table的编辑模式  -- 进入编辑模式后，table的列、行可增删、单元格可合并、拆分，但是不可输入
