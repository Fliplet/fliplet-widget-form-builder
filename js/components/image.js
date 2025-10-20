/* global Camera, addThumbnailToCanvas, loadImage, dataURLToBlob */

const MAX_IMAGE_WIDTH = 3000;
const MAX_IMAGE_HEIGHT = 3000;

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
    const rules = {
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
      const $vm = this;

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
      const $vm = this;
      let boundingRect = fileInput.getBoundingClientRect();

      while (boundingRect.width === 0 || boundingRect.height === 0) {
        if (!fileInput.parentNode) {
          break;
        }

        fileInput = fileInput.parentNode;
        boundingRect = fileInput.getBoundingClientRect();
      }

      return new Promise(function(resolve) {
        $vm.boundingRect = fileInput.getBoundingClientRect();

        let buttonLabels = [
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
      const $vm = this;
      const popoverOptions = {
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
    processImage: async function(file, addThumbnail = true) {
      const $vm = this;
      try {
        // Validate current value before adding new images
        this.validateValue();

        // Parse EXIF metadata (orientation, etc.)
        await new Promise((resolve) => loadImage.parseMetaData(file, resolve));

        const options = {
          canvas: true,        // use canvas to manipulate the image
          maxWidth: $vm.customWidth || MAX_IMAGE_WIDTH,
          maxHeight: $vm.customHeight || MAX_IMAGE_HEIGHT,
          orientation: 0       // set to 0 by default; can read EXIF if needed
        };
    
        // Load the image into a canvas
        const img = await new Promise((resolve) => loadImage(file, resolve, options));
    
        if (!img || img.type === 'error') {
          $vm.hasCorruptedImage = true;
          console.error('Failed to load image', file.name);
          return;
        }
    
        $vm.hasCorruptedImage = false;
    
        // Convert the canvas to a WebP Blob
        const blob = await new Promise((resolve) => {
          img.toBlob(
            (b) => resolve(b),
            'image/webp',             // Changed to WebP
            $vm.jpegQuality || 0.8    // Compression quality (0–1)
          );
        });
    
        if (!blob) {
          $vm.hasCorruptedImage = true;
          console.error('Blob creation failed for', file.name);
          return;
        }
    
        // Assign proper filename and extension
        const blobExtension = (blob.type && blob.type.split('/')[1]) || 'webp';
        blob.name = file.name
          ? file.name.replace(/\.[^/.]+$/, '') + '.' + blobExtension
          : 'image-' + Date.now() + '.' + blobExtension;
    
        // Add the blob to the component's value
        $vm.value.push(blob);
    
        // Generate thumbnail if needed
        if (addThumbnail) {
          const reader = new FileReader();
          reader.onload = function (e) {
            addThumbnailToCanvas(e.target.result, $vm.value.length - 1, $vm);
          };
          reader.readAsDataURL(blob); // Convert blob to base64 for thumbnail preview
        }
    
        // Emit the updated value for parent component
        $vm.$emit('_input', $vm.name, $vm.value);
    
      } catch (err) {
        $vm.hasCorruptedImage = true;
        console.error('Error processing image', file.name, err);
      }
    },    
    onFileClick: function(event) {
      // Native
      const $vm = this;

      // Web
      if (Fliplet.Env.is('web') || !navigator.camera) {
        return;
      }

      let getPicture;

      if (this.forcedClick) {
        this.forcedClick = false;
        try {
          getPicture = $vm.getPicture();
        } catch (error) {
          console.error('Failed to get picture', error);
        }

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
          })
            .then(function(file) {
            // Read the Cordova File as ArrayBuffer
              return new Promise(function(resolve, reject) {
                const reader = new FileReader();

                reader.onloadend = function() {
                  resolve({
                    arrayBuffer: reader.result,
                    name: file.name,
                    type: file.type || 'image/jpeg'
                  });
                };

                reader.onerror = function(err) {
                  reject(err);
                };

                reader.readAsArrayBuffer(file);
              });
            })
            .then(function({ arrayBuffer, name, type }) {
            // Create a proper Blob from the raw bytes
              const blob = new Blob([arrayBuffer], { type });

              blob.name = name || 'image-' + Date.now() + '.jpg';

              // Use existing pipeline
              $vm.processImage(blob, true);
            })
            .catch(function(err) {
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
      const files = this.$refs.imageInput.files;

      for (let i = 0; i < files.length; i++) {
        this.processImage(files.item(i), true);
      }

      e.target.value = '';
    },
    onImageClick: function(index) {
      const imagesData = {
        images: this.value.map(function(img) {
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

      const $vm = this;

      $vm.value.forEach(function(image, index) {
        addThumbnailToCanvas(image, index, $vm);
      });
    },
    openFileDialog: function() {
      this.$refs.imageInput.click();
    }
  }
});
