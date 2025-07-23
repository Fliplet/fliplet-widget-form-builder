/* global Camera, addThumbnailToCanvas, loadImage */

/**
 * Image field component – renders an image capture and upload input in forms.
 * Supports camera capture, file upload, and image compression options.
 */
Fliplet.FormBuilder.field('image', {
  i18n: window.VueI18Next,
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
    },
    hasCorruptedImage: {
      type: Boolean,
      default: false
    },
    canHide: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    isImageSizeExceeded: {
      type: Boolean,
      default: false
    }
  },
  data: {
    boundingRect: undefined,
    cameraSource: undefined,
    forcedClick: false
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
    Fliplet.Hooks.on('beforeFormSubmit', this.onBeforeSubmit);
  },
  mounted: function() {
    this.drawImagesAfterInit();
  },
  updated: function() {
    this.drawImagesAfterInit();
  },
  destroyed: function() {
    Fliplet.FormBuilder.off('reset', this.onReset);
  },
  methods: {
    removeImage: function(index) {
      var $vm = this;

      // this is used to trigger onChange event even if user deletes and than uploads same image
      $vm.$refs.imageInput.value = null;

      $vm.value.splice(index, 1);

      $vm.value.forEach(function(image, index) {
        addThumbnailToCanvas(image, index, $vm);
      });

      $vm.$emit('_input', $vm.name, $vm.value);
    },
    onReset: function() {
      this.value = [];
      this.$emit('_input', this.name, this.value);
    },
    onBeforeSubmit: function() {
      $(this.$refs.imageInput).parents('.form-group').removeClass('has-error');

      if (!this.required) {
        return;
      }

      if (this.readonly) {
        return;
      }

      if (!this.value.length) {
        $(this.$refs.imageInput).parents('.form-group').addClass('has-error');

        return Promise.reject(T('widgets.form.image.required'));
      }
    },
    validateValue: function() {
      if (typeof this.value === 'string' && this.value) {
        this.value = [this.value];
      }

      if (!Array.isArray(this.value)) {
        this.value = [];
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

      return new Promise(function(resolve) {
        $vm.boundingRect = fileInput.getBoundingClientRect();

        var buttonLabels = [
          T('widgets.form.image.actionLabels.takePhoto'),
          T('widgets.form.image.actionLabels.choosePhoto'),
          T('widgets.form.image.actionLabels.cancel')
        ];

        if (Modernizr.windows) {
          buttonLabels = [
            T('widgets.form.image.actionLabels.takePhoto'),
            T('widgets.form.image.actionLabels.choosePhoto')
          ];
        }

        navigator.notification.confirm(
          T('widgets.form.image.confirmMessage'),
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
          T('widgets.form.image.confirmLabel'),
          buttonLabels
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
          targetWidth: $vm.customWidth || 0, // Setting default value as 0 so that camera plugin API does not fail
          targetHeight: $vm.customHeight || 0,
          popoverOptions: popoverOptions,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true // Corrects Android orientation quirks
        });
      });
    },
    processImage: function(file, addThumbnail) {
      var $vm = this;
      var mimeType = file.type || 'image/png';

      this.validateValue();

      loadImage.parseMetaData(file, function() {
        var options = {
          canvas: true,
          maxWidth: $vm.customWidth,
          maxHeight: $vm.customHeight,
          orientation: 0
        };

        loadImage(file, function(img) {
          if (img.type === 'error') {
            $vm.hasCorruptedImage = true;

            return;
          }

          if (($vm.customWidth && img.width > $vm.customWidth) || ($vm.customHeight && img.height > $vm.customHeight)) {
            $vm.isImageSizeExceeded = true;

            return;
          }

          $vm.hasCorruptedImage = false;
          $vm.isImageSizeExceeded = false;

          var scaledImage = loadImage.scale(img, options);

          scaledImage.toBlob(function(blob) {
            blob.name = file.name;
            $vm.value.push(blob);

            if (addThumbnail) {
              var imgBase64Url = scaledImage.toDataURL(mimeType, $vm.jpegQuality);

              addThumbnailToCanvas(imgBase64Url, $vm.value.length - 1, $vm);
            }

            $vm.$emit('_input', $vm.name, $vm.value);
          }, mimeType, $vm.jpegQuality / 100);
        });
      });
    },
    onFileClick: function(event) {
      // Native
      var $vm = this;

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

      this.validateValue();

      getPicture.then(function onSelectedPicture(imgBase64Url) {
        imgBase64Url = (imgBase64Url.indexOf('base64') > -1)
          ? imgBase64Url
          : 'data:image/jpeg;base64,' + imgBase64Url;

        var arr = imgBase64Url.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        // For Cordova apps when we use new File constructor it is creating instance for cordova-plugin-file
        // So we need to use Blob

        const blob = new Blob([u8arr], { type: mime });

        blob.name = 'image upload-' + Date.now() + '.' + mime.split('/')[1];

        $vm.value.push(blob);
        addThumbnailToCanvas(imgBase64Url, $vm.value.length - 1, $vm);
        $vm.$emit('_input', $vm.name, $vm.value);
      }).catch(function(error) {
      /* eslint-disable-next-line */
        console.error(error);
      });
    },
    onFileChange: function(e) {
      var files = this.$refs.imageInput.files;

      for (var i = 0; i < files.length; i++) {
        this.processImage(files.item(i), true);
      }

      e.target.value = '';
    },
    onImageClick: function(index) {
      var imagesData = {
        images: _.map(this.value, function(img) {
          if (img instanceof Blob) {
            return { url: URL.createObjectURL(img) };
          }

          return { url: img };
        }),
        options: {
          index: index
        }
      };

      Fliplet.Navigate.previewImages(imagesData);
    },
    drawImagesAfterInit: function() {
      if (this.readonly) {
        return;
      }

      var $vm = this;

      $vm.value.forEach(function(image, index) {
        addThumbnailToCanvas(image, index, $vm);
      });
    },
    openFileDialog: function() {
      this.$refs.imageInput.click();
    }
  }
});
