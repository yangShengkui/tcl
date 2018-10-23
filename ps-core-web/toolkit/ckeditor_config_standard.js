CKEDITOR.plugins.add('myplugin', {
  init: function(editor) {
    var getFuncNum = function(url) {
      console.log("getFuncNum== " + url);
      var reParam = new RegExp('(?:[\?&]|&amp;)CKEditorFuncNum=([^&]+)', 'i');
      var match = url.split("api/");
      return match[0];
    };
    var getAjaxResult = function(t) {
      var _id = this.getId();
    }

    CKEDITOR.dialog.add('myAddImage', function(editor) {
      return {
        title: ' Adding pictures  ',
        minWidth: 400,
        minHeight: 200,
        contents: [{
          id: 'addImage',
          label: ' Adding pictures  ',
          title: ' Adding pictures  ',
          filebrowser: 'uploadButton',
          elements: [{
            id: 'txtUrl',
            type: 'text',
            label: ' 图片地址 ',
            required: true
          }, {
            id: 'file',
            type: 'file',
            label: ' Upload a picture  ',
            style: 'height:40px',
            size: 38
          }, {
            type: 'fileButton',
            id: 'uploadButton',
            label: ' Upload  ',
            filebrowser: {
              action: 'QuickUpload',
              //target : 'info:src',
              params: {
                type: 'Files',
                currentFolder: '/folder/'
              },
              target: 'addImage:txtUrl',
              onSelect: function(fileUrl, errorMessage) {

                console.log("fileUrl====" + fileUrl);
              }
            },
            onClick: function() {
              var d = this.getDialog();
              var _photo = d.getContentElement('addImage', 'file');

              console.log("_photo== " + _photo);
              _funcNum = getFuncNum(_photo.action);
              var _iframe = CKEDITOR.document.getById(_photo._.frameId);
              _iframe.on('load', getAjaxResult, _iframe, _funcNum);
            },
            'for': ['addImage', 'file']
          }]
        }],
        onOk: function() {
          _src = this.getContentElement('addImage', 'txtUrl').getValue();
          if(_src.match(/(^\s*(\d+)((px)|\%)?\s*$)|^$/i)) {
            alert('请输入网页或上传文件的网址');
            return false;
          }
          this.imageElement = editor.document.createElement('img');
          this.imageElement.setAttribute('alt', '插入图片');
          this.imageElement.setAttribute('src', _src);
          // Insert a picture into an editor editor
          editor.insertElement(this.imageElement);
        }
      };
    });
    editor.addCommand('myImageCmd', new CKEDITOR.dialogCommand('myAddImage'));
    editor.ui.addButton('AddImage', {
      label: ' Picture  ',
      icon: 'images/images.jpg', //toolbar On the address icon  , To upload a picture to the images under
      command: 'myImageCmd'
    });
  },
  requires: ['dialog']
});

CKEDITOR.editorConfig = function(config) {
  config.language = 'zh-cn';
  config.image_previewText = ''; //清空image图片里面的无用英文
  config.stylesSet = 'my_styles';
  config.extraPlugins = 'myplugin'; //非默认 仅示例

};