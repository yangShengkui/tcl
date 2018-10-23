var fs = require("fs"),
  dir = "" /** String */,
  _paths = ["controllers", "services", "directives", "filters"],
  _targetPath = "" /** string */,
  _solutionPath = "solution/",
  promises = [] /** Array */;
dir = getCurrentDir();
_targetPath = dir + "module.config.js"
function getCurrentDir(){
  var d = __dirname.indexOf(_solutionPath) != -1 ? __dirname.split(_solutionPath)[0] : __dirname;
  return d + "/";
}
function removeExtname(str){
  if(str.indexOf(".js") != -1){
    return str.split(".js")[0];
  } else {
    return str
  }
}
function convertFilePath(path){
  return path;
}
promises = _paths.map(function(path){
  return new Promise(function(resolve, reject){
    path = convertFilePath(path);
    console.log(dir + path);
    fs.readdir(dir + path, function(err, files){
      files = files != undefined ? files : [];
      files = files.map(function(e){
        return removeExtname(e);
      })
      resolve(files || []);
    });
  });
});
Promise.all(promises).then(function(path){
  console.log(path);
  function pathsToString(pth){
    if(pth.length > 0){
      return "\"" + pth.toString() + "\"";
    } else {
      return ""
    }
  }
  var define = "define({\n\
    controllers : [" + pathsToString(path[0]) + "],\n\
    services : [" + pathsToString(path[1]) + "],\n\
    directives : [" + pathsToString(path[2]) + "]\n\
    filters : [" + pathsToString(path[3]) + "]\n\
  })";
  writeFile(define, function(data){
    console.log("文件写入成功", data);
  })
});
function writeFile(text, callback){
  fs.writeFile(_targetPath, text,  function(err) {
    if (err) {
      return console.error(err);
    };
    fs.readFile(_targetPath, function (err, data) {
      if (err) {
        return console.error(err);
      }
      callback(data.toString());
    });
  });
};
