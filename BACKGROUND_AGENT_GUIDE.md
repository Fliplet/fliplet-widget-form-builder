# Single Submission Feature - Background Agent Implementation Guide

**THIS IS THE DEFINITIVE GUIDE FOR AUTOMATED IMPLEMENTATION**

---

## 🎯 Mission: Implement Runtime Validation

**Status:**
- ✅ Configuration UI: **100% Complete** (no changes needed)
- ⏳ Runtime Validation: **0% Complete** (implement this)

**Scope:**
- **Only 1 file needs modification:** `js/libs/form.js`
- **4 precise insertion points** with exact line numbers
- **All code is copy-paste ready** with context markers

---

## 📋 Pre-Implementation Checklist

Before starting, verify these files exist and are at the correct state:

### ✅ Files that should NOT be modified:
- `interface.html` - Configuration UI complete
- `js/libs/builder.js` - Configuration logic complete
- `schema.json` - Schema complete

### ⏳ File to modify:
- `js/libs/form.js` - Add runtime validation here

---

## 🔍 Code Structure Analysis

### Current structure of `js/libs/form.js`:

```
Line 1-688:   Helper functions and setup
Line 689-693: Variable declarations
Line 694:     [INSERT POINT 1: Utility Functions]
Line 695:     const $form = new Vue({
Line 698-719: data: function() { ... }
Line 728:     methods: {
Line 1014:    [INSERT POINT 2: onSetDefaultValues method - REPLACE]
Line 1021:    [INSERT POINT 3: checkSingleSubmissionOnLoad method - ADD AFTER]
Line 1582:    formPromise.then(...)
Line 1583:    beforeFormSubmit hook
Line 1584:    [INSERT POINT 4: Add validation logic here]
Line 1624:    [INSERT POINT 5: Add analytics in afterFormSubmit]
```

---

## 📝 Implementation Steps

### STEP 1: Add Utility Functions

**Location:** After line 693, before `const $form = new Vue({`

**Context marker to find:**
```javascript
const changeListeners = {};

// [ADD UTILITY FUNCTIONS HERE]

const $form = new Vue({
```

**Code to insert:**

```javascript
/**
 * ============================================
 * SINGLE SUBMISSION - UTILITY FUNCTIONS
 * ============================================
 */

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

/**
 * ============================================
 * END SINGLE SUBMISSION - UTILITY FUNCTIONS
 * ============================================
 */
```

---

### STEP 2: Replace onSetDefaultValues Method

**Location:** Line 1014-1020

**Context marker to find:**
```javascript
onSetDefaultValues: function(defaultValue) {
  // data.singleSubmission check enable
  // check data.singlesubmission is equalt defaultValue.key;
  // check existing record. if yes stop the rendering and show popup

  console.log('Setting default value for field:', defaultValue, data);
},
```

**Replace with:**

```javascript
/**
 * Called when default values are set for form fields
 * Used to check for duplicate submissions on form load
 */
onSetDefaultValues: function(defaultValue) {
  const $vm = this;
  
  // Check if single submission is enabled
  if (!data.singleSubmissionSelected || !data.singleSubmissionField) {
    return;
  }
  
  // Only check when the identifier field value is set
  if (defaultValue.key !== data.singleSubmissionField) {
    return;
  }
  
  // Perform the duplicate check
  this.checkSingleSubmissionOnLoad(defaultValue.key, defaultValue.value);
},
```

---

### STEP 3: Add checkSingleSubmissionOnLoad Method

**Location:** After the `onSetDefaultValues` method (after line 1020)

**Context marker to find:**
```javascript
onSetDefaultValues: function(defaultValue) {
  // ... (the code you just added)
},
// [ADD NEW METHOD HERE]
onChange: function(fieldName, fn, runOnBind) {
```

**Code to insert:**

```javascript
/**
 * Check for existing submission on form load
 * @param {string} fieldName - The identifier field name
 * @param {any} fieldValue - The field value to check
 */
checkSingleSubmissionOnLoad: async function(fieldName, fieldValue) {
  const $vm = this;
  
  // Skip if no value
  if (!fieldValue) {
    return;
  }
  
  try {
    // Check if duplicate exists
    const isDuplicate = await checkForDuplicateSubmission(fieldName, fieldValue);
    
    if (isDuplicate) {
      console.log('Duplicate submission detected on load');
      
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

### STEP 4: Add Submit Validation

**Location:** Line 1584, in the `.then(async function()` after `beforeFormSubmit`

**Context marker to find:**
```javascript
formPromise.then(function(form) {
  return Fliplet.Hooks.run('beforeFormSubmit', formData, form);
}).then(async function() {
  if (data.isFormInSlide) {
    await submitMultiStepForm(formData);
  }
```

**Replace `.then(async function() {` section with:**

```javascript
}).then(async function() {
  
  // ========================================
  // SINGLE SUBMISSION VALIDATION
  // ========================================
  if (data.singleSubmissionSelected && data.singleSubmissionField) {
    
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
    
    // 3. Check for duplicate
    try {
      const isDuplicate = await checkForDuplicateSubmission(
        data.singleSubmissionField,
        fieldValue
      );
      
      if (isDuplicate) {
        console.log('Duplicate submission detected on submit');
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
```

---

### STEP 5: Add Success Analytics

**Location:** Around line 1624, in the `afterFormSubmit` hook

**Context marker to find:**
```javascript
.then(function(result) {
  return formPromise.then(function(form) {
    return Fliplet.Hooks.run('afterFormSubmit', { formData: formData, result: result }, form).then(function() {
      if (entryId !== 'session') {
        return;
      }
```

**Add after the `.then(function() {` line:**

```javascript
return Fliplet.Hooks.run('afterFormSubmit', { formData: formData, result: result }, form).then(function() {
  
  // Track single submission feature usage
  if (data.singleSubmissionSelected) {
    Fliplet.Analytics.trackEvent('form', 'single_form_submission', {
      formId: data.id,
      identifierField: data.singleSubmissionField
    });
  }
  
  // Existing code continues...
  if (entryId !== 'session') {
    return;
  }
```

---

## ✅ Verification Checklist

After implementing all changes, verify:

### Code Structure:
- [ ] 3 utility functions added before `const $form = new Vue({`
- [ ] `onSetDefaultValues` method replaced with new version
- [ ] `checkSingleSubmissionOnLoad` method added after `onSetDefaultValues`
- [ ] Submit validation added in `beforeFormSubmit` hook
- [ ] Analytics tracking added in `afterFormSubmit` hook

### Syntax Check:
- [ ] No missing commas between methods
- [ ] All functions properly closed with `}`
- [ ] No syntax errors (run linter if available)

### Logic Check:
- [ ] Uses `data.singleSubmissionSelected` (not `settings`)
- [ ] Uses `data.singleSubmissionField` (not `settings`)
- [ ] Excludes current entry: `id: { $ne: entryId }`
- [ ] Uses `offline: false` in data source connection
- [ ] Checks `Fliplet.Navigator.isOnline()` before submission

---

## 🧪 Testing Instructions

### Test 1: Configuration UI (Already Working)
```bash
# Start development server
fliplet run

# In Studio:
1. Add form to page
2. Select data source
3. Enable "Single submission"
4. Verify dropdown shows columns
5. Select identifier column (e.g., "Email")
6. Save form
```

### Test 2: Form Load Validation
```javascript
// Scenario A: No duplicate exists
1. Open form in preview/app
2. Form should load normally
3. Can fill out fields

// Scenario B: Duplicate exists
1. Create test entry with Email = "test@example.com"
2. Set form field to load default value "test@example.com"
3. Open form in preview/app
4. Should see toast: "This form can only be submitted once..."
5. Click OK → Should execute post-submission action
```

### Test 3: Form Submit Validation
```javascript
// Scenario A: Submit unique value
1. Fill form with unique Email
2. Submit form
3. Should succeed

// Scenario B: Submit duplicate
1. Fill form with existing Email
2. Submit form
3. Should see toast: "This form can only be submitted once..."
4. Submission blocked
```

### Test 4: Offline Handling
```javascript
// Disconnect internet
1. Try to submit form
2. Should see toast: "Unable to submit form..."
3. Submission blocked
```

### Test 5: Edit Mode
```javascript
1. Open form to edit existing entry
2. Change other fields (not identifier)
3. Submit
4. Should succeed (own entry excluded from check)
```

---

## 📊 Expected Outcomes

### Configuration (Already Complete ✅)
```javascript
// Saved in widget data
{
  singleSubmissionSelected: true,
  singleSubmissionField: "Email",
  dataSourceColumns: ["Email", "Name", "Phone"],
  offline: false
}
```

### Runtime Validation (After Implementation ⏳)
```javascript
// On Form Load
if (identifierField.value === "test@example.com") {
  checkForDuplicateSubmission()
  → Query: { where: { Email: "test@example.com", id: { $ne: entryId } } }
  → If found: Show toast + Execute post-submission action
  → If not found: Render form normally
}

// On Form Submit
if (formData.Email === "test@example.com") {
  checkForDuplicateSubmission()
  → Query: { where: { Email: "test@example.com", id: { $ne: entryId } } }
  → If found: Show toast + Block submission
  → If not found: Allow submission
}

// On Success
→ Track analytics: "single_form_submission"
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot read property 'singleSubmissionSelected' of undefined"
**Solution:** Check that you're using `data.singleSubmissionSelected` (not `this.settings`)

### Issue 2: Duplicate still submitted
**Solution:** Verify the `beforeFormSubmit` validation returns `Promise.reject()` when duplicate found

### Issue 3: Edit mode blocks own submission
**Solution:** Ensure `id: { $ne: entryId }` is in the query to exclude current entry

### Issue 4: Form submission hangs
**Solution:** Check for missing `return` statements or unhandled promise rejections

### Issue 5: Syntax errors
**Solution:** Verify all commas between methods and closing braces

---

## 📁 File Reference

### Files Modified
```
js/libs/form.js
├── Line 694:  + Utility functions (3 functions)
├── Line 1014: ↻ onSetDefaultValues (replaced)
├── Line 1021: + checkSingleSubmissionOnLoad (new method)
├── Line 1584: ↻ beforeFormSubmit validation (enhanced)
└── Line 1624: + afterFormSubmit analytics (added)
```

### Files NOT Modified (Already Complete)
```
interface.html       - Configuration UI ✅
js/libs/builder.js   - Configuration logic ✅
schema.json          - Schema definitions ✅
```

---

## 🎯 Success Criteria

Implementation is complete when:

1. ✅ All 5 code insertions made without syntax errors
2. ✅ Form loads and shows toast when duplicate exists
3. ✅ Form submission blocks when duplicate exists
4. ✅ Offline submission shows appropriate error
5. ✅ Edit mode allows updating own submission
6. ✅ Analytics events fire correctly
7. ✅ All tests pass

---

## 📞 Support Information

### Variables to Know
```javascript
// Configuration (Studio)
settings.singleSubmissionSelected  // Boolean - UI binding
settings.singleSubmissionField     // String - UI binding
dataSourceColumns                   // Array - Column list

// Runtime (App)
data.singleSubmissionSelected      // Boolean - Feature flag
data.singleSubmissionField         // String - Column name
data.dataSourceId                  // String - Data source ID
entryId                            // String - Current entry ID (edit mode)
```

### Key Functions
```javascript
checkForDuplicateSubmission(fieldName, fieldValue)  // Returns Promise<boolean>
showSubmissionExistMessage(columnName, value, fn)   // Shows toast
executePostSubmissionAction($vm)                    // Executes action
Fliplet.Navigator.isOnline()                        // Returns boolean
Fliplet.Analytics.trackEvent(category, action, data) // Tracks event
```

---

**END OF BACKGROUND AGENT GUIDE**

*This guide is complete and ready for automated implementation.*
