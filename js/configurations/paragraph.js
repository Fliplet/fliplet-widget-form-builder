Fliplet.FormBuilder.configuration('paragraph', {
  editor: null,

  mounted: function() {
    const $vm = this;

    tinymce.init({
      target: this.$refs.textarea,
      menubar: false,
      branding: false,
      plugins: 'lists',
      toolbar: 'bold italic underline | fontsize_label fontsize',
      font_size_formats: '12pt 16pt 20pt',
      setup: function(editor) {
        $vm.editor = editor;

        editor.ui.registry.addButton('fontsize_label', {
          text: 'Font Size:',
          type: 'button',
          disabled: true,
          readonly: true,
          onAction: function() {}
        });

        editor.on('init', function() {
          if ($vm.value) {
            editor.setContent($vm.value);
          }
        });

        editor.on('change keyup', function() {
          $vm.value = editor.getContent();
        });
      }
    });
  },

  destroyed: function() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }
});
