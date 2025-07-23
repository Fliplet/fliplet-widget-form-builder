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
          destinationType: Camera.DestinationType.FILE_URI, // Changed from DATA_URL
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

          // Convert canvas to blob instead of base64
          scaledImage.toBlob(function(blob) {
            // Create a File object from the blob
            var processedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now()
            });

            // Store the File object directly instead of base64
            $vm.value.push(processedFile);

            // Create base64 for thumbnail display only
            if (addThumbnail) {
              var imgBase64Url = scaledImage.toDataURL(mimeType, $vm.jpegQuality / 100);

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
          return $vm.getPicture();
        });
      }

      this.validateValue();

      getPicture.then(function onSelectedPicture(fileUri) {
        console.log('Received file URI:', fileUri);

        // Convert file URI to File object
        var fileName = fileUri.split('/').pop() || 'camera-image.jpg';
        var mimeType = 'image/jpeg'; // Default for camera captures

        // Handle different URI schemes
        if (fileUri.startsWith('file://')) {
          // Use Cordova File API for file:// URLs
          if (window.resolveLocalFileSystemURL) {
            $vm.convertFileUriToFile(fileUri, fileName, mimeType).then(function(file) {
              $vm.value.push(file);

              // Create base64 for thumbnail
              var reader = new FileReader();

              reader.onload = function(e) {
                addThumbnailToCanvas(e.target.result, $vm.value.length - 1, $vm);
              };

              reader.readAsDataURL(file);

              $vm.$emit('_input', $vm.name, $vm.value);
            }).catch(function(error) {
              console.error('Error processing file URI:', error);

              // Fallback: try to use the fileUri as base64 if it contains base64 data
              if (fileUri.indexOf('base64') > -1) {
                $vm.value.push(fileUri);
                addThumbnailToCanvas(fileUri, $vm.value.length - 1, $vm);
                $vm.$emit('_input', $vm.name, $vm.value);
              }
            });
          } else {
            console.warn('Cordova File plugin not available, falling back to base64');

            // Fallback for when Cordova File plugin is not available
            if (fileUri.indexOf('base64') > -1) {
              $vm.value.push(fileUri);
              addThumbnailToCanvas(fileUri, $vm.value.length - 1, $vm);
              $vm.$emit('_input', $vm.name, $vm.value);
            } else {
              console.error('Unable to process file URI without Cordova File plugin');
            }
          }
        } else {
          // Use fetch for other URLs (data: URLs, http URLs, etc.)
          fetch(fileUri)
            .then(function(response) {
              return response.blob();
            })
            .then(function(blob) {
              var file = new File([blob], fileName, {
                type: mimeType,
                lastModified: Date.now()
              });

              $vm.value.push(file);

              // Create base64 for thumbnail
              var reader = new FileReader();

              reader.onload = function(e) {
                addThumbnailToCanvas(e.target.result, $vm.value.length - 1, $vm);
              };

              reader.readAsDataURL(file);

              $vm.$emit('_input', $vm.name, $vm.value);
            })
            .catch(function(error) {
              console.error('Error processing camera image:', error);
            });
        }
      }).catch(function(error) {
        // Only log actual errors, not intentional rejections for photo library
        if (error !== 'Switch to HTML file input to select files') {
          console.error(error);
        }
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
        images: _.map(this.value, function(item) {
          // Handle File objects by creating temporary URLs
          if (item instanceof File) {
            return { url: URL.createObjectURL(item) };
          }

          // Handle existing base64/URL strings
          return { url: item };
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
    },
    convertFileUriToFile: function(fileUri, fileName, mimeType) {
      return new Promise(function(resolve, reject) {
        window.resolveLocalFileSystemURL(fileUri, function(fileEntry) {
          fileEntry.file(function(file) {
            // Create a new File object with the desired name and type
            var reader = new FileReader();

            reader.onload = function(e) {
              var arrayBuffer = e.target.result;
              var blob = new Blob([arrayBuffer], { type: mimeType });
              var newFile = new File([blob], fileName, {
                type: mimeType,
                lastModified: Date.now()
              });

              resolve(newFile);
            };

            reader.onerror = function(error) {
              reject(error);
            };

            reader.readAsArrayBuffer(file);
          }, function(error) {
            reject(error);
          });
        }, function(error) {
          reject(error);
        });
      });
    }
  }
});
