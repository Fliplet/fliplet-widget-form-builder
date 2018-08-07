var UPLOADS_FOLDER_NAME = 'Uploaded from Form';

var WEB_SAFE_FONTS = [
  'Arial', 'Arial Black', 'Comic Sans MS', 'Impact', 'Lucida Sans Unicode',
  'Tahoma', 'Trebuchet MS', 'Verdana', 'Helvetica', 'Courier New', 'Lucida Console',
  'Georgia', 'Palatino Linotype', 'Times New Roman'
];

Fliplet.FormBuilder.field('wysiwyg', {
  name: 'WYSIWYG Editor',
  category: 'Advanced',
  props: {
    placeholder: {
      type: String
    },
    rows: {
      type: Number,
      default: 8
    }
  },
  watch: {
    value: function (val) {
      // This happens when the value is updated programmatically via the FormBuilder field().val() method
      if (val !== this.$refs.textarea.value) {
        $(this.$refs.textarea).summernote('code', val);
      }
    }
  },
  methods: {
    onReset: function() {
      $(this.$refs.textarea).summernote('reset');
    }
  },
  mounted: function () {
    var $vm = this;
    var uploadsFolder;
    var toast;

    var appFonts = _.map(Fliplet.Env.get('appFonts') || [], 'name');

    var $el = $(this.$refs.textarea).summernote({
      placeholder: this.placeholder,
      tabsize: 2,
      height: this.rows * 25,
      fontNames: _.uniq(appFonts.concat(WEB_SAFE_FONTS)).sort(),
      fontNamesIgnoreCheck: appFonts,
      toolbar: [
        ['fontStyle', ['bold', 'italic', 'underline']],
        ['paragraphStyle', ['ul', 'ol']],
        ['paragraphStyle', ['ltr', 'rtl']],
        ['insert', ['link']],
        ['cleaner', ['cleaner']]
      ],
      cleaner: {
        icon: '<i class="fa fa-eraser"></i>',
        action: 'both', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
        keepHtml: false,
        keepOnlyTags: ['<p>', '<br>', '<ul>', '<li>', '<b>', '<strong>','<i>', '<a>'], // If keepHtml is true, remove all tags except these
        keepClasses: false, // Remove Classes
        badTags: ['style', 'script', 'applet', 'embed', 'noframes', 'noscript', 'html'], // Remove full tags with contents
        badAttributes: ['style', 'start'], // Remove attributes from remaining tags
        limitChars: false, // 0/false|# 0/false disables option
        limitDisplay: 'both', // text|html|both
        limitStop: false // true/false
      },
      callbacks: {
        onChange: function(contents) {
          $vm.$emit('_input', $vm.name, contents);
        },
        onImageUpload: function(files) {
          var toast;

          Fliplet.UI.Toast({
            message: 'Uploading file...',
            progress: true
          }).then(function (result) {
            toast = result;

            if (uploadsFolder) {
              return;
            }

            return Fliplet.Media.Folders.get().then(function (response) {
              uploadsFolder = _.find(response.folders, { name: UPLOADS_FOLDER_NAME });

              if (uploadsFolder) {
                return;
              }

              return Fliplet.Media.Folders.create({ name: UPLOADS_FOLDER_NAME }).then(function (folder) {
                uploadsFolder = folder;
              });
            });
          }).then(function () {
            var data = new FormData();

            Array.prototype.forEach.call(files, function(file) {
              data.append('image', file);
            });

            return Fliplet.Media.Files.upload({
              data: data,
              folderId: uploadsFolder.id,
              progress: function (percentage) {
                toast.setProgress(percentage/100);
              }
            }).then(function (files) {
              toast.dismiss();
              files.forEach(function (file) {
                var image = document.createElement('img');
                image.src = file.url;
                $el.summernote('insertNode', image);
              });
            });
          }).catch(function (err) {
            console.error(err);
          });
        }
      }
    });

    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    $(this.$refs.textarea).summernote('destroy');
    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});
