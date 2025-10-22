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
  const webAppUrl = 'https://persona-answer-automaton.lovable.app';
  chrome.tabs.create({ url: webAppUrl });
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

// Sync profiles from web app
async function syncProfiles() {
  chrome.tabs.query({}, (tabs) => {
    const managerTab = tabs.find(tab => 
      tab.url && tab.url.includes('persona-answer-automaton.lovable.app')
    );
    
    if (managerTab) {
      chrome.scripting.executeScript({
        target: { tabId: managerTab.id },
        func: () => {
          const stored = localStorage.getItem('autofill_profiles');
          return stored ? JSON.parse(stored) : null;
        }
      }).then(results => {
        if (results && results[0] && results[0].result) {
          const webAppProfiles = results[0].result;
          chrome.storage.local.set({ profiles: webAppProfiles }, () => {
            loadProfiles();
            showToast('Profiles synced successfully!');
          });
        } else {
          showToast('No profiles found in manager', 'error');
        }
      }).catch(err => {
        showToast('Please open the Profile Manager first', 'error');
      });
    } else {
      showToast('Please open the Profile Manager first', 'error');
    }
  });
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadProfiles();
  
  // Fill button
  document.getElementById('fillButton').addEventListener('click', autoFillCurrentPage);
  
  // Sync button
  document.getElementById('syncButton').addEventListener('click', syncProfiles);
  
  // Manager button
  document.getElementById('managerButton').addEventListener('click', openProfileManager);
});