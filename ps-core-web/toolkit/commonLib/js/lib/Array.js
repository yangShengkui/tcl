(function(window){
	/*remove all the element equal the value you provide from a Array*/
	$Date = function(date){
		var rs = new Date(date);
		if(rs == 'Invalid Date')
		{
			var date_safari = date.replace("T", " ").replace(/-/g, "/").split(".")[0];
			rs = new Date(date_safari);
		}
		return rs;
	};
	Function.prototype.$CLASS = function(target) {
		var rs = new this();
		for(var i in target)
		{
			if(target.hasOwnProperty(i))
			{
				rs[i] = target[i]
			}
		}
		return rs;
	};
	Object.prototype.$attr = function() {
		var target = this;
		if(arguments.length == 1)
		{
			var arr = arguments[0].split("/");
			var track = arguments[1];
			if(track == true)
			{
				//console.log(arr);
			}
			for(var i in arr)
			{
				var attr = arr[i];
				if(i < arr.length - 1)
				{
					if(track == true)
					{
						//console.log("$attr", target[attr]);
					}
					if(typeof target[attr] != 'object' || target[attr] == null)
					{
						//console.log('[warning!] ', attr, "is not defined!!");
						target = undefined;
						break;
					}
				}
				target = target[attr]
			}
			return target;
		}
		else if(arguments.length == 2)
		{
			var arr = arguments[0].split("/");
			var value = arguments[1];
			for(var i in arr)
			{
				var attr = arr[i];
				if(i < arr.length - 1)
				{
					if(typeof target[attr] != 'object' || target[attr] == null)
					{
						target[attr] = {};
					}
					target = target[attr]
				}
				else
				{
					target[attr] = value;
				}
			}
		}
	};
	Object.prototype.$init = function() {
		var rs = {};
		if(this.hasOwnProperty('__$CLASS__'))
		{
			rs = eval(this['__$CLASS__']).$CLASS(this);
			//Object.defineProperty(rs, "__$CLASS__", { enumerable : false });
		}
		if(this.hasOwnProperty('__$OBJECT__'))
		{
			rs.$extension(eval(this['__$OBJECT__']));
			//Object.defineProperty(rs, "__$OBJECT__", { enumerable : false });
		}
		if(this.hasOwnProperty('__$ANCHOR__'))
		{
			//Object.defineProperty(rs, "__$ANCHOR__", { enumerable : false });
		}
		rs.traveseByChild(function(element, parent){
			var inx = parent.indexOf(element);
			var target = parent[inx];
			if(element.hasOwnProperty('__$CLASS__'))
			{
				parent[inx] = eval(element['__$CLASS__']).$CLASS(element);
				//Object.defineProperty(parent[inx], "__$CLASS__", { enumerable : false });
			}
			if(element.hasOwnProperty('__$OBJECT__'))
			{
				parent[inx].$extension(eval(element['__$OBJECT__']));
				//Object.defineProperty(parent[inx], "__$OBJECT__", { enumerable : false });
			}
			if(element.hasOwnProperty('__$ANCHOR__'))
			{
				//Object.defineProperty(parent[inx], "__$ANCHOR__", { enumerable : false });
			}
		});
		return rs;
	}
	Object.prototype.$find = function(callback) {

	};
  Array.prototype.$sum = function(callcack){
    var sum = 0;
    for(var i in this){
      sum += callcack(this[i]);
    }
    return sum;
  };
	Array.prototype.$remove = remove;
  function remove() {
    var callback = arguments[0];
    var removeOnlyfirstfind = arguments[1];
    if(typeof callback == 'function')
    {
      for(var i in this)
      {
        if(this.hasOwnProperty(i))
        {
          if(callback(i, this[i]))
          {
            if(removeOnlyfirstfind)
            {
              callback = function(){
                return false;
              }
            }
            delete this[i];
          }
        }
      }
      reOrder.call(this);
    }
    else
    {
      throw new Error("callback is not a function!")
    }
  };
	function reOrder() {
		var inx = 0;
		for(var i in this)
		{
			if(this.hasOwnProperty(i))
			{
				var temp = this[i];
				delete this[i];
				this[inx] = temp;
				inx++;
			}
		}
		this.length = inx;
		Object.defineProperty(this, 'length', {
			enumerable : false
		})
	};
  var ArrElement = function(elem){
    this.$clone(elem);
  };
  ArrElement.prototype.remove = function(){
    var parent = this.parent;
    remove.call(parent, function(index, elem){
      return elem == this;
    });
  };
  window.$Array = function(array){
    for(var i= 0; i<array.length; i++){
      Object.defineProperty(array[i], "parentArr", {
        enumerable : false,
        value : array
      })
      array[i] = new ArrElement(array[i]);
    }
  };
  window.$Array.prototype.remove = remove;
	/** define Object Method clone*/
	/** make duplication of a object*/
	Array.prototype.$clone = clone;
	Object.prototype.$clone = clone;
	function clone(/*Object*/) {
		var cur = this;
		if(arguments.length == 0) {
			return getSelfclone(); /*return object*/
		} else if(arguments.length == 1) {
			if(typeof arguments[0] == 'object') {
				cloneTargetObject.call(this, arguments[0]); /*return object*/
			} else {
				//throw new Error('target is not a object!!');
			}
		} else {
			throw new Error('no more than 1 parameters allowed.');
		}
		function getSelfclone() {
			var result = new cur.constructor();
			traverse(result, cur)
			return result;
		}
		function cloneTargetObject(targetObject) {
			clear.call(this);
			traverse(this, targetObject);
		}
		function clear() {
			for(var i in this) {
				if(this[i].hasOwnProperty(i)) {
					delete this[i];
				}
			}
		}
		function traverse(target, children) {
			var inx = 0;
			for(var i in children) {
				if(typeof children[i] == 'object' && children[i] != null && !(children[i] instanceof Date)) {
					var constructor = children[i].constructor;
					if(children.hasOwnProperty(i)) {
						target[i] = new constructor();
						traverse(target[i], children[i]);
					}
				} else if(children[i] != undefined && children[i] != null) {
					if(children.hasOwnProperty(i)) {
						target[i] = children[i];
					}
				}
				inx++ ;
			}
			if(children instanceof Array) {
				target.length = inx;
				Object.defineProperty(target, 'length', {
					enumerable : false
				})
			}
		}
	};
	/** define Object Method $extension*/
	/** extend the value of a object*/
	Object.prototype.$extension = function(/*Object*/)
	{
		var cur = this;
		var data = arguments[0];
		traverse(this, data);
		return this;
		function traverse(target, children)
		{
			for(var i in children)
			{
				if(target[i] == undefined)
				{
					target[i] = {};
				}
				if(typeof children[i] == 'object' && children[i] instanceof Array)
				{
					if(children.hasOwnProperty(i)) {
						target[i] = [];
						traverse(target[i], children[i]);
					}
				}
				else if(typeof children[i] == 'object' && typeof children[i] != null)
				{
					if(children.hasOwnProperty(i)) {
						traverse(target[i], children[i]);
					}
				}
				else if(children[i] != undefined)
				{
					if(children.hasOwnProperty(i))
					{
						target[i] = children[i];
					}
				}
			}
		}
	};
  Object.prototype.$remapByChild = function(callback)
  {
    var rs = callback(this);
    traverse(this.children, rs.children);
    function traverse(data, target){
      for(var i in data) {
        target[i] = callback(data[i]);
        if(data[i].children) {
          if(target[i].children == undefined){
            target[i].children = []
          }
          traverse(data[i].children, target[i].children)
        }
      }
    }
    return rs;
  };
  Object.prototype.$recreateByChild = function(callback)
  {
    var cb = callback(this);
    this.$clone(cb);
    traverse(this.children, this.children);
    function traverse(data, target){
      for(var i in data) {
        target[i] = callback(data[i]);
        if(data[i].children) {
          if(target[i].children == undefined){
            target[i].children = []
          }
          traverse(data[i].children, target[i].children)
        }
      }
    };
  };
	/* define Object Method traverse*/
	/* visit every objects inside their parent object*/
	Object.prototype.traveseByChild = function(callback){
		callback(this, [this]);
		traverse(this.children);
		function traverse(data){
			for(var i in data)
			{
				callback(data[i], data);
				if(data[i].children)
				{
					traverse(data[i].children)
				}
			}
		}
	};
	Array.prototype.insertBefore = function(index, value)
	{
		var find = false;
		var length = this.length;
		var clone = [];
		for(var j in this)
		{
			clone[j] = this[j];
		}
		for(var i in this)
		{
			if(i == index)
			{
				this[i] = value;
			}
			else if( i > index)
			{
				this[i] = clone[i - 1]
			}
		}
		this[length] = clone[length - 1];
	};
	/* define Object Method traverse*/
	/* visit every objects inside their parent object*/
	Object.prototype.traverse = function(callback)
	{
		traverse(this);
		function traverse(children)
		{
			for(var i in children)
      {
        if(typeof children[i] == 'object'){
          //console.log(children[i]);
        }
        //console.log(children[i] instanceof Array,typeof children[i] == 'object', !(children[i] instanceof Array));
				if(typeof children[i] == 'object' && children[i] != null && children.hasOwnProperty(i))
				{
					children[i].parent = children;
					Object.defineProperty(children[i], "parent", {
						enumerable : false
					});
					callback(i, children[i]);
					traverse(children[i]);
				}
			}
		}
		return clone;
	};
	/* define Object Method extend*/
	/* extend a object*/
  /**
	Object.prototype.extend = function(data) {
		var clone = this.clone();
		if(typeof data == 'object') {
			for(var i in data) {
				if(data.hasOwnProperty(i)) {
					clone[i] = data[i];
				}
			}
		} else {
			throw new Error('parameter is not a object!!');
		}
		return clone;
	};
   */
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
	}
	for(var i in Array.prototype)
	{
		Object.defineProperty(Array.prototype, i, {
			enumerable : false
		});
	}
	for(var j in Object.prototype)
	{
		Object.defineProperty(Object.prototype, j, {
			enumerable : false
		});
	}
  /**
	window.$Array = function(data){
		var cur = this;
		var current;
		var visible;
		cur.data = data;
		cur.values = function(){
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
		cur.indexOf = function(index){
			return cur.data[index];
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
				if(cur.data.hasOwnProperty(i)){
					callback(cur.data[i])
				};
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
	};*/
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
	window.$valueListGroup = function(data, minTimespan, formatStr){
		var cur = this;
		var startTime = Infinity;
		var endTime = 0;
		var xAxis_time =[];
		var xAxis_ci =[];
		var legend = [];
		var dimensionByKpi, dimensionByCi;
		cur.eachValueListMerged = function(callback){
			data.each(function(element){
				callback(element)
			})
		};
		cur.getLegend = function(){
			return legend;
		};
		cur.getxAxisByTime = function(){
			var result = [];
			new $Array(data.first().valueList).each(function(element){
				result.push($formatDate(new Date(element.timeStamp), formatStr));
			});
			return result;
		};
		cur.getxAxisByCi = function(){
			return xAxis_ci;
		};
		cur.getValueByIndex = function(index){
			return data.indexOf(index);
		};
		cur.demensionByKpi = function(callback){

		};
		cur.demensionByCi = function(callback){

		};
		data.each(function(groupValue){
			var length = groupValue.valueList.length;
			var timeSpan = parseInt((groupValue.valueList[length - 1].timeStamp - groupValue.valueList[0].timeStamp) / length);
			legend.push(groupValue.nodeDes.label + "-" + groupValue.kpiDes.label);
			xAxis_ci.push(groupValue.nodeDes.label + "-" + groupValue.kpiDes.label);
			if(minTimespan < timeSpan){
				minTimespan = timeSpan;
			}
			if(startTime > groupValue.valueList[0].timeStamp){
				startTime = groupValue.valueList[0].timeStamp;
			}

			if(endTime < groupValue.valueList[length - 1].timeStamp){
				endTime = groupValue.valueList[length - 1].timeStamp;
			}
		});
		for(var i=startTime; i<= endTime; i += minTimespan){
			var date = new Date(i);
			xAxis_time.push($formatDate(date, formatStr));
			data.each(function(groupValue){
				var st = i;
				var et = i + minTimespan;
				var sum = 0;
				var length = 0;
				groupValue.$valueList = groupValue.valueList;
				/*
				 for(var j in groupValue.valueList){
				 if((groupValue.valueList[j].timeStamp >= st) && (groupValue.valueList[j].timeStamp <= et)){
				 sum += parseInt(groupValue.valueList[j].value);
				 length++;
				 }
				 }
				 if(groupValue.$valueList){
				 groupValue.$valueList.push(parseInt(sum / length));
				 }
				 else
				 {
				 groupValue.$valueList = [parseInt(sum / length)];
				 }
				 */
			});
		}
		dimensionByKpi = new $Array([]);
		data.each(function(groupValue){
			var kpiId = groupValue.kpicode;
			var find = dimensionByKpi.find("kpiCode", kpiId);
			if(find)
			{
				for(var i in groupValue.$valueList)
				{
					if(typeof find.$valueList[i] == Array)
					{
						find.$valueList[i].push(groupValue.$valueList[i])
					}
					else
					{
						find.$valueList[i] = [find.$valueList[i], groupValue.$valueList[i]];
					}
				}
			}
			else
			{
				dimensionByKpi.push(JSON.parse(JSON.stringify(groupValue)));
			}
		});
		dimensionByCi = new $Array([]);
		data.each(function(groupValue){
			var nodeId = groupValue.nodeId;
			var find = dimensionByCi.find("nodeId", nodeId);
			if(find)
			{
				for(var i in groupValue.$valueList)
				{
					if(typeof find.$valueList[i] == Array)
					{
						find.$valueList[i].push(groupValue.$valueList[i])
					}
					else
					{
						find.$valueList[i] = [find.$valueList[i], groupValue.$valueList[i]];
					}
				}
			}
			else
			{
				dimensionByCi.push(JSON.parse(JSON.stringify(groupValue)));
			}
		});
	};
	window.$formatDate = function(date, formatStr){
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var dt = date.getDate();
		var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
		var minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
		var second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
		if(date == 'Invalid Date')
		{
			return "-";
		}
		else
		{
			switch(formatStr){
				case "月日":
					return (month + "/" + dt);
					break;
				case "年月日":
					return (year + "/" + month + "/" + dt);
					break;
				case "年月日时":
					return (year + "/" + month + "/" + dt + " , " + hour);
					break;
				case "年月日时分":
					return (year + "/" + month + "/" + dt + " , " + hour + ":" + minute);
					break;
				case "时分秒":
					return (hour + ":" + minute + ":" + second);
					break;
				case "时分":
					return (hour + ":" + minute);
					break;
				case "分秒":
					return (minute + ":" + second);
					break;
				case "年月日时分秒":
					return (year + "/" + month + "/" + dt + " , " + hour + ":" + minute + ":" + second);
					break;
				default :
					return (year + "/" + month + "/" + dt);
					break;
			}
		}
	}
	window.$option = function(data){
		var cur = this;
		var option = data;
		var template = JSON.parse(JSON.stringify(option.series[0]));
		cur.setTitle = function(title){
			option.title.text = title;
		};
		cur.setLegend = function(legend){
			option.legend.data = legend;
		};
		cur.eachSeries = function(callback){
			for(var i in option.series){
				callback(i, option.series[i])
			}
		};
		cur.firstSeries = function(callback){
			return option.series[0]
		};
		cur.clearSeries = function(){
			option.series = [];
		}
		cur.pushSeries = function(name, data){
			var clone = JSON.parse(JSON.stringify(template));
			clone.name = name;
			clone.data = data;
			option.series.push(clone);
		}
		cur.setFirstxAxis = function(data){
			option.xAxis[0].data = data;
		}
		cur.getOption = function(){
			return option;
		}
	}
})(window);