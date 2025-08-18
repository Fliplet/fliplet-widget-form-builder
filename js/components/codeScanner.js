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
        this.announceStatus('Scanner is disabled in read-only mode', 2000);

        return;
      }

      this.announceStatus('Opening barcode scanner...', 1500);

      Fliplet.Barcode.scan().then(function(result) {
        if (result.text) {
          $vm.value = result.text;

          $vm.announceAction(`Code scanned successfully: ${result.text}`, 2000);
        } else {
          $vm.announceStatus('No code detected, please try again', 2000);
        }
      })
        .catch(function(error) {
          $vm.errorMessage = Fliplet.parseError(error);

          $vm.announceError(`Scanner error: ${$vm.errorMessage}`, 3000);
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
    },

    handleKeyDown: function(event) {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.openScanner();
          break;
        case 'Escape':
          event.preventDefault();
          // Clear the scanned value
          this.value = '';
          this.announceStatus('Scanned code cleared', 1500);
          break;
        default:
          break;
      }
    }
  },
  watch: {
    value: function(val) {
      this.$emit('_input', this.name, val, false, true);
    }
  }
});
