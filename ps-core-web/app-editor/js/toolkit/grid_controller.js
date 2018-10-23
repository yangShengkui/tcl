define(["jquery", "jquery-ui"],function($){
	var grid = {};
	var callback = []
	$.fn.extend({
		connect : '',
		id : 0,
		gridCreator : function(param1, param2, param3){
			var current = this;
			if(param1 == "option")
			{
				if(param3)
				{
					eval(param2)(current, param3);
				}
				else
				{
					eval(param2 + "(current)");
				}
			}
			else
			{
				$.each(current.find(".toolBox"), function(index, element){
					$(element).draggable({
						tolerance: "pointer",
						helper: "clone",
						connectToSortable : ".inner_ul",
					});
				});
			}
		},
		gridReceiver : function(param1, param2, param3, param4){
			var current = this;
			current.attr("gridReceiver", "gr_" + randomString(32));
			var current = this;
			if(param1 == "option")
			{
				if(param4)
				{
					return eval(param2)(current, param3, param4);
				}
				else if(param3)
				{
					eval(param2)(current, param3);
				}
				else
				{
					return  eval(param2 + "(current)");
				}
			}
			else
			{
				add(current);
				$("ul#all").sortable({
					scroll : false,
					tolerance: "pointer",
					placeholder : "inner_placeholder",
					handle : ".inner_handler",
					stop : function(event, ui){
						calculateBlockPos(current);
					}
				});
				callback[0] = param1.stop;
				callback[1] = param1.change;
				callback[2] = param1.delete;
			}
		},
		lineCreator : function(param1, param2, param3){
			var current = this;
			if(param1 == "option")
			{
				if(param3)
				{
					eval(param2 + "(current," + param3 + ")");
				}
				else
				{
					eval(param2 + "(current)");
				}
			}
			else
			{

			}
		},
		boxCreator : function(param1, param2, param3){
			var current = this;
			if(param1 == "option")
			{
				if(param3)
				{
					eval(param2 + "(current," + param3 + ")");
				}
				else
				{
					eval(param2 + "(current)");
				}
			}
			else
			{

			}
		}
	});
	function rearrangeEmpty(current){
		$("li.inner.empty").remove();
		current.gridReceiver("option", "add");
	}
	function addDefaultItem(current){
		var inner_li = $("<li class='inner_li'></li>");
		var li_handler = $("<div class='li_handler'></div>");
		var li_close = $("<div class='li_close'><span class='glyphicon glyphicon-remove'></span></div>");
		var li_content = $("<div class='li_content'></div>");
		var resizeOption = {
			containment: "#grid_receiver",
			minWidth : 50,
			create : function(event, ui)
			{
				inner_li.find(".ui-resizable-e").css("background-color" , "rgba(0,0,0,.1)");
				inner_li.find(".ui-resizable-e").addClass("cursorMove");
				inner_li.find(".ui-resizable-s").css("display" , "block");
				inner_li.find(".ui-resizable-se").css("display" , "none");
			},
			resize : resize
		}
		li_handler.append(li_close);
		inner_li.append(li_handler);
		inner_li.append(li_content);
		inner_li.attr("id", "li_" + randomString(32));
		li_close.on("mousedown", function(event){
			event.stopPropagation();
		});
		li_close.on("click", function(event){
			event.stopPropagation();
			callback[2]([inner_li]);
			inner_li.remove();
			calculateBlockPos(current);
			callback[1]();

		});
		inner_li.resizable(resizeOption);
		function resize(event, ui)
		{
			var totalWidth = $(event.target).parent().width() - 5;
			var lis = $(event.target).parent().find("li.inner_li");
			var fixwidth = 0;
			var nextwidth = 0;
			var currentWidth = $(event.target).width();
			var inx = 0;
			var needToResize = (function(){
				var result;
				$.each(lis, function(index, element){
					if($(element).attr("id") == $(event.target).attr("id"))
					{
						result = '';
					}
					else
					{
						if(result == undefined)
						{
							fixwidth += $(element).width();
						}
						else if(result == '')
						{
							result = $(element);
							inx++;
						}
						else
						{
							fixwidth += $(element).width();
							inx++;
						}
					};
				});
				return result;
			})();
			inner_li.resizable({
				maxWidth : (inx > 0) ? (totalWidth - fixwidth - 50) : undefined
			});
			if(needToResize)
			{
				if(totalWidth - fixwidth > 50)
				{
					needToResize.width(totalWidth - (fixwidth + currentWidth));
				}
			}
			callback[1]();
		}
		return inner_li;
	}
	function add(current, outerli, inner_li){
		var verticalMoveColor;
		var inner_ul;
		current.id ++;
		if(outerli)
		{
			outerUl = outerli;
			inner_ul = $(outerUl).find(".inner_ul");
		}
		else
		{
			if(inner_li) {
				var outerUl = $("<li class='inner'></li>");
			}else{
				var outerUl = $("<li class='inner empty'></li>");
			}
			var out_close = $("<div class='out_close'><span class='glyphicon glyphicon-remove'></span></div>");
			var div_handler = $("<div class='inner_handler'></div>");
			var div_wrap = $("<div class='inner_content_wrap'></div>");
			inner_ul = $("<ul class='inner_ul'></ul>");
			inner_ul.attr("id", "ul_" + randomString(32));
			outerUl.append(div_handler).append(div_wrap);
			div_wrap.append(inner_ul);
			div_handler.append(out_close);
			current.find("ul.all").append(outerUl);
			out_close.on("mousedown", function(event){
				event.stopPropagation();
			});
			out_close.on("click", function(event){
				event.stopPropagation();
				var result = []
				outerUl.find("li.inner_li").each(function(index, element){
					result.push($(element));
				});
				callback[2](result);
				outerUl.remove();
			});
			inner_ul.sortable({
				scroll : false,
				cursor: "move",
				handle : ".li_handler",
				connectWith : ".inner_ul",
				placeholder : "li_placeholder",
				tolerance: "pointer",
				cursorAt: { top : 20, left: 0 },
				start : start,
				update : update,
				over : over,
				out : out,
				stop : stop,
				create : create,
				deactivate : deactivate,
				activate : active,
				receive : receive,
				opacity :.8
			});
			outerUl.resizable({
				containment: "#grid_receiver",
				minHeight : 50,
				create : function(event, ui){
					outerUl.find(".ui-resizable-s").css("background-color" , verticalMoveColor);
					outerUl.find(".ui-resizable-s").addClass("cursorMove_s");
					outerUl.find(".ui-resizable-e").css("display" , "block");
					outerUl.find(".ui-resizable-se").css("display" , "block");
				},
				resize : function(){
					callback[1]();
				}
			});
		}
		if(inner_li)
		{
			inner_ul.append(inner_li);
			verticalMoveColor = "rgba(0,0,0,.1)";
		}
		else
		{
			verticalMoveColor = "transparent";
		}

		function change(event, ui)
		{
			var linum = 0;
			$.each($(event.target).find("li.inner_li:not(.ui-sortable-helper)"), function(index, element){
				if($(element).css("display") != "none"){
					linum ++;
				};
			});
			var placeholder = $(event.target).find("li.li_placeholder").length;
			var len = linum + placeholder;
			var pers = 100 / len;
			$(event.target).find(".inner_li").css("width", inner_ul.width() * pers / 100 + "px");
			$(ui.helper).css("width", outerli.width() * pers / 100 + "px");
			$(event.target).find("li.li_placeholder").css("width", (inner_ul.width() * pers / 100 - 2) + "px)");
		}
		function sort(event, ui)
		{
		}
		function receive(event, ui){
			$(event.target).find("div.toolBox").remove();
		}
		function deactivate(event, ui){
		}
		function active(event, ui){
		}
		function receive(event, ui){
		}
		function update(event, ui){
			callback[1]();
		}
		function start(event, ui){
			var linum = 0;
			$.each($(event.target).find("li.inner_li:not(.ui-sortable-helper)"), function(index, element){
				if($(element).css("display") != "none"){
					linum ++;
				};
			});
			//$(".ui-resizable-handle").css("pointer-events", "none");
			var placeholder = $(event.target).find("li.li_placeholder").length;
			var len = linum + placeholder - 1;
			var pers = 100 / len;
			$(event.target).find(".inner_li").css("width", inner_ul.width() * pers / 100 + "px");
			$(ui.helper).css("width", inner_ul.width() * pers / 100 + "px");
			$(event.target).find("li.li_placeholder").css("width", (inner_ul.width() * pers / 100 - 2) + "px)");
		}
		function create(event, ui){
		}
		function over(event, ui){
			var linum = 0;
			var parent = $(event.target).parents();
			var height = parent.height();
			$.each($(event.target).find("li.inner_li:not(.ui-sortable-helper)"), function(index, element){
				if($(element).css("display") != "none"){
					linum ++;
				};
			});
			var placeholder = $(event.target).find("li.li_placeholder").length;
			var len = linum + placeholder;
			var pers = 100 / len;
			event.stopPropagation();
			$(event.target).find(".inner_li").css("width", inner_ul.width() * pers / 100 + "px");
			$(ui.helper).css({
				"width" : inner_ul.width() * pers / 100 + "px",
				"height" : inner_ul.height() + "px",
				"background-color" : "transparent",
				"border" : "1px dashed #444"
			});
			$(event.target).find("li.li_placeholder").css("display", "block");
			$(event.target).find("li.li_placeholder").css("width", (inner_ul.width() * pers / 100 - 2) + "px");
			$(event.target).find("li.li_placeholder").height(height);
			callback[1]();
		}
		function out(event, ui){
			$.each($(".inner_ul"), function(index, element){
				var linum = 0;
				var len;
				$.each($(element).find("li.inner_li:not(.ui-sortable-helper)"), function(index, elem){
					if($(elem).css("display") != "none"){
						linum ++;
					};
				});
				len = linum;
				var pers = 100 / len;
				$(element).find(".inner_li").css("width", inner_ul.width() * pers / 100 + "px");
				$(element).find("li.li_placeholder").css("width", inner_ul.width() * pers / 100 + "px");
				$(ui.helper).css("width", inner_ul.width() * pers / 100 + "px");
			});
			$(event.target).find("li.li_placeholder").css("display", "none");
			callback[1]();
		}
		function stop(event, ui){
			calculateBlockPos(current);
			callback[1]();
		}
		function update(event, ui){
			$(event.target).find(".ui-sortable-helper").remove();
			var parent = $(event.target).parents();
			var height = parent.height();
			var len = $(event.target).find(".inner_li:not(.ui-sortable-helper)").length;
			if(len)
			{
				var pers = 100 / len;
				$(event.target).find(".inner_li").css({
					"width" : inner_ul.width() * pers / 100 + "px"
				});
			}
			else
			{
			}
		}
		return outerUl;
	}
	function calculateBlockPos(current){
		var widthAll = $("ul.all").width() - 20;
		$("ul.all").find("li.inner").each(function(index, element){
			var row = index;
			var col;
			var innerli_list = [];
			$(element).find("ul.inner_ul").find(".toolBox").each(function(index, element){
				var clone = addDefaultItem(current);
				var source = $(element);
				$(element).after(clone);
				$(element).remove();
				callback[0](source, clone);
			});
			$(element).find("ul.inner_ul").find(".inner_li.ui-sortable-helper").remove();
			$(element).find("ul.inner_ul").find(".inner_li:not(.ui-sortable-helper)").each(function(index, element){
				col = index;
				if($(element).css("display")!="none"){
					$(element).attr({
						row : row,
						col : col
					});
					innerli_list.push(element);
				}
			});
			var len = innerli_list.length;
			if(len > 0){
				var pers = 100 / len;
				$(element).find("ul.inner_ul").find(".inner_li").css("width", (widthAll * pers / 100 - 1) + "px");
			}
			else
			{
				$(element).remove();
			}
			var height = $(element).height();
			$(element).css("height", height + "px");
			$(element).removeClass("empty");
		});
		add(current);
		$(".all").find();
	}
	function randomString(len) {
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		var maxPos = $chars.length;
		var pwd = '';
		for (i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	}
	return grid;
})
