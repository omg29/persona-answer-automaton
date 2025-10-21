// Popup script for profile selection and actions

let profiles = [];
let activeProfile = null;

// Load profiles and active profile from storage
async function loadProfiles() {
  const result = await chrome.storage.local.get(['profiles', 'activeProfile']);
  profiles = result.profiles || [];
  activeProfile = result.activeProfile || null;
  renderProfiles();
}

// Render profile list
function renderProfiles() {
  const profileList = document.getElementById('profileList');
  
  if (profiles.length === 0) {
    profileList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">
          No profiles found. Create profiles in the <a href="#" id="managerLink" class="link">Profile Manager</a>
        </div>
      </div>
    `;
    
    // Add event listener to manager link
    const managerLink = document.getElementById('managerLink');
    if (managerLink) {
      managerLink.addEventListener('click', (e) => {
        e.preventDefault();
        openProfileManager();
      });
    }
    
    return;
  }
  
  profileList.innerHTML = profiles.map(profile => {
    const isActive = activeProfile?.id === profile.id;
    return `
      <div class="profile-item ${isActive ? 'active' : ''}" data-profile-id="${profile.id}">
        <input type="radio" name="profile" class="profile-radio" ${isActive ? 'checked' : ''}>
        <div class="profile-info">
          <div class="profile-name">${profile.name}</div>
          <div class="profile-details">
            ${profile.personal?.firstName || ''} ${profile.personal?.lastName || ''} • ${profile.contact?.email || 'No email'}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add click listeners to profile items
  document.querySelectorAll('.profile-item').forEach(item => {
    item.addEventListener('click', () => {
      const profileId = item.dataset.profileId;
      selectProfile(profileId);
    });
  });
}

// Select a profile as active
async function selectProfile(profileId) {
  const profile = profiles.find(p => p.id === profileId);
  if (profile) {
    activeProfile = profile;
    await chrome.storage.local.set({ activeProfile: profile });
    renderProfiles();
    
    // Show feedback
    showToast('Profile activated: ' + profile.name);
  }
}

// Auto-fill current page
function autoFillCurrentPage() {
  if (!activeProfile) {
    showToast('Please select a profile first', 'error');
    return;
  }
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForm' }, (response) => {
        if (chrome.runtime.lastError) {
          showToast('Unable to fill form on this page', 'error');
        } else {
          showToast('Form filled successfully!');
          window.close();
        }
      });
    }
  });
}

// Open profile manager (the web app)
function openProfileManager() {
  // You can replace this URL with your actual deployed web app URL
  chrome.tabs.create({ url: 'index.html' });
  window.close();
}

// Show toast message
function showToast(message, type = 'info') {
  // Create a simple toast in the popup
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#ef4444' : '#10b981'};
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    z-index: 1000;
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Sync profiles from web app to extension storage
async function syncFromWebApp() {
  // Try to read from localStorage of the web app
  // This would need the web app to be on the same domain or use messaging
  // For now, we'll use chrome.storage.local as the source of truth
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadProfiles();
  
  // Fill button
  document.getElementById('fillButton').addEventListener('click', autoFillCurrentPage);
  
  // Manager button
  document.getElementById('managerButton').addEventListener('click', openProfileManager);
  
  // Try to sync profiles from web app's localStorage
  // This is a workaround - ideally the web app would communicate with the extension
  chrome.tabs.query({}, (tabs) => {
    // Find tab with the profile manager
    const managerTab = tabs.find(tab => tab.url && (
      tab.url.includes('localhost') || 
      tab.url.includes('lovable.app') ||
      tab.url.includes('index.html')
    ));
    
    if (managerTab) {
      // Execute script to get profiles from web app localStorage
      chrome.scripting.executeScript({
        target: { tabId: managerTab.id },
        func: () => {
          const stored = localStorage.getItem('autofill_profiles');
          return stored ? JSON.parse(stored) : null;
        }
      }).then(results => {
        if (results && results[0] && results[0].result) {
          const webAppProfiles = results[0].result;
          // Sync to extension storage
          chrome.storage.local.set({ profiles: webAppProfiles }, () => {
            loadProfiles();
          });
        }
      }).catch(err => {
        console.log('Could not sync from web app:', err);
      });
    }
  });
});
