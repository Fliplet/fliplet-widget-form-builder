/* global SignaturePad */
var sig = [
  { 'lx': 20, 'ly': 34, 'mx': 20, 'my': 34 },
  { 'lx': 21, 'ly': 33, 'mx': 20, 'my': 34 },
  { 'lx': 22, 'ly': 31, 'mx': 21, 'my': 33 },
  { 'lx': 23, 'ly': 30, 'mx': 22, 'my': 31 },
  { 'lx': 25, 'ly': 27, 'mx': 23, 'my': 30 },
  { 'lx': 27, 'ly': 25, 'mx': 25, 'my': 27 },
  { 'lx': 29, 'ly': 23, 'mx': 27, 'my': 25 },
  { 'lx': 31, 'ly': 21, 'mx': 29, 'my': 23 },
  { 'lx': 33, 'ly': 19, 'mx': 31, 'my': 21 },
  { 'lx': 35, 'ly': 18, 'mx': 33, 'my': 19 },
  { 'lx': 35, 'ly': 17, 'mx': 35, 'my': 18 },
  { 'lx': 36, 'ly': 17, 'mx': 35, 'my': 17 },
  { 'lx': 36, 'ly': 17, 'mx': 36, 'my': 17 },
  { 'lx': 35, 'ly': 18, 'mx': 36, 'my': 17 },
  { 'lx': 34, 'ly': 20, 'mx': 35, 'my': 18 },
  { 'lx': 32, 'ly': 23, 'mx': 34, 'my': 20 },
  { 'lx': 30, 'ly': 26, 'mx': 32, 'my': 23 },
  { 'lx': 28, 'ly': 29, 'mx': 30, 'my': 26 },
  { 'lx': 26, 'ly': 32, 'mx': 28, 'my': 29 },
  { 'lx': 24, 'ly': 33, 'mx': 26, 'my': 32 },
  { 'lx': 23, 'ly': 35, 'mx': 24, 'my': 33 },
  { 'lx': 23, 'ly': 36, 'mx': 23, 'my': 35 },
  { 'lx': 23, 'ly': 36, 'mx': 23, 'my': 36 },
  { 'lx': 24, 'ly': 35, 'mx': 23, 'my': 36 },
  { 'lx': 26, 'ly': 34, 'mx': 24, 'my': 35 },
  { 'lx': 28, 'ly': 33, 'mx': 26, 'my': 34 },
  { 'lx': 30, 'ly': 31, 'mx': 28, 'my': 33 },
  { 'lx': 32, 'ly': 30, 'mx': 30, 'my': 31 },
  { 'lx': 33, 'ly': 29, 'mx': 32, 'my': 30 },
  { 'lx': 34, 'ly': 29, 'mx': 33, 'my': 29 },
  { 'lx': 34, 'ly': 29, 'mx': 34, 'my': 29 },
  { 'lx': 33, 'ly': 30, 'mx': 34, 'my': 29 },
  { 'lx': 32, 'ly': 31, 'mx': 33, 'my': 30 },
  { 'lx': 31, 'ly': 33, 'mx': 32, 'my': 31 },
  { 'lx': 30, 'ly': 35, 'mx': 31, 'my': 33 },
  { 'lx': 29, 'ly': 36, 'mx': 30, 'my': 35 },
  { 'lx': 29, 'ly': 37, 'mx': 29, 'my': 36 },
  { 'lx': 29, 'ly': 37, 'mx': 29, 'my': 37 },
  { 'lx': 31, 'ly': 36, 'mx': 29, 'my': 37 },
  { 'lx': 33, 'ly': 35, 'mx': 31, 'my': 36 },
  { 'lx': 36, 'ly': 34, 'mx': 33, 'my': 35 },
  { 'lx': 38, 'ly': 32, 'mx': 36, 'my': 34 },
  { 'lx': 40, 'ly': 31, 'mx': 38, 'my': 32 },
  { 'lx': 42, 'ly': 30, 'mx': 40, 'my': 31 },
  { 'lx': 43, 'ly': 30, 'mx': 42, 'my': 30 },
  { 'lx': 44, 'ly': 30, 'mx': 43, 'my': 30 },
  { 'lx': 44, 'ly': 31, 'mx': 44, 'my': 30 },
  { 'lx': 44, 'ly': 32, 'mx': 44, 'my': 31 },
  { 'lx': 43, 'ly': 33, 'mx': 44, 'my': 32 },
  { 'lx': 42, 'ly': 35, 'mx': 43, 'my': 33 },
  { 'lx': 41, 'ly': 36, 'mx': 42, 'my': 35 },
  { 'lx': 40, 'ly': 37, 'mx': 41, 'my': 36 },
  { 'lx': 40, 'ly': 37, 'mx': 40, 'my': 37 },
  { 'lx': 40, 'ly': 36, 'mx': 40, 'my': 37 },
  { 'lx': 41, 'ly': 36, 'mx': 40, 'my': 36 },
  { 'lx': 42, 'ly': 35, 'mx': 41, 'my': 36 },
  { 'lx': 44, 'ly': 33, 'mx': 42, 'my': 35 },
  { 'lx': 46, 'ly': 32, 'mx': 44, 'my': 33 },
  { 'lx': 47, 'ly': 32, 'mx': 46, 'my': 32 },
  { 'lx': 48, 'ly': 31, 'mx': 47, 'my': 32 },
  { 'lx': 48, 'ly': 31, 'mx': 48, 'my': 31 },
  { 'lx': 48, 'ly': 33, 'mx': 48, 'my': 31 },
  { 'lx': 47, 'ly': 35, 'mx': 48, 'my': 33 },
  { 'lx': 45, 'ly': 37, 'mx': 47, 'my': 35 },
  { 'lx': 43, 'ly': 39, 'mx': 45, 'my': 37 },
  { 'lx': 41, 'ly': 42, 'mx': 43, 'my': 39 },
  { 'lx': 39, 'ly': 44, 'mx': 41, 'my': 42 },
  { 'lx': 37, 'ly': 45, 'mx': 39, 'my': 44 },
  { 'lx': 37, 'ly': 46, 'mx': 37, 'my': 45 },
  { 'lx': 37, 'ly': 46, 'mx': 37, 'my': 46 },
  { 'lx': 37, 'ly': 45, 'mx': 37, 'my': 46 },
  { 'lx': 39, 'ly': 44, 'mx': 37, 'my': 45 },
  { 'lx': 42, 'ly': 42, 'mx': 39, 'my': 44 },
  { 'lx': 46, 'ly': 40, 'mx': 42, 'my': 42 },
  { 'lx': 49, 'ly': 38, 'mx': 46, 'my': 40 },
  { 'lx': 53, 'ly': 36, 'mx': 49, 'my': 38 },
  { 'lx': 56, 'ly': 35, 'mx': 53, 'my': 36 },
  { 'lx': 58, 'ly': 34, 'mx': 56, 'my': 35 },
  { 'lx': 59, 'ly': 34, 'mx': 58, 'my': 34 },
  { 'lx': 60, 'ly': 34, 'mx': 59, 'my': 34 },
  { 'lx': 59, 'ly': 35, 'mx': 60, 'my': 34 },
  { 'lx': 58, 'ly': 36, 'mx': 59, 'my': 35 },
  { 'lx': 57, 'ly': 37, 'mx': 58, 'my': 36 },
  { 'lx': 55, 'ly': 39, 'mx': 57, 'my': 37 },
  { 'lx': 54, 'ly': 40, 'mx': 55, 'my': 39 },
  { 'lx': 53, 'ly': 41, 'mx': 54, 'my': 40 },
  { 'lx': 53, 'ly': 41, 'mx': 53, 'my': 41 },
  { 'lx': 55, 'ly': 40, 'mx': 53, 'my': 41 },
  { 'lx': 57, 'ly': 38, 'mx': 55, 'my': 40 },
  { 'lx': 60, 'ly': 36, 'mx': 57, 'my': 38 },
  { 'lx': 63, 'ly': 34, 'mx': 60, 'my': 36 },
  { 'lx': 65, 'ly': 32, 'mx': 63, 'my': 34 },
  { 'lx': 67, 'ly': 31, 'mx': 65, 'my': 32 },
  { 'lx': 69, 'ly': 31, 'mx': 67, 'my': 31 },
  { 'lx': 69, 'ly': 31, 'mx': 69, 'my': 31 },
  { 'lx': 68, 'ly': 31, 'mx': 69, 'my': 31 },
  { 'lx': 66, 'ly': 33, 'mx': 68, 'my': 31 },
  { 'lx': 64, 'ly': 34, 'mx': 66, 'my': 33 },
  { 'lx': 62, 'ly': 36, 'mx': 64, 'my': 34 },
  { 'lx': 60, 'ly': 37, 'mx': 62, 'my': 36 },
  { 'lx': 59, 'ly': 38, 'mx': 60, 'my': 37 },
  { 'lx': 58, 'ly': 39, 'mx': 59, 'my': 38 },
  { 'lx': 58, 'ly': 39, 'mx': 58, 'my': 39 },
  { 'lx': 59, 'ly': 39, 'mx': 58, 'my': 39 },
  { 'lx': 61, 'ly': 38, 'mx': 59, 'my': 39 },
  { 'lx': 64, 'ly': 36, 'mx': 61, 'my': 38 },
  { 'lx': 66, 'ly': 35, 'mx': 64, 'my': 36 },
  { 'lx': 69, 'ly': 33, 'mx': 66, 'my': 35 },
  { 'lx': 72, 'ly': 32, 'mx': 69, 'my': 33 },
  { 'lx': 73, 'ly': 31, 'mx': 72, 'my': 32 },
  { 'lx': 74, 'ly': 31, 'mx': 73, 'my': 31 },
  { 'lx': 74, 'ly': 31, 'mx': 74, 'my': 31 },
  { 'lx': 72, 'ly': 31, 'mx': 74, 'my': 31 },
  { 'lx': 70, 'ly': 32, 'mx': 72, 'my': 31 },
  { 'lx': 68, 'ly': 33, 'mx': 70, 'my': 32 },
  { 'lx': 65, 'ly': 34, 'mx': 68, 'my': 33 },
  { 'lx': 64, 'ly': 36, 'mx': 65, 'my': 34 },
  { 'lx': 62, 'ly': 36, 'mx': 64, 'my': 36 },
  { 'lx': 61, 'ly': 37, 'mx': 62, 'my': 36 },
  { 'lx': 61, 'ly': 37, 'mx': 61, 'my': 37 },
  { 'lx': 62, 'ly': 37, 'mx': 61, 'my': 37 },
  { 'lx': 64, 'ly': 36, 'mx': 62, 'my': 37 },
  { 'lx': 68, 'ly': 34, 'mx': 66, 'my': 35 },
  { 'lx': 69, 'ly': 33, 'mx': 68, 'my': 34 },
  { 'lx': 70, 'ly': 33, 'mx': 69, 'my': 33 },
  { 'lx': 70, 'ly': 33, 'mx': 70, 'my': 33 },
  { 'lx': 70, 'ly': 32, 'mx': 70, 'my': 33 },
  { 'lx': 70, 'ly': 32, 'mx': 70, 'my': 32 },
  { 'lx': 71, 'ly': 32, 'mx': 70, 'my': 32 },
  { 'lx': 72, 'ly': 32, 'mx': 71, 'my': 32 },
  { 'lx': 74, 'ly': 32, 'mx': 72, 'my': 32 },
  { 'lx': 76, 'ly': 32, 'mx': 74, 'my': 32 },
  { 'lx': 79, 'ly': 33, 'mx': 76, 'my': 32 },
  { 'lx': 83, 'ly': 33, 'mx': 79, 'my': 33 },
  { 'lx': 87, 'ly': 34, 'mx': 83, 'my': 33 },
  { 'lx': 92, 'ly': 35, 'mx': 87, 'my': 34 },
  { 'lx': 97, 'ly': 36, 'mx': 92, 'my': 35 },
  { 'lx': 103, 'ly': 37, 'mx': 97, 'my': 36 },
  { 'lx': 110, 'ly': 38, 'mx': 103, 'my': 37 },
  { 'lx': 117, 'ly': 39, 'mx': 110, 'my': 38 },
  { 'lx': 125, 'ly': 39, 'mx': 117, 'my': 39 },
  { 'lx': 133, 'ly': 38, 'mx': 125, 'my': 39 },
  { 'lx': 140, 'ly': 36, 'mx': 133, 'my': 38 },
  { 'lx': 146, 'ly': 34, 'mx': 140, 'my': 36 },
  { 'lx': 151, 'ly': 32, 'mx': 146, 'my': 34 },
  { 'lx': 155, 'ly': 30, 'mx': 151, 'my': 32 },
  { 'lx': 157, 'ly': 28, 'mx': 155, 'my': 30 },
  { 'lx': 158, 'ly': 27, 'mx': 157, 'my': 28 },
  { 'lx': 158, 'ly': 27, 'mx': 158, 'my': 27 }
];

Fliplet.FormBuilder.field('signature', {
  name: 'Signature',
  category: 'Advanced',
  props: {
    placeholder: {
      type: String
    },
    height: {
      type: Number,
      default: 150
    },
    canHide: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    mediaFolderId: {
      type: Number,
      default: null
    },
    mediaFolderData: {
      type: Object,
      default: {}
    },
    mediaFolderNavStack: {
      type: Array,
      default: []
    }
  },
  data: {
    previousClientWidth: 0
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  computed: {
    borderColor: function() {
      return Fliplet.Themes && Fliplet.Themes.Current.get('bodyTextColor') || '#e5e5e5';
    }
  },
  mounted: function() {
    if (this.readonly) {
      return;
    }

    var $vm = this;

    var canvas = this.$refs.canvas;

    canvas.style.width = '100%';
    canvas.style.height = parseInt(this.height, 10) + 'px';
    canvas.style.userSelect = 'none';
    canvas.style.borderBottom = '1px solid ' + this.borderColor;

    this.pad = new SignaturePad(canvas);

    // check is field valid when required
    this.pad.onEnd = function() {
      if ($vm.required) {
        $vm.value = true;
        $vm.updateValue();
      }
    };

    Fliplet.FormBuilder.on('reset', this.onReset);
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);

    $(window).on('resize', this.onResize);
    this.onResize();
  },
  destroyed: function() {
    this.isDestroyed = true;
    $(window).off('resize', this.onResize);
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  methods: {
    onResize: function() {
      var canvas = this.$refs.canvas;

      if (this.previousClientWidth !== canvas.clientWidth) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.onReset();
        this.previousClientWidth = canvas.width;
      }
    },
    onReset: function() {
      if (this.pad) {
        this.pad.clear();
        this.value = sig;
      }
    },
    clean: function() {
      this.onReset();
      this.updateValue();
    },
    onBeforeSubmit: function(data) {
      var $vm = this;

      if (!$vm.pad || $vm.isDestroyed) {
        return;
      }

      // highlight Error if not valid field when required
      if ($vm.required && $vm.pad.isEmpty()) {
        this.highlightError();
      }

      // Get signature as base 64 string
      data[this.name] = this.pad.toDataURL('image/png') + ';filename:' + this.name + ' ' + moment().format('YYYY-MM-DD HH:mm') + '.png';
    }
  }
});
