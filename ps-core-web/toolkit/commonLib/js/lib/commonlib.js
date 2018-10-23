(function(window){
	define(function(){
		var lib = {};
		lib.ArrayHandler = ArrayHandler;
		lib.recordListRemap = recordListRemap;
		function ArrayHandler(data){
			var cur = this;
			var current;
			var visible;
			cur.data = data;
			cur.getData = function(){
				return cur.data;
			};
			cur.setCurrent = function(element){
				current = element;
			};
			cur.current = function(){
				return current;
			};
			cur.remove = function(element){
				this.data = this.data.filter(function(elem){
					return elem != element;
				});
			};
			cur.first = function(){
				return cur.data[0];
			};
			cur.show = function(){
				visible = true;
			};
			cur.hide = function(){
				visible = false;
			};
			cur.visible = function(){
				return visible;
			};
			cur.push = function(elem){
				cur.data.push(elem);
			};
			cur.unshift = function(elem){
				cur.data.unshit(elem);
			};
			cur.concat = function(array){
				return cur.data.concat(array)
			};
			cur.each = function(callback){
				for(var i in cur.data){
					if(cur.data.hasOwnProperty(i))
					{
						callback(cur.data[i])
					}

				}
			};
			cur.sortBy = function(name){
				cur.data = cur.data.sort(function(a, b){
					if(a[name] < b[name]){
						return -1;
					}else{
						return 1;
					}
				});
			};
			cur.setAllValue = function(attribute, value){
				for(var i in cur.data){
					(function(elem){
						elem[attribute] = value;
					})(data[i])
				}
			};
			cur.find = function(){
				if(typeof arguments[0] == 'object')
				{
					var argument = arguments[0];
					for(var i in cur.data){
						var result = (function(elem){
							for(var i in argument){
								var pair = (function(attribute, value){
									return elem[attribute] == value;
								})(i, argument[i]);
								if(!pair){
									return undefined;
								}
							}
							return elem;
						})(data[i]);
						if(result){
							return result;
						}
					}
				}
				else if(arguments.length==2)
				{
					var attribute = arguments[0];
					var value = arguments[1]
					for(var i in cur.data){
						var result = (function(elem){
							if(elem[attribute] == value){
								return elem;
							}
						})(data[i]);
						if(result){
							return result;
						}
					}
				}
				else
				{
					alert("参数输入错误")
				}
			};
			cur.findAll = function(attribute, value){
				var result;
				for(var i in cur.data){
					(function(elem){
						if(elem[attribute] == value){
							if(result)
							{
								result.push(elem);
							}
							else
							{
								result = [elem]
							}
						}
					})(data[i]);
				}
				return result;
			}
		};
		if(typeof Array.prototype.find != 'function')
		{
			Array.prototype.find = function(fun)
			{
				var cur = this;
				for(var i in cur)
				{
					if(fun(cur[i]))
					{
						return cur[i];
					}
				}
				return undefined;
			}
			Object.defineProperty(Array.prototype, "find", {
				enumerable: false
			});
		}
		window.$randomString = function(len) {
			len = len || 32;
			var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			var maxPos = $chars.length;
			var pwd = '';
			for (i = 0; i < len; i++) {
				pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
		};
		function recordListRemap(recordList, category){
			var cur = this;
			var MAP_TIME = {
				'category' : 'time',
				'nodeId-instance-kpiname' : 'value'
			};
			var MAP_CI = {
				'category' : 'nodeName',
				'kpiname' : 'value'
			};
			cur.recordList = new ArrayHandler(recordList);
			cur.recordList.each(function(element){
				(function(category){
					if(category == "time"){
						console.log(this);
						for(var key in this){
							(function(key, value){
								if(key=='category'){
									var date = new Date(value);
									this.date = date;
									this.timeStamp = date.getTime();
									this.date = value.split("T")[0];
									this.time = value.split("T")[1];
								}
								else
								{
									var splitKey = key.split("-");
									this.value = value;
									(function(){
										if(arguments.length == 2)
										{
											this.nodeId = parseInt(arguments[0]);
											this.kpiname = arguments[1];
										}
										else if(arguments.length == 3)
										{
											this.nodeId = parseInt(arguments[0]);
											this.instance = arguments[1];
											this.kpiname = arguments[2];
										}
									}).apply(this, splitKey)
								}
							}).call(this, key, this[key]);
						}
					}
					else
					{
						for(var key in this){
							(function(key, value){
								if(key=='category'){
									this.nodename = value;
								}
								else
								{
									this.kpiname = key;
									this.value = value;
								}
							})(key, this[key]);
						}
					}
				}).call(element, category);
			});
			return cur.recordList;
		}
		return lib
	});
})(window);