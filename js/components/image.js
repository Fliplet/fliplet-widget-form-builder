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
  // `data` must be a function: Vue.component() shares a plain object across every
  // instance of the field, so two image fields on one form would overwrite each
  // other's state. isFileSizeExceeded is transient UI state and deliberately not a
  // prop - props are owned by the saved field configuration, so the parent
  // re-render triggered by onFileChange() would reset it before it could render.
  data: function() {
    return {
      boundingRect: undefined,
      cameraSource: undefined,
      forcedClick: false,
      isFileSizeExceeded: false,
      isTotalSizeExceeded: false,
      oversizedFileNames: []
    };
  },
  computed: {
    maxFileSizeLabel: function() {
      return Fliplet.FormBuilderUtils.maxFileSizeLabel();
    },
    maxTotalSizeLabel: function() {
      return Fliplet.FormBuilderUtils.maxTotalSizeLabel();
    },
    oversizedFileList: function() {
      return this.oversizedFileNames.join(', ');
    }
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
    // Normalize the value to ensure it's always an array
    this.validateValue();
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

      // Normalize the value to ensure it's an array
      this.validateValue();

      // Filter out empty strings, null, undefined, and other falsy values
      const validImages = this.value.filter(function(img) {
        return img !== null && img !== undefined && img !== '';
      });

      if (!validImages.length) {
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
        const isCamera = $vm.cameraSource === Camera.PictureSourceType.CAMERA;

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

          return;
        }

        // Assign proper filename and extension
        const blobExtension = (blob.type && blob.type.split('/')[1]) || 'webp';

        blob.name = file.name
          ? file.name.replace(/\.[^/.]+$/, '') + '.' + blobExtension
          : 'image-' + Date.now() + '.' + blobExtension;

        // Size gate lives here, not at the call sites, because this blob is what
        // actually goes on the wire (PS-2112). The selected file is resized to
        // maxWidth/maxHeight and re-encoded to WebP above, so gating on the raw
        // File refused a 600 MB photo that uploads as a ~1 MB WebP the server
        // accepts without complaint — while the size that IS uploaded went
        // unchecked. Every entry point (onFileChange, the Cordova URI path,
        // onSelectedPicture) funnels through here, so one check covers them all.
        if (Fliplet.FormBuilderUtils.isFileSizeExceeded(blob)) {
          $vm.isFileSizeExceeded = true;
          $vm.oversizedFileNames.push(blob.name);

          return;
        }

        // Individually-valid images can still overflow the request: the API's
        // checkRequestBodySize measures the whole multipart envelope. $vm.value
        // holds previously-processed blobs plus already-uploaded URLs, and only
        // the blobs are counted (see fileByteSize in js/libs/utils.js).
        if (Fliplet.FormBuilderUtils.isTotalSizeExceeded($vm.value.concat([blob]))) {
          $vm.isTotalSizeExceeded = true;

          return;
        }

        // Add the blob to the component's value
        $vm.value.push(blob);

        // Generate thumbnail if needed
        if (addThumbnail) {
          const reader = new FileReader();

          reader.onload = function(e) {
            addThumbnailToCanvas(e.target.result, $vm.value.length - 1, $vm);
          };

          reader.readAsDataURL(blob); // Convert blob to base64 for thumbnail preview
        }

        // Emit the updated value for parent component
        $vm.$emit('_input', $vm.name, $vm.value);
      } catch (err) {
        $vm.hasCorruptedImage = true;
      }
    },
    onFileClick: function(event) {
      // Native
      const $vm = this;

      // Web
      if (Fliplet.Env.is('web') || !navigator.camera) {
        return;
      }

      event.preventDefault();

      let getPicture;

      // Re-entry from the jQuery trigger('click') in the PHOTOLIBRARY branch
      // below. jQuery's trigger fires the JS click event without opening the
      // browser's native file picker, so this branch is responsible for opening
      // the Cordova picker and its result must flow through onSelectedPicture
      // below — do NOT early-return here (PS-1978).
      if (this.forcedClick) {
        this.forcedClick = false;
        getPicture = $vm.getPicture();
      } else {
        getPicture = this.requestPicture(this.$refs.imageInput).then(function onRequestedPicture() {
          if ($vm.cameraSource === Camera.PictureSourceType.PHOTOLIBRARY) {
            $vm.forcedClick = true;

            // jQuery trigger — re-enters onFileClick without opening the
            // browser's native file picker (which is unreliable from this
            // async context in Android WebView).
            $($vm.$refs.imageInput).trigger('click');

            return Promise.reject('Switch to HTML file input to select files');
          }

          return $vm.getPicture();
        });
      }

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

              // Clear any previous warning, then let processImage gate this on the
              // compressed blob (PS-2112) — a gallery pick can be far larger than
              // what it uploads as, so checking the raw capture here would refuse
              // images the server would accept.
              $vm.isFileSizeExceeded = false;
              $vm.isTotalSizeExceeded = false;
              $vm.oversizedFileNames = [];

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
        const imgBase64Url = (typeof result === 'string' && result.indexOf('base64') > -1)
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

      const $vm = this;

      this.isFileSizeExceeded = false;
      this.isTotalSizeExceeded = false;
      this.oversizedFileNames = [];

      // Deliberately no size check on the raw selection (PS-2112). processImage
      // resizes to maxWidth/maxHeight and re-encodes to WebP, so the selected
      // file's size says nothing about what gets uploaded — a 600 MB photo can
      // land as a ~1 MB WebP. The gate lives in processImage, on the blob that
      // is actually sent.
      for (let i = 0; i < files.length; i++) {
        $vm.processImage(files.item(i), true);
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
