/* global loadImage, addThumbnailToCanvas */

/**
 * File field component – renders a file upload input with progress tracking.
 * Supports multiple file types, image resizing, and media folder integration.
 */
Fliplet.FormBuilder.field('file', {
  i18n: window.VueI18Next,
  name: 'Attach a file',
  category: 'Files',
  props: {
    accept: {
      type: String,
      default: '.mp3, .docx, .pdf, .xlsx, .bmp, .gif, .jpg, .png, .svg, .tiff, .webp, .txt, .mp4, .csv, .xml, .json, .pptx, .doc, .rtf, .mpg, .mov, .flv'
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
    },
    isValueUrlLink: function() {
      return _.some(this.value, function(value) {
        return typeof value === 'string' && Fliplet.Media.isRemoteUrl(value);
      });
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
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  mounted: function() {
    this.loadFileData();
  },
  updated: function() {
    if (this.readonly || this.isValueUrlLink) {
      this.loadFileData();
    }
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
    this.selectedFiles.length = 0;
  },
  methods: {
    loadFileData: function() {
      var $vm = this;
      var isFileDataLoaded = false;
      var fileIDs = _.map(this.value, function(fileURL) {
        if (typeof fileURL === 'string' && /v1\/media\/files\/([0-9]+)/.test(fileURL)) {
          return +fileURL.match(/v1\/media\/files\/([0-9]+)/)[1];
        }

        isFileDataLoaded = true;

        return null;
      });

      if (isFileDataLoaded) {
        return;
      }

      Fliplet.Media.Files.getAll({
        files: fileIDs,
        fields: ['name', 'url', 'metadata', 'createdAt']
      }).then(function(files) {
        var newFiles = _.map(files, function(file) {
          file.size = file.metadata.size;

          return file;
        });

        $vm.value = _.sortBy(newFiles, ['name']);
      }).catch(function() {});
    },
    showLocalDateFormat: function(date) {
      return TD(date, { format: 'L' });
    },
    onFileItemClick: function(url) {
      Fliplet.Navigate.file(url);
    },
    isFileImage: function(file) {
      if (file && file.type) {
        return (file.type.indexOf('image') >= 0);
      }
    },
    /**
     * Format bytes as human-readable text.
     *
     * @param {Number} bytes size in bytes
     *
     * @return {String} Formatted size i.e 1.2MB
     */
    humanFileSize: function(bytes) {
      var unitCapacity = 1000;
      var decimals = 1;

      if (Math.abs(bytes) < unitCapacity) {
        return bytes + ' B';
      }

      var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      var unitIndex = -1;
      var round  = 10 * decimals;

      do {
        bytes /= unitCapacity;
        ++unitIndex;
      } while (Math.round(Math.abs(bytes) * round) / round >= unitCapacity && unitIndex < units.length - 1);

      return TN(bytes.toFixed(decimals)) + ' ' + units[unitIndex];
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
    processImage: function(file, isAddElem) {
      var $vm = this;

      loadImage.parseMetaData(file, function() {
        loadImage(
          file,
          function() {
            if (isAddElem) {
              $vm.value.push(file);
              $vm.$emit('_input', $vm.name, $vm.value);
            }
          }, {
            canvas: true,
            maxWidth: $vm.customWidth,
            maxHeight: $vm.customHeight,
            orientation: 0
          });
      });
    },
    removeFile: function(index) {
      var $vm = this;

      this.validateValue();

      // this is used to trigger onChange event even if user deletes and than uploads same file
      this.$refs.fileInput.value = null;

      $vm.value.splice(index, 1);

      $vm.value.forEach(function(file) {
        if ($vm.isFileImage(file)) {
          $vm.processImage(file, false);
        }
      });

      $vm.$emit('_input', $vm.name, $vm.value);
    },
    updateValue: function(e) {
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
      e.target.value = '';
    },
    openFileDialog: function() {
      this.$refs.fileInput.click();
    }
  }
});
