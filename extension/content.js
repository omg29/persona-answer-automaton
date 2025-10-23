// Content script that runs on all pages and handles form filling

console.log('AutoFill Profile Manager content script loaded');

// Field mapping patterns - comprehensive patterns to detect all form field types
const fieldMappings = {
  firstName: ['firstname', 'first_name', 'fname', 'given-name', 'givenname', 'forename', 'first name', 'given name'],
  middleName: ['middlename', 'middle_name', 'mname', 'middle', 'additional-name', 'middle name'],
  lastName: ['lastname', 'last_name', 'lname', 'surname', 'family-name', 'familyname', 'last name', 'family name'],
  email: ['email', 'e-mail', 'mail', 'emailaddress', 'email_address', 'user_email', 'e mail', 'email address'],
  phone: ['phone', 'telephone', 'mobile', 'tel', 'phonenumber', 'phone_number', 'cellphone', 'cell', 'phone number', 'contact number'],
  address: ['address', 'street', 'address1', 'address_1', 'street-address', 'streetaddress', 'addr', 'street address', 'address line'],
  address2: ['address2', 'address_2', 'apt', 'apartment', 'suite', 'unit', 'address-line2', 'address line 2'],
  city: ['city', 'town', 'locality', 'address-level2', 'municipality'],
  state: ['state', 'province', 'region', 'address-level1', 'st'],
  zipCode: ['zip', 'zipcode', 'zip_code', 'postal', 'postalcode', 'postal_code', 'postcode', 'zip code', 'postal code'],
  country: ['country', 'country_code', 'countrycode', 'country-name', 'nation', 'nationality'],
  dateOfBirth: ['dob', 'birthdate', 'birth_date', 'dateofbirth', 'date_of_birth', 'birthday', 'bday', 'birth date', 'date of birth'],
  gender: ['gender', 'sex', 'male', 'female'],
  ssn: ['ssn', 'social', 'socialsecurity', 'social_security', 'tax_id', 'social security', 'tax id'],
  employer: ['employer', 'company', 'organization', 'work', 'companyname', 'company_name', 'company name', 'workplace'],
  jobTitle: ['jobtitle', 'job_title', 'title', 'position', 'occupation', 'job title', 'job position'],
  relationshipStatus: ['marital', 'maritalstatus', 'marital_status', 'relationship', 'relationship_status', 'marital status', 'relationship status', 'married', 'single'],
  annualIncome: ['income', 'annual_income', 'annualincome', 'salary', 'yearly_income', 'annual income', 'yearly income', 'earnings'],
};

// Helper function to match field name/id/label to profile field
function matchField(element) {
  const name = (element.name || '').toLowerCase().replace(/[_-]/g, ' ');
  const id = (element.id || '').toLowerCase().replace(/[_-]/g, ' ');
  const placeholder = (element.placeholder || '').toLowerCase();
  const label = getFieldLabel(element).toLowerCase();
  const autocomplete = (element.autocomplete || '').toLowerCase();
  const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
  const dataName = (element.getAttribute('data-name') || '').toLowerCase();
  const className = (element.className || '').toLowerCase();
  
  // Combine all possible identifiers
  const searchText = `${name} ${id} ${placeholder} ${label} ${autocomplete} ${ariaLabel} ${dataName} ${className}`;
  
  // Try exact matches first for better accuracy
  for (const [profileField, patterns] of Object.entries(fieldMappings)) {
    for (const pattern of patterns) {
      // Check for exact word boundaries to avoid false matches
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(searchText)) {
        return profileField;
      }
    }
  }
  
  // If no exact match, try partial matches
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
  if (!value && value !== 0 && value !== false) return false;
  
  const tagName = element.tagName.toLowerCase();
  const type = (element.type || '').toLowerCase();
  
  try {
    // Handle different input types
    if (tagName === 'input') {
      if (type === 'radio') {
        // For radio buttons, try comprehensive matching
        const valueStr = value.toString().toLowerCase().trim();
        const elementValue = (element.value || '').toLowerCase().trim();
        const elementLabel = getFieldLabel(element).toLowerCase().trim();
        
        // Try exact match first
        if (elementValue === valueStr || elementLabel === valueStr) {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('click', { bubbles: true }));
          return true;
        }
        
        // Try partial matches
        if (elementValue.includes(valueStr) || valueStr.includes(elementValue) ||
            elementLabel.includes(valueStr) || valueStr.includes(elementLabel)) {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('click', { bubbles: true }));
          return true;
        }
      } else if (type === 'checkbox') {
        // For checkboxes, check if value is truthy or matches label
        const valueStr = value.toString().toLowerCase().trim();
        const elementLabel = getFieldLabel(element).toLowerCase().trim();
        const shouldCheck = !!value || elementLabel.includes(valueStr) || valueStr.includes(elementLabel);
        
        if (element.checked !== shouldCheck) {
          element.checked = shouldCheck;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('click', { bubbles: true }));
        }
        return true;
      } else if (type === 'date' || type === 'datetime-local' || type === 'month' || type === 'week' || type === 'time') {
        // Handle date/time fields
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      } else if (type === 'number' || type === 'range') {
        // Handle numeric fields
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      } else if (type === 'email' || type === 'tel' || type === 'url' || type === 'text' || type === 'search' || !type) {
        // Regular text-based inputs
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    } else if (tagName === 'select') {
      // Try comprehensive select option matching
      const valueStr = value.toString().toLowerCase().trim();
      const options = Array.from(element.options);
      
      // Try exact matches first
      for (const option of options) {
        const optionValue = (option.value || '').toLowerCase().trim();
        const optionText = (option.text || '').toLowerCase().trim();
        
        if (optionValue === valueStr || optionText === valueStr) {
          element.value = option.value;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      }
      
      // Try partial matches
      for (const option of options) {
        const optionValue = (option.value || '').toLowerCase().trim();
        const optionText = (option.text || '').toLowerCase().trim();
        
        if (optionValue.includes(valueStr) || optionText.includes(valueStr) ||
            valueStr.includes(optionValue) || valueStr.includes(optionText)) {
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
    
    // Handle contenteditable divs (modern form builders)
    if (element.contentEditable === 'true' || element.getAttribute('contenteditable') === 'true') {
      element.textContent = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  } catch (error) {
    console.error('Error filling field:', error);
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
    
    // Find all form fields including contenteditable elements
    const inputs = document.querySelectorAll('input, select, textarea, [contenteditable="true"]');
    
    inputs.forEach((element) => {
      // Skip hidden and disabled fields (but allow readonly for some forms)
      const isVisible = element.offsetParent !== null || element.offsetWidth > 0 || element.offsetHeight > 0;
      if (!isVisible || element.disabled) {
        return;
      }
      
      const matchedField = matchField(element);
      if (matchedField) {
        const value = getProfileValue(profile, matchedField);
        if (value !== undefined && value !== null) {
          const filled = fillField(element, value, matchedField);
          if (filled) {
            fieldsFilledCount++;
            console.log(`Filled ${matchedField} with value:`, value);
          }
        }
      }
    });
    
    // Special handling for radio button groups - ensure we process all radios in a group
    const radioGroups = {};
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      const name = radio.name;
      if (name) {
        if (!radioGroups[name]) radioGroups[name] = [];
        radioGroups[name].push(radio);
      }
    });
    
    // Try to match and fill radio groups
    Object.entries(radioGroups).forEach(([groupName, radios]) => {
      if (radios.length === 0 || radios[0].checked) return; // Skip if already checked
      
      const matchedField = matchField(radios[0]);
      if (matchedField) {
        const value = getProfileValue(profile, matchedField);
        if (value) {
          for (const radio of radios) {
            const filled = fillField(radio, value, matchedField);
            if (filled) {
              fieldsFilledCount++;
              console.log(`Filled radio group ${groupName} (${matchedField}) with value:`, value);
              break; // Only check one radio per group
            }
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
