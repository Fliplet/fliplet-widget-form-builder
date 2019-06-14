Fliplet.FormBuilder.field('image', {
  name: 'Image upload',
  category: 'Files',
  props: {
    accept: {
      type: String,
      default: ''
    },
    customWidth: {
      type: Number,
      default: 1024
    },
    customHeight: {
      type: Number,
      default: 1024
    },
    jpegQuality: {
      type: Number,
      default: 80
    },
    value: {
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
    }
  },
  data: {
    boundingRect: undefined,
    cameraSource: undefined,
    forcedClick: false,
    isImageValid: undefined
  },
  created: function() {
    Fliplet.FormBuilder.on('reset', this.onReset);
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  mounted: function () {
    var $vm = this;

    this.value.forEach(function (image) {
      $vm.addThumbnailToCanvas(image);
    });
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  methods: {
    onReset: function() {
      var canvas = this.$refs.canvas;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    },
    onBeforeSubmit: function (data) {
      $(this.$refs.imageInput).parents('.form-group').removeClass('has-error');

      if (!this.required) {
        if (this.value.length && !this.isImageValid) {
          $(this.$refs.imageInput).parents('.form-group').addClass('has-error');
          return Promise.reject('Field [' + this.name + '] height or width exceeded.');
        }
        return;
      }

      if (!this.value.length) {
        $(this.$refs.imageInput).parents('.form-group').addClass('has-error');

        return Promise.reject('Please fill in required fields.');
      }
      if (!this.isImageValid) {
        $(this.$refs.imageInput).parents('.form-group').addClass('has-error');
        return Promise.reject('Field [' + this.name + '] height or width exceeded.');
      }
    },
    requestPicture: function(fileInput) {
      var $vm = this;
      var boundingRect = fileInput.getBoundingClientRect();

      while (boundingRect.width === 0 || boundingRect.height === 0) {
        if (!fileInput.parentNode) {
          break;
        }

        fileInput = fileInput.parentNode;
        boundingRect = fileInput.getBoundingClientRect();
      }

      return new Promise(function(resolve, reject) {
        $vm.boundingRect = fileInput.getBoundingClientRect();

        var buttonLabels = ["Take Photo", "Choose Existing Photo", "Cancel"];
        if (Modernizr.windows) {
          buttonLabels = ["Take Photo", "Choose Existing Photo"];
        }

        navigator.notification.confirm(
          'How do you want to choose your image?',
          function onSelectedImageMethod(button) {
            document.body.focus();
            switch (button) {
              case 1:
                $vm.cameraSource = Camera.PictureSourceType.CAMERA;
                return resolve();
              case 2:
              default:
                $vm.cameraSource = Camera.PictureSourceType.PHOTOLIBRARY;
                return resolve();
              case 3:
                return;
            }
          },
          'Choose Image', buttonLabels
        );
      });
    },
    getPicture: function() {
      var $vm = this;
      var popoverOptions = {
        arrowDir: Camera.PopoverArrowDirection.ARROW_ANY
      };

      if (typeof $vm.boundingRect === 'object') {
        popoverOptions.x = $vm.boundingRect.left;
        popoverOptions.y = $vm.boundingRect.top;
        popoverOptions.width = $vm.boundingRect.width;
        popoverOptions.height = $vm.boundingRect.height;
      }

      return new Promise(function(resolve, reject) {
        navigator.camera.getPicture(resolve, reject, {
          quality: $vm.jpegQuality,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: $vm.cameraSource,
          targetWidth: $vm.customWidth,
          targetHeight: $vm.customHeight,
          popoverOptions: popoverOptions,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true // Corrects Android orientation quirks
        });
      });
    },
    processImage: function(file, addThumbnail) {
      var $vm = this;

      var image = new Image();
      image.onload = function () {
        if (this.height > $vm.customHeight || this.width > $vm.customWidth) {
          $vm.isImageValid = false;
        } else {
          $vm.isImageValid = true;
        }
      };
      image.src = window.URL.createObjectURL(file);

      var mimeType = file.type || 'image/png';
      loadImage.parseMetaData(file, function(data) {
        loadImage(
          file,
          function(img) {
            var imgBase64Url = img.toDataURL(mimeType, $vm.jpegQuality);
            if (addThumbnail) {
              $vm.addThumbnailToCanvas(imgBase64Url);
            }
            $vm.value.push(imgBase64Url);
            $vm.$emit('_input', $vm.name, $vm.value);
          }, {
            canvas: true,
            maxWidth: $vm.customWidth,
            maxHeight: $vm.customHeight,
            orientation: data.exif ?
              data.exif.get('Orientation') : true
          });
      });
    },
    onFileClick: function(event) {
      // Native
      var $vm = this;
      this.value = [];

      // Web
      if (Fliplet.Env.is('web') || !navigator.camera) {
        return;
      }

      var getPicture;
      event.preventDefault();

      if (this.forcedClick) {
        this.forcedClick = false;
        getPicture = $vm.getPicture();
      } else {
        getPicture = this.requestPicture(this.$refs.imageInput).then(function onRequestedPicture() {
          if ($vm.cameraSource === Camera.PictureSourceType.PHOTOLIBRARY) {
            $vm.forcedClick = true;
            $($vm.$refs.imageInput).trigger('click');
            return Promise.reject('Switch to HTML file input to select files');
          }

          return $vm.getPicture();
        });
      }

      getPicture.then(function onSelectedPicture(imgBase64Url) {
        imgBase64Url = (imgBase64Url.indexOf('base64') > -1) ?
          imgBase64Url :
          'data:image/jpeg;base64,' + imgBase64Url;

        $vm.addThumbnailToCanvas(imgBase64Url);
        $vm.value.push(imgBase64Url);
        $vm.$emit('_input', $vm.name, $vm.value);
      }).catch(function(error) {
        console.error(error);
      });
    },
    onFileChange: function() {
      // Cleanup if the user adds new images
      this.value = [];

      for (var i = 0; i < this.$refs.imageInput.files.length; i++) {
        this.processImage(this.$refs.imageInput.files.item(i), i === 0);
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
    addThumbnailToCanvas: function(imageURI) {
      var $vm = this;

      if (!imageURI.match(/^http/)) {
        imageURI = (imageURI.indexOf('base64') > -1)
          ? imageURI
          :'data:image/jpeg;base64,' + imageURI;
      }

      var canvas = this.$refs.canvas;
      var canvasWidth = canvas.clientWidth;
      var canvasHeight = canvas.clientHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      var canvasRatio = canvasWidth / canvasHeight;
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      var img = new Image();
      img.onload = function imageLoadedFromURI() {
        $vm.drawImageOnCanvas(this, canvas);
      };
      img.src = imageURI;
    }
  }
});
