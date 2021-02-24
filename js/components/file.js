/* global loadImage, addThumbnailToCanvas */

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
    },
    canHide: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
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
    this.selectedFiles.length = 0;
  },
  methods: {
    isFileImage: function(file) {
      if (file && file.type) {
        return (file.type.indexOf('image') >= 0);
      }
    },
    onReset: function() {
      var $vm = this;

      $vm.value = [];
      $vm.selectedFileName = '';

      $vm.$emit('_input', $vm.name, $vm.value);
    },
    validateValue: function() {
      if (typeof this.value === 'string' && this.value) {
        this.value = [this.value];
      }

      if (!Array.isArray(this.value)) {
        this.value = [];
      }
    },
    processImage: function(file, isAddElem, index) {
      var $vm = this;
      var mimeType = file.type || 'image/png';

      loadImage.parseMetaData(file, function(data) {
        loadImage(
          file,
          function(img) {
            var imgBase64Url = img.toDataURL(mimeType, $vm.jpegQuality);

            if (isAddElem) {
              $vm.value.push(file);
              addThumbnailToCanvas(imgBase64Url, $vm.value.length - 1, $vm, true);
              $vm.$emit('_input', $vm.name, $vm.value);
            } else {
              addThumbnailToCanvas(imgBase64Url, index, $vm, true);
            }
          }, {
            canvas: true,
            maxWidth: $vm.customWidth,
            maxHeight: $vm.customHeight,
            orientation: data.exif ?
              data.exif.get('Orientation') : true
          });
      });
    },
    removeFile: function(index) {
      var $vm = this;

      this.validateValue();

      // this is used to trigger onChange event even if user deletes and than uploads same file
      this.$refs.fileInput.value = null;

      $vm.value.splice(index, 1);

      $vm.value.forEach(function(file, index) {
        if ($vm.isFileImage(file)) {
          $vm.processImage(file, false, index);
        }
      });

      $vm.$emit('_input', $vm.name, $vm.value);
    },
    updateValue: function() {
      var $vm = this;
      var files = $vm.$refs.fileInput.files;

      this.validateValue();

      for (var i = 0; i < files.length; i++) {
        var file = files.item(i);

        if ($vm.isFileImage(file)) {
          this.processImage(file, true);
        } else {
          $vm.value.push(file);
        }
      }

      $vm.$emit('_input', $vm.name, $vm.value);
    },
    openFileDialog: function() {
      this.$refs.fileInput.click();
    }
  }
});
