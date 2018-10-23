define(['../services/services.js'], function(services) {
  'use strict';
  services.factory('fuploader', ['FileUploader', 'configUIService', 'growl',
    function(FileUploader, configUIService, growl) {
      var param = {
        domainPath: "",
        groupName: "dashboardImage",
        id: 0,
        invalid: false,
        key: "",
        keyDesc: "",
        label: "",
        value: ""
      };
      var fileFormat = "|jpg|png|jpeg|bmp|gif|svg|";
      var queueLimit = 1;
      var fileMaxSize = configUIService.baseConfig && configUIService.baseConfig.modelUploadConfig ? (configUIService.baseConfig.modelUploadConfig.fileSize ? configUIService.baseConfig.modelUploadConfig.fileSize : 1) : 1;
      var uploader = new FileUploader({
        url: configUIService.origin + '/api/rest/uploadConfig/configUIService/uploadConfigFile',
        withCredentials: true
      });
      var events = {};
      var fuploader = function(){
        uploader.filters.push({
          name: 'imageFilter',
          fn: function(item /*{File|FileLikeObject}*/ , options) {
            var nameAry = item.name.split(".");
            var type = nameAry[nameAry.length - 1];
            if(fileFormat.indexOf(type) == -1) {
              growl.warning("文件格式仅支持" + fileFormat + "文件，请重新选择", {});
              return false;
            }
            if((item.size / 1024) > fileMaxSize * 1000) {
              growl.warning("您选择的文件大于" + fileMaxSize + "M，请重新选择", {});
              return false;
            }
            return true;
          }
        });
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
          console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {

        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
          console.info('onCompleteItem', response);
          if(response) {
            if(response.code == 0) {
              var url = response.data;
              param.value = url;
              growl.success("图片上传成功", {});
              configUIService.saveConfig(param, function(resultObj) {
                events['fileUploadComplete'](resultObj);
              });
            } else {
              growl.error(response.message, {});
            };
          } else {
            growl.error("操作异常了，尝试重新刷新", {});
          }
        };
      };
      fuploader.prototype.on = function(eventName, callback){
        events[eventName] = callback;
      };
      fuploader.prototype.uploadFile = function(file, callback){
        events['fileUploadComplete'] = callback;
        uploader.clearQueue();
        uploader.addToQueue(file);
        if(uploader.queue.length > 0){
          var que = uploader.queue[0];
          param.label = que.file.name;
          configUIService.saveConfig(param, function(resultObj) {
            if(resultObj.code == 0) {
              var id = resultObj.data.id;
              param.id = id;
              que.formData = [{
                value: 'images/dashboardImage',
                id: id
              }];
              que.upload();
            }
          });
        }
      };
      return new fuploader();
    }
  ]);
});