this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.buttons"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group clearfix\">\n  <div class=\"checkbox checkbox-icon\">\n    <input type=\"checkbox\" id=\"show_submit\" v-model=\"showSubmit\">\n    <label for=\"show_submit\">\n      <span class=\"check\"><i class=\"fa fa-check\"></i></span> Show submit button\n    </label>\n  </div>\n</div>\n\n<div class=\"form-group\" :class=\"{ 'has-error': _fieldLabelError && !submitValue }\">\n  <label>Submit button label</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"submitValue\" placeholder=\"Submit button label\" />\n  <p class=\"help-block\" v-if=\"_fieldLabelError && !submitValue\" v-html=\"_fieldLabelError\"></p>\n</div>\n\n<div class=\"form-group clearfix\">\n  <div class=\"checkbox checkbox-icon\">\n    <input type=\"checkbox\" id=\"show_clear\" v-model=\"showClear\">\n    <label for=\"show_clear\">\n      <span class=\"check\"><i class=\"fa fa-check\"></i></span> Show clear button\n    </label>\n    <p class=\"help-block\">The clear button will reset all fields to their defaults.</p>\n  </div>\n</div>\n\n<div class=\"form-group\" :class=\"{ 'has-error': _fieldLabelError && !clearValue }\">\n  <label>Clear button label</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"clearValue\" placeholder=\"Clear button label\" />\n  <p class=\"help-block\" v-if=\"_fieldLabelError && !clearValue\" v-html=\"_fieldLabelError\"></p>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.checkbox"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default values <small>(One per line)</small></label>\n  <textarea class=\"form-control\" v-model.trim=\"defaultValue\" placeholder=\"Default values\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.date"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <div>\n    <label class=\"control-label\">Default</label>\n  </div>\n  <div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"empty\" name=\"empty\" value='empty' v-model=\"autofill\">\n      <label for=\"empty\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>No default value\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"specific\" name=\"specific\" value='specific' v-model=\"autofill\">\n      <label for=\"specific\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Autofill with a specific date if it's empty\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"default\" name=\"default\" value='default' v-model=\"autofill\">\n      <label for=\"default\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Autofill with current date if it's empty\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"always\" name=\"always\" value='always' v-model=\"autofill\">\n      <label for=\"always\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Always autofill with current date\n      </label>\n    </div>\n  </div>\n</div>\n\n<div v-if=\"isApplyCurrentDateFiled\" class=\"form-group\">\n  <div>\n    <label class=\"control-label\">When applying the current date</label>\n  </div>\n  <div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"load\" name=\"load\" value='load' v-model=\"defaultSource\">\n      <label for=\"load\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Use the date when form is loaded\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"submission\" name=\"submission\" value='submission' v-model=\"defaultSource\">\n      <label for=\"submission\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Use the date when form is submitted\n      </label>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.email"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.file"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Description</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"description\" placeholder=\"Description text\" />\n</div>\n<div class=\"form-group\">\n  <label class=\"selectLabel\">Select the folder where the files are stored.</label>\n  <div class=\"btn btn-primary\" id=\"select_folder\" v-model=\"mediaFolderId\" v-on:click=\"openFilePicker\">\n    <template v-if=\"mediaFolderId\">Replace folder</template>\n    <template v-else>Select a folder</template>\n  </div>\n  <div v-if=\"mediaFolderId\" class=\"selected-folder-holder\">\n    <i class=\"fa fa-folder\"></i> Selected folder: <strong>{{ mediaFolderData.name }}</strong> - <a href=\"#\" v-on:click.prevent=\"openFileManager\">See files</a>\n  </div>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.form-result"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>Thank you for submitting the form!</h2>\n<hr />\n<a href=\"#\" class=\"btn btn-primary\" v-on:click=\"start($event)\">Start over</a>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.form"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "      <div class=\"form-group cleafix\">\n        <div class=\"col-xs-12\">\n          <label class=\"control-label\">Options <small>(One per line)</small></label>\n        </div>\n        <div class=\"col-xs-12\">\n          <textarea v-on:input=\"_setOptions($event.target.value)\" class=\"form-control\">{{ _options }}</textarea>\n        </div>\n      </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", buffer = 
  "<form v-on:submit.prevent=\"onSubmit\" class=\"form-horizontal\">\n  <div class=\"form-fields-holder\">\n    <div v-if=\"_isFormField\">\n      <div class=\"form-group cleafix\" :class=\"{ 'has-error': _fieldLabelError }\">\n        <div class=\"col-xs-12\">\n          <div class=\"row\">\n            <div class=\"col-xs-5\">\n              <label class=\"control-label\" for=\"field-label\">Field label</label>\n            </div>\n            <div class=\"col-xs-12\">\n              <input class=\"form-control\" @input=\"matchFields\" id=\"field-label\" type=\"text\" v-model.trim=\"label\" placeholder=\"Field description\" />\n              <p class=\"help-block\" v-if=\"_fieldLabelError\" v-html=\"_fieldLabelError\"></p>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"form-group cleafix\" :class=\"{ 'has-error': _fieldNameError }\">\n        <div class=\"col-xs-12\">\n          <div class=\"row\">\n            <div class=\"col-xs-5\" v-if=\"_showNameField\">\n              <label class=\"control-label\" for=\"field-name\">Field name</label>\n            </div>\n            <div class=\"col-xs-12 text-right\" v-if=\"!_showNameField\">\n              <span class=\"btn-link form-fields-customize\" @click=\"disableAutomatch\">Set the field's name <i class=\"text-muted fa fa-question-circle\" ref=\"tooltip\" data-viewport=\".modal-body\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Customize a different field name for the data source\"></i></span>\n            </div>\n            <div class=\"col-xs-7 col-xs-7 text-right\" v-else>\n              <span class=\"btn-link form-fields-customize\" @click=\"enableAutomatch\">Match the field's name and label</span>\n            </div>\n            <div class=\"col-xs-12\" v-if=\"_showNameField\">\n              <input id=\"field-name\" class=\"form-control\" type=\"text\" v-model.trim=\"name\" placeholder=\"Field name\" />\n              <p class=\"help-block\" v-if=\"_fieldNameError\" v-html=\"_fieldNameError\"></p>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"form-group cleafix\">\n        <div class=\"col-xs-12\">\n          <label class=\"control-label\">Is this field required?</label>\n        </div>\n        <div class=\"col-xs-12\">\n          <div class=\"radio radio-icon\">\n            <input type=\"radio\" id=\"required-yes\" name=\"required-option\" v-bind:value=\"true\" v-model=\"required\" v-on:input=\"isHidden = false\">\n            <label for=\"required-yes\">\n              <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>Yes</strong> - Users will have to fill in the field\n            </label>\n          </div>\n          <div class=\"radio radio-icon\">\n            <input type=\"radio\" id=\"required-no\" name=\"required-option\" v-bind:value=\"false\" v-model=\"required\">\n            <label for=\"required-no\">\n              <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>No</strong> - The field is optional\n            </label>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"form-group-cleafix\">\n        <div class=\"checkbox checkbox-icon form-hide-checkbox\">\n          <input type=\"checkbox\" :name=\"name\" v-model=\"isHidden\" id=\"form-hide-checkbox\" v-on:input=\"required = false\">\n          <label for=\"form-hide-checkbox\">\n            <span class=\"check\"><i class=\"fa fa-check\"></i></span>\n            <span class=\"hide-field\">Hide this field from users.</span>\n          </label>\n        </div>\n      </div>\n    </div>\n\n";
  stack1 = ((helper = (helper = helpers.hasOptions || (depth0 != null ? depth0.hasOptions : depth0)) != null ? helper : alias2),(options={"name":"hasOptions","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.hasOptions) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n     <div v-if=\"_componentsWithDescription.includes(_componentName)\" class=\"form-group cleafix\">\n       <div class=\"col-xs-12\">\n        <label>Description</label>\n        <input class=\"form-control\" type=\"text\" v-model.trim=\"description\" placeholder=\"Description text\" />\n      </div>\n    </div>\n\n    <div v-if=\"_componentsWithPersonalization.includes(_componentName)\" class=\"form-group cleafix\">\n      <div class=\"col-xs-12\">\n        <label>Default value type</label>\n        <select class=\"form-control\" :value=\"defaultValueSource\" v-model=\"defaultValueSource\">\n          <option value=\"default\">Enter a value</option>\n          <option value=\"profile\">User profile data</option>\n          <option value=\"appStorage\">App storage variable</option>\n          <option value=\"query\">Link query parameter</option>\n        </select>\n        <div class=\"col-xs-12 text-right\">\n          <a href=\"https://help.fliplet.com/form-component/\" target=\"_blank\">Learn more about these types</a>\n        </div>\n        <div v-if=\"defaultValueSource !== 'default'\">\n          <label>Default key</label>\n          <div v-if=\"!defaultValueKey\" class=\"text-danger\">\n            This field is required*\n          </div>\n          <input v-bind:class=\"{ 'border-danger': !defaultValueKey }\" v-if=\"defaultValueSource === 'profile'\"class=\"form-control\" type=\"text\" v-model.trim=\"defaultValueKey\" placeholder=\"Enter user data field/column name\" />\n          <input v-bind:class=\"{ 'border-danger': !defaultValueKey }\" v-else-if=\"defaultValueSource === 'appStorage'\"class=\"form-control\" type=\"text\" v-model.trim=\"defaultValueKey\" placeholder=\"Enter storage key\" />\n          <input v-bind:class=\"{ 'border-danger': !defaultValueKey }\" v-else-if=\"defaultValueSource === 'query'\"class=\"form-control\" type=\"text\" v-model.trim=\"defaultValueKey\" placeholder=\" Enter query name\" />\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-xs-12\">\n      "
    + ((stack1 = ((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"template","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n\n    <div v-if='_readOnlyComponents.includes(_componentName)' class=\"col-xs-12 form-group\">\n      <div class=\"checkbox checkbox-icon\">\n        <input type=\"checkbox\" id=\"readonly\" name=\"readonly\" v-model=\"readonly\">\n        <label for=\"readonly\">\n          <span class=\"check\"><i class=\"fa fa-check\"></i></span> Read only and cannot be edited\n        </label>\n      </div>\n    </div>\n\n  </div>\n\n  <div class=\"footer\">\n    <button type=\"submit\" class=\"btn btn-primary\" :class=\"{ disabled: _fieldNameError || _fieldLabelError }\">Done</button>\n  </div>\n</form>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.horizontalRule"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.image"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Description</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"description\" placeholder=\"Description text\" />\n</div>\n<div class=\"form-group\">\n  <label>Set a maximum width for uploaded images</label>\n  <input class=\"form-control\" type=\"number\" v-model.trim=\"customWidth\" />\n</div>\n<div class=\"form-group\">\n  <label>Set a maximum height for uploaded images</label>\n  <input class=\"form-control\" type=\"number\" v-model.trim=\"customHeight\" />\n</div>\n<div class=\"form-group\">\n  <label class=\"selectLabel\">Select the folder where the images are stored.</label>\n  <div class=\"btn btn-primary\" id=\"select_folder\" v-model=\"mediaFolderId\" v-on:click=\"openFilePicker\">\n    <template v-if=\"mediaFolderId\">Replace folder</template>\n    <template v-else>Select a folder</template>\n  </div>\n    <div v-if=\"mediaFolderId\" class=\"selected-folder-holder\">\n      <i class=\"fa fa-folder\"></i> Selected folder: <strong>{{ mediaFolderData.name }}</strong> - <a href=\"#\" v-on:click.prevent=\"openFileManager\">See files</a>\n    </div>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.input"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.number"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n<div class=\"form-group\">\n  <label class=\"control-label\">What numbers should be allowed?</label>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"numbers-all\" name=\"numbers-option\" v-bind:value=\"false\" v-model=\"positiveOnly\">\n    <label for=\"numbers-all\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> Allow all numbers\n    </label>\n  </div>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"numbers-natural\" name=\"numbers-option\" v-bind:value=\"true\" v-model=\"positiveOnly\">\n    <label for=\"numbers-natural\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> Positive numbers only\n    </label>\n  </div>\n</div>\n<div class=\"form-group\">\n  <label>Decimal places allowed</label>\n  <input class=\"form-control\" type=\"number\" min=\"0\" max=\"10\" step=\"1\" v-model.number=\"decimals\" placeholder=\"0\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.paragraph"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Text</label>\n  <textarea class=\"form-control\" v-model.trim=\"value\" placeholder=\"Type some text\" rows=\"6\"></textarea>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.password"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Description</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"description\" placeholder=\"Description text\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n\n<div class=\"form-group\">\n  <label>Should the password be encrypted?</label>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"hash-yes\" name=\"hash-option\" v-bind:value=\"true\" v-model=\"hash\">\n    <label for=\"hash-yes\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>Yes</strong> - Encrypt the password before storing\n    </label>\n  </div>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"hash-no\" name=\"hash-option\" v-bind:value=\"false\" v-model=\"hash\">\n    <label for=\"hash-no\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>No</strong> - Store the password as plain text\n    </label>\n  </div>\n</div>\n\n<div class=\"form-group\">\n  <label>Should a password be automatically generated when submitting a new entry?</label>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"autogenerate-yes\" name=\"autogenerate-option\" v-bind:value=\"true\" v-model=\"autogenerate\">\n    <label for=\"autogenerate-yes\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>Yes</strong> - a secure password will be randomly generated\n    </label>\n  </div>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"autogenerate-no\" name=\"autogenerate-option\" v-bind:value=\"false\" v-model=\"autogenerate\">\n    <label for=\"autogenerate-no\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>No</strong> - The user will manually enter a password\n    </label>\n  </div>\n</div>\n\n<div class=\"form-group\" v-if=\"autogenerate\">\n  <label>Autogenerated password length</label>\n  <input class=\"form-control\" type=\"number\" v-model=\"autogenerateLength\" placeholder=\"Password length\" min=\"1\" max=\"32\" step=\"1\" :required=\"autogenerate\" />\n</div>\n\n<div class=\"form-group\" v-if=\"!autogenerate\">\n  <label>Ask users to confirm the password before submitting?</label>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"confirm-yes\" name=\"confirm-option\" v-bind:value=\"true\" v-model=\"confirm\">\n    <label for=\"confirm-yes\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>Yes</strong> - Add a password confirmation field\n    </label>\n  </div>\n  <div class=\"radio radio-icon\">\n    <input type=\"radio\" id=\"confirm-no\" name=\"confirm-option\" v-bind:value=\"false\" v-model=\"confirm\">\n    <label for=\"confirm-no\">\n      <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>No</strong> - Don't add anything else\n    </label>\n  </div>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.select"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value <small>(Enter one of the options you entered above)</small></label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Option placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Option placeholder\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.signature"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Description</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"description\" placeholder=\"Description text\" />\n</div>\n<div class=\"form-group\">\n  <label>Height (px)</label>\n  <input class=\"form-control\" type=\"number\" v-model.trim=\"height\" placeholder=\"e.g. 150\" />\n</div>\n<div class=\"form-group\">\n  <label class=\"selectLabel\">Select the folder where the images are stored.</label>\n  <div class=\"btn btn-primary\" id=\"select_folder\" v-model=\"mediaFolderId\" v-on:click=\"openFilePicker\">\n    <template v-if=\"mediaFolderId\">Replace folder</template>\n    <template v-else>Select a folder</template>\n  </div>\n    <div v-if=\"mediaFolderId\" class=\"selected-folder-holder\">\n      <i class=\"fa fa-folder\"></i> Selected folder: <strong>{{ mediaFolderData.name }}</strong> - <a href=\"#\" v-on:click.prevent=\"openFileManager\">See files</a>\n    </div>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.starRating"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Description</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"description\" placeholder=\"Description text\" />\n</div>\n<div class=\"form-group\">\n  <label for=\"default-value\">Default value</label>\n  <select v-model.trim=\"value\" id=\"default-value\" class=\"form-control\">\n    <option value=\"\">Select one</option>\n    <option value=\"1\">1</option>\n    <option value=\"2\">2</option>\n    <option value=\"3\">3</option>\n    <option value=\"4\">4</option>\n    <option value=\"5\">5</option>\n  </select>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.telephone"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.textarea"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value</label>\n  <textarea class=\"form-control\" v-model.trim=\"value\" placeholder=\"Default value\"></textarea>\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder\" />\n</div>\n<div class=\"form-group\">\n  <label>Rows <small>(Specifies the height of the text area in lines)</small></label>\n  <label for=\"textarea-rows\" class=\"select-proxy-display\">\n    <span class=\"icon fa fa-chevron-down\"></span>\n    <span class=\"select-value-proxy\">2</span>\n    <select class=\"form-control hidden-select\" id=\"textarea-rows\" v-model=\"rows\">\n      <option :value=\"number\" v-for=\"number in [1,2,3,4,5,6,7,8,9]\">{{ number }}</option>\n    </select>\n  </label>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.time"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <div>\n    <label class=\"control-label\">Default</label>\n  </div>\n  <div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"empty\" name=\"empty\" value='empty' v-model=\"autofill\">\n      <label for=\"empty\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>No default value\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"specific\" name=\"specific\" value='specific' v-model=\"autofill\">\n      <label for=\"specific\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Autofill with a specific date if it's empty\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"default\" name=\"default\" value='default' v-model=\"autofill\">\n      <label for=\"default\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Autofill with current time if it's empty\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"always\" name=\"always\" value='always' v-model=\"autofill\">\n      <label for=\"always\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Always autofill with current time\n      </label>\n    </div>\n  </div>\n</div>\n\n<div v-if=\"isApplyCurrentDateFiled\" class=\"form-group\">\n  <div>\n    <label class=\"control-label\">When applying the current time</label>\n  </div>\n  <div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"load\" name=\"load\" value='load' v-model=\"defaultSource\">\n      <label for=\"load\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Use the time when form is loaded\n      </label>\n    </div>\n    <div class=\"radio radio-icon\">\n      <input type=\"radio\" id=\"submission\" name=\"submission\" value='submission' v-model=\"defaultSource\">\n      <label for=\"submission\">\n        <span class=\"check\"><i class=\"fa fa-circle\"></i></span>Use the time when form is submitted\n      </label>\n    </div>\n  </div>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.title"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Title text</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Type some text\" />\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.url"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.wysiwyg"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value</label>\n  <textarea class=\"form-control\" v-model.trim=\"value\" placeholder=\"Default value\"></textarea>\n</div>\n<div class=\"form-group\">\n  <label>Rows <small>(Specifies the height of the text area in lines)</small></label>\n  <label for=\"textarea-rows\" class=\"select-proxy-display\">\n    <span class=\"icon fa fa-chevron-down\"></span>\n    <span class=\"select-value-proxy\">2</span>\n    <select class=\"form-control hidden-select\" id=\"textarea-rows\" v-model=\"rows\">\n      <option :value=\"number\" v-for=\"number in [1,2,3,4,5,6,7,8,9,10,15,20]\">{{ number }}</option>\n    </select>\n  </label>\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <textarea class=\"form-control\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n";
},"useData":true});