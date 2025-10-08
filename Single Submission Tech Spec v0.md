## 0\. Updated scope

|  Form settings changes Add a “Only allow single submission” checkbox If checked, user must select the “Identifying column” from the selected data source It doesn’t have to be related to the user’s login/email Helper text: Choose the data source column used to detect existing submissions The identifying column data can have its value loaded via the form field settings, no changes are required to this feature On load, [after all data is loaded](https://developers.fliplet.com/API/components/form-builder.html#afterformentryload), the form will read the identifying column and check if a record exists in the associated data source This applies to the following flow: User trying to insert a new entry If a record exists, display a Toast message “This form can only be submitted once. An entry with column: value already exists.” with an “OK” action to execute the form’s post-submission action. The toast message should not auto-dismiss, so that they have to interact with the message. `Fliplet.UI.Toast({ type: 'regular', position: 'center', backdrop: true, tapToDismiss: false, duration: false, actions: [{ label: 'OK', action() { this.dismiss() /* Execute post-submission action */ } }], title: 'This form can only be submitted once', message: 'An entry with {columnName}: {value} already exists.' })` [Before form submission](https://developers.fliplet.com/API/components/form-builder.html#beforeformsubmit), Verify, depending on the form’s submission flow/behaviour User trying to insert a new entry no record with a matching identifier exists in the associated data source User trying to update an entry, which could lead to two entries with the same value in a column no OTHER record with a matching identifier exists in the associated data source If a record exists, display a Toast message “This form can only be submitted once. An entry with column: value already exists.” with an “OK” action to execute the form’s post-submission action. The toast message should not auto-dismiss, so that they have to interact with the message. See above. The checks for existing entries must be using live data source and not the offline cached data source. The API request will fail if the device is offline, which will consider the check as failed. See `offline: false` parameter in [https://developers.fliplet.com/API/fliplet-datasources.html\#connect-to-a-data-source-by-id](https://developers.fliplet.com/API/fliplet-datasources.html#connect-to-a-data-source-by-id) In this case, do continue to show the form as normal (so the user can fill it in and bring the device online during this time). But the form cannot be submitted unless the device is online to perform the single submission check. The toast message can be changed to `{ title: 'Unable to submit form', message: 'You must have an active network connection to submit this form.' }`  |
| :---- |

## **1\. Introduction and Overview**

### **1.1 Purpose**

	The purpose of this technical specification is to provide a detailed blueprint for the implementation of the “Single Submission Per User” setting in Fliplet’s Form component.

### **1.2 Scope**

This specification covers the implementation of a configurable setting within the Fliplet Form Builder Widget, available in Fliplet Studio, that restricts each user to a single form submission. The scope includes frontend configuration and conditional rendering or redirection based on submission status. 

---

## **2\. Reference Documents**

### **2.1 Product Requirement Document (PRD)**

**Title:** Product Specifications – Form Submission Logic

This PRD outlines the requirement to allow only one submission per user in Fliplet forms. It details settings to enable this feature, dependencies on validation, the conditional rendering of the form based on submission status, and UI/UX expectations for post-submission behavior.

### **2.2 Additional References**

[Fliplet Data Source API – Fetch Records](https://developers.fliplet.com/API/fliplet-datasources.html#fetch-records-with-a-query)  
Used to query the form submission data source to determine if a submission from the current user already exists.

---

## **3\. Technical Requirements**

### **3.1 Feature Breakdown**

| ID | Feature Name | Description | Owner (Initials) |
| ----- | :---- | :---- | :---- |
| FR-1 | “Single Submission” Form Setting | Add a checkbox in the form configuration panel labelled "Allow single submission per user." | F.T. |
| FR-2 | Field Dropdown for identifier column | Display a dependent dropdown of data source columns to select the identifier field for matching submissions. | F.T. |
| FR-3 | Form Load Check Logic  | On form load, check if the user has previously submitted the form using the selected identifier field for matching submissions, against any entry in the data source. | F.T. |
| FR-4 | Block Re-submission & Trigger Action | If submission exists, do not render the form, show a toast message and if the user clicks on “OK” then trigger the post-submission action. | F.T. |
| FR-5 | Offline Submission Blocking | Block the form when offline with an error message: “This form requires internet access…” | F.T. |
| FR-6 | Submission Check Logic  | On form submit, check if the user has previously submitted using the selected identifier field for matching submissions, against any entry in the data source to ensure data integrity. | FT |
| FR-7 | Track Usage for Form | Track the usage of the feature(Add, Delete, Configure Form) | FT |

### **3.2 Feature Implementation Details**

#### FR-1 “Single Submission” Form Setting

1. Add a checkbox in the form configuration panel labeled "Allow single submission per user."  
2. Figma: [https://www.figma.com/design/kcY9zJHjU0rSasYFWnIb3B/Form-improvements?node-id=0-1](https://www.figma.com/design/kcY9zJHjU0rSasYFWnIb3B/Form-improvements?node-id=0-1)  
3. On toggling this checkbox, the option for updating existing entries in a data source should become hidden. It will also hide offline options.

| State | Trigger | Display | User Actions |
| :---- | :---- | :---- | :---- |
| Toggle Checkbox for single submission |  | Show dropdown to select the identifier field for matching submissions Hide option to update existing entries Hide option for online & offline availability | Click on checkbox |

#### FR-2  Field Dropdown for identifier matching

1. Display a dependent dropdown of data source columns to select the identifier field for matching submissions.

| State | Trigger | Display | User Actions |
| :---- | :---- | :---- | :---- |
| Select the identifier field for matching submissions from the dropdown |  | Show configured datasource columns | Select the form field |

#### FR-3 Form Load Check Logic

1. On form load, check if the user has previously submitted the form using the selected identifier field for matching submissions, against any entry in the data source. If the entry exists then the submission already exists and the toast message will be displayed. Clicking the “OK” action will trigger post-submission action. If the entry doesn’t exist then the form will be rendered.  
2. To accomplish this we will query via a configured field. This will:  
   1. Perform case-sensitive comparisons by default for string fields.  
   2. Enforce submission prevention alone — it supports enforcement by being called in form logic

```javascript
// Function to check for existing submission on form load
onSetDefaultValues: async function({ key, value }) {
         try {
           // data.singleSubmission check enable
           const isSingleSubmissionSelected = data.singleSubmissionSelected;
    // data.singleSubmission check enable follow code will be converted to function for reusability
           if (!isSingleSubmissionSelected) {
             return;
           }

           // check data.singleSubmissionField.label is equal to key;
           const singleSubmissionField = data.singleSubmissionField.label;

           if (singleSubmissionField === key) {
             // check existing record. if yes stop the rendering and show toast
             const connection = await Fliplet.DataSources.connect(data.dataSourceId);

             const records = await connection.find({
               where: {
                 [singleSubmissionField]: value,
		    id: { $ne: entryId }
               }
             });

             if (records.length) {
               showSubmissionExistMessage(key, value);

               //Post-Submission action function called
               triggerPostSubmissionAction();
             }

             //render-form function
             renderForm();
           }
         } catch (error) {
           // Handle error (e.g., show an error message to the user)
         }
       }

//function to display toast message 
function showSubmissionExistMessage(columnName, value){
           Fliplet.UI.Toast({
             type: 'regular',         
             position: 'center',      
             backdrop: true,          
             tapToDismiss: false,     
             duration: false,         
             actions: [{
               label: 'OK',
               action() {
                 this.dismiss();      
                 /* Execute post-submission action */
               }
             }],
             title: 'This form can only be submitted once',
             message: `An entry with ${columnName}: ${value} already exists.`
           });
         }
```

#### FR- 4 Block Re-submission & Trigger Action

1. If submission exists, do not render the form and instead trigger the post-submission action.  
2. Clicking 'Start Over' should behave the same way.  
 


| State | Trigger | Display | User Actions |
| :---- | :---- | :---- | :---- |
| If submission exists then don’t render the form  |  | Show a toast message that “This form can only be submitted once. An entry with column: value already exists.” and it can’t be auto-dismissed. Show an “OK” action inside the Toast message to execute post-submission action | Click on “OK” action it will trigger post submission action |
| If submission doesn’t exist then render the form |  | Render the form |  |

#### FR-5 Offline Submission Blocking

1. Block the form when offline with an error message: “`This form requires internet access to verify submission status.`”

| State | Trigger | Display | User Actions |
| :---- | :---- | :---- | :---- |
| If the device is offline then block the form submission  |  | Show an error message that “This form requires internet access to verify submission status.” Continue to show the form as normal so the user can fill it and bring the device online during this time. |  |
| If the device is online then allow the form submission  |  | Allow to submit the form |  |

#### FR-6 Submission Check Logic 

1. On form submit, check if the user has previously submitted using the selected identifier field for matching submissions, against any entry in the data source to ensure data integrity. If the entry exists then the submission already exists and the toast message will be displayed. Clicking the “OK” action will trigger post-submission action. If the entry doesn’t exist then the form will be submitted.  
   **Before Form Submission logic** 

```javascript
formPromise.then(function(form) {
return Fliplet.Hooks.run('beforeFormSubmit', formData, form);
}).then(async function() {
         
         try {
           // data.singleSubmission check enable follow code will be converted to function for reusability
           const isSingleSubmissionSelected = data.singleSubmissionSelected;
           if (!isSingleSubmissionSelected) {
             return;
           }

           // check data.singleSubmissionField.label is equal to formData.key;
           const singleSubmissionField = data.singleSubmissionField.label;

           if (singleSubmissionField) {
             // check existing record. if yes stop the rendering and show popup
             const connection = await Fliplet.DataSources.connect(data.dataSourceId);

             const records = await connection.find({
               where: {
                 [singleSubmissionField]: formData[singleSubmissionField],
 			    id: { $ne: entryId }
               }
             });

             if (records.length) {
               showSubmissionExistMessage(singleSubmissionField, formData[singleSubmissionField]);

               //Post-Submission action function called
               triggerPostSubmissionAction();
             }

             //render-form function
             renderForm();
           }
         } catch (error) {
           // Handle error (e.g., show an error message to the user)
         }
       }

              if (data.isFormInSlide) {
                await  submitMultiStepForm(formData);
              }
```

- **isSingleSubmissionSelected** will tell that whether the single submission check is enabled in the form settings or not   
- If **isSingleSubmissionSelected** is true, then it will further check whether the **singleSubmissionField** exists. If it exists then match its field value with the data source entry. If the entry already exists in the data source then it means that the submission already exists so display a toast message.  
- Only after the user clicks the “OK” action, then the post submission action will be triggered.   
- If the entry doesn’t exist in the data source then the form will be submitted.  
- This field will be enforced as unique across all entries in the DataSource for the specific form.

#### FR- 7 Track form usage analytics

This feature will track key user interactions with the "Single Submission Per User" setting within Fliplet Studio and successful form submissions in live apps.

| Category | Action | Label | When Triggered |
| :---- | :---- | :---- | :---- |
| `form` | `form_add_to_screen` | `${formFieldName}_field` | In Studio, when the form is added on the page. |
| `form` | `form_delete_from_screen` | `${formFieldName}_field` | In Studio, when the form is removed from the page. |
| `form` | `form_configure_to_screen` | `${formFieldName}_field` | In Studio, when configuration for the forms are changed. |
| `form` | `single_form_submission` | `${formFieldName}_field` | In Live App, when a form with a single submission feature enabled is successfully submitted. |

## Tracking Information:

### **3.3 Dependencies**

| Dependency | Description |
| ----- | ----- |
| **Fliplet Data Source API** | Used to query the form submission data source to check for prior submissions. |

### **3.4 Acceptance Criteria**

| ID | Acceptance Criterion | Related Feature |
| :---- | :---- | :---- |
| AC-1 | Given the “Single submission per user” checkbox is enabled, when no prior submission exists, then the form should be rendered | FR-3 |
| AC-2 | Given the “Single submission per user” checkbox is enabled, when a prior submission exists, then the form should not render and a toast message will be displayed. Only after the user clicks “OK” action, then the post-submission action should trigger. | FR-4 |
| AC-3 | Given the user is offline, when the feature is enabled, then show the error message: “This form requires internet access to verify your submission status.” | FR-5 |
| AC-4 | Given the checkbox is unchecked, when a user accesses the form, then the form behaves with no submission restrictions. | FR-1 |
| AC-5 | Given the “Single submission per user” checkbox is enabled, when no prior submission exists, then the form should be submitted | FR-6 |

## **4\. API and Integration Details**

### **4.1 Service Endpoints**

### **Overview:**

This section outlines the APIs used by the feature, including endpoint details, expected request/response structures, and authentication requirements.

---

### **JS API Dependencies**

#### **1\. Fliplet.DataSources.connect().find()**

* **Purpose:** Check whether a form submission exists for the current user by querying the configured data source.  
* **Method:** JavaScript SDK  
* **Authentication:** Inherits current app user’s access level

**Usage Example:**

`const connection = await Fliplet.DataSources.connect(data.dataSourceId);`

             `const records = await connection.find({`  
               `where: {`  
                 `[singleSubmissionField]: value,`  
		     `id: { $ne: entryId }`  
               `}`  
             `});`

### **Request/Response Expectations**

* **Query Parameters:**  
  * `where`: JSON object filtering by the selected identifier field for matching submissions

* **Response:**  
  * Array of matching records  
  * If empty: user has not submitted  
  * If non-empty: user has already submitted

### **4.2 Integration Points**

### **Overview:**

This section describes how the feature integrates with other Fliplet components or services, and outlines any cross-system interactions required for its functionality.

---

### **Internal Integration Points**

| Component / Service | Integration Purpose |
| ----- | ----- |
| **Fliplet Form Builder Widget** | Hosts the UI setting ("Single submission per user") and handles form logic flow. |
| **Fliplet Data Source Service** | Stores and queries submission data for duplication checks. |
| **Post-submission action handlers** | Executes configured actions (e.g., redirect, show message) based on submission status. |

---

## **5\. Risks and Mitigations**

This section identifies potential technical or organizational risks associated with the implementation of the feature, assesses their likelihood and severity, and outlines mitigation strategies and ownership.

### **5.1 Risk Log**

| Risk ID | Description | Severity | Likelihood |
| ----- | ----- | ----- | ----- |
| R-1 | Failure to correctly identify duplicate submissions due to misconfigured identifier field for matching submissions | High | Low |
| R-2 | Incorrect or incomplete configuration by app builder leads to user frustration or confusion | Medium | Medium |

### 

### **5.2 Mitigation Strategies**

| Risk ID | Mitigation Strategy | Owner |
| ----- | ----- | ----- |
| R-1 | Require selection of an identifier field for matching submissions via a dependent dropdown. Show a warning to select the identifier field for matching submission again so that if the user changes the identifier field’s label for matching submission. | F.T. |
| R-2 | Provide comprehensive guidance in Fliplet Studio and documentation. Conduct usability review prior to release. | F.T. |
| R-3 | Educate app builders through documentation and reinforce best practices in documentation. | F.T. |

