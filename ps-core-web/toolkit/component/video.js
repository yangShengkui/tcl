/**
 * Created by leonlin on 16/11/3.
 */
define([], function() {
  return function(data) {
    var element = data.element;
    var timeout = data.timeout;
    var autostart = element.$attr("parameters/autostart")
    var innerContent = $("<div id='video'></div>");
    var videotype = element.$attr("parameters/videotype");
    var url = element.$attr("parameters/url");
    var style = element.$attr("style");
    var username = element.$attr("parameters/username");
    var password = element.$attr("parameters/password");
    var geturl = element.$attr("advance/geturl");
    var expression;
    $$.runExpression(element.$attr("advance/expression"), function(funRes) {
      if(funRes.code == "0") {
        var fnResult = funRes.data;
        if(typeof fnResult == 'function') {
          expression = fnResult(data, system);
        } else {
          expression = fnResult;
        }
        expression = expression ? expression : {};
      } else {
        expression = {};
        console.log(funRes.message);
        //throw new Error(funRes.message);
      }
    });
    var initFn = expression.$attr("on/init");
    var render = function(obj) {
      if(videotype == "video") {
        $$.loadExternalJs(["jwplayer"], function() {
          timeout(function() {
            var title = "";
            var player = jwplayer('video').setup({
              file: obj.url,
              width: innerContent.parent().width(),
              height: style ? style.height : 300,
              title: title,
              autostart: autostart,
              aspectratio: '16:9',
              events: {
                onComplete: function() {
                  //getPlayPosition();
                },
                onPause: function() {
                  //getPlayPosition();
                }
              },
              analytics: {
                enabled: true
              },
              provider: "http",
              "http.startparam": "starttime"
            });
          });
        });
      } else if(videotype == "embed") {
        var embed = $("<embed></embed>");
        embed.attr("src", obj.url);
        embed.attr("quality", "high");
        embed.attr("align", "middle");
        embed.attr("width", '100%');
        embed.attr("height", style ? style.height : 300);
        embed.attr("flashvars", "autoplay=true&play=true");
        embed.attr("allowScriptAccess", "always");
        embed.attr("allowFullScreen", true);
        embed.attr("mode", "transparent");
        embed.attr("type", "application/x-shockwave-flash");
        innerContent.append(embed);
      } else if(videotype == "camera") {
        var video = $('<div id="videoPlay"></div>');
        video.css("width", innerContent.parent().width() + "px");
        video.css("height", style ? style.height : 300);
        $$.loadExternalJs(['ckplayer'], function() {
          var flashvars = {
            f: '../../../../toolkit/ckplayer/m3u8.swf',
            a: obj.url,
            c: 0, // 0-使用ckplayer.js的配置 1-使用ckplayer.xml的配置
            p: 1, // 1-默认播放 0-默认暂停
            s: 4, // 4-使用swf视频流插件播放
            lv: 1 // 1-直播 0-普通方式
          };
          var params = {
            bgcolor: '#FFF',
            allowFullScreen: true,
            allowScriptAccess: 'always',
            wmode: 'transparent'
          };
          timeout(function() {
            CKobject.embedSWF("../toolkit/ckplayer/ckplayer.swf", "videoPlay", "video", "100%", "100%", flashvars, params);
          });
        });
        innerContent.append(video);
      } else if(videotype == "live") {
        var live = $('<video id="myPlayer" poster="" controls playsInline webkit-playsinline autoplay></video>');
        timeout(function(){
          live.css("width", innerContent.parent().width() + "px");
          live.css("height", style ? style.height : 300);
          live.attr('src',obj.url);
          innerContent.append(live);
          $$.loadExternalJs(['ezuikit'], function() {
            var player = new EZUIPlayer('myPlayer');
          });
        })
      };
    };
    element.render = render;
    if(initFn) {
      try {
        initFn({
          target: element
        });
      } catch(e) {
        console.log(e);
      };
    } else {
      if(geturl == "fromResource") {
        element.getCurrentResource(function(resource) {
          if(resource) {
            render({
              url: resource.values.VIDEO
            })
          }
        });
      } else {
        render({
          url: url
        });
      };
    };
    return innerContent;
  }
});