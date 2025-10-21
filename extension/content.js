// Content script that runs on all pages and handles form filling

console.log('AutoFill Profile Manager content script loaded');

// Field mapping patterns
const fieldMappings = {
  firstName: ['firstname', 'first_name', 'fname', 'given-name', 'givenname', 'forename'],
  middleName: ['middlename', 'middle_name', 'mname', 'middle', 'additional-name'],
  lastName: ['lastname', 'last_name', 'lname', 'surname', 'family-name', 'familyname'],
  email: ['email', 'e-mail', 'mail', 'emailaddress', 'email_address', 'user_email'],
  phone: ['phone', 'telephone', 'mobile', 'tel', 'phonenumber', 'phone_number', 'cellphone', 'cell'],
  address: ['address', 'street', 'address1', 'address_1', 'street-address', 'streetaddress', 'addr'],
  address2: ['address2', 'address_2', 'apt', 'apartment', 'suite', 'unit', 'address-line2'],
  city: ['city', 'town', 'locality', 'address-level2'],
  state: ['state', 'province', 'region', 'address-level1'],
  zipCode: ['zip', 'zipcode', 'zip_code', 'postal', 'postalcode', 'postal_code', 'postcode'],
  country: ['country', 'country_code', 'countrycode', 'country-name'],
  dateOfBirth: ['dob', 'birthdate', 'birth_date', 'dateofbirth', 'date_of_birth', 'birthday', 'bday'],
  gender: ['gender', 'sex'],
  ssn: ['ssn', 'social', 'socialsecurity', 'social_security', 'tax_id'],
  employer: ['employer', 'company', 'organization', 'work', 'companyname', 'company_name'],
  jobTitle: ['jobtitle', 'job_title', 'title', 'position', 'occupation'],
  relationshipStatus: ['marital', 'maritalstatus', 'marital_status', 'relationship', 'relationship_status'],
  annualIncome: ['income', 'annual_income', 'annualincome', 'salary', 'yearly_income'],
};

// Helper function to match field name/id/label to profile field
function matchField(element) {
  const name = (element.name || '').toLowerCase();
  const id = (element.id || '').toLowerCase();
  const placeholder = (element.placeholder || '').toLowerCase();
  const label = getFieldLabel(element).toLowerCase();
  const autocomplete = (element.autocomplete || '').toLowerCase();
  
  const searchText = `${name} ${id} ${placeholder} ${label} ${autocomplete}`;
  
  for (const [profileField, patterns] of Object.entries(fieldMappings)) {
    for (const pattern of patterns) {
      if (searchText.includes(pattern)) {
        return profileField;
      }
    }
  }
  
  return null;
}

// Get label text for an input field
function getFieldLabel(element) {
  // Check for label element
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent || '';
  }
  
  // Check for parent label
  const parentLabel = element.closest('label');
  if (parentLabel) return parentLabel.textContent || '';
  
  // Check for aria-label
  if (element.getAttribute('aria-label')) {
    return element.getAttribute('aria-label') || '';
  }
  
  // Check for previous sibling
  const prevSibling = element.previousElementSibling;
  if (prevSibling && prevSibling.tagName === 'LABEL') {
    return prevSibling.textContent || '';
  }
  
  return '';
}

// Fill a single input field
function fillField(element, value, profileField) {
  if (!value) return false;
  
  const tagName = element.tagName.toLowerCase();
  const type = (element.type || '').toLowerCase();
  
  // Handle different input types
  if (tagName === 'input') {
    if (type === 'radio') {
      // For radio buttons, try to match the value
      const valueStr = value.toString().toLowerCase();
      const elementValue = (element.value || '').toLowerCase();
      const elementLabel = getFieldLabel(element).toLowerCase();
      
      if (elementValue.includes(valueStr) || elementLabel.includes(valueStr) || valueStr.includes(elementValue)) {
        element.checked = true;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    } else if (type === 'checkbox') {
      // For checkboxes, check if value is truthy
      element.checked = !!value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } else if (type === 'date') {
      // Handle date fields
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } else {
      // Regular text input
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  } else if (tagName === 'select') {
    // Try to match select option
    const valueStr = value.toString().toLowerCase();
    const options = Array.from(element.options);
    
    for (const option of options) {
      const optionValue = (option.value || '').toLowerCase();
      const optionText = (option.text || '').toLowerCase();
      
      if (optionValue === valueStr || optionText === valueStr || 
          optionValue.includes(valueStr) || optionText.includes(valueStr)) {
        element.value = option.value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }
  } else if (tagName === 'textarea') {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  
  return false;
}

// Extract value from profile based on matched field
function getProfileValue(profile, field) {
  const mapping = {
    firstName: profile.personal?.firstName,
    middleName: profile.personal?.middleName,
    lastName: profile.personal?.lastName,
    email: profile.contact?.email,
    phone: profile.contact?.phone,
    address: profile.contact?.address,
    address2: profile.contact?.address2,
    city: profile.contact?.city,
    state: profile.contact?.state,
    zipCode: profile.contact?.zipCode,
    country: profile.contact?.country,
    dateOfBirth: profile.personal?.dateOfBirth,
    gender: profile.personal?.gender,
    ssn: profile.personal?.ssn,
    employer: profile.work?.employer,
    jobTitle: profile.work?.jobTitle,
    relationshipStatus: profile.family?.relationshipStatus,
    annualIncome: profile.work?.annualIncome,
  };
  
  return mapping[field];
}

// Main form filling function
async function fillForm() {
  try {
    // Get active profile from storage
    const result = await chrome.storage.local.get(['activeProfile']);
    const profile = result.activeProfile;
    
    if (!profile) {
      console.log('No active profile found');
      showNotification('No active profile selected', 'error');
      return;
    }
    
    console.log('Filling form with profile:', profile.name);
    let fieldsFilledCount = 0;
    
    // Find all form fields
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach((element) => {
      // Skip hidden, disabled, and readonly fields
      if (element.offsetParent === null || element.disabled || element.readOnly) {
        return;
      }
      
      const matchedField = matchField(element);
      if (matchedField) {
        const value = getProfileValue(profile, matchedField);
        if (value) {
          const filled = fillField(element, value, matchedField);
          if (filled) {
            fieldsFilledCount++;
            console.log(`Filled ${matchedField} with value:`, value);
          }
        }
      }
    });
    
    console.log(`Filled ${fieldsFilledCount} fields`);
    showNotification(`Auto-filled ${fieldsFilledCount} fields`, 'success');
    
  } catch (error) {
    console.error('Error filling form:', error);
    showNotification('Error filling form', 'error');
  }
}

// Show notification to user
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.getElementById('autofill-notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'autofill-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillForm();
    sendResponse({ success: true });
  }
  return true;
});

// Add keyboard shortcut listener (Ctrl+Shift+F or Cmd+Shift+F)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    fillForm();
  }
});

console.log('AutoFill content script ready. Press Ctrl+Shift+F to auto-fill forms.');
