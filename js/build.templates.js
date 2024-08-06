this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.components.address"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group fl-address-field\" ref=\"addressField\">\n  <input type=\"text\" class=\"form-control\" placeholder=\"Enter your address\">\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.buttons"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template v-if=\"showSubmit\">\n<button :type=\"submitType\" class=\"btn btn-primary pull-right focus-outline\" tabindex=\"0\">{{ submitValue }}</button>\n</template>\n<template v-if=\"showClear\">\n<button :type=\"clearType\" class=\"btn btn-secondary pull-right focus-outline\" tabindex=\"0\" @click=\"resetForm()\">{{ clearValue }}</button>\n</template>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.checkbox"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<template>\n  <template>\n    <template v-if=\"addSelectAll\">\n      <div class=\"checkbox checkbox-icon\" :class=\"{ 'readonly' : readonly }\">\n        <input\n          type=\"checkbox\"\n          :id=\"name + '-' + 'select-all'\"\n          v-model=\"selectedAll\"\n          tabindex=\"-1\"\n        >\n        <label @click=\"selectAllClickHandler()\">\n          <span\n            class=\"check focus-outline\"\n            tabindex=\"0\"\n          >\n            <i class=\"fa fa-check\"></i>\n          </span>\n          <span class=\"option-item\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.checkbox.selectAll",{"name":"T","hash":{},"data":data}))
    + "</span>\n        </label>\n      </div>\n    </template>\n    <template v-for=\"(option, index) in options\">\n      <div class=\"checkbox checkbox-icon\" :class=\"{ 'readonly' : readonly }\">\n        <input\n          type=\"checkbox\"\n          :id=\"name + '-' + index\"\n          :name=\"name\"\n          v-model.lazy=\"$v.value.$model\"\n          :value=\"option.id || option.label\"\n          tabindex=\"-1\"\n        >\n        <label v-on:click=\"clickHandler(option)\">\n          <span\n            class=\"check focus-outline\"\n            tabindex=\"0\"\n            v-on:keydown.space.prevent=\"readonly ? false : clickHandler(option)\"\n            @blur=\"onBlur()\"\n          >\n            <i class=\"fa fa-check\"></i>\n          </span>\n          <span class=\"option-item\">{{ option.label || option.id }}</span>\n        </label>\n      </div>\n    </template>\n  </template>\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n</template>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.codeScanner"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<template>\n  <button class=\"scanner btn btn-primary focus-outline\" :class=\"{'disabled': readonly}\" @click.prevent=\"openScanner\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 22 22\" fill=\"currentColor\">\n      <path d=\"M22 0.916667V5.5C22 5.74312 21.9034 5.97627 21.7315 6.14818C21.5596 6.32009 21.3264 6.41667 21.0833 6.41667C20.8402 6.41667 20.6071 6.32009 20.4352 6.14818C20.2632 5.97627 20.1667 5.74312 20.1667 5.5V1.83333H16.5C16.2569 1.83333 16.0237 1.73676 15.8518 1.56485C15.6799 1.39294 15.5833 1.15978 15.5833 0.916667C15.5833 0.673552 15.6799 0.440394 15.8518 0.268486C16.0237 0.0965773 16.2569 0 16.5 0H21.0833C21.3264 0 21.5596 0.0965773 21.7315 0.268486C21.9034 0.440394 22 0.673552 22 0.916667ZM5.5 20.1667H1.83333V16.5C1.83333 16.2569 1.73676 16.0237 1.56485 15.8518C1.39294 15.6799 1.15978 15.5833 0.916667 15.5833C0.673552 15.5833 0.440394 15.6799 0.268486 15.8518C0.0965773 16.0237 0 16.2569 0 16.5V21.0833C0 21.3264 0.0965773 21.5596 0.268486 21.7315C0.440394 21.9034 0.673552 22 0.916667 22H5.5C5.74312 22 5.97627 21.9034 6.14818 21.7315C6.32009 21.5596 6.41667 21.3264 6.41667 21.0833C6.41667 20.8402 6.32009 20.6071 6.14818 20.4352C5.97627 20.2632 5.74312 20.1667 5.5 20.1667ZM21.0833 15.5833C20.8402 15.5833 20.6071 15.6799 20.4352 15.8518C20.2632 16.0237 20.1667 16.2569 20.1667 16.5V20.1667H16.5C16.2569 20.1667 16.0237 20.2632 15.8518 20.4352C15.6799 20.6071 15.5833 20.8402 15.5833 21.0833C15.5833 21.3264 15.6799 21.5596 15.8518 21.7315C16.0237 21.9034 16.2569 22 16.5 22H21.0833C21.3264 22 21.5596 21.9034 21.7315 21.7315C21.9034 21.5596 22 21.3264 22 21.0833V16.5C22 16.2569 21.9034 16.0237 21.7315 15.8518C21.5596 15.6799 21.3264 15.5833 21.0833 15.5833ZM0.916667 6.41667C1.15978 6.41667 1.39294 6.32009 1.56485 6.14818C1.73676 5.97627 1.83333 5.74312 1.83333 5.5V1.83333H5.5C5.74312 1.83333 5.97627 1.73676 6.14818 1.56485C6.32009 1.39294 6.41667 1.15978 6.41667 0.916667C6.41667 0.673552 6.32009 0.440394 6.14818 0.268486C5.97627 0.0965773 5.74312 0 5.5 0H0.916667C0.673552 0 0.440394 0.0965773 0.268486 0.268486C0.0965773 0.440394 0 0.673552 0 0.916667V5.5C0 5.74312 0.0965773 5.97627 0.268486 6.14818C0.440394 6.32009 0.673552 6.41667 0.916667 6.41667ZM17.4167 15.5833V6.41667C17.4167 5.93044 17.2235 5.46412 16.8797 5.1203C16.5359 4.77649 16.0696 4.58333 15.5833 4.58333H6.41667C5.93044 4.58333 5.46412 4.77649 5.1203 5.1203C4.77649 5.46412 4.58333 5.93044 4.58333 6.41667V15.5833C4.58333 16.0696 4.77649 16.5359 5.1203 16.8797C5.46412 17.2235 5.93044 17.4167 6.41667 17.4167H15.5833C16.0696 17.4167 16.5359 17.2235 16.8797 16.8797C17.2235 16.5359 17.4167 16.0696 17.4167 15.5833Z\" fill=\"currentColor\"/>\n    </svg>\n    "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.codeScanner.scanCode",{"name":"T","hash":{},"data":data}))
    + "\n  </button>\n  <textarea\n    class=\"form-control focus-outline\"\n    v-model.trim.lazy=\"$v.value.$model\"\n    rows=\"1\"\n    :id=\"name\"\n    :placeholder=\"placeholder\"\n    :readonly=\"readonly\"\n    @blur=\"onBlur()\"\n    @input=\"scannerInput($event)\"\n  />\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">\n    "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "\n  </p>\n  <p v-if=\"errorMessage\" class=\"text-danger\">{{errorMessage}}</p>\n</template>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.customButton"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\n  <button class=\"custom-btn btn\" :class=\"[buttonStyle, className]\" tabindex=\"0\" v-html=\"buttonLabel || 'Button'\" @click.prevent=\"runCustomFunction\"></button>\n</template>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.date"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template v-if=\"autofill === 'always' && defaultSource === 'submission'\">\n  Today\n</template>\n<template v-else>\n  <div class=\"form-group fl-date-picker\" :class=\"{ 'readonly' : readonly }\" ref=\"datePicker\">\n    <i class=\"fa fa-calendar fa-fw\"></i>\n    <input type=\"date\" class=\"form-control\" :name=\"name\" :id=\"name\"/>\n    <input type=\"text\" class=\"form-control\" :tabindex=\"readonly ? -1 : 0\"/>\n    <i class=\"fa fa-times fa-fw\"></i>\n  </div>\n</template>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">\n  "
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "\n</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.dateRange"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\n  <label\n    v-if=\"showPredefinedRanges\"\n    :for=\"name\"\n    class=\"form-group select-proxy-display\"\n    :class=\"{ 'input-focused': isInputFocused , 'readonly': readonly }\"\n  >\n    <select\n      class=\"form-control hidden-select focus-outline\"\n      name=\"predefinedRanges\"\n      v-model.lazy=\"selectedRange\"\n      v-on:keydown.prevent=\"readonly ? false : true\"\n      tabindex=\"0\"\n      @blur=\"onBlur()\"\n    >\n      <option v-for=\"option in predefinedRanges\" :value=\"option\" :disabled=\"option.disabled\">\n        {{ option.label || option.id }}\n      </option>\n    </select>\n    <span class=\"icon fa fa-chevron-down\"></span>\n    <span class=\"select-value-proxy\"><template v-if=\"selectedRange && selectedRange !== {}\">{{ selectedRange.label }}</template><template v-else>{{ placeholder }}</template></span>\n  </label>\n  <div class=\"form-group fl-date-range\" ref=\"dateRange\">\n    <div class=\"form-group fl-date-picker date-picker-start focus-outline\">\n      <i class=\"fa fa-calendar fa-fw\"></i>\n      <input type=\"date\" class=\"form-control\" :name=\"`start-${name}`\" :id=\"`start-${name}`\"/>\n      <input type=\"text\" class=\"form-control\" :tabindex=\"readonly ? -1 : 0\"/>\n      <i class=\"fa fa-times fa-fw\"></i>\n    </div>\n    <div class=\"arrow-right\">\n      <i class=\"icon fa fa-long-arrow-right fa-fw\"></i>\n    </div>\n    <div class=\"form-group fl-date-picker date-picker-end focus-outline\">\n      <i class=\"fa fa-calendar fa-fw\"></i>\n      <input type=\"date\" class=\"form-control\" :name=\"`end-${name}`\" :id=\"`end-${name}`\"/>\n      <input type=\"text\" class=\"form-control\" :tabindex=\"readonly ? -1 : 0\"/>\n      <i class=\"fa fa-times fa-fw\"></i>\n    </div>\n  </div>\n</template>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">\n  "
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "\n</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.email"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<input\n  type=\"email\"\n  class=\"form-control focus-outline\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  v-on:change=\"updateValue()\"\n  v-on:input=\"onInput($event)\"\n  :name=\"name\"\n  :id=\"name\"\n  :placeholder=\"placeholder\"\n  autocomplete=\"new-password\"\n  tabindex=\"0\"\n  :readonly=\"readonly\"\n  @blur=\"onBlur()\"\n/>\n<p class=\"text-danger\" v-if=\"$v.value.email === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.email.invalid",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.field"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div\n  v-show=\"_showField\"\n  class=\"form-group row clearfix\"\n  :class=\"[{'has-error': !isValid, 'own': ownRow}, _fieldDynamicWidth]\"\n  :data-field=\"name\"\n  data-form-field\n>\n  <div class=\"col-xs-12 grow-2\" v-if=\"_isFormField\">\n    <label class=\"control-label\" :for=\"_labelName\">\n      {{ label }}\n      <template v-if=\"required\"><span class=\"required-info\">*</span></template>\n    </label>\n    <div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\n  </div>\n  <div class=\"col-xs-12\">\n    "
    + ((stack1 = ((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"template","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n  </div>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.file"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"form-group fileUpload file-input\" :class=\"{ 'fileUpload-padding-top': value.length, 'fileUpload-disabled' : readonly }\">\n  <div class=\"row\" v-if=\"value.length\">\n    <ul class=\"file-holder\" :class=\"{ 'editable' : !readonly }\">\n      <li class=\"file-item\" v-for=\"(file, index) in value\">\n        <div @click=\"readonly ? false : onFileItemClick(file.url)\" class=\"file-content\" :class=\"{ 'no-pointer-events' : !file.url }\">\n          <div class=\"file-title\" >{{ file.name }}</div>\n          <div class=\"file-info\">\n            <span class=\"file-info-uploaded\">\n              <span v-if=\"file.createdAt\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.file.uploaded",{"name":"T","hash":{},"data":data}))
    + ": <strong>{{ showLocalDateFormat(file.createdAt) }}</strong></span>\n              <span v-else>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.file.uploadMessage",{"name":"T","hash":{},"data":data}))
    + "</span>\n            </span>\n            <span v-show=\"file.size\" class=\"file-info-size\">&ndash; <strong>{{ humanFileSize(file.size) }}</strong></span>\n          </div>\n        </div>\n        <div class=\"file-icon\" @click=\"readonly ? false : removeFile(index)\">\n          <i class=\"fa fa-times\"></i>\n        </div>\n      </li>\n    </ul>\n  </div>\n  <label class=\"btn btn-primary focus-outline\" tabindex=\"0\" v-on:keydown.space.prevent=\"readonly ? false : openFileDialog()\">\n    <i class=\"fa fa-plus\" :class=\"{ 'hidden' : readonly }\" aria-hidden=\"true\"></i>\n    <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.file.instruction",{"name":"T","hash":{},"data":data}))
    + "</span>\n    <input type=\"file\" ref=\"fileInput\" :id=\"name\" :name=\"name\" :data-folder-id=\"mediaFolderId\" class=\"input-file selectfile\" :class=\"{ 'hidden' : readonly }\" v-on:change=\"updateValue($event)\" multiple tabindex=\"-1\">\n  </label>\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.geolocation"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<template>\n  <button v-if=\"!firstTimeSaved\" class=\"geolocation btn btn-primary focus-outline\" @click.prevent=\"getLocation\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"25\" height=\"24\" viewBox=\"0 0 25 24\" fill=\"none\">\n      <path d=\"M12.5 8C10.29 8 8.5 9.79 8.5 12C8.5 14.21 10.29 16 12.5 16C14.71 16 16.5 14.21 16.5 12C16.5 9.79 14.71 8 12.5 8ZM21.44 11C21.2135 8.97212 20.3042 7.08154 18.8613 5.63869C17.4185 4.19585 15.5279 3.28651 13.5 3.06V1H11.5V3.06C9.47212 3.28651 7.58154 4.19585 6.13869 5.63869C4.69585 7.08154 3.78651 8.97212 3.56 11H1.5V13H3.56C3.78651 15.0279 4.69585 16.9185 6.13869 18.3613C7.58154 19.8042 9.47212 20.7135 11.5 20.94V23H13.5V20.94C15.5279 20.7135 17.4185 19.8042 18.8613 18.3613C20.3042 16.9185 21.2135 15.0279 21.44 13H23.5V11H21.44ZM12.5 19C8.63 19 5.5 15.87 5.5 12C5.5 8.13 8.63 5 12.5 5C16.37 5 19.5 8.13 19.5 12C19.5 15.87 16.37 19 12.5 19Z\" fill=\"white\"/>\n    </svg>\n    "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.geolocation.getLocation",{"name":"T","hash":{},"data":data}))
    + "\n  </button>\n  <button v-else class=\"geolocation btn btn-primary focus-outline\" @click.prevent=\"updateLocation\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"25\" height=\"24\" viewBox=\"0 0 25 24\" fill=\"none\">\n      <path d=\"M12.5 8C10.29 8 8.5 9.79 8.5 12C8.5 14.21 10.29 16 12.5 16C14.71 16 16.5 14.21 16.5 12C16.5 9.79 14.71 8 12.5 8ZM21.44 11C21.2135 8.97212 20.3042 7.08154 18.8613 5.63869C17.4185 4.19585 15.5279 3.28651 13.5 3.06V1H11.5V3.06C9.47212 3.28651 7.58154 4.19585 6.13869 5.63869C4.69585 7.08154 3.78651 8.97212 3.56 11H1.5V13H3.56C3.78651 15.0279 4.69585 16.9185 6.13869 18.3613C7.58154 19.8042 9.47212 20.7135 11.5 20.94V23H13.5V20.94C15.5279 20.7135 17.4185 19.8042 18.8613 18.3613C20.3042 16.9185 21.2135 15.0279 21.44 13H23.5V11H21.44ZM12.5 19C8.63 19 5.5 15.87 5.5 12C5.5 8.13 8.63 5 12.5 5C16.37 5 19.5 8.13 19.5 12C19.5 15.87 16.37 19 12.5 19Z\" fill=\"white\"/>\n    </svg>\n    "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.geolocation.updateLocation",{"name":"T","hash":{},"data":data}))
    + "\n  </button>\n  <div v-if=\"showFeedback\">\n    <div v-if=\"isLoading\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\" viewBox=\"0 0 10 10\" fill=\"none\">\n        <path d=\"M5 10C7.7105 10 10 7.7105 10 5H9C9 7.1685 7.1685 9 5 9C2.8315 9 1 7.1685 1 5C1 2.832 2.8315 1 5 1V0C2.2895 0 0 2.29 0 5C0 7.7105 2.2895 10 5 10Z\" fill=\"#474A74\"/>\n      </svg>\n    </div>\n    <div v-else class=\"geolocation text-info\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"10\" viewBox=\"0 0 12 10\" fill=\"none\">\n        <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.7367 0.704706C11.9053 0.873516 12 1.10235 12 1.34093C12 1.57951 11.9053 1.80834 11.7367 1.97715L4.41773 9.29612C4.33324 9.38053 4.2328 9.44728 4.12225 9.4925C4.01171 9.53771 3.89327 9.56048 3.77385 9.55947C3.65442 9.55847 3.53638 9.53371 3.42662 9.48664C3.31685 9.43957 3.21754 9.37114 3.13448 9.28531L0.249873 6.30347C0.0853669 6.13158 -0.00440809 5.90155 0.000166642 5.66367C0.00474138 5.42579 0.103294 5.19939 0.274287 5.03394C0.44528 4.8685 0.674809 4.77747 0.912714 4.78075C1.15062 4.78403 1.37755 4.88134 1.54393 5.05143L3.79231 7.37545L10.4643 0.704706C10.6331 0.536107 10.8619 0.441406 11.1005 0.441406C11.3391 0.441406 11.5679 0.536107 11.7367 0.704706Z\" fill=\"#474A74\"/>\n      </svg>\n      "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.geolocation.locationSaved",{"name":"T","hash":{},"data":data}))
    + "\n    </div>\n  </div>\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">\n    "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "\n  </p>\n</template>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.horizontalRule"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<hr>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.image"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"form-group fileUpload\" :class=\"{ 'fileUpload-disabled' : readonly, 'fileUpload-padding-top': value.length }\">\n  <div class=\"row\" v-if=\"value.length\">\n    <div v-for=\"(image, index) in value\">\n      <div class=\"canvas-holder\">\n        <canvas ref=\"canvas\"></canvas>\n        <button class=\"canvas-remove\" :class=\"{ 'hidden' : readonly }\" type=\"button\" v-on:click=\"removeImage(index)\"></button>\n      </div>\n    </div>\n  </div>\n  <label\n    class=\"btn btn-primary focus-outline\"\n    tabindex=\"0\"\n    v-on:keydown.space.prevent=\"openFileDialog()\"\n  >\n    <i class=\"fa fa-plus\" :class=\"{ 'hidden' : readonly }\" aria-hidden=\"true\"></i>\n    <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.image.instruction",{"name":"T","hash":{},"data":data}))
    + "</span>\n    <input\n      multiple\n      type=\"file\"\n      ref=\"imageInput\"\n      :id=\"name\"\n      :name=\"name\"\n      class=\"input-file selectfile\"\n      accept=\"image/gif, image/jpg, image/jpeg, image/tiff, image/png\"\n      :data-folder-id=\"mediaFolderId\"\n      v-on:click=\"onFileClick\"\n      v-on:change=\"onFileChange($event)\"\n      tabindex=\"-1\"\n    />\n  </label>\n  <p class=\"text-danger\" v-if=\"hasCorruptedImage\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.image.invalid",{"name":"T","hash":{},"data":data}))
    + "</p>\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.input"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<input\n  type=\"text\"\n  class=\"form-control focus-outline\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  v-on:change=\"readonly ? false : updateValue()\"\n  v-on:input=\"readonly ? false : onInput($event)\"\n  :name=\"name\"\n  :id=\"name\"\n  :placeholder=\"placeholder\"\n  tabindex=\"0\"\n  :readonly=\"readonly\"\n  @blur=\"onBlur()\"\n/>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.interface"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "<div :class=\"{ 'reduced-opacity': isHidden }\" >\n  <span v-if=\"isHidden\" class=\"label label-default\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.interface.hidden",{"name":"T","hash":{},"data":data}))
    + "</span>\n  <div class=\"form-group row clearfix\" :data-field=\"name\">\n    <div class=\"col-xs-12\" v-if=\"_isFormField\">\n      <label class=\"control-label\" :for=\"name\">\n        {{ label }} <template v-if=\"required\"><span class=\"required-info\">*</span></template>\n      </label>\n      <div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\n    </div>\n    <div class=\"col-xs-12\">\n      "
    + ((stack1 = ((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"template","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n  </div>\n</div>\n\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.matrix"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"fl-matrix\" ref=\"matrix\">\n  <table>\n    <thead>\n      <tr>\n        <th></th>\n        <th v-for=\"(column, index) in columnOptions\">{{ column.label }}</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr v-for=\"(row, rowIndex) in rowOptions\">\n        <th>{{ row.label }}</th>\n        <td v-for=\"(column, colIndex) in columnOptions\">\n          <div class=\"radio radio-icon\" :class=\"{ 'readonly' : readonly }\">\n            <input type=\"radio\" class=\"matrix-radio-input\" :id=\"getOptionId(rowIndex, colIndex, 'input')\" :name=\"getOptionName(rowIndex)\" :value=\"column.id\" v-model.lazy=\"$v.value.$model\" tabindex=\"-1\">\n            <label v-on:click=\"readonly ? false : clickHandler(row, column, rowIndex, colIndex)\">\n              <span class=\"check focus-outline\"\n                :id=\"getOptionId(rowIndex, colIndex,'span')\"\n                v-on:keydown.right.prevent=\"readonly ? false : focusHandler(rowIndex, colIndex + 1)\"\n                v-on:keydown.down.prevent=\"readonly ? false : focusHandler(rowIndex, colIndex + 1)\"\n                v-on:keydown.left.prevent=\"readonly ? false : focusHandler(rowIndex, colIndex - 1)\"\n                v-on:keydown.up.prevent=\"readonly ? false : focusHandler(rowIndex, colIndex - 1)\"\n                v-on:keydown.space.prevent=\"readonly ? false : focusHandler(rowIndex, colIndex)\"\n                tabindex=\"0\"\n              >\n                <i class=\"fa fa-circle\"></i>\n              </span>\n            </label>\n          </div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.number"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<input\n  type=\"text\"\n  class=\"form-control focus-outline\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  v-on:change=\"updateValue()\"\n  v-on:input=\"onInput($event)\"\n  :name=\"name\"\n  :id=\"name\"\n  :placeholder=\"placeholder\"\n  tabindex=\"0\"\n  :readonly=\"readonly\"\n  @blur=\"onBlur()\"\n/>\n<p class=\"text-danger\" v-if=\"$v.value.maxLength === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.number.invalidLength",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.positive === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.number.onlyPositiveDigitsAllowed",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.integer === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.number.onlyIntegerDigitsAllowed",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.decimal === false && $v.value.$dirty\">{{$t(\"widgets.form.number.invalidDecimal\", {decimals: decimals})}}</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.paragraph"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p v-html=\"htmlValue\"></p>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.password"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<input\n  type=\"password\"\n  class=\"form-control focus-outline\"\n  :readonly=\"autogenerate\"\n  autocomplete=\"new-password\"\n  v-on:change=\"updateValue()\"\n  v-on:input=\"onInput($event)\"\n  v-on:focus=\"isFocused = true\"\n  v-on:blur=\"isFocused = false\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  :name=\"name\"\n  :id=\"name\"\n  :placeholder=\"fieldPlaceholder\"\n  tabindex=\"0\"\n  @blur=\"onBlur()\"\n/>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n\n<div\n  v-if=\"isFocused || $v.value.$model\"\n  class=\"panel password-checker\"\n  :class=\"validationClass.password\"\n>\n  <div class=\"panel-heading\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.title",{"name":"T","hash":{},"data":data}))
    + "</div>\n  <div class=\"panel-body\">\n    <div class=\"requirement\">\n      <input\n        type=\"checkbox\"\n        class=\"hidden\"\n        :checked=\"$v.value.$model.length >= passwordMinLength\"\n        readonly=\"readonly\"\n        tabindex=\"-1\"\n      />\n      <label class=\"requirement-marker\">\n        <i class=\"fa fa-check\"></i>\n      </label>\n      <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.length",{"name":"T","hash":{},"data":data}))
    + "</span>\n    </div>\n    <div class=\"requirement\">\n      <input\n        type=\"checkbox\"\n        class=\"hidden\"\n        :checked=\"$v.value.containsUppercase && $v.value.$model\"\n        readonly=\"readonly\"\n        tabindex=\"-1\"\n      />\n      <label class=\"requirement-marker\">\n        <i class=\"fa fa-check\"></i>\n      </label>\n      <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.uppercase",{"name":"T","hash":{},"data":data}))
    + "</span>\n    </div>\n    <div class=\"requirement\">\n      <input\n        type=\"checkbox\"\n        class=\"hidden\"\n        :checked=\"$v.value.containsLowercase && $v.value.$model\"\n        readonly=\"readonly\"\n        tabindex=\"-1\"\n      />\n      <label class=\"requirement-marker\">\n        <i class=\"fa fa-check\"></i>\n      </label>\n      <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.lowercase",{"name":"T","hash":{},"data":data}))
    + "</span>\n    </div>\n    <div class=\"requirement\">\n      <input\n        type=\"checkbox\"\n        class=\"hidden\"\n        :checked=\"$v.value.containsNumber && $v.value.$model\"\n        readonly=\"readonly\"\n        tabindex=\"-1\"\n      />\n      <label class=\"requirement-marker\">\n        <i class=\"fa fa-check\"></i>\n      </label>\n      <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.number",{"name":"T","hash":{},"data":data}))
    + "</span>\n    </div>\n    <div class=\"requirement\">\n      <input\n        type=\"checkbox\"\n        class=\"hidden\"\n        :checked=\"$v.value.containsSpecial && $v.value.$model\"\n        readonly=\"readonly\"\n        tabindex=\"-1\"\n      />\n      <label class=\"requirement-marker\">\n        <i class=\"fa fa-check\"></i>\n      </label>\n      <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.symbol",{"name":"T","hash":{},"data":data}))
    + "</span>\n    </div>\n  </div>\n</div>\n\n<div class=\"form-group row clearfix\" data-form-field v-if=\"confirm\">\n  <br />\n  <div class=\"col-xs-12\">\n    <label class=\"control-label\" for=\"confirmPassword\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.confirmPassword",{"name":"T","hash":{},"data":data}))
    + "\n      <template v-if=\"required\">\n        <span class=\"required-info\">*</span>\n      </template>\n    </label>\n  </div>\n  <div class=\"col-xs-12\">\n    <input\n      type=\"password\"\n      class=\"form-control focus-outline\"\n      v-model.lazy=\"$v.passwordConfirmation.$model\"\n      id=\"confirmPassword\"\n      autocomplete=\"new-password\"\n      v-on:change=\"updatePasswordConfirmation()\"\n      v-on:input=\"onPasswordConfirmationInput($event)\"\n      tabindex=\"0\"\n    />\n  </div>\n  <div class=\"col-xs-12\">\n    <div\n      v-if=\"isFocused || $v.value.$model\"\n      class=\"panel password-checker\"\n      :class=\"validationClass.passwordConfirmation\"\n    >\n      <div class=\"panel-heading\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.confirmTitle",{"name":"T","hash":{},"data":data}))
    + "</div>\n      <div class=\"panel-body\">\n        <div class=\"requirement\">\n          <input\n            type=\"checkbox\"\n            class=\"hidden\"\n            :checked=\"$v.passwordConfirmation.sameAsPassword && $v.value.$model\"\n            readonly=\"readonly\"\n            tabindex=\"-1\"\n          />\n          <label class=\"requirement-marker\">\n            <i class=\"fa fa-check\"></i>\n          </label>\n          <span>"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.password.requirements.confirmation",{"name":"T","hash":{},"data":data}))
    + "</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.radio"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\n  <template>\n    <template v-for=\"(option, index) in options\">\n      <div class=\"radio radio-icon\" :class=\"{ 'readonly' : readonly }\">\n        <input\n          type=\"radio\"\n          :id=\"name + '-' + index\"\n          :name=\"name\"\n          v-model.lazy=\"$v.value.$model\"\n          :value=\"option.id || option.label\"\n          tabindex=\"-1\"\n        >\n        <label v-on:click=\"readonly ? false : clickHandler(option)\">\n          <span\n            ref=\"radioButton\"\n            class=\"check focus-outline\"\n            tabindex=\"0\"\n            v-on:keydown.right.prevent=\"readonly ? false : focusHandler(index + 1)\"\n            v-on:keydown.down.prevent=\"readonly ? false : focusHandler(index + 1)\"\n            v-on:keydown.left.prevent=\"readonly ? false : focusHandler(index - 1)\"\n            v-on:keydown.up.prevent=\"readonly ? false : focusHandler(index - 1)\"\n            v-on:keydown.space.prevent=\"readonly ? false : focusHandler(index)\"\n            @blur=\"onBlur()\"\n          >\n            <i class=\"fa fa-circle\"></i>\n          </span>\n          <span class=\"option-item\"></span>{{ option.label || option.id }}</span>\n        </label>\n    </div>\n    </template>\n  </template>\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n</template>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.reorderList"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\n  <div class=\"list-group col\" v-sortable=\"sortableOptions\">\n    <div class=\"list-group-item\" v-for=\"option in orderedOptions\" :key=\"option.id || option.label\" :data-id=\"option.id || option.label\" :class=\"{ 'readonly' : readonly }\">\n      <div v-if=\"!readonly\" class=\"list-icons\">\n        <div class=\"dots\">\n          <svg width=\"6\" height=\"17\" viewBox=\"0 0 6 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <circle cx=\"5\" cy=\"1.5\" r=\"1\" fill=\"currentColor\"/>\n            <circle cx=\"5\" cy=\"8.5\" r=\"1\" fill=\"currentColor\"/>\n            <circle cx=\"5\" cy=\"15.5\" r=\"1\" fill=\"currentColor\"/>\n            <circle cx=\"1\" cy=\"1.5\" r=\"1\" fill=\"currentColor\"/>\n            <circle cx=\"1\" cy=\"8.5\" r=\"1\" fill=\"currentColor\"/>\n            <circle cx=\"1\" cy=\"15.5\" r=\"1\" fill=\"currentColor\"/>\n          </svg>\n        </div>\n        <div class=\"arrows\">\n          <svg width=\"18\" height=\"19\" viewBox=\"0 0 18 19\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M9.21749 16.0176C9.28443 15.9891 9.34548 15.9484 9.39749 15.8976L12.3975 12.8976C12.4969 12.7909 12.5509 12.6499 12.5484 12.5042C12.5458 12.3584 12.4868 12.2194 12.3837 12.1163C12.2806 12.0133 12.1416 11.9542 11.9959 11.9517C11.8502 11.9491 11.7091 12.0032 11.6025 12.1026L9.56249 14.1426V4.85756L11.6025 6.89756C11.7091 6.99692 11.8502 7.05101 11.9959 7.04844C12.1416 7.04587 12.2806 6.98683 12.3837 6.88377C12.4868 6.78071 12.5458 6.64167 12.5484 6.49595C12.5509 6.35022 12.4969 6.20919 12.3975 6.10256L9.39749 3.10256C9.34548 3.05171 9.28443 3.01102 9.21749 2.98256C9.14883 2.95283 9.07481 2.9375 8.99999 2.9375C8.92518 2.9375 8.85115 2.95283 8.78249 2.98256C8.71555 3.01102 8.65451 3.05171 8.60249 3.10256L5.60249 6.10256C5.49716 6.20802 5.43799 6.35099 5.43799 6.50006C5.43799 6.64912 5.49716 6.79209 5.60249 6.89756C5.70796 7.00289 5.85093 7.06206 5.99999 7.06206C6.14906 7.06206 6.29202 7.00289 6.39749 6.89756L8.43749 4.85756V14.1426L6.39749 12.1026C6.29202 11.9972 6.14906 11.9381 5.99999 11.9381C5.85093 11.9381 5.70796 11.9972 5.60249 12.1026C5.49716 12.208 5.43799 12.351 5.43799 12.5001C5.43799 12.6491 5.49716 12.7921 5.60249 12.8976L8.60249 15.8976C8.65451 15.9484 8.71555 15.9891 8.78249 16.0176C8.85115 16.0473 8.92518 16.0626 8.99999 16.0626C9.07481 16.0626 9.14883 16.0473 9.21749 16.0176Z\" fill=\"currentColor\"/>\n          </svg>\n        </div>\n      </div>\n      {{option.label}}\n    </div>\n  </div>\n</template>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.select"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\n  <label\n    :for=\"name\"\n    class=\"select-proxy-display\"\n    :class=\"{ 'input-focused': isInputFocused , 'readonly': readonly }\"\n  >\n    <select\n      class=\"form-control hidden-select focus-outline\"\n      :name=\"name\"\n      :id=\"name\"\n      v-model.lazy=\"$v.value.$model\"\n      v-on:change=\"updateValue()\"\n      v-on:input=\"onInput($event)\"\n      v-on:focus=\"isInputFocused = true\"\n      v-on:blur=\"isInputFocused = false\"\n      v-on:keydown.prevent=\"readonly ? false : true\"\n      tabindex=\"0\"\n      @blur=\"onBlur()\"\n    >\n      <option v-if=\"placeholder\" value=\"\">{{ placeholder }}</option>\n      <option v-for=\"option in options\" :value=\"(_.isNumber(option.id) || _.isString(option.id)) ? option.id : option.label\" :disabled=\"option.disabled\">\n        {{ option.label || option.id }}\n      </option>\n    </select>\n    <span class=\"icon fa fa-chevron-down\"></span>\n    <span class=\"select-value-proxy\"><template v-if=\"value && value !== ''\">{{ _selectedLabel }}</template><template v-else>{{ placeholder }}</template></span>\n  </label>\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n</template>\n\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.signature"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<template>\n  <div v-show=\"isEditable\" class=\"signature-editor\" :class=\"{ 'readonly' : readonly }\">\n    <div class=\"field-signature focus-outline\" tabindex=\"0\">\n      <canvas :id=\"name\" ref=\"canvas\"></canvas>\n      <a\n        href=\"#\"\n        class=\"focus-outline btn-clear\"\n        tabindex=\"0\"\n        v-on:click.prevent=\"clean()\"\n        v-on:keydown.space.prevent=\"clean()\"\n        :class=\"{ 'hidden' : readonly }\"\n      >\n        <i class=\"fa fa-times\"></i>\n        "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.signature.actions.clear",{"name":"T","hash":{},"data":data}))
    + "\n      </a>\n    </div>\n  </div>\n  <div v-show=\"!isEditable\" class=\"field-signature focus-outline signature-preview\" :class=\"{ 'readonly' : readonly }\" tabindex=\"0\">\n    <img :src=\"value\" alt=\"signature image\" />\n    <a\n      href=\"#\"\n      v-on:click.prevent=\"isEditable = true\"\n      :class=\"{ 'hidden' : readonly }\"\n    >\n      "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.signature.actions.edit",{"name":"T","hash":{},"data":data}))
    + "\n    </a>\n  </div>\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n</template>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.slider"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group fl-range-slider\" :class=\"{ 'readonly': readonly }\" ref=\"slider\">\n <input\n    type=\"range\"\n    :name=\"name\"\n    :id=\"name\"\n    :min=\"min\"\n    :max=\"max\"\n    :step=\"step\"\n    v-model=\"value\"\n    :tabindex=\"readonly ? -1 : 0\"\n  />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.starRating"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div\n  class=\"inverse-direction focus-outline input-star-rating\"\n  tabindex=\"0\"\n  v-on:keydown.up.prevent=\"readonly ? false : increaseRatingValue()\"\n  v-on:keydown.right.prevent=\"readonly ? false : increaseRatingValue()\"\n  v-on:keydown.down.prevent=\"readonly ? false : decreaseRatingValue()\"\n  v-on:keydown.left.prevent=\"readonly ? false : decreaseRatingValue()\"\n  @blur=\"onBlur()\"\n>\n  <template v-for=\"(option, index) in values\">\n    <input\n      class=\"rating-input\"\n      :name=\"name\"\n      type=\"radio\"\n      :id=\"name + '-' + index\"\n      v-model=\"value\"\n      :value=\"option.id\"\n      v-on:change=\"readonly ? false : updateValue()\"\n      v-on:input=\"readonly ? false : onInput($event)\"\n      tabindex=\"-1\"\n      :readonly=\"readonly\"\n      :class=\"{ 'readonly' : readonly }\"\n    >\n    <label class=\"rating-star\" :class=\"{ 'readonly' : readonly }\" :for=\"name + '-' + index\">\n      <i class=\"fa fa-star-o\"></i>\n      <i class=\"fa fa-star\"></i>\n    </label>\n  </template>\n</div>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.telephone"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<input\n  type=\"tel\"\n  class=\"form-control focus-outline\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  v-on:change=\"updateValue()\"\n  v-on:input=\"onInput($event)\"\n  :name=\"name\"\n  :id=\"name\"\n  :placeholder=\"placeholder\"\n  tabindex=\"0\"\n  :readonly=\"readonly\"\n  @blur=\"onBlur()\"\n/>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.phone === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.telephone.instruction",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.textarea"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<textarea\n  class=\"form-control focus-outline\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  v-on:change=\"updateValue()\"\n  v-on:input=\"onInput($event)\"\n  :name=\"name\"\n  :id=\"name\"\n  :placeholder=\"placeholder\"\n  :rows=\"rows\"\n  tabindex=\"0\"\n  :readonly=\"readonly\"\n  @blur=\"onBlur()\"\n></textarea>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.time"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template v-if=\"autofill === 'always' && defaultSource === 'submission'\">\n  Now\n</template>\n<template v-else>\n  <div class=\"form-group fl-time-picker\" :class=\"{ 'readonly' : readonly }\" ref=\"timePicker\">\n    <i class=\"fa fa-clock-o fa-fw\"></i>\n    <input type=\"time\" class=\"form-control\" :name=\"name\" :id=\"name\" :tabindex=\"readonly ? -1 : 0\"/>\n    <input type=\"text\" class=\"form-control\" :tabindex=\"readonly ? -1 : 0\"/>\n    <i class=\"fa fa-times fa-fw\"></i>\n  </div>\n</template>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">\n  "
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "\n</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.timer"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<template>\n  <div class=\"form-group fl-timer\" ref=\"timer\">\n    <input type=\"text\" class=\"form-control focus-outline\" readonly=\"true\" tabindex=\"0\" v-model=\"stringValue\"/>\n    <button v-if=\"!readonly && (status === 'stopped' && value)\" class=\"btn btn-primary\" v-on:click.prevent=\"reset\">Reset</button>\n    <button v-if=\"!readonly && status === 'stopped'\" class=\"btn btn-primary\" v-on:click.prevent=\"start\">Start</button>\n    <button v-if=\"!readonly && status === 'running'\" class=\"btn btn-primary\" v-on:click.prevent=\"stop\">Stop</button>\n  </div>\n</template>\n<p class=\"text-danger\" v-if=\"hasRequiredError\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.timer.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">\n  "
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "\n</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.timeRange"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\n  <div class=\"form-group fl-time-range\" ref=\"timeRange\" :class=\"{ 'readonly' : readonly }\">\n    <div class=\"form-group fl-time-picker time-picker-start focus-outline\">\n      <i class=\"fa fa-clock-o fa-fw\"></i>\n      <input type=\"time\" class=\"form-control\" :name=\"name\" :id=\"name\"/>\n      <input type=\"text\" class=\"form-control\" :tabindex=\"readonly ? -1 : 0\"/>\n      <i class=\"fa fa-times fa-fw\"></i>\n    </div>\n    <div class=\"arrow-right\">\n      <i class=\"icon fa fa-long-arrow-right fa-fw\"></i>\n    </div>\n    <div class=\"form-group fl-time-picker time-picker-end focus-outline\">\n      <i class=\"fa fa-clock-o fa-fw\"></i>\n      <input type=\"time\" class=\"form-control\" :name=\"name\" :id=\"name\"/>\n      <input type=\"text\" class=\"form-control\" :tabindex=\"readonly ? -1 : 0\"/>\n      <i class=\"fa fa-times fa-fw\"></i>\n    </div>\n  </div>\n</template>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">\n  "
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "\n</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.title"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>{{ value }}</h2>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.typeahead"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\n  <div class=\"form-group fl-typeahead\" :class=\"{ 'readonly' : readonly }\" ref=\"typeahead\">\n    <select multiple placeholder=\"Start typing...\"></select>\n  </div>\n  <div class=\"text-danger\" v-if=\"reachedMaxItems\">Only {{maxItems}} item(s) can be selected.</div>\n</template>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.url"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<input\n  type=\"text\"\n  class=\"form-control focus-outline\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  v-on:change=\"updateValue()\"\n  v-on:input=\"onInput($event)\"\n  :name=\"name\"\n  :id=\"name\"\n  :placeholder=\"placeholder\"\n  tabindex=\"0\"\n  :readonly=\"readonly\"\n  @blur=\"onBlur()\"\n/>\n<p class=\"text-danger\" v-if=\"$v.value.url === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.url.invalid",{"name":"T","hash":{},"data":data}))
    + "</p>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + alias3((helpers.T || (depth0 && depth0.T) || alias2).call(alias1,"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.wysiwyg"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<textarea\n  class=\"form-control\"\n  v-model.trim.lazy=\"$v.value.$model\"\n  ref=\"textarea\"\n  :name=\"name\"\n  :id=\"tinymceId\"\n  :placeholder=\"placeholder\"\n  :readonly=\"readonly\"\n></textarea>\n<div\n  class=\"ghost-tinymce\"\n  :class=\"{ 'readonly' : readonly }\"\n  ref=\"ghost\"\n  v-html=\"value\"\n  v-if=\"isInterface\">\n</div>\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">"
    + container.escapeExpression((helpers.T || (depth0 && depth0.T) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"widgets.form.errors.required",{"name":"T","hash":{},"data":data}))
    + "</p>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.radio"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\n  <label>Default value <small>(Enter one of the options you entered above)</small></label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n";
},"useData":true});