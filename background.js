// 扩展安装或更新时初始化存储
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['selectors'], function(result) {
    if (!result.selectors) {
      chrome.storage.sync.set({ selectors: [] });
      console.log('初始化元素选择器列表');
    }
  });
});

// 当存储数据发生变化时通知当前活动标签页
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.selectors) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'selectors_updated'}, function(response) {
          console.log('选择器列表已更新，通知内容脚本');
        });
      }
    });
  }
});

// 监听来自popup或content script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'get_selectors') {
    chrome.storage.sync.get(['selectors'], function(result) {
      sendResponse({selectors: result.selectors || []});
    });
    return true;
  }
}); 