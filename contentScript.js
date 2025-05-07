// 主函数：移除元素
function removeElements() {
  chrome.storage.sync.get(['selectors'], function(result) {
    const selectors = result.selectors || [];
    
    if (selectors.length === 0) {
      return;
    }
    
    selectors.forEach(selector => {
      if (selector.type === 'id') {
        const element = document.getElementById(selector.value);
        if (element) {
          element.remove();
          console.log(`已移除ID为 ${selector.value} 的元素`);
        }
      } else if (selector.type === 'class') {
        const elements = document.getElementsByClassName(selector.value);
        while (elements.length > 0) {
          elements[0].remove();
        }
        console.log(`已移除Class为 ${selector.value} 的元素`);
      }
    });
  });
}

// 在页面加载时执行元素移除
// 根据需求，在页面加载的第0秒、第2秒、第6秒和第10秒执行
function executeRemoval() {
  // 立即执行一次（第0秒）
  removeElements();
  
  // 2秒后执行
  setTimeout(() => {
    removeElements();
  }, 2000);
  
  // 6秒后执行
  setTimeout(() => {
    removeElements();
  }, 6000);
  
  // 10秒后执行
  setTimeout(() => {
    removeElements();
  }, 10000);
}

// 页面加载时执行
executeRemoval();

// 监听来自popup的消息，如果有更新选择器列表，则重新执行移除
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'selectors_updated') {
    executeRemoval();
    sendResponse({status: 'success'});
  }
  return true;
}); 