document.addEventListener('DOMContentLoaded', function() {
  const addSelectorBtn = document.getElementById('addSelector');
  const selectorValueInput = document.getElementById('selectorValue');
  const elementsListContainer = document.getElementById('elementsList');
  const selectorTypeRadios = document.getElementsByName('selectorType');
  
  // 加载保存的选择器
  loadSelectors();
  
  // 添加选择器事件
  addSelectorBtn.addEventListener('click', function() {
    const selectorValue = selectorValueInput.value.trim();
    if (!selectorValue) {
      alert('请输入选择器值');
      return;
    }
    
    let selectorType = '';
    for (const radio of selectorTypeRadios) {
      if (radio.checked) {
        selectorType = radio.value;
        break;
      }
    }
    
    addSelector(selectorType, selectorValue);
    selectorValueInput.value = '';
  });
  
  // 加载已保存的选择器
  function loadSelectors() {
    chrome.storage.sync.get(['selectors'], function(result) {
      const selectors = result.selectors || [];
      
      elementsListContainer.innerHTML = '';
      
      if (selectors.length === 0) {
        elementsListContainer.innerHTML = '<p>尚未添加任何元素</p>';
        return;
      }
      
      selectors.forEach((selector, index) => {
        const item = document.createElement('div');
        item.className = 'element-item';
        
        const selectorText = document.createElement('span');
        const typeLabel = selector.type === 'id' ? '通过ID' : '通过Class';
        selectorText.textContent = `${typeLabel}: ${selector.value}`;
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '删除';
        removeBtn.dataset.index = index;
        removeBtn.addEventListener('click', function() {
          removeSelector(parseInt(this.dataset.index));
        });
        
        item.appendChild(selectorText);
        item.appendChild(removeBtn);
        elementsListContainer.appendChild(item);
      });
    });
  }
  
  // 添加选择器
  function addSelector(type, value) {
    chrome.storage.sync.get(['selectors'], function(result) {
      const selectors = result.selectors || [];
      
      // 检查是否已存在相同的选择器
      const exists = selectors.some(selector => 
        selector.type === type && selector.value === value
      );
      
      if (exists) {
        alert('此选择器已存在');
        return;
      }
      
      selectors.push({ type, value });
      
      chrome.storage.sync.set({ selectors }, function() {
        loadSelectors();
      });
    });
  }
  
  // 移除选择器
  function removeSelector(index) {
    chrome.storage.sync.get(['selectors'], function(result) {
      const selectors = result.selectors || [];
      
      if (index >= 0 && index < selectors.length) {
        selectors.splice(index, 1);
        
        chrome.storage.sync.set({ selectors }, function() {
          loadSelectors();
        });
      }
    });
  }
}); 