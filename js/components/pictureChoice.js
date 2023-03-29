Fliplet.FormBuilder.field('pictureChoice', {
  name: 'Picture choice',
  category: 'Multiple options',
  props: {
    items: {
      type: Array,
      default: function() {
        return [];
      }
    }
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
  methods: {
    clickHandler: function(item) {
      this.value = item;
      this.updateValue();
    },
    focusHandler: function(index) {
      var newIndex = index;

      if (index > this.items.length - 1) {
        newIndex = 0;
      } else if (index < 0) {
        newIndex = this.items.length - 1;
      }

      this.$refs.radioButton[newIndex].focus();
      this.clickHandler(this.items[newIndex]);
    },
    attachObservers: function() {
      var $accordion = $('#componentsAccordion');

      var recalculateHeight = function(obj) {
        var $panelHeading = $('.panel-heading');
        var tabsHeight = $panelHeading.outerHeight() * $panelHeading.length;
        var borders = $panelHeading.length * 3;
        var wrapperHeight =
          $('.components-list .form-html').innerHeight() - tabsHeight;

        obj.children('.panel-body').css('height', wrapperHeight - borders);
        obj.children('.panel-body').fadeIn(250);
        obj.children('.panel-body').animate(
          {
            scrollTop: 0
          },
          250
        );
      };

      recalculateHeight($('.panel-collapse'));

      $accordion.on('show.bs.collapse', '.panel-collapse', function() {
        recalculateHeight($(this));
      });

      $accordion.on('hide.bs.collapse', '.panel-collapse', function() {
        $(this).children('.panel-body').fadeOut(250);
      });
    }
  },
  created: function() {
    var $vm = this;

    var selectedOption = _.find($vm.items, function(item) {
      return _.has(item, 'label') && _.has(item, 'id')
        ? item.id === $vm.value
        : item.label === $vm.value;
    });

    this.value = selectedOption ? this.value : '';
  }
});
