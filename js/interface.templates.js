this["Fliplet"] = this["Fliplet"] || {};
this["Fliplet"]["Widget"] = this["Fliplet"]["Widget"] || {};
this["Fliplet"]["Widget"]["Templates"] = this["Fliplet"]["Widget"]["Templates"] || {};

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.buttons"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group clearfix\">\n  <div class=\"checkbox checkbox-icon\">\n    <input type=\"checkbox\" id=\"show_submit\" v-model=\"showSubmit\">\n    <label for=\"show_submit\">\n      <span class=\"check\"><i class=\"fa fa-check\"></i></span> Show submit button\n    </label>\n  </div>\n</div>\n\n<div class=\"form-group\">\n  <label>Submit button label</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"submitValue\" placeholder=\"Submit button label\" />\n</div>\n\n<div class=\"form-group clearfix\">\n  <div class=\"checkbox checkbox-icon\">\n    <input type=\"checkbox\" id=\"show_clear\" v-model=\"showClear\">\n    <label for=\"show_clear\">\n      <span class=\"check\"><i class=\"fa fa-check\"></i></span> Show clear button\n    </label>\n    <p class=\"help-block\">The clear button will reset all fields to their defaults.</p>\n  </div>\n</div>\n\n<div class=\"form-group\">\n  <label>Clear button label</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"clearValue\" placeholder=\"Clear button label\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.email"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.file"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.form-result"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>Thank you for submitting the form!</h2>\n<hr />\n<a href=\"#\" class=\"btn btn-primary\" @click.prevent=\"start()\">Start over</a>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.form"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"form-group\">\n      <label>Options <small>(One per line)</small></label>\n      <textarea v-on:input=\"_setOptions($event.target.value)\" class=\"form-control\">{{ _options }}</textarea>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", buffer = 
  "<form v-on:submit.prevent=\"onSubmit\">\n  <div v-if=\"_isFormField\">\n    <div class=\"form-group field-id\">\n      <p id=\"field-id\"><span class=\"field-label\">ID:</span> {{ name }}</p>\n    </div>\n\n    <div class=\"form-group\">\n      <label>Field label</label>\n      <input class=\"form-control\" type=\"text\" v-model.trim=\"label\" placeholder=\"Field description\" />\n    </div>\n\n    <div class=\"form-group\">\n      <label>Is this field required?</label>\n      <div class=\"radio radio-icon\">\n        <input type=\"radio\" id=\"required-yes\" name=\"required-option\" v-bind:value=\"true\" v-model=\"required\">\n        <label for=\"required-yes\">\n          <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>Yes</strong> - Users will have to fill in the field\n        </label>\n      </div>\n      <div class=\"radio radio-icon\">\n        <input type=\"radio\" id=\"required-no\" name=\"required-option\" v-bind:value=\"false\" v-model=\"required\">\n        <label for=\"required-no\">\n          <span class=\"check\"><i class=\"fa fa-circle\"></i></span> <strong>No</strong> - The field is optional\n        </label>\n      </div>\n    </div>\n  </div>\n\n";
  stack1 = ((helper = (helper = helpers.hasOptions || (depth0 != null ? depth0.hasOptions : depth0)) != null ? helper : alias2),(options={"name":"hasOptions","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.hasOptions) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n  "
    + ((stack1 = ((helper = (helper = helpers.template || (depth0 != null ? depth0.template : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"template","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n  <div class=\"footer\">\n    <button type=\"submit\" class=\"btn btn-primary\">Save</button>\n  </div>\n</form>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.horizontalRule"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.image"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Custom width</label>\n  <input class=\"form-control\" type=\"number\" v-model.trim=\"customWidth\" />\n</div>\n<div class=\"form-group\">\n  <label>Custom height</label>\n  <input class=\"form-control\" type=\"number\" v-model.trim=\"customHeight\" />\n</div>\n\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.input"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Default value</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder text\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.paragraph"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Text</label>\n  <textarea class=\"form-control\" v-model.trim=\"value\" placeholder=\"Type some text\" rows=\"6\"></textarea>\n</div>";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.select"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Default value <small>(Enter one of the options you entered above)</small></label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Default value\" />\n</div>\n<div class=\"form-group\">\n  <label>Option placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Option placeholder\" />\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.textarea"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Default value</label>\n  <textarea class=\"form-control\" v-model.trim=\"value\" placeholder=\"Default value\"></textarea>\n</div>\n<div class=\"form-group\">\n  <label>Placeholder</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"placeholder\" placeholder=\"Placeholder\" />\n</div>\n<div class=\"form-group\">\n  <label>Rows <small>(Specifies the height of the text area in lines)</small></label>\n  <label for=\"textarea-rows\" class=\"select-proxy-display\">\n    <span class=\"icon fa fa-chevron-down\"></span>\n    <span class=\"select-value-proxy\">2</span>\n    <select class=\"form-control hidden-select\" id=\"textarea-rows\" v-model=\"rows\">\n      <option :value=\"number\" v-for=\"number in [1,2,3,4,5,6,7,8,9]\">{{ number }}</option>\n    </select>\n  </label>\n</div>\n";
},"useData":true});

this["Fliplet"]["Widget"]["Templates"]["templates.configurations.title"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"form-group\">\n  <label>Title text</label>\n  <input class=\"form-control\" type=\"text\" v-model.trim=\"value\" placeholder=\"Type some text\" />\n</div>";
},"useData":true});