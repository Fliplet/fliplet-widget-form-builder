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
    },
    selectedFiles: {
      type: Array,
      default: []
    },
    saveProgress: {
      type: Boolean,
      default: false
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
    },
    value: {
      type: Array,
      default: []
    }
  },
  computed: {
    selectedFileName: function() {
      return _.map(this.value, 'name').join(', ');
    }
  },
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  methods: {
    onReset: function() {
      var $vm = this;
      
      $vm.value = [];
      $vm.selectedFileName = '';
      
      $vm.$emit('_input', $vm.name, $vm.value);
    },
    updateValue: function() {
      var $vm = this;
      var files = $vm.$refs.fileInput.files;
  
      $vm.value.splice(0, $vm.value.length);
  
      for (var i = 0; i < files.length; i++) {
        var file = files.item(i);
        $vm.value.push(file);
      }

      $vm.$emit('_input', $vm.name, $vm.value);
    }
  }
});
