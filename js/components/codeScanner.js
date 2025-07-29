/**
 * A Fliplet Form Builder field component that provides barcode/QR code scanning functionality.
 * Allows users to scan barcodes or QR codes using their device's camera and automatically
 * populate form fields with the scanned data.
 */
Fliplet.FormBuilder.field('codeScanner', {
  name: 'Code scanner',
  category: 'Advanced',
  props: {
    value: {
      type: String
    },
    description: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  data: function() {
    return {
      errorMessage: null
    };
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required && !this.readonly) {
      rules.value.required = window.validators.required;
    }

    return rules;
  },
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  methods: {
    openScanner: function() {
      var $vm = this;

      if (this.readonly) {
        return;
      }

      Fliplet.Barcode.scan().then(function(result) {
        if (result.text) {
          $vm.value = result.text;
        }
      })
        .catch(function(error) {
          $vm.errorMessage = Fliplet.parseError(error);
        });
    },
    onReset: function() {
      this.errorMessage = null;
    },
    scannerInput: function(event) {
      var el = event.target;
      var maxRows = 5;

      el.rows = 1;

      while (el.scrollHeight > el.clientHeight && el.rows < maxRows) {
        el.rows++;
      }
    }
  },
  watch: {
    value: function(val) {
      this.$emit('_input', this.name, val, false, true);
    }
  }
});
