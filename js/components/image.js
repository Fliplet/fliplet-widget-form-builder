/* global Camera, addThumbnailToCanvas, loadImage */

/**
 * Image field component – renders an image capture and upload input in forms.
 * Supports camera capture, file upload.
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

      $vm.announceAction(`Image ${index + 1} removed`, 2000);
    },

    onReset: function() {
      this.value = [];
      this.$emit('_input', this.name, this.value);

      this.announceStatus('Image upload reset', 1500);
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

        this.announceError('Image upload is required', 3000);

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

                $vm.announceStatus('Camera selected for image capture', 2000);

                return resolve();
              case 2:
              default:
                $vm.cameraSource = Camera.PictureSourceType.PHOTOLIBRARY;

                $vm.announceStatus('Photo library selected for image selection', 2000);

                return resolve();
              case 3:
                $vm.announceStatus('Image selection cancelled', 1500);

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
          var imgBase64Url = scaledImage.toDataURL(mimeType, $vm.jpegQuality);
          var flipletBase64Url = imgBase64Url + ';filename:' + file.name;

          $vm.value.push(flipletBase64Url);

          if (addThumbnail) {
            addThumbnailToCanvas(flipletBase64Url, $vm.value.length - 1, $vm);
          }

          $vm.$emit('_input', $vm.name, $vm.value);

          $vm.announceAction(`Image ${file.name} processed and added`, 2000);
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

        $vm.value.push(imgBase64Url);
        addThumbnailToCanvas(imgBase64Url, $vm.value.length - 1, $vm);
        $vm.$emit('_input', $vm.name, $vm.value);

        $vm.announceAction('Image captured and added', 2000);
      }).catch(function(error) {
        $vm.announceError('Failed to capture image', 3000);

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

      if (files.length > 0) {
        this.announceStatus(`${files.length} image${files.length !== 1 ? 's' : ''} selected`, 2000);
      }
    },

    onImageClick: function(index) {
      var imagesData = {
        images: _.map(this.value, function(imgURL) {
          return { url: imgURL };
        }),
        options: {
          index: index
        }
      };

      this.announceStatus(`Opening image ${index + 1} in preview`, 1500);

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
      this.announceStatus('Opening image selection dialog', 1500);
      this.$refs.imageInput.click();
    },

    // Add method to handle keyboard navigation for remove buttons
    handleRemoveKeyDown: function(event, index) {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();

          if (!this.readonly) {
            this.removeImage(index);
          }

          break;
        default:
          break;
      }
    }
  }
});
