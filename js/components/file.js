Fliplet.FormBuilder.field('file', {
  name: 'Attach a file',
  category: 'Files',
  props: {
    accept: {
      type: String,
      default: ''
    },
    selectedFileName: {
      type: String,
      default: ''
    }
  },
  computed: {
    selectedFileName: function() {
      return this.value && this.value[0].name
    }
  },
  methods: {
    updateValue: function() {
      this.value = this.$refs.fileInput.files;
      this.$emit('_input', this.name, this.value);
    }
  }
});
