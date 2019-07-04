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
    addThumbnailToCanvas: function(imageURI, indexCanvas) {
      var $vm = this;
    
      if (!imageURI.match(/^http/)) {
        imageURI = (imageURI.indexOf('base64') > -1)
          ? imageURI
          :'data:image/jpeg;base64,' + imageURI;
      }
      
      $vm.$nextTick(function () {
        var canvas = $vm.$refs.canvasWrap[indexCanvas].children[0].children[0];
        var context = canvas.getContext('2d');
      
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
      
        var img = new Image();
      
        img.onload = function imageLoadedFromURI() {
          $vm.drawImageOnCanvas(this, canvas);
        };
      
        img.src = imageURI;
      });
    },
    isFileImage: function(file) {
      if (file && file.type) {
        return (file.type.indexOf('image') >= 0);
      }
    },
    drawImageOnCanvas: function(img, canvas) {
      var imgWidth = img.width;
      var imgHeight = img.height;
      var imgRatio = imgWidth / imgHeight;
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      var canvasRatio = canvasWidth / canvasHeight;
      var context = canvas.getContext('2d');
    
      // Re-interpolate image draw dimensions based to CONTAIN within canvas
      if (imgRatio < canvasRatio) {
        // IMAGE RATIO is slimmer than CANVAS RATIO, i.e. margin on the left & right
        if (imgHeight > canvasHeight) {
          // Image is taller. Resize image to fit height in canvas first.
          imgHeight = canvasHeight;
          imgWidth = imgHeight * imgRatio;
        }
      } else {
        // IMAGE RATIO is wider than CANVAS RATIO, i.e. margin on the top & bottom
        if (imgWidth > canvasWidth) {
          // Image is wider. Resize image to fit width in canvas first.
          imgWidth = canvasWidth;
          imgHeight = imgWidth / imgRatio;
        }
      }
    
      var drawX = (canvasWidth > imgWidth) ? (canvasWidth - imgWidth) / 2 : 0;
      var drawY = (canvasHeight > imgHeight) ? (canvasHeight - imgHeight) / 2 : 0;
    
      context.drawImage(img, drawX, drawY, imgWidth, imgHeight);
    },
    onReset: function() {
      var $vm = this;
      
      $vm.value = [];
      $vm.selectedFileName = '';
      
      $vm.$emit('_input', $vm.name, $vm.value);
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
              $vm.addThumbnailToCanvas(imgBase64Url, $vm.value.length - 1);
              $vm.$emit('_input', $vm.name, $vm.value);
            } else {
              $vm.addThumbnailToCanvas(imgBase64Url, index);
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
    
      $vm.value.splice(index, 1);
    
      $vm.value.forEach(function (file, index) {
        if ($vm.isFileImage(file)) {
          $vm.processImage(file, false, index);
        }
      });
    
      $vm.$emit('_input', $vm.name, $vm.value);
    },
    updateValue: function() {
      var $vm = this;
      var files = $vm.$refs.fileInput.files;
  
      for (var i = 0; i < files.length; i++) {
        var file = files.item(i);
        
        if ($vm.isFileImage(file)) {
          this.processImage(file, true);
        } else {
          $vm.value.push(file);
        }
      }
      
      $vm.$emit('_input', $vm.name, $vm.value);
    }
  }
});
