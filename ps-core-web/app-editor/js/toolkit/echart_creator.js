define(function(){
		var eventList = [];
		var ec = {};
		ec.on = onEvent;
		ec.resize = resize;
		ec.setOption = setOption;

		(function(){
			this.init = function(domElement, option, theme, type, callback, error_callback){
				
				require(["echarts"], function(echarts_v3){
					var themePath = "../bower_components/echarts/theme/" + theme + ".js";
					require([themePath],
						function () {
							var target  = echarts_v3.init(domElement, theme);
							target.setOption(option);
							callback(target);

						},
						function(error){
							eventList[1]({
								errorMsg : "加载echarts Ver3组建失败",
								error : error
							});
						}
					);
				}, function(error){
					if(eventList[1])
					{
						eventList[1]({
							errorMsg : "加载echarts Ver3失败",
							error : error
						});
						error_callback({
							errorMsg : "加载echarts Ver3失败",
							error : error
						})
					}
				});
			};
			this.preload = function(){
				require(["echarts"], function(ec3){
				}, function(error){
				});
			}
			this.setTheme = function(tg, theme, option, merge, callback){
				var themePath = "../bower_components/echarts/theme/" + theme + ".js";
				require(["echarts"], function(echarts) {
					require(
						[themePath],
						function () {
							var dom = tg.getDom();
							tg.dispose();
							tg = echarts.init(dom, theme);
							tg.setOption(option, merge);
							if (callback) {
								callback({
									target: tg
								});
							}
						}, function(error){
							if(eventList[1])
							{
								eventList[1]({
									errorMsg : "加载echarts Ver3失败",
									error : error
								});
							}
						}
					);
				});
			}
		}).call(ec)
		
		function onEvent(handler, callback){
			switch(handler){
				case "saveImage":
					eventList[0] = callback;
					break;
				case "error" :
					eventList[1] = callback;
				default :
					break;
			}
		}
		function resize(tg)
		{
			tg.resize();
		}
		function setOption(tg, option, merge)
		{
			tg.setOption(option, merge);
		}
		return ec;
	}
)