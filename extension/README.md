# AutoFill Profile Manager - Chrome Extension

A browser extension that automatically fills web forms with your saved profile information.

## Installation Instructions

1. **Download Extension Files**
   - Download all files from the `extension/` folder
   - Keep them in a single folder on your computer

2. **Create Extension Icons** (Required)
   Create three icon files with these dimensions:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
   
   You can create simple icons using any image editor, or use these placeholder dimensions:
   - Use a solid color square with white text "AF" (AutoFill)
   - Save them in the same folder as the other extension files

3. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the folder containing your extension files
   - The extension should now appear in your extensions list

4. **Setup Profiles**
   - Click the extension icon in your Chrome toolbar
   - Click "Manage Profiles" to open the profile manager
   - Create your profiles with your personal information
   - The profiles are automatically synced between the web app and extension

## How to Use

### Method 1: Keyboard Shortcut (Fastest)
- Press `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac) on any page
- The extension will automatically detect and fill all matching form fields

### Method 2: Extension Popup
- Click the extension icon in your toolbar
- Select your active profile
- Click "Auto-Fill Current Page"

### Method 3: Manage Profiles
- Click "Manage Profiles" in the popup
- Add, edit, or delete profiles
- Export profiles as JSON files
- Import profiles from JSON files

## Supported Form Fields

The extension automatically detects and fills:

**Personal Information:**
- First Name, Middle Name, Last Name
- Date of Birth
- Gender
- SSN
- Driver's License

**Contact Information:**
- Email
- Phone Number
- Address (Line 1 & 2)
- City, State, ZIP Code
- Country

**Work Information:**
- Employer
- Job Title
- Industry
- Annual Income

**Family Information:**
- Relationship Status
- Spouse Name
- Number of Children

**Financial Information:**
- Bank Name
- Account Type
- Credit Score
- Monthly Income/Expenses

## Field Detection

The extension uses intelligent field detection based on:
- Input field names
- Input field IDs
- Placeholder text
- Labels
- Autocomplete attributes

It works with all standard HTML form elements:
- Text inputs
- Email inputs
- Phone inputs
- Select dropdowns
- Radio buttons
- Checkboxes
- Textareas
- Date inputs

## Features

✅ **Smart Field Detection** - Automatically identifies form fields regardless of naming conventions
✅ **Multiple Profiles** - Create and manage multiple profiles for different purposes
✅ **Keyboard Shortcut** - Quick fill with Ctrl+Shift+F
✅ **Profile Import/Export** - Backup and share profiles via JSON files
✅ **Visual Feedback** - On-screen notifications confirm successful auto-fill
✅ **Privacy First** - All data stored locally on your device
✅ **Works Everywhere** - Compatible with all websites

## Privacy & Security

- **Local Storage Only**: All profile data is stored locally on your device
- **No Cloud Sync**: Your data never leaves your computer
- **No Tracking**: The extension does not track or collect any usage data
- **No External Requests**: All processing happens locally in your browser

## Troubleshooting

**Extension not filling fields?**
- Make sure you have selected an active profile
- Check that your profile has data filled in
- Some websites use custom form implementations that may not be detected
- Try refreshing the page and filling again

**Extension not appearing?**
- Make sure you created the three required icon files
- Check that Developer Mode is enabled in chrome://extensions/
- Try removing and re-adding the extension

**Profiles not syncing?**
- The extension reads from the web app's localStorage
- Make sure you've opened the profile manager web app at least once
- Click "Manage Profiles" in the popup to ensure sync

## File Structure

```
extension/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for extension
├── content.js          # Script that runs on web pages
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── icon16.png          # Small icon (16x16)
├── icon48.png          # Medium icon (48x48)
├── icon128.png         # Large icon (128x128)
└── README.md           # This file
```

## Support

For issues or questions:
1. Check the browser console for error messages (F12 > Console)
2. Verify all files are present in the extension folder
3. Make sure icons are present and properly sized
4. Try disabling and re-enabling the extension

## Version

Current Version: 1.0.0

## License

This extension is provided as-is for personal use.
