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
      return _.map(this.selectedFiles, 'name').join(', ');
    }
  },
  mounted: function () {
    this.onReset();
  },
  methods: {
    onReset: function() {
      this.selectedFiles = [];
      this.selectedFileName = '';
      
      this.$emit('_input', this.name, this.selectedFiles);
    },
    updateValue: function() {
      var $vm = this;
      var files = $vm.$refs.fileInput.files;
      
      $vm.selectedFiles.splice(0, $vm.selectedFiles.length);
      
      for (var i = 0; i < files.length; i++) {
        var file = files.item(i);
        $vm.selectedFiles.push(file);
      }
      
      $vm.$emit('_input', $vm.name, $vm.selectedFiles);
    }
  }
});
