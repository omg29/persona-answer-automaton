// Background service worker for the extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('AutoFill Profile Manager installed');
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getActiveProfile') {
    chrome.storage.local.get(['activeProfile', 'profiles'], (result) => {
      sendResponse({
        activeProfile: result.activeProfile,
        profiles: result.profiles || []
      });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'setActiveProfile') {
    chrome.storage.local.set({ activeProfile: request.profile }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'saveProfiles') {
    chrome.storage.local.set({ profiles: request.profiles }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'autoFill') {
    // Inject content script and trigger auto-fill
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForm' });
      }
    });
  }
});

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'auto-fill') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForm' });
      }
    });
  }
});
