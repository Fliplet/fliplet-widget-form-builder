/* global Camera, addThumbnailToCanvas, loadImage, dataURLToBlob */

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
        var isCamera = $vm.cameraSource === Camera.PictureSourceType.CAMERA;

        navigator.camera.getPicture(resolve, reject, {
          quality: $vm.jpegQuality,
          destinationType: isCamera
          ? Camera.DestinationType.FILE_URI
          : Camera.DestinationType.DATA_URL,
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

      this.validateValue();

      loadImage.parseMetaData(file, function() {
        var options = {
          canvas: true,
          maxWidth: $vm.customWidth,
          maxHeight: $vm.customHeight,
          orientation: 0
        };

        loadImage(file, async function(img) {
          if (img.type === 'error') {
            $vm.hasCorruptedImage = true;

            return;
          }

          $vm.hasCorruptedImage = false;


          var scaledImage = loadImage.scale(img, options);

          // Always convert resized images to JPEG on web for consistency with native
          const jpegMimeType = 'image/jpeg';
          const imgBase64Url = scaledImage.toDataURL(jpegMimeType, $vm.jpegQuality);

          try {
            const blob = dataURLToBlob(imgBase64Url);

            // Ensure the file name extension matches the JPEG MIME type
            const blobExtension = (blob.type && blob.type.split('/')[1]) || 'jpeg';
            if (file && file.name) {
              blob.name = file.name.replace(/\.[^/.]+$/, '') + '.' + blobExtension;
            } else {
              blob.name = 'image-' + Date.now() + '.' + blobExtension;
            }

            $vm.value.push(blob);

            if (addThumbnail) {
              addThumbnailToCanvas(imgBase64Url, $vm.value.length - 1, $vm);
            }

            $vm.$emit('_input', $vm.name, $vm.value);
          } catch (error) {
            $vm.hasCorruptedImage = true;

            return;
          }
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

      if (this.forcedClick) {
        this.forcedClick = false;
        return;
      }

      event.preventDefault();

      getPicture = this.requestPicture(this.$refs.imageInput).then(function onRequestedPicture() {
        if ($vm.cameraSource === Camera.PictureSourceType.PHOTOLIBRARY) {
          $vm.forcedClick = true;

          // Use native element click so the OS file picker opens reliably
          if ($vm.$refs.imageInput && typeof $vm.$refs.imageInput.click === 'function') {
            $vm.$refs.imageInput.click();
          } else {
            $($vm.$refs.imageInput).trigger('click');
          }

          return Promise.reject('Switch to HTML file input to select files');
        }

        return $vm.getPicture();
      });

      this.validateValue();

      getPicture.then(function onSelectedPicture(result) {
        // If we receive a FILE_URI (native camera/gallery), resolve it to a File to preserve the original name
        if (typeof result === 'string' && (/^(file:|content:|cdvfile:)/i).test(result)) {
          return new Promise(function(resolveFile, rejectFile) {
            // Cordova File API: resolve URI to FileEntry → File object
            window.resolveLocalFileSystemURL(result, function(entry) {
              try {
                entry.file(function(file) {
                  resolveFile(file);
                }, rejectFile);
              } catch (e) {
                rejectFile(e);
              }
            }, rejectFile);
          }).then(function(file) {
            // Use existing pipeline which keeps base name and switches extension to jpeg
            $vm.processImage(file, true);
          }).catch(function(err){
            /* eslint-disable-next-line */
            console.error('Failed to resolve file from URI', err);
            // Fallback: mark as corrupted
            $vm.hasCorruptedImage = true;
          });
        }

        // Fallback for legacy base64 results
        var imgBase64Url = (typeof result === 'string' && result.indexOf('base64') > -1)
          ? result
          : 'data:image/jpeg;base64,' + result;

        try {
          const blob = dataURLToBlob(imgBase64Url);
          blob.name = 'image upload-' + Date.now() + '.' + blob.type.split('/')[1];
          $vm.value.push(blob);
          addThumbnailToCanvas(imgBase64Url, $vm.value.length - 1, $vm);
          $vm.$emit('_input', $vm.name, $vm.value);
        } catch (e) {
          /* eslint-disable-next-line */
          console.error('Failed to parse base64 image', e);
          $vm.hasCorruptedImage = true;
        }
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
