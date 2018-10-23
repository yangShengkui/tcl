define([], function(){
	function baiduMap(callback){
		var url = 'https://api.map.baidu.com/api?v=2.0&ak=NnMW3maSPQGpNrYVkNWGcaF2&s=1';
		//var url = 'https://api.map.baidu.com/getscript?v=2.0&ak=NnMW3maSPQGpNrYVkNWGcaF2&services=&t=20160427155926';
		//var url = 'https://api0.map.bdimg.com/getmodules?v=2.0&t=20140707&mod=local_ilaz5a'
		require([url], function(baiduMap){
			console.log(baiduMap);
			var map = new BMap.Map("container");
			var localSearch = new BMap.LocalSearch(map);
			callback(localSearch);
		}, function(error){
			callback("error");
		});
	}
	return baiduMap;
});