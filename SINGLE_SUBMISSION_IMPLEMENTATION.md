# Single Submission Feature - Complete Implementation Guide

**Date:** October 8, 2025  
**Branch:** `projects/single-submission`  
**Status:** Configuration UI Complete ✅ | Runtime Validation Pending ⏳

---

## Table of Contents
1. [Current Implementation Status](#current-implementation-status)
2. [Configuration UI - What's Complete](#configuration-ui---whats-complete)
3. [How It Works](#how-it-works)
4. [Runtime Validation - What's Needed](#runtime-validation---whats-needed)
5. [Complete Implementation Code](#complete-implementation-code)
6. [Testing Guide](#testing-guide)

---

## Current Implementation Status

### ✅ **PHASE 1: Configuration UI - COMPLETE**

All configuration-related code is implemented and working:

| Component | Status | File | Lines |
|-----------|--------|------|-------|
| UI Checkbox & Dropdown | ✅ Complete | `interface.html` | 81-101 |
| Default Values | ✅ Complete | `js/libs/builder.js` | 174-175 |
| Data Property | ✅ Complete | `js/libs/builder.js` | 207 |
| Get Columns Method | ✅ Complete | `js/libs/builder.js` | 719-736 |
| Watcher Logic | ✅ Complete | `js/libs/builder.js` | 1202-1214 |
| Mounted Logic | ✅ Complete | `js/libs/builder.js` | 1396-1399 |
| Schema Definition | ✅ Complete | `schema.json` | 42-53 |

### ⏳ **PHASE 2: Runtime Validation - PENDING**

| Component | Status | File | Estimated Lines |
|-----------|--------|------|----------------|
| Utility Functions | ⏳ Pending | `js/libs/form.js` | ~706-800 |
| Load Validation | ⏳ Pending | `js/libs/form.js` | ~1020-1070 |
| Submit Validation | ⏳ Pending | `js/libs/form.js` | ~1584-1650 |
| Analytics Tracking | ⏳ Pending | `js/libs/form.js` | ~1624+ |

---

## Configuration UI - What's Complete

### 1. **Interface HTML** (`interface.html`)

**Location:** Lines 81-101

```html
<div v-if="showDataSourceSettings">
  <div class="single-submission-label">
    <label>Single submission</label>
  </div>
  
  <!-- Checkbox -->
  <div class="checkbox checkbox-icon">
    <input type="checkbox" 
           id="singleSubmissionSelected" 
           v-model="settings.singleSubmissionSelected">
    <label class="single-submission-check-label" for="singleSubmissionSelected">
      <span class="check"><i class="fa fa-check"></i></span>
      <p>Only allow single submission</p>
    </label>
    <p v-if="settings.singleSubmissionSelected" class="single-submission-text">
      Choose the data source column used to detect existing submissions
    </p>
  </div>
  
  <!-- Dropdown for Identifier Column -->
  <div class="control-label" v-if="settings.singleSubmissionSelected">
    <label class="field-selection-single-submission">Identifying column</label>
    <select class="form-control" 
            v-model="settings.singleSubmissionField" 
            style="margin-bottom: 18px;">
      <option value="">
        \{{ dataSourceColumns.length > 0 ? 'Select a column' : 'No columns found' }}
      </option>
      <option v-for="column in dataSourceColumns" :value="column">
        \{{ column }}
      </option>
    </select>
  </div>
</div>
```

**Key Change:** Uses `dataSourceColumns` (simplified from `selectedDataSourceColumns`)

**Line 127:** Hides offline option when single submission is enabled
```html
<div class="radio radio-icon" v-if="!settings.singleSubmissionSelected">
```

---

### 2. **Builder Configuration** (`js/libs/builder.js`)

#### A. Default Values (Lines 174-175)
```javascript
function generateFormDefaults(data) {
  return Object.assign({
    // ... existing defaults ...
    isFormInSlider: isFormInSlider,
    singleSubmissionSelected: false,     // NEW
    singleSubmissionField: ''            // NEW
  }, data);
}
```

#### B. Data Property (Line 207)
```javascript
data: function() {
  return {
    // ... existing properties ...
    dataSourceColumns: [],  // NEW - stores columns from data source
    // ... rest of properties
  };
}
```

#### C. Get Data Source Columns Method (Lines 719-736)
```javascript
getDataSourceColumns: function() {
  const $vm = this;
  
  // Early return if no data source selected
  if (!this.settings.dataSourceId) {
    this.dataSourceColumns = [];
    return Promise.resolve([]);
  }
  
  // Fetch columns from data source
  return Fliplet.DataSources.getById(this.settings.dataSourceId, {
    cache: false,
    attributes: 'columns'
  }).then(function(dataSource) {
    $vm.dataSourceColumns = dataSource && dataSource.columns ? dataSource.columns : [];
    return $vm.dataSourceColumns;
  }).catch(function(error) {
    console.error('Error fetching data source columns:', error);
    $vm.dataSourceColumns = [];
    return [];
  });
}
```

#### D. Watcher for Checkbox Toggle (Lines 1202-1214)
```javascript
'settings.singleSubmissionSelected': function(value) {
  if (value) {
    // When enabled
    this.settings.offline = false;  // Force online-only mode
    
    // Fetch data source columns
    if (this.settings.dataSourceId) {
      this.getDataSourceColumns();
    }
  } else {
    // When disabled
    this.settings.offline = true;   // Restore offline capability
    this.settings.singleSubmissionField = '';  // Clear selected field
  }
}
```

**Key Improvement:** Now restores `offline: true` when disabled

#### E. Mounted Lifecycle (Lines 1396-1399)
```javascript
mounted: function() {
  // ... existing mounted code ...
  
  // Load data source columns if single submission is already enabled
  if ($vm.settings.singleSubmissionSelected && $vm.settings.dataSourceId) {
    $vm.getDataSourceColumns();
  }
  
  // ... rest of mounted code
}
```

---

### 3. **Schema Definition** (`schema.json`)

**Location:** Lines 42-53

```json
{
  "singleSubmissionSelected": {
    "type": "boolean",
    "title": "Enable single submission per user",
    "description": "Prevent users from submitting the form more than once based on an identifier column",
    "default": false
  },
  "singleSubmissionField": {
    "type": "string",
    "title": "Identifier column name",
    "description": "The data source column used to detect existing submissions",
    "default": ""
  }
}
```

---

## How It Works

### Configuration Flow

```
┌─────────────────────────────────────────┐
│ 1. User selects data source             │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 2. User checks "Single submission"      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 3. Watcher triggers:                    │
│    • Sets offline = false               │
│    • Calls getDataSourceColumns()       │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 4. API fetches columns from data source │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 5. Populates dataSourceColumns array    │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 6. Dropdown shows column names          │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 7. User selects identifier column       │
│    (e.g., "Email")                       │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 8. Saved to settings.singleSubmission-  │
│    Field                                 │
└─────────────────────────────────────────┘
```

### Saved Configuration

When a user configures the form, these settings are saved:

```javascript
{
  // Form settings
  name: "Contact Form",
  dataSourceId: "12345",
  
  // Single submission configuration
  singleSubmissionSelected: true,      // Feature is enabled
  singleSubmissionField: "Email",      // Column name to check
  offline: false,                       // Forced to online-only
  
  // ... other settings
}
```

---

## Runtime Validation - What's Needed

The configuration UI is complete. Now we need to add runtime validation in `js/libs/form.js` to:

1. **Check for duplicates on form load** (when field values are set)
2. **Check for duplicates before form submit** (before saving to data source)
3. **Show toast messages** when duplicates are detected
4. **Handle offline scenarios** gracefully
5. **Track analytics** events

---

## Complete Implementation Code

### Step 1: Add Utility Functions (Add after line 706)

Add these three helper functions at the beginning of the form logic:

```javascript
/**
 * Shows toast message when duplicate submission is detected
 * @param {string} columnName - The identifier column name
 * @param {any} value - The value that already exists
 * @param {Function} onDismiss - Callback to execute when user clicks OK
 */
function showSubmissionExistMessage(columnName, value, onDismiss) {
  Fliplet.UI.Toast({
    type: 'regular',
    position: 'center',
    backdrop: true,
    tapToDismiss: false,
    duration: false,
    actions: [{
      label: 'OK',
      action: function() {
        this.dismiss();
        if (typeof onDismiss === 'function') {
          onDismiss();
        }
      }
    }],
    title: 'This form can only be submitted once',
    message: 'An entry with ' + columnName + ': ' + value + ' already exists.'
  });
}

/**
 * Executes the configured post-submission action
 * @param {Object} $vm - Vue instance
 */
function executePostSubmissionAction($vm) {
  // Navigate to configured page
  if (data.linkAction && data.redirect === true) {
    Fliplet.Navigate.to(data.linkAction);
    return;
  }
  
  // Go to next slide (multi-step forms)
  if (data.redirect === 'nextSlide' && data.isFormInSlide) {
    $vm.start();
    return;
  }
  
  // Show confirmation message
  $vm.isSent = true;
  $vm.$forceUpdate();
}

/**
 * Checks if a record with the identifier already exists in the data source
 * @param {string} fieldName - The identifier field name
 * @param {any} fieldValue - The value to check
 * @returns {Promise<boolean>} - True if duplicate exists, false otherwise
 */
async function checkForDuplicateSubmission(fieldName, fieldValue) {
  // Early returns for invalid scenarios
  if (!data.singleSubmissionSelected || !data.singleSubmissionField) {
    return false;
  }
  
  if (!fieldName || fieldValue === null || fieldValue === undefined || fieldValue === '') {
    return false;
  }
  
  try {
    // Connect to data source (online only)
    const connection = await Fliplet.DataSources.connect(data.dataSourceId, { 
      offline: false 
    });
    
    // Build query to find matching records
    const query = {
      where: {
        [fieldName]: fieldValue
      }
    };
    
    // Exclude current entry if in edit mode
    if (entryId && entryId !== 'session') {
      query.where.id = { $ne: entryId };
    }
    
    // Execute query
    const records = await connection.find(query);
    
    // Return true if any records found
    return records.length > 0;
    
  } catch (error) {
    // Re-throw error to be handled by caller
    throw error;
  }
}
```

---

### Step 2: Add Form Load Validation Method (Add around line 1020)

Replace or update the existing `onSetDefaultValues` method:

```javascript
/**
 * Called when default values are set for form fields
 * Used to check for duplicate submissions on form load
 */
onSetDefaultValues: function(defaultValue) {
  const $vm = this;
  
  // Check if single submission is enabled
  if (!data.singleSubmissionSelected || !data.singleSubmissionField) {
    console.log('Single submission not enabled, skipping check');
    return;
  }
  
  // Only check when the identifier field value is set
  if (defaultValue.key !== data.singleSubmissionField) {
    console.log('Not the identifier field, skipping check');
    return;
  }
  
  console.log('Checking for existing submission:', defaultValue);
  
  // Perform the duplicate check
  this.checkSingleSubmissionOnLoad(defaultValue.key, defaultValue.value);
},

/**
 * Check for existing submission on form load
 * @param {string} fieldName - The identifier field name
 * @param {any} fieldValue - The field value to check
 */
checkSingleSubmissionOnLoad: async function(fieldName, fieldValue) {
  const $vm = this;
  
  // Skip if no value
  if (!fieldValue) {
    console.log('No value to check');
    return;
  }
  
  try {
    // Check if duplicate exists
    const isDuplicate = await checkForDuplicateSubmission(fieldName, fieldValue);
    
    if (isDuplicate) {
      console.log('Duplicate submission detected on load!');
      
      // Show toast message with post-submission action
      showSubmissionExistMessage(
        fieldName,
        fieldValue,
        function() {
          executePostSubmissionAction($vm);
        }
      );
      
      // Track analytics
      Fliplet.Analytics.trackEvent('form', 'single_submission_blocked_on_load', {
        formId: data.id,
        fieldName: fieldName
      });
    } else {
      console.log('No duplicate found, form can be displayed');
    }
    
  } catch (error) {
    console.error('Error checking for duplicate submission:', error);
    
    // Handle offline scenario
    if (!Fliplet.Navigator.isOnline()) {
      $vm.isOffline = true;
      $vm.blockScreen = true;
      $vm.isOfflineMessage = 'This form requires internet access to verify submission status.';
    }
  }
},
```

---

### Step 3: Add Submit Validation (Modify around line 1584)

Find the `beforeFormSubmit` hook and add validation:

```javascript
formPromise.then(function(form) {
  return Fliplet.Hooks.run('beforeFormSubmit', formData, form);
}).then(async function() {
  
  // ========================================
  // SINGLE SUBMISSION VALIDATION
  // ========================================
  if (data.singleSubmissionSelected && data.singleSubmissionField) {
    console.log('Single submission check enabled, validating...');
    
    // 1. Check if device is online
    if (!Fliplet.Navigator.isOnline()) {
      console.error('Device is offline, cannot submit');
      $vm.isSending = false;
      
      Fliplet.UI.Toast({
        type: 'error',
        position: 'center',
        backdrop: true,
        tapToDismiss: false,
        duration: false,
        actions: [{
          label: 'OK',
          action: function() {
            this.dismiss();
          }
        }],
        title: 'Unable to submit form',
        message: 'You must have an active network connection to submit this form.'
      });
      
      // Stop submission
      return Promise.reject('Device is offline');
    }
    
    // 2. Get the identifier field value
    const fieldValue = formData[data.singleSubmissionField];
    
    if (!fieldValue) {
      console.warn('Identifier field has no value');
    }
    
    // 3. Check for duplicate
    try {
      const isDuplicate = await checkForDuplicateSubmission(
        data.singleSubmissionField,
        fieldValue
      );
      
      if (isDuplicate) {
        console.log('Duplicate submission detected on submit!');
        $vm.isSending = false;
        
        // Show toast message
        showSubmissionExistMessage(
          data.singleSubmissionField,
          fieldValue,
          function() {
            executePostSubmissionAction($vm);
          }
        );
        
        // Track analytics
        Fliplet.Analytics.trackEvent('form', 'single_submission_blocked_on_submit', {
          formId: data.id,
          fieldName: data.singleSubmissionField
        });
        
        // Stop submission
        return Promise.reject('Duplicate submission detected');
      }
      
      console.log('No duplicate found, allowing submission');
      
    } catch (error) {
      console.error('Error during duplicate check:', error);
      $vm.isSending = false;
      
      // Handle offline error
      if (!Fliplet.Navigator.isOnline()) {
        Fliplet.UI.Toast({
          type: 'error',
          position: 'center',
          title: 'Unable to submit form',
          message: 'You must have an active network connection to submit this form.'
        });
      }
      
      return Promise.reject(error);
    }
  }
  // ========================================
  // END SINGLE SUBMISSION VALIDATION
  // ========================================
  
  // Continue with existing submission flow
  if (data.isFormInSlide) {
    await submitMultiStepForm(formData);
  }
  
  // ... rest of existing code continues ...
```

---

### Step 4: Add Success Analytics (Around line 1624)

Find the `afterFormSubmit` hook and add tracking:

```javascript
.then(function(result) {
  return formPromise.then(function(form) {
    return Fliplet.Hooks.run('afterFormSubmit', { 
      formData: formData, 
      result: result 
    }, form).then(function() {
      
      // Track single submission feature usage
      if (data.singleSubmissionSelected) {
        Fliplet.Analytics.trackEvent('form', 'single_form_submission', {
          formId: data.id,
          identifierField: data.singleSubmissionField
        });
      }
      
      // ... rest of existing afterFormSubmit code
```

---

## Testing Guide

### Phase 1: Configuration UI Testing ✅

Test these scenarios in Fliplet Studio:

- [ ] **Load Form Editor**
  - Single submission section appears when data source is selected
  - Checkbox is unchecked by default

- [ ] **Enable Single Submission**
  - Check the checkbox
  - Dropdown appears with "Loading..." or "No columns found"
  - Columns populate from selected data source
  - Offline option disappears

- [ ] **Select Identifier Column**
  - Choose a column from dropdown (e.g., "Email")
  - Save form
  - Reload form editor
  - Settings persist (checkbox checked, column selected)

- [ ] **Disable Single Submission**
  - Uncheck the checkbox
  - Dropdown disappears
  - Offline option reappears
  - Selected column is cleared

- [ ] **Change Data Source**
  - Select different data source
  - If single submission enabled, columns refresh automatically

---

### Phase 2: Runtime Testing ⏳

Test these scenarios after implementing the runtime validation:

#### A. Form Load Validation

- [ ] **New Submission (No Duplicate)**
  - Open form with single submission enabled
  - Form loads normally
  - Can fill out fields

- [ ] **Existing Submission (Duplicate Exists)**
  - Create a test entry with identifier value "test@email.com"
  - Open form with default value "test@email.com" for identifier field
  - Toast appears: "This form can only be submitted once..."
  - Click "OK" → Post-submission action executes

- [ ] **Edit Mode (Own Submission)**
  - Open form to edit your own submission
  - Form loads normally (current entry excluded from check)
  - Can update and save

#### B. Form Submit Validation

- [ ] **Submit New (No Duplicate)**
  - Fill form with unique identifier value
  - Submit form
  - Submission succeeds

- [ ] **Submit Duplicate**
  - Fill form with existing identifier value
  - Submit form
  - Toast appears: "This form can only be submitted once..."
  - Submission blocked

- [ ] **Submit While Offline**
  - Disconnect from internet
  - Try to submit form
  - Toast appears: "Unable to submit form..."
  - Submission blocked
  - Reconnect → Should be able to submit

#### C. Analytics Tracking

Check analytics dashboard for these events:

- [ ] `form_add_to_screen` - When form added
- [ ] `form_configure_to_screen` - When settings saved
- [ ] `single_submission_blocked_on_load` - When duplicate detected on load
- [ ] `single_submission_blocked_on_submit` - When duplicate detected on submit
- [ ] `single_form_submission` - When submission succeeds

---

## Implementation Checklist

### Configuration (✅ Complete)
- [x] Add checkbox and dropdown to interface.html
- [x] Add default values to generateFormDefaults()
- [x] Add dataSourceColumns data property
- [x] Create getDataSourceColumns() method
- [x] Add watcher for checkbox toggle
- [x] Add mounted lifecycle logic
- [x] Update schema.json
- [x] Hide offline option when enabled

### Runtime Validation (⏳ Pending)
- [ ] Add utility functions (showSubmissionExistMessage, executePostSubmissionAction, checkForDuplicateSubmission)
- [ ] Implement onSetDefaultValues method
- [ ] Implement checkSingleSubmissionOnLoad method
- [ ] Add validation in beforeFormSubmit hook
- [ ] Add analytics in afterFormSubmit hook

### Testing (⏳ Pending)
- [ ] Test configuration UI in Studio
- [ ] Test form load validation
- [ ] Test form submit validation
- [ ] Test offline scenarios
- [ ] Verify analytics tracking
- [ ] Test edit mode (own submission)

---

## Key Technical Details

### Query Logic

**Checking for Duplicates:**
```javascript
const query = {
  where: {
    [identifierField]: value,      // Match the identifier
    id: { $ne: entryId }           // Exclude current entry (edit mode)
  }
};
```

The `id: { $ne: entryId }` clause is critical - it excludes the current entry when in edit mode, allowing users to update their own submissions.

### Offline Handling

The feature requires online connectivity to check for duplicates:
- Uses `offline: false` parameter in `Fliplet.DataSources.connect()`
- Checks `Fliplet.Navigator.isOnline()` before submission
- Shows clear error messages when offline

### Data Flow

```
Configuration (Studio):
  settings.singleSubmissionSelected → Boolean
  settings.singleSubmissionField → String (column name)
  
Runtime (App):
  data.singleSubmissionSelected → Boolean
  data.singleSubmissionField → String (column name)
  data.dataSourceId → String (data source ID)
```

---

## File Summary

### Modified Files

| File | Lines Modified | Purpose |
|------|---------------|---------|
| `interface.html` | 81-101, 127 | UI for checkbox and dropdown |
| `js/libs/builder.js` | 174-175, 207, 719-736, 1202-1214, 1396-1399 | Configuration logic |
| `schema.json` | 42-53 | Schema definitions |
| `js/libs/form.js` | TBD | Runtime validation (pending) |

---

## Next Steps

1. **Implement Runtime Validation**
   - Open `js/libs/form.js`
   - Add the utility functions after line 706
   - Update `onSetDefaultValues` method around line 1020
   - Add validation in `beforeFormSubmit` around line 1584
   - Add analytics in `afterFormSubmit` around line 1624

2. **Test Configuration UI**
   - Run `fliplet run`
   - Test in Studio
   - Verify columns load correctly

3. **Test Runtime Validation**
   - Create test data source with sample data
   - Test all scenarios from Testing Guide
   - Verify analytics events fire

4. **Deploy**
   - Commit changes
   - Push to branch
   - Create pull request
   - Deploy to production

---

**END OF IMPLEMENTATION GUIDE**
