this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.components.buttons"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template v-if=\"showSubmit\">\r\n<button :type=\"submitType\" class=\"btn btn-primary pull-right focus-outline\" tabindex=\"0\">{{ submitValue }}</button>\r\n</template>\r\n<template v-if=\"showClear\">\r\n<button :type=\"clearType\" class=\"btn btn-secondary pull-right focus-outline\" tabindex=\"0\" @click=\"resetForm()\">{{ clearValue }}</button>\r\n</template>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.checkbox"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\r\n  <div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n\r\n  <template v-if=\"readonly\">\r\n    <template v-for=\"(option, index) in options\">\r\n      <template v-if=\"value.includes(option.label) || value.includes(option.id)\">\r\n        <p class=\"form-control-static\">{{ option.label || option.id }}</p>\r\n        <input\r\n          type=\"hidden\"\r\n          :id=\"name + '-' + index\"\r\n          :name=\"name\"\r\n          v-model=\"value\"\r\n          :value=\"option.id || option.label\"\r\n          class=\"focus-outline\"\r\n          tabindex=\"0\"\r\n        />\r\n      </template>\r\n    </template>\r\n  </template>\r\n\r\n  <template v-else>\r\n    <template v-for=\"(option, index) in options\">\r\n      <div class=\"checkbox checkbox-icon\">\r\n        <input\r\n          type=\"checkbox\"\r\n          :id=\"name + '-' + index\"\r\n          :name=\"name\"\r\n          v-model=\"value\"\r\n          :value=\"option.id || option.label\"\r\n          tabindex=\"-1\"\r\n        >\r\n        <label v-on:click=\"clickHandler(option)\">\r\n          <span\r\n            class=\"check focus-outline\"\r\n            tabindex=\"0\"\r\n            v-on:keydown.space.prevent=\"clickHandler(option)\"\r\n          >\r\n            <i class=\"fa fa-check\"></i>\r\n          </span>\r\n          <span class=\"option-item\">{{ option.label || option.id }}</span>\r\n        </label>\r\n      </div>\r\n    </template>\r\n  </template>\r\n\r\n\r\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n</template>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.date"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n  <input\r\n    type=\"hidden\"\r\n    v-model.lazy=\"value\"\r\n    v-on:change=\"updateValue()\"\r\n    :name=\"name\"\r\n    :id=\"name\"\r\n    :placeholder=\"placeholder\"\r\n    class=\"form-control\"\r\n  />\r\n</template>\r\n<template v-else-if=\"autofill === 'always' && defaultSource === 'submission' && empty\">\r\n  Today\r\n</template>\r\n<template v-else>\r\n  <div v-if=\"isWeb\" class=\"input-group custom-date\" :class=\"{ 'input-focused': isInputFocused }\">\r\n    <div class=\"input-group-addon\">\r\n      <i class=\"fa fa-calendar\"></i>\r\n    </div>\r\n\r\n    <input\r\n      type=\"text\"\r\n      v-model.lazy=\"value\"\r\n      v-on:change=\"updateValue()\"\r\n      v-on:input=\"onInput($event)\"\r\n      v-on:focus=\"isInputFocused = true\"\r\n      v-on:blur=\"isInputFocused = false\"\r\n      :name=\"name\"\r\n      :id=\"name\"\r\n      :placeholder=\"placeholder\"\r\n      class=\"date-picker form-control focus-outline\"\r\n      tabindex=\"0\"\r\n    />\r\n  </div>\r\n  <div v-else class=\"input-group native-date\" :class=\"{ 'input-focused': isInputFocused }\">\r\n    <div class=\"input-group-addon\">\r\n      <i class=\"fa fa-calendar\"></i>\r\n    </div>\r\n\r\n    <input\r\n      type=\"date\"\r\n      v-model.lazy=\"value\"\r\n      v-on:change=\"updateValue()\"\r\n      v-on:focus=\"isInputFocused = true\"\r\n      v-on:blur=\"isInputFocused = false\"\r\n      :name=\"name\"\r\n      :id=\"name\"\r\n      :placeholder=\"placeholder\"\r\n      class=\"form-control focus-outline\"\r\n      tabindex=\"0\"\r\n    />\r\n  </div>\r\n</template>\r\n\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.email"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n  <input\r\n    type=\"hidden\"\r\n    class=\"form-control\"\r\n    v-model.trim.lazy=\"value\"\r\n    v-on:change=\"updateValue()\"\r\n    v-on:input=\"onInput($event)\"\r\n    :name=\"name\"\r\n    :id=\"name\"\r\n    :placeholder=\"placeholder\"\r\n    autocomplete=\"new-password\"\r\n  />\r\n</template>\r\n<input v-else\r\n  type=\"email\"\r\n  class=\"form-control focus-outline\"\r\n  v-model.trim.lazy=\"value\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"placeholder\"\r\n  autocomplete=\"new-password\"\r\n  tabindex=\"0\"\r\n/>\r\n<p class=\"text-danger\" v-if=\"$v.value.email === false && $v.value.$dirty\">The input is not a valid email address.</p>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.field"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div v-show=\"_showField\" class=\"form-group row clearfix\" :class=\"{'has-error': !isValid}\" :data-field=\"name\">\r\n  <div class=\"col-xs-12\" v-if=\"_isFormField\">\r\n    <label class=\"control-label\" :for=\"name\">\r\n      {{ label }} <template v-if=\"required\"><span class=\"required-info\">*</span></template>\r\n    </label>\r\n  </div>\r\n  <div class=\"col-xs-12\">\r\n    "
    + ((stack1 = ((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"template","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\r\n  </div>\r\n</div>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.file"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <ul class=\"file-holder\">\r\n    <li class=\"file-item\" v-for=\"(file, index) in value\" @click=\"onFileItemClick(file.url)\">\r\n      <div class=\"file-title\">{{ file.name }}</div>\r\n      <div class=\"file-info\">\r\n        <span class=\"file-info-uploaded\">Uploaded: <strong>{{ showLocalDateFormat(file.createdAt) }}</strong></span>\r\n        <span v-show=\"file.size\" class=\"file-info-size\">&ndash; <strong>{{ humanFileSize(file.size) }}</strong></span>\r\n      </div>\r\n      <div class=\"file-icon\">\r\n        <i class=\"fa fa-angle-right\"></i>\r\n      </div>\r\n    </li>\r\n  </ul>\r\n</template>\r\n<div v-else class=\"fileUpload file-input\" :class=\"{ 'fileUpload-padding-top': value.length }\">\r\n  <div class=\"row\">\r\n    <ul class=\"file-holder editable\">\r\n      <li class=\"file-item\" v-for=\"(file, index) in value\">\r\n        <div @click=\"onFileItemClick(file.url)\" class=\"file-content\" :class=\"{'no-pointer-events': !file.url}\">\r\n          <div class=\"file-title\" >{{ file.name }}</div>\r\n          <div class=\"file-info\">\r\n            <span class=\"file-info-uploaded\">\r\n              <span v-if=\"file.createdAt\">Uploaded: <strong>{{ showLocalDateFormat(file.createdAt) }}</strong></span>\r\n              <span v-else>To be uploaded</span>\r\n            </span>\r\n            <span v-show=\"file.size\" class=\"file-info-size\">&ndash; <strong>{{ humanFileSize(file.size) }}</strong></span>\r\n          </div>\r\n        </div>\r\n        <div class=\"file-icon\" @click=\"removeFile(index)\">\r\n          <i class=\"fa fa-times\"></i>\r\n        </div>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n  <label class=\"btn btn-primary focus-outline\" tabindex=\"0\" v-on:keydown.space.prevent=\"openFileDialog()\">\r\n    <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n    <span>Choose file</span>\r\n    <input type=\"file\" ref=\"fileInput\" :id=\"name\" :name=\"name\" :data-folder-id=\"mediaFolderId\" class=\"input-file selectfile\" v-on:change=\"updateValue()\" multiple tabindex=\"-1\">\r\n  </label>\r\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n</div>\r\n ";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.horizontalRule"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<hr>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.image"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n\r\n<div v-if=\"readonly\" class=\"fileUpload\" :class=\"{ 'fileUpload-padding-top': value.length }\">\r\n  <div class=\"row\">\r\n    <div v-for=\"(image, index) in value\" @click=\"onImageClick(index)\" class=\"multiple-images-item\">\r\n      <div class=\"image-item\" :style=\"{ 'background-image': 'url(' + image + ')' }\"></div>\r\n    </div>\r\n  </div>\r\n  <input multiple type=\"hidden\" ref=\"imageInput\" :id=\"name\" :name=\"name\" class=\"input-file selectfile\" accept=\"image/gif, image/jpg, image/jpeg, image/tiff, image/png\" :data-folder-id=\"mediaFolderId\">\r\n</div>\r\n\r\n<div v-else class=\"fileUpload\" :class=\"{ 'fileUpload-padding-top': value.length }\">\r\n  <div class=\"row\">\r\n    <div v-for=\"(image, index) in value\">\r\n      <div class=\"canvas-holder\">\r\n        <canvas ref=\"canvas\"></canvas>\r\n        <button class=\"canvas-remove\" type=\"button\" v-on:click=\"removeImage(index)\"></button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <label class=\"btn btn-primary focus-outline\" tabindex=\"0\" v-on:keydown.space.prevent=\"openFileDialog()\">\r\n    <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n    <span>Choose image</span>\r\n    <input multiple type=\"file\" ref=\"imageInput\" :id=\"name\" :name=\"name\" class=\"input-file selectfile\" accept=\"image/gif, image/jpg, image/jpeg, image/tiff, image/png\" :data-folder-id=\"mediaFolderId\" v-on:click=\"onFileClick\" v-on:change=\"onFileChange\" tabindex=\"-1\">\r\n  </label>\r\n  <p class=\"text-danger\" v-if=\"hasCorruptedImage\">The uploaded file is not a valid image. Please try again.</p>\r\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n</div>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.input"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n  <input\r\n    type=\"hidden\"\r\n    class=\"form-control\"\r\n    v-model.trim.lazy=\"value\"\r\n    v-on:change=\"updateValue()\"\r\n    v-on:input=\"onInput($event)\"\r\n    :name=\"name\"\r\n    :id=\"name\"\r\n    :placeholder=\"placeholder\"\r\n  />\r\n</template>\r\n<input v-else\r\n  type=\"text\"\r\n  class=\"form-control focus-outline\"\r\n  v-model.trim.lazy=\"value\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"placeholder\"\r\n  tabindex=\"0\"\r\n/>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.interface"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div :class=\"{ 'reduced-opacity': isHidden }\" >\r\n  <span v-if=\"isHidden\" class=\"label label-default\">Hidden</span>\r\n  <div class=\"form-group row clearfix\" :data-field=\"name\">\r\n    <div class=\"col-xs-12\" v-if=\"_isFormField\">\r\n      <label class=\"control-label\" :for=\"name\">\r\n        {{ label }} <template v-if=\"required\"><span class=\"required-info\">*</span></template>\r\n      </label>\r\n    </div>\r\n    <div class=\"col-xs-12\">\r\n      "
    + ((stack1 = ((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"template","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.number"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n  <input\r\n  type=\"hidden\"\r\n  class=\"form-control\"\r\n  v-model.trim.lazy=\"value\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"placeholder\"\r\n  />\r\n</template>\r\n\r\n<input v-else\r\n  type=\"text\"\r\n  class=\"form-control focus-outline\"\r\n  v-model.trim.lazy=\"value\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"placeholder\"\r\n  tabindex=\"0\"\r\n/>\r\n<p class=\"text-danger\" v-if=\"$v.value.maxLength === false && $v.value.$dirty\">This field only accept up to 15 digits.</p>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n<p class=\"text-danger\" v-if=\"$v.value.positive === false && $v.value.$dirty\">Only positive digits are allowed.</p>\r\n<p class=\"text-danger\" v-if=\"$v.value.integer === false && $v.value.$dirty\">Only integer digits are allowed.</p>\r\n<p class=\"text-danger\" v-if=\"$v.value.decimal === false && $v.value.$dirty\">Only digits or {{decimals}} digits after point are allowed.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.paragraph"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p v-html=\"htmlValue\"></p>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.password"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<input\r\n  type=\"password\"\r\n  class=\"form-control focus-outline\"\r\n  :readonly=\"autogenerate\"\r\n  autocomplete=\"new-password\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  v-on:focus=\"isFocused = true\"\r\n  v-on:blur=\"isFocused = false\"\r\n  v-model.trim=\"$v.value.$model\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"fieldPlaceholder\"\r\n  tabindex=\"0\"\r\n/>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n\r\n<div v-if=\"isFocused || $v.value.$model\" class=\"panel password-checker\" :class=\"validationClass.password\">\r\n  <div class=\"panel-heading\">Password requirements</div>\r\n  <div class=\"panel-body\">\r\n    <div class=\"requirement\">\r\n      <input type=\"checkbox\" class=\"hidden\" :checked=\"$v.value.$model.length >= passwordMinLength\" readonly tabindex=\"-1\" />\r\n      <label class=\"requirement-marker\">\r\n        <i class=\"fa fa-check\"></i>\r\n      </label>\r\n      <span>Password must be at least 8 characters.</span>\r\n    </div>\r\n    <div class=\"requirement\">\r\n      <input type=\"checkbox\" class=\"hidden\" :checked=\"$v.value.containsUppercase && $v.value.$model\" readonly tabindex=\"-1\"/>\r\n      <label class=\"requirement-marker\">\r\n        <i class=\"fa fa-check\"></i>\r\n      </label>\r\n      <span>Password must contain at least 1 uppercase character.</span>\r\n    </div>\r\n    <div class=\"requirement\">\r\n      <input type=\"checkbox\" class=\"hidden\" :checked=\"$v.value.containsLowercase && $v.value.$model\" readonly tabindex=\"-1\" />\r\n      <label class=\"requirement-marker\">\r\n        <i class=\"fa fa-check\"></i>\r\n      </label>\r\n      <span>Password must contain at least 1 lowercase character.</span>\r\n    </div>\r\n    <div class=\"requirement\">\r\n      <input type=\"checkbox\" class=\"hidden\" :checked=\"$v.value.containsNumber && $v.value.$model\" readonly tabindex=\"-1\" />\r\n      <label class=\"requirement-marker\">\r\n        <i class=\"fa fa-check\"></i>\r\n      </label>\r\n      <span>Password must contain at least 1 number.</span>\r\n    </div>\r\n    <div class=\"requirement\">\r\n      <input type=\"checkbox\" class=\"hidden\" :checked=\"$v.value.containsSpecial && $v.value.$model\" readonly tabindex=\"-1\" />\r\n      <label class=\"requirement-marker\">\r\n        <i class=\"fa fa-check\"></i>\r\n      </label>\r\n      <span>Password must contain at least 1 symbol.</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"form-group row clearfix\" v-if=\"confirm\">\r\n  <br />\r\n  <div class=\"col-xs-12\">\r\n    <label class=\"control-label\" for=\"confirmPassword\">Confirm password\r\n      <template v-if=\"required\">\r\n        <span class=\"required-info\">*</span>\r\n      </template>\r\n    </label>\r\n  </div>\r\n  <div class=\"col-xs-12\">\r\n    <input\r\n      type=\"password\"\r\n      class=\"form-control focus-outline\"\r\n      v-model.lazy=\"$v.passwordConfirmation.$model\"\r\n      id=\"confirmPassword\"\r\n      autocomplete=\"new-password\"\r\n      v-on:change=\"updatePasswordConfirmation()\"\r\n      v-on:input=\"onPasswordConfirmationInput($event)\"\r\n      tabindex=\"0\"\r\n    />\r\n  </div>\r\n  <div class=\"col-xs-12\">\r\n    <div v-if=\"isFocused || $v.value.$model\" class=\"panel password-checker\" :class=\"validationClass.passwordConfirmation\">\r\n      <div class=\"panel-heading\">Password confirmation</div>\r\n      <div class=\"panel-body\">\r\n        <div class=\"requirement\">\r\n          <input type=\"checkbox\" class=\"hidden\" :checked=\"$v.passwordConfirmation.sameAsPassword && $v.value.$model\" readonly tabindex=\"-1\" />\r\n          <label class=\"requirement-marker\">\r\n            <i class=\"fa fa-check\"></i>\r\n          </label>\r\n          <span>Password confirmation must match.</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.radio"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<template>\r\n  <div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n  <template v-if=\"readonly\">\r\n    <template v-for=\"(option, index) in options\">\r\n      <template v-if=\"value === option.label || value === option.id\">\r\n        <p class=\"form-control-static\">{{ option.label || option.id }}</p>\r\n        <input\r\n          type=\"hidden\"\r\n          :id=\"name + '-' + index\"\r\n          :name=\"name\"\r\n          v-model=\"value\"\r\n          :value=\"option.id || option.label\"\r\n          class=\"focus-outline\"\r\n          tabindex=\"0\"\r\n        >\r\n      </template>\r\n    </template>\r\n  </template>\r\n  <template v-else>\r\n    <template v-for=\"(option, index) in options\">\r\n      <div class=\"radio radio-icon\">\r\n        <input\r\n          type=\"radio\"\r\n          :id=\"name + '-' + index\"\r\n          :name=\"name\"\r\n          v-model=\"value\"\r\n          :value=\"option.id || option.label\"\r\n          tabindex=\"-1\"\r\n        >\r\n        <label v-on:click=\"clickHandler(option)\">\r\n          <span\r\n            ref=\"radioButton\"\r\n            class=\"check focus-outline\"\r\n            tabindex=\"0\"\r\n            v-on:keydown.right.prevent=\"focusHandler(index + 1)\"\r\n            v-on:keydown.down.prevent=\"focusHandler(index + 1)\"\r\n            v-on:keydown.left.prevent=\"focusHandler(index - 1)\"\r\n            v-on:keydown.up.prevent=\"focusHandler(index - 1)\"\r\n            v-on:keydown.space.prevent=\"focusHandler(index)\"\r\n          >\r\n            <i class=\"fa fa-circle\"></i>\r\n          </span>\r\n          <span class=\"option-item\"></span>{{ option.label || option.id }}</span>\r\n        </label>\r\n    </div>\r\n    </template>\r\n\r\n  </template>\r\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n</template>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.select"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n    <select\r\n      class=\"form-control hidden-select hidden focus-outline\"\r\n      :name=\"name\"\r\n      :id=\"name\"\r\n      v-model=\"value\"\r\n      v-on:change=\"updateValue()\"\r\n      v-on:input=\"onInput($event)\"\r\n      tabindex=\"0\"\r\n    >\r\n      <option v-if=\"placeholder\" value=\"\">{{ placeholder }}</option>\r\n      <option v-for=\"option in options\" :value=\"(_.isNumber(option.id) || _.isString(option.id)) ? option.id : option.label\" :disabled=\"option.disabled\">\r\n        {{ option.label || option.id }}\r\n      </option>\r\n    </select>\r\n</template>\r\n<template v-else>\r\n  <label\r\n    :for=\"name\"\r\n    class=\"select-proxy-display\" \r\n    :class=\"{ 'input-focused': isInputFocused }\"\r\n  >\r\n    <select\r\n      class=\"form-control hidden-select focus-outline\"\r\n      :name=\"name\"\r\n      :id=\"name\"\r\n      v-model=\"value\"\r\n      v-on:change=\"updateValue()\"\r\n      v-on:input=\"onInput($event)\"\r\n      v-on:focus=\"isInputFocused = true\"\r\n      v-on:blur=\"isInputFocused = false\"\r\n      tabindex=\"0\"\r\n    >\r\n      <option v-if=\"placeholder\" value=\"\">{{ placeholder }}</option>\r\n      <option v-for=\"option in options\" :value=\"(_.isNumber(option.id) || _.isString(option.id)) ? option.id : option.label\" :disabled=\"option.disabled\">\r\n        {{ option.label || option.id }}\r\n      </option>\r\n    </select>\r\n    <span class=\"icon fa fa-chevron-down\"></span>\r\n    <span class=\"select-value-proxy\"><template v-if=\"value && value !== ''\">{{ _selectedLabel }}</template><template v-else>{{ placeholder }}</template></span>\r\n  </label>\r\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n</template>\r\n\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.signature"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <div class=\"field-signature focus-outline\" tabindex=\"0\">\r\n    <img :src=\"value\" alt=\"signature image\" />\r\n  </div>\r\n</template>\r\n<template v-else>\r\n  <div v-show=\"isEditable\" class=\"signature-editor\">\r\n    <div class=\"field-signature focus-outline\" tabindex=\"0\">\r\n      <canvas :id=\"name\" ref=\"canvas\"></canvas>\r\n      <a\r\n        href=\"#\"\r\n        class=\"focus-outline btn-clear\"\r\n        tabindex=\"0\"\r\n        v-on:click.prevent=\"clean()\"\r\n        v-on:keydown.space.prevent=\"clean()\"\r\n      >\r\n        <i class=\"fa fa-times\"></i>\r\n        Clear\r\n      </a>\r\n    </div>\r\n  </div>\r\n  <div v-show=\"!isEditable\" class=\"field-signature focus-outline signature-preview\" tabindex=\"0\">\r\n    <img :src=\"value\" alt=\"signature image\" />\r\n    <a href=\"#\" v-on:click.prevent=\"isEditable = true\">Edit</a>\r\n  </div>\r\n  <p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n</template>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.starRating"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<div v-if=\"readonly\" class=\"inverse-direction\">\r\n  <template v-for=\"(option, index) in values\">\r\n    <template v-if=\"value >= option.id\">\r\n      <input\r\n        class=\"rating-input\"\r\n        :name=\"name\"\r\n        type=\"radio\"\r\n        :id=\"name + '-' + index\"\r\n        v-model=\"value\"\r\n        :value=\"option.id\"\r\n      />\r\n      <label class=\"rating-star\">\r\n        <i class=\"fa fa-star-o\"></i>\r\n        <i class=\"fa fa-star\"></i>\r\n      </label>\r\n    </template>\r\n  </template>\r\n</div>\r\n<div\r\n  v-else\r\n  class=\"inverse-direction focus-outline\"\r\n  tabindex=\"0\"\r\n  v-on:keydown.up.prevent=\"increaseRatingValue()\"\r\n  v-on:keydown.right.prevent=\"increaseRatingValue()\"\r\n  v-on:keydown.down.prevent=\"decreaseRatingValue()\"\r\n  v-on:keydown.left.prevent=\"decreaseRatingValue()\"\r\n>\r\n  <template v-for=\"(option, index) in values\">\r\n    <input\r\n      class=\"rating-input\"\r\n      :name=\"name\"\r\n      type=\"radio\"\r\n      :id=\"name + '-' + index\"\r\n      v-model=\"value\"\r\n      :value=\"option.id\"\r\n      v-on:change=\"updateValue()\"\r\n      v-on:input=\"onInput($event)\"\r\n      tabindex=\"-1\"\r\n    >\r\n    <label class=\"rating-star\" :for=\"name + '-' + index\">\r\n      <i class=\"fa fa-star-o\"></i>\r\n      <i class=\"fa fa-star\"></i>\r\n    </label>\r\n  </template>\r\n</div>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.telephone"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n  <input\r\n    type=\"hidden\"\r\n    class=\"form-control\"\r\n    v-model.trim.lazy=\"value\"\r\n    v-on:change=\"updateValue()\"\r\n    v-on:input=\"onInput($event)\"\r\n    :name=\"name\"\r\n    :id=\"name\"\r\n    :placeholder=\"placeholder\"\r\n  />\r\n</template>\r\n\r\n<input v-else\r\n  type=\"tel\"\r\n  class=\"form-control focus-outline\"\r\n  v-model.trim.lazy=\"value\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"placeholder\"\r\n  tabindex=\"0\"\r\n/>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n<p class=\"text-danger\" v-if=\"$v.value.phone === false && $v.value.$dirty\">Phone could contain <b>; , . ( ) - + SPACE * #</b> and numbers.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.textarea"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\" v-html=\"replaceNewLines(value)\"></p>\r\n  <input\r\n    type=\"hidden\"\r\n    class=\"form-control\"\r\n    v-model.trim.lazy=\"value\"\r\n    v-on:change=\"updateValue()\"\r\n    v-on:input=\"onInput($event)\"\r\n    :name=\"name\"\r\n    :id=\"name\"\r\n    :placeholder=\"placeholder\"\r\n  />\r\n</template>\r\n\r\n<textarea v-else\r\n  class=\"form-control focus-outline\"\r\n  v-model.trim.lazy=\"value\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"placeholder\"\r\n  :rows=\"rows\"\r\n  tabindex=\"0\"\r\n></textarea>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.time"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n  <input\r\n    type=\"hidden\"\r\n    v-model.lazy=\"value\"\r\n    v-on:change=\"updateValue()\"\r\n    v-on:input=\"onInput($event)\"\r\n    :name=\"name\"\r\n    :id=\"name\"\r\n    :placeholder=\"placeholder\"\r\n    class=\"form-control\"\r\n  />\r\n</template>\r\n</template>\r\n<template v-else-if=\"autofill === 'always' && defaultSource === 'submission' && empty\">\r\n  Now\r\n</template>\r\n<template v-else>\r\n  <div class=\"input-group custom-time\" :class=\"{ 'input-focused': isInputFocused }\">\r\n    <div class=\"input-group-addon\">\r\n      <i class=\"fa fa-clock-o\"></i>\r\n    </div>\r\n    <input\r\n        type=\"time\"\r\n        v-model=\"value\"\r\n        v-on:change=\"updateValue()\"\r\n        v-on:focus=\"isInputFocused = true\"\r\n        v-on:blur=\"isInputFocused = false\"\r\n        v-on:input=\"onInput($event)\"\r\n        :name=\"name\"\r\n        :id=\"name\"\r\n        :placeholder=\"placeholder\"\r\n        class=\"form-control focus-outline\"\r\n        tabindex=\"0\"\r\n      />\r\n  </div>\r\n</template>\r\n\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.title"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>{{ value }}</h2>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.url"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n\r\n<template v-if=\"readonly\">\r\n  <p class=\"form-control-static\">{{ value }}</p>\r\n  <input\r\n    type=\"hidden\"\r\n    class=\"form-control\"\r\n    v-model.trim.lazy=\"value\"\r\n    v-on:change=\"updateValue()\"\r\n    v-on:input=\"onInput($event)\"\r\n    :name=\"name\"\r\n    :id=\"name\"\r\n    :placeholder=\"placeholder\"\r\n  />\r\n</template>\r\n\r\n<input v-else\r\n  type=\"text\"\r\n  class=\"form-control focus-outline\"\r\n  v-model.trim.lazy=\"value\"\r\n  v-on:change=\"updateValue()\"\r\n  v-on:input=\"onInput($event)\"\r\n  :name=\"name\"\r\n  :id=\"name\"\r\n  :placeholder=\"placeholder\"\r\n  tabindex=\"0\"\r\n/>\r\n<p class=\"text-danger\" v-if=\"$v.value.url === false && $v.value.$dirty\">The input is not a valid URL.</p>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>\r\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.components.wysiwyg"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-if=\"description\" class=\"help-block description\">{{ description }}</div>\r\n<textarea\r\n  class=\"form-control\"\r\n  v-model.trim.lazy=\"value\"\r\n  ref=\"textarea\"\r\n  :name=\"name\"\r\n  :id=\"tinymceId\"\r\n  :placeholder=\"placeholder\"\r\n></textarea>\r\n<div\r\n  class=\"ghost-tinymce\"\r\n  ref=\"ghost\"\r\n  v-html=\"value\"\r\n  v-if=\"isInterface\">\r\n</div>\r\n<p class=\"text-danger\" v-if=\"$v.value.required === false && $v.value.$dirty\">Field is required.</p>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.radio"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div v-show=\"defaultValueSource === 'default'\" class=\"form-group\">\r\n  <label>Default value <small>(Enter one of the options you entered above)</small></label>\r\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\r\n</div>\r\n";
},"useData":true});