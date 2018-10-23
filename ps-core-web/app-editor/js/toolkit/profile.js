define(["jquery", "jquery-ui", "static", "echart_creator", "grid_controller", 'Array'], callback);
function callback(jquery, jui, st, ec, grid_controller, lib) {
	if(typeof $.fn.find != 'function')
	{
		$.fn.find = $.fn.filter;
	}
	var profile = {};
	var currentProfile;
	var idList = [];
	var drag_placeholder;
	var editBtn_click_event;
	var resBtn_click_event;
	var codeBtn_click_event;
	var saveImage_event;
	var onErrorEvent;
	var elementList = new $Array([]);
	var idid = 0;
	var oldSelect;
	var chartChangeEvent;
	var resourceChanged;
	var onChartInit;
	profile.on = onEvent;
	profile.createNewProfile = createNewProfile;
	profile.getElementList = getElementList;
	profile.getChartTitle = getChartTitle;
	profile.renderGraphList = renderGraphList;
	profile.createChart = createChart;
	profile.addNewLabel = addNewLabel;
	profile.renderPreview = renderPreview;
	ec.preload();
	ec.on("saveImage", function(event, toolbox){
		saveImage_event(event, toolbox);
	});
	ec.on("error", function(event){
		onErrorEvent(event);
	});
	function addNewLabel(label){
		var currentProfile = $("[currentProfile=true]");
		currentProfile.find("#HeaderInput").val(label);
	};
	function createChart(type, option, dataType){
		var gr = $(document).find("#grid_receiver");
		var clone = gr.gridReceiver("option", "addDefaultItem");
		var handler = clone.find(".li_handler")
		var li_content = clone.find(".li_content");
		var tmpHtml = '';
		var tmpHtml2 = '';
		var element;
		var element2;
		var row;
		if(typeof $("ul#all").find)
		{
			row = $("ul#all").find("li.inner:not(.empty)").length;
		}
		else
		{
			row = $("ul#all li.inner:not(.empty)").length;
		}

		eval("option = st." + option);
		tmpHtml += "<div class='coverbg'></div>";
		tmpHtml += "<div class='noData'>\
                        <table>\
                            <td>没有数据</td>\
                        </table>\
                    </div>\
                    <div class='loading'>\
                        <table style='width : 100%; height : 100%'><td style='text-align:center; vertical-align:middle;'><div class='loadingIcon'></div></td></table>\
                    </div>\
                    <div class='edit'>\
                </div>";
		tmpHtml += "</li>";
		tmpHtml2 += "<button class='codeBtn btn btn-default'>代码</button>\
                    <button class='editBtn btn btn-default'>样式</button>\
                    <button class='resources btn btn-default'>数据</button>";
		element = $(tmpHtml);
		element2 = $(tmpHtml2);
		clone
			.attr({
				row : row,
				col : 0
			})
			.css({
				width : "100%",
			});
		handler.append(element2);
		li_content.append(element);
		gr.gridReceiver("option", "add", undefined, clone);
		clone.parent().parent().parent().css("height", dataType.height ? dataType.height : 300);
		clone.chartCreator(type, option, undefined, undefined, undefined, undefined, undefined, dataType);
		gr.gridReceiver("option", "rearrangeEmpty");
		elementList.push(clone);
	};
	function getElementList(){
		return elementList;
	}
	function getChartTitle(){
		var currentProfile = $("[currentProfile=true]");
		if(currentProfile.find)
		{
			return currentProfile.find("#HeaderInput").val();
		}
		else
		{
			return  $("[currentProfile=true] #HeaderInput").val();
		}
	}
	function onEvent(eventName, callback) {
		switch (eventName) {
			case "editBtn_click":
				editBtn_click_event = callback;
				break;
			case "resBtn_click":
				resBtn_click_event = callback;
				break;
			case "codeBtn_click":
				codeBtn_click_event = callback;
				break;
			case "saveImage":
				saveImage_event = callback;
				break;
			case "chartChanged":
				chartChangeEvent = callback;
				break;
			case "resourceChanged":
				resourceChanged = callback;
				break;
			case "chartInit":
				onChartInit = callback;
				break;
			case "onError":
				onErrorEvent = callback;
				break;
			default:
				break;
		}
	}
	function renderPreview(data){
		$("#preview").html('');
		for(var i in data){
			var row = $("<div class='rowcls'></div>");
			$("#preview").append(row);
			for(var j in data[i].children){
				var col = $("<div class='colcls'></div>");
				var option = data[i].children[j].option;
				var type = data[i].children[j].type;
				var width = data[i].children[j].layout.width;
				var height = 1200 * width / 100 * data[i].children[j].layout.widthheightPortion;
				var theme = data[i].children[j].theme;
				col.css({
					width : width + "%",
					height : height
				});
				row.append(col);
				ec.init(col[0], option, theme, type);

			}
		}
	}
	function renderGraphList(title, content, callback){
		var gr = $("#grid_receiver");
		changeTitleText(title);
		for(var i in content){
			var outul;
			for(var j in content[i].children){
				(function(){
					var tmpHtml = '';
					var tmpHtml2 = '';
					var element;
					var element2;
					var clone = gr.gridReceiver("option", "addDefaultItem");
					var handler, li_content;
					if(typeof clone.find == 'function')
					{
						handler = clone.find(".li_handler");
						li_content = clone.find(".li_content");
					}
					else
					{
						handler = clone.filter(".li_handler");
						li_content = clone.filter(".li_content");
					}


					var option = content[i].children[j].option;
					var modelId = content[i].children[j].modelId;
					var type = content[i].children[j].type;
					var data = content[i].children[j].data;
					var width = content[i].children[j].layout ? content[i].children[j].layout.width : 100;
					var height = gr.width() * width / 100 * (content[i].children[j].layout ? content[i].children[j].layout.widthheightPortion :.4);
					var theme = content[i].children[j].theme;
					var kpis = content[i].children[j].kpis;
					var nodes = content[i].children[j].nodes;
					var dataType = content[i].children[j].dataType;
					var timespan = parseInt(content[i].children[j].timespan / 60000);
					var formatStr = content[i].children[j].formatStr;
					if(dataType.type == "pie_2chart"){
						option.series[0].itemStyle.normal.label.position = "inner";
						option.series[0].itemStyle.normal.label.formatter = function (params) {
							return (params.percent - 0).toFixed(0) + '%'
						}
						option.series[1].itemStyle.normal.label.formatter = function (params) {
							return (params.percent - 0).toFixed(0) + '%'
						}
					}
					clone
						.attr({
							row : i,
							col : j
						})
						.css({
							width : width + "%",
							height : height
						});
					if(j == 0){
						outul =  gr.gridReceiver("option", "add", undefined, clone);
					}
					else
					{
						gr.gridReceiver("option", "add", outul, clone);
					}
					tmpHtml += "<div class='coverbg'></div>";
					tmpHtml += "<div class='noData'>\
                        <table>\
                            <td>没有数据</td>\
                        </table>\
                    </div>\
                    <div class='loading'>\
                        <table style='width : 100%; height : 100%'><td style='text-align:center; vertical-align:middle;'><div class='loadingIcon'></div></td></table>\
                    </div>\
                    <div class='edit'>\
                </div>";
					tmpHtml += "</li>";
					tmpHtml2 += "<button class='codeBtn btn btn-default'>代码</button>\
                    <button class='editBtn btn btn-default'>样式</button>\
                    <button class='resources btn btn-default'>数据</button>";
					element = $(tmpHtml);
					element2 = $(tmpHtml2);
					handler.append(element2);
					li_content.append(element);
					clone.chartCreator(type, option, data, nodes, kpis, theme, timespan, dataType, modelId, formatStr, function(event){
						callback(clone);
					});
					clone.parent().parent().parent().css("height", height);
					elementList.push(clone);
				})();
			}
		}
		gr.gridReceiver("option", "rearrangeEmpty");
	}
	function changeTitleText(text)
	{
		var target = $("[currentprofile=true] input#HeaderInput");
		target.val(text);
	}
	function createNewProfile(data) {
		var elementHtml;
		var newProf;
		var window_width = $(window).width();
		var window_height = $(window).height();
		var prof_width = window_width * .6;
		var prof_height = window_height * .8;
		var id = idList.length;
		elementHtml = "<div id='prof_" + idList.length + "' class='prof'>";
		elementHtml += "<div class='prof-header'>";
		elementHtml += "</div>";
		elementHtml += "<div id='chartHeader'>";
		elementHtml += "<input id='HeaderInput' value='新建运营分析视图' placeholder='新建运营分析视图'/>";
		elementHtml += "</div>";
		elementHtml += "<div id='grid_receiver'><ul id='all' class='all'></ul></div>";
		//elementHtml += "<div id='testtest'><li style='width : 100px; height : 100px; background-color: red;'></li><li style='width : 100px; height : 100px; background-color: red;'></li></div>";
		elementHtml += "</div>"
		newProf = $(elementHtml);
		$("#draw-area").append(newProf);
		newProf.css({
			"width": prof_width,
			opacity: 1
		});
		currentProfile = newProf.attr({
			"currentProfile": true
		});
		$("#testtest").sortable();

		var grid_receiver = $("#grid_receiver");
		var grid_creator = $("#grid_creator");
		grid_creator.gridCreator({
			connect : "grid_receiver"
		});
		grid_receiver.gridReceiver({
			stop : function(source, target){
				var type = source.attr("toolbar_id").split("toolbar_")[1];
				var handler, content;
				if(typeof target.find == 'function')
				{
					var handler = target.find(".li_handler");
					var content = target.find(".li_content");
				}
				else
				{
					var handler = target.find(".li_handler");
					var content = target.find(".li_content");
				}
				var obj = target;
				var tmpHtml = '';
				var tmpHtml2 = '';
				var element;
				var element2;
				var dataType = JSON.parse(source.attr("dataType"));
				var option;
				var optionStr = source.attr("option");
				var height = dataType.height ? dataType.height : target.parent().find(".inner_li").height();
				eval("option = st." + option);
				tmpHtml += "<div class='coverbg'></div>";
				tmpHtml += "<div class='noData'>\
                        <table>\
                            <td>没有数据</td>\
                        </table>\
                    </div>\
                    <div class='reList'>\
                    	<div class='row resourseSel' style='display : none;'>\
                    		<div style='width : 20%; float : left; text-align:center;'>\
													<span class='addOn'>设备</span>\
												</div>\
												<div style='width : 80%; float : left;'>\
													<select id='resourcesList' class='form-control'></select>\
												</div>\
                    	</div>\
                    </div>\
                    <div class='loading'>\
                        <table style='width : 100%; height : 100%'><td style='text-align:center; vertical-align:middle;'><div class='loadingIcon'></div></td></table>\
                    </div>\
                    <div class='edit'>\
                </div>";
				tmpHtml += "</li>";
				tmpHtml2 += "<button class='codeBtn btn btn-default'>代码</button>\
                    <button class='editBtn btn btn-default'>样式</button>\
                    <button class='resources btn btn-default'>数据</button>";
				element = $(tmpHtml);
				element2 = $(tmpHtml2);
				handler.append(element2);
				content.append(element);
				if(dataType.type == "tab")
				{
					obj.chartTab(type, option, undefined, undefined, undefined, undefined, undefined, dataType);
				}
				else
				{
					obj.chartCreator(type, option, undefined, undefined, undefined, undefined, undefined, dataType);
				}
				elementList.push(obj);
			},
			delete : function(event){
				for(var i in event){
					var id = event[i].attr("id");
					elementList.each(function(element){
						if(id == element.attr("id")){
							elementList.remove(element);
						}
					});
				}
			},
			change : function(){
				elementList.each(function(element){
					element.resizeEchart();
				});
			}
		});
		idList.push(newProf);
		for (var i in idList) {
			idList[i].css({
				"z-index": i,
			})
		}
		newProf
			.on("mousedown", profMouseDown)
			.resizable();
		$("#image").toolbarDraggableCreator(300, 300);
		$("#text").toolbarDraggableCreator(250, 50);
		$("#return").toolbarDraggableCreator(700, 10);
		$("#line").toolbarDraggableCreator(newProf.width() *.7, newProf.width() *.4);
		$("#bar").toolbarDraggableCreator(newProf.width() *.7, newProf.width() *.4);
		$("#pie").toolbarDraggableCreator(newProf.width() *.7, newProf.width() *.4);
		$("#gauge").toolbarDraggableCreator(newProf.width() *.7, newProf.width() *.4);
		function profMouseDown(event) {
			event.stopPropagation();
			for (var i in idList) {
				idList[i].css({
					"z-index": i,
				})
			};
			$("#draw-area").find("[id*=prof_]").attr("currentProfile", false);
			currentProfile = newProf;
			newProf.attr("currentProfile", true).css({
				"z-index": 80,
			});
		}
		function receiveFromOuter(event, ui) {
			var sender_id = ui.sender.attr("id");
			switch (sender_id) {
				case "image":
					dragImageEnd();
					break;
				case "text":
					dragTextEnd();
					break;
				case "return":
					dragReturnEnd();
					break;
				case "line":
					dragLineEnd();
					break;
				case "bar":
					dragBarEnd();
					break;
				case "pie":
					dragPieEnd();
					break;
				case "gauge":
					dragGaugeEnd();
					break;
				default:
					break;
			}
		}
		function dragImageEnd() {
			var target;
			var needtoeplace = sortable.find(".leftBar-item");
			var tmpHtml = "";
			tmpHtml += "<li class='item'>";
			tmpHtml += "<div class='imageControl'>";
			tmpHtml += "<canvas id='uploadImage'></canvas>"
			tmpHtml += "<p class='tips'>您可选择拖拽图片或</p>";
			tmpHtml += "<button class='uploadBtn'>上传图片</button>";
			tmpHtml += "</div>";
			tmpHtml += "</li>"
			var element = $(tmpHtml);
			element.insertBefore(needtoeplace).css({
				"width": "300px",
				"height": "300px"
			});
			var canvas = element.find("canvas#uploadImage")[0];
			var img = element.find("img#getImage");
			canvas.addEventListener("dragover", function(evt) {
					evt.preventDefault();
				},
				false);
			canvas.addEventListener("drop", function(evt) {
					evt.preventDefault();
					evt.stopPropagation();
					var files = evt.dataTransfer.files;
					if (files.length > 0) {
						var file = files[0];
						if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
							var reader = new FileReader();
							reader.onload = loadComplete;
							reader.readAsDataURL(file);
							function loadComplete(evt) {
								element.find("div.imageControl").css({
									"background-image": "url(" + evt.target.result + ")",
								})
								$(".tips").css("display", "none");
								$(".uploadBtn").css("display", "none");
							}
						}
					}
				},
				false)
			needtoeplace.remove();
			element.resizable({
				stop: resizeEnd,
				helper: "help-placeholder"
			});
			function resizeEnd(event, ui) {}
		}
		function dragTextEnd() {
			var target;
			var needtoeplace = sortable.find(".leftBar-item");
			var tmpHtml = "";
			tmpHtml += "<li class='item'>";
			tmpHtml += "<table class='textControl'><td>";
			tmpHtml += "</td></table>"
			tmpHtml += "</li>";
			var innerTxt = $("<p class='innerTxt'>请点击此处编辑文字</p>");
			var editInput = $("<input class='editInput'/>");
			var element = $(tmpHtml);
			var tcontrol = element.find('table.textControl td');
			tcontrol.append(innerTxt);
			tcontrol.on('click', tcontrol_click);
			function tcontrol_click(event) {
				event.stopPropagation();
				innerTxt.remove();
				editInput.val(innerTxt.text());
				tcontrol.append(editInput);
				editInput.focus();
				editInput.on("keypress", function(event) {
					if (event.charCode == 13) {
						editInput.blur();
					}
				});
				editInput.on("blur", function() {
					innerTxt.text(editInput.val());
					editInput.remove();
					tcontrol.append(innerTxt);
					tcontrol.on('click', tcontrol_click);
				});
				tcontrol.off("click");
			}
			element.insertBefore(needtoeplace).css({
				"width": "250px",
				"height": "50px"
			});
			needtoeplace.remove();
			element.resizable({
				stop: resizeEnd,
				helper: "help-placeholder"
			});
			function resizeEnd(event, ui) {}
		}
		function dragReturnEnd() {
			var target;
			var needtoeplace = sortable.find(".leftBar-item");
			var tmpHtml = "";
			tmpHtml += "<li class='item'>";
			tmpHtml += "<div class='element'></div>";
			tmpHtml += "</li>"
			var element = $(tmpHtml);
			element.insertBefore(needtoeplace).css({
				"width": "700px",
				"height": "10px"
			});;
			needtoeplace.remove();
		}
		function dragLineEnd() {
			var sortable = currentProfile.find("ul#sortable");
			var needtoreplace = sortable.find(".leftBar-item");
			var newlinechart = createNewChart("line");
			newlinechart.insertBefore(needtoreplace);
			needtoreplace.remove();
		}
		function dragBarEnd() {
			var sortable = currentProfile.find("ul#sortable");
			var needtoreplace = sortable.find(".leftBar-item");
			var newlinechart = createNewChart("bar");
			newlinechart.insertBefore(needtoreplace);
			needtoreplace.remove();
		}
		function dragPieEnd() {
			var target;
			var sortable = currentProfile.find("ul#sortable");
			var needtoreplace = sortable.find(".leftBar-item");
			var newlinechart = createNewChart("pie");
			newlinechart.insertBefore(needtoreplace);
			needtoreplace.remove();
		}
		function dragGaugeEnd() {
			var target;
			var sortable = currentProfile.find("ul#sortable");
			var needtoreplace = sortable.find(".leftBar-item");
			var newlinechart = createNewChart("gauge");
			newlinechart.insertBefore(needtoreplace);
			needtoreplace.remove();
		}
		function elementReplacer(currentItem) {
			if (currentItem.hasClass("leftBar-item")) {
				return replaceWithOuterElement();
			} else {
				return replaceWithInnerElement();
			};
			function replaceWithOuterElement() {
				return drag_placeholder[0];
			};
			function replaceWithInnerElement() {
				var width = currentItem.width();
				var height = currentItem.height();
				var object = $("<li class='item placeholder'></li>");
				object.css({
					width: width - 8,
					height: height - 8
				});
				return object[0];
			};
		};
		return currentProfile;
	}
	$.fn.extend({
		id: 0,
		type :'',
		option: '',
		target: '',
		nodes:'',
		kpis:'',
		timespan:'',
		dataType:{},
		modelId:'',
		theme:'',
		formatStr:'',
		category:'',
		optionType : 0,
		eventListener : function(){},
		chartCreator: function(type, option, data, nodes, kpis, theme, timespan, dataType, modelId, formatStr, callback) {
			var current = this;
			var element = $("<div class='element'></div>");
			var ec_element = element[0];
			var deleteBtn = current.find("button.deleteBtn");
			var codeBtn = current.find("button.codeBtn");
			var editBtn = current.find("button.editBtn");
			var resources = current.find("button.resources");
			current.attr("elementId", this.id);
			current.type = type;
			current.id = idid;
			current.data = data;
			current.nodes = nodes;
			current.kpis = kpis;
			current.theme = theme ? theme : "macarons";
			current.timespan = timespan;
			current.dataType = dataType;
			current.modelId = modelId;
			current.formatStr = formatStr;
			current.startloading();
			if(typeof onChartInit == 'function')
			{
				onChartInit({

				});
			}
			idid++;
			var inx = 0;
			if(dataType)
			{
				for(var i in dataType.category)
				{
					if(inx == 0)
					{
						current.category = i;
					}
					inx++;
				}
			}
			switch (type) {
				case "line":
					current.baseOption = option ? option : st._lINECHART_STANDARD_;
					current.option = option ? option : st._lINECHART_STANDARD_;
					break;
				case "bar":
					current.baseOption = option ? option : st._BARCHART_STANDARD_;
					current.option = option ? option : st._BARCHART_STANDARD_;
					break;
				case "pie":
					current.baseOption = option ? option : st._PIECHART_STANDARD_;
					current.option = option ? option : st._PIECHART_STANDARD_;
					break;
				case "gauge":
					current.baseOption = option ? option : st._GAUGECHART_STANDARD_;
					current.option = option ? option : st._GAUGECHART_STANDARD_;
					break;
				case "scatter":
					current.baseOption = option ? option : st._SCATTERCHART_STANDARD_;
					current.option = option ? option : st._SCATTERCHART_STANDARD_;
					break;
				case "k":
					current.baseOption = option ? option : st._KCHART_STANDARD_;
					current.option = option ? option : st._KCHART_STANDARD_;
					break;
				case "radar":
					current.baseOption = option ? option : st._RADARCHART_STANDARD_;
					current.option = option ? option : st._RADARCHART_STANDARD_;
					break;
				case "chord":
					current.baseOption = option ? option : st._CHORDCHART_STANDARD_;
					current.option = option ? option : st._CHORDCHART_STANDARD_;
					break;
				case "funnel":
					current.baseOption = option ? option : st._FUNNELCHART_STANDARD_;
					current.option = option ? option : st._FUNNELCHART_STANDARD_;
					break;
				case "eventRiver":
					current.baseOption = option ? option : st._RIVERCHART_STANDARD_;
					current.option = option ? option : st._RIVERCHART_STANDARD_;
					break;
				case "venn":
					current.baseOption = option ? option : st._VENNCHART_STANDARD_;
					current.option = option ? option : st._VENNCHART_STANDARD_;
					break;
				case "treemap":
					current.baseOption = option ? option : st._TREEMAPCHART_STANDARD_;
					current.option = option ? option : st._TREEMAPCHART_STANDARD_;
					break;
				case "tree":
					current.baseOption = option ? option : st._TREECHART_STANDARD_;
					current.option = option ? option : st._TREECHART_STANDARD_;
					break;
				case "map":
					current.baseOption = option ? option : st._MAPCHART_STANDARD_;
					current.option = option ? option : st._MAPCHART_STANDARD_;
					break;
				case "force":
					current.baseOption = option ? option : st._FORCECHART_STANDARD_;
					current.option = option ? option : st._FORCECHART_STANDARD_;
					break;
				default:
					break;
			}
			if(chartChangeEvent){
				chartChangeEvent({
					target : current
				});
			}
			current.find(".li_content").append(element);
			current.bindEvent();
			codeBtn.on("click", function(){
				codeBtn_click_event({
					target : current,
					theme : current.theme,
					option : current.option
				})
			});
			deleteBtn.on("click", current.deleteBtnClick);
			timeoutFn();
			current.on("click", current_click);
			current.resizable({
				stop: resizeEnd,
				helper: "help-placeholder"
			});
			function current_click(event) {

			};
			function resizeEnd(event, ui) {
				ec.resize(current.target);
			};
			function timeoutFn(){
				if(current.option.series.length > 0)
				{
					ec.init(ec_element, current.option, current.theme, type, function(tg) {
						current.target = tg;
						var sortable = current.parent();
						if(typeof callback == 'function')
						{
							callback(current);
						}
						current.stoploading();
					}, function(error){
						current.remove();
					});
				}
			}
			return current;
		},
		deleteBtnClick : function() {
			elementList = (function(id, el){
				var rs = [];
				for(var i in el)
				{
					if(el[i].id != id)
					{
						rs.push(el[i]);
					}
				}
				return rs;
			})(current.id, elementList)
			current.remove();
			if($("#modelPanel").css("display") == "none")
			{
				$(".chart-setting-closeBtn").trigger("click");
			}
			else
			{
				$(".modePlanel_closeBtn").trigger("click");
			}
			current.eventListener({
				target : current
			});
		},
		resBtn_click : function(){
			var current = this;
			var returnData = {};
			var deleteBtn = current.find("button.deleteBtn");
			var codeBtn = current.find("button.codeBtn");
			var editBtn = current.find("button.editBtn");
			var resBtn = current.find("button.resources");
			elementList.each(function(element){
				if(typeof element != 'function')
				{
					if( element.find(".element.current").size()){
						element.bindEvent();
						element.find(".element.current").removeClass("current");
					}
				}
				/*
				if( element.find(".element.current").size()){
					element.bindEvent();
					element.find(".element.current").removeClass("current")
				}
				*/
			});
			current.find(".element").addClass("current");
			editBtn.off("click.editBtn");
			resBtn.off("click.resBtn");
			current.find(".edit").css("display", "block");
			returnData.target = current;
			returnData.theme = current.theme;
			returnData.baseOption = current.baseOption;
			returnData.type = current.type;
			returnData.option = current.option;
			returnData.nodes = current.nodes;
			returnData.kpis = current.kpis;
			returnData.modelId = current.modelId;
			returnData.category = current.category;
			returnData.timespan = current.timespan;
			returnData.dataType = current.dataType;
			currentProfile.find("button.active").removeClass('active');
			resBtn.addClass("active");
			currentProfile.find("ul#sortable li").removeClass("select");
			current.addClass("select");
			$(".modePlanel_closeBtn").off("click");
			$(".modePlanel_closeBtn").on("click", function(event){
				current.modePlanel_closeBtn_callback();
			});
			$("#leftContent").css("display", "none");
			if($("#modelPanel").css("display") == "none")
			{
				console.log(resBtn_click_event);
				resBtn_click_event(returnData);
				$("#modelPanel").css({
					display: "block",
					right: -300,
					opacity: 0
				}).animate({
						right : 0,
						opacity: 1
					},
					600, function(){
						editBtn.on("click.editBtn", function(event){
							current.editBtn_click(event);
						});
					});
			}
			else
			{
				$("#modelPanel")
					.animate({
						right : -$("#modelPanel").width(),
						opacity: 0
					},
					600, function(){
						resBtn_click_event(returnData);
					})
				$("#modelPanel")
					.animate({
						right : 0,
						opacity: 1
					},
					600, function(){
						editBtn.on("click.editBtn", function(event){
							current.editBtn_click(event);
						});
					});
			}
			currentProfile.animate({
				marginLeft : (($(document).width() - 550) - currentProfile.width()) / 2 + 100
			},600);
			if($("#chart-setting").css("display") == "block")
			{
				$("#chart-setting").animate({
					right : -700
				},500, function(){
					$("#chart-setting").css("display","none");
				})
			}
		},
		editBtn_click : function(event) {
			var returnData = {};
			var current = this;
			var currentProfile = $("[currentProfile*=true]");
			var deleteBtn = current.find("button.deleteBtn");
			var codeBtn = current.find("button.codeBtn");
			var editBtn = current.find("button.editBtn");
			var resBtn = current.find("button.resources");
			elementList.each(function(element){
				if( element.find(".element.current").size()){
					element.bindEvent();
					element.find(".element.current").removeClass("current")
				}
			});
			current.find(".element").addClass("current");
			editBtn.off("click.editBtn");
			resBtn.off("click.resBtn");
			currentProfile.find("button.active").removeClass('active');
			editBtn.addClass("active");
			returnData.theme = current.theme;
			returnData.target = current;
			returnData.type = current.type;
			returnData.option = current.option;
			returnData.dataType = current.dataType;
			returnData.baseOption = current.baseOption;
			editBtn_click_event(returnData);
			current.find(".edit").css("display", "block");
			currentProfile.find("ul#sortable li").removeClass("select");
			current.addClass("select");
			event.stopPropagation();
			if($("#chart-setting").css("display") == "none"){
				$("#chart-setting").css({
					display: "block",
					top : 100,
					right: - $("#chart-setting").width() - 50,
					opacity: 0
				}).animate({
					right : 0,
					opacity: 1
				}, 500, function(){
					resBtn.on("click.resBtn", function(event){
						current.resBtn_click();
					});
				});
			}
			else
			{
				$("#chart-setting")
					.animate({
						right : - $("#chart-setting").width() - 50,
						opacity : 0
					}, 500)
					.animate({
						right : 0,
						opacity : 1
					},
					500, function(){
						resBtn.on("click.resBtn", function(event){
							current.resBtn_click();
						});
					});
			}
			if($("#modelPanel").css("display") == "block"){
				$("#modelPanel").animate({
					right : - $("#modelPanel").width() - 50
				}, 400, function(){
					$("#modelPanel").css("display","none");
				})
			}
			$(".chart-setting-closeBtn").off("click")
			$(".chart-setting-closeBtn").on("click", function(){
				current.closeBtnClick();
			});
			currentProfile.animate({
					marginLeft : (($(document).width() - 550) - currentProfile.width()) / 2 + 100
				},
				500, function(){

				});
			$("#chart-setting").draggable({
				handle: ".handler"
			});
		},
		closeBtnClick : function (event) {
			var current = this;
			var currentProfile = $("[currentProfile*=true]");
			var editBtn = current.find("button.editBtn");
			$(".element.current").removeClass("current");
			current.find(".edit").css("display", "");
			currentProfile.find("ul#sortable li").removeClass("select");
			currentProfile.animate({ "marginLeft": ($(window).width() - currentProfile.width())/2 },400, function(){
				currentProfile.css({
					'margin' : "120px auto"
				})
			});
			$("#chart-setting").animate({
					right: -700,
					opacity: 0
				},
				300, function() {
					$("#chart-setting").css("display", "none");
					editBtn.on("click.editBtn", function(event){
						current.editBtn_click(event);
					});
					oldSelect = undefined;
				});
		},
		bindEvent: function(){
			var current = this;
			var editBtn = current.find("button.editBtn");
			var resBtn = current.find("button.resources");
			editBtn.off("click.editBtn");
			resBtn.off("click.resBtn");
			editBtn.on("click.editBtn", function(event){
				current.editBtn_click(event);
			});
			resBtn.on("click.resBtn", function(event){
				current.resBtn_click();
			});
		},
		modePlanel_closeBtn_callback : function(event){
			var current = this;
			var resBtn = current.find("button.resources");
			$(".element.current").removeClass("current");
			$("#modelPanel")
				.animate({
					right : -$("#modelPanel").width()-50
				},600, function(){
					$("#modelPanel").css("display", "none");
					resBtn.on("click.resBtn", function(event){
						current.resBtn_click();
					});
				});
			current.find(".edit").css("display", "");
			currentProfile.find("ul#sortable li").removeClass("select");
			currentProfile.animate({ "marginLeft": ($(window).width() - currentProfile.width())/2 },400, function(){
				currentProfile.css({
					'margin' : "120px auto"
				})
			});
		},
		resizeEchart : function(){
			current = this;
			if(current.target){
				ec.resize(current.target);
			}
		},
		startloading : function(){
			var current = this;
			var loading = current.find(".loading");
			loading.css("display", "block");
		},
		stoploading : function(){
			var current = this;
			var loading = current.find(".loading");
			loading.css("display", "none");
		},
		setNodeKpiList : function(data){
			var current = this;
			current.kpis = data.kpis;
			current.nodes = data.nodes;
			current.modelId = data.modelId;
			current.category = data.category;
			current.formatStr = data.formatStr;
			current.timespan = data.timespan;
			current.resources = data.resources;
			current.find("#resourcesList").children().remove();
			current.find("#resourcesList").append($("<option value=''>模拟数据</option>"));
			for(var i in current.resources)
			{
				var option = $("<option value='" + current.resources[i].id + "'>" + current.resources[i].label + "</option>");
				current.find("#resourcesList").append(option);
				current.find(".reList").css("display", "none");
				current.find("#resourcesList").off();
				current.find("#resourcesList").on("change", function(event){
					resourceChanged(current, event);
				});
			}
			if(current.nodes instanceof Array && current.nodes.length > 0)
			{
				current.find("#resourcesList").val(current.nodes[0]);
			}
		},
		changeTheme : function(theme, option) {

			var current = this;
			current.theme = theme;
			ec.setTheme(current.target, theme, current.option, true, function(data){
				current.target = data.target;
			});
			chartChangeEvent({
				target : current
			});
		},
		changeOption: function(option, theme, merge, data) {
			var current = this;
			var allEmpty = (function(obj){
				for(var i in obj)
				{
					if(obj[i])
					{
						if(obj[i].data)
						{
							if(obj[i].data.length > 0)
							{
								return false;
							}

						}
						else if(obj[i].value)
						{
							if(obj[i].value.length > 0)
							{
								return false;
							}
						}
					}
				}
				return true
			})(option.series);
			if(data)
			{
				if(data.length == 0)
				{
					$("[data-zr-dom-id*=_zrender_hover_]").css("display", "block");
					current.find(".noData").css("display", "block");
				}
				else
				{
					$("[data-zr-dom-id*=_zrender_hover_]").css("display", "none");
					current.find(".noData").css("display", "none");
					current.option = option;
					if(option.series.length == 0)
					{
						ec.setOption(current.target, current.baseOption, true);
					}
					else
					{
						ec.setOption(current.target, option, true);
					}
				}
			}
			else
			{
				if(option.series.length == 0)
				{
					$("[data-zr-dom-id*=_zrender_hover_]").css("display", "block");
					current.find(".noData").css("display", "block");
					ec.setOption(current.target, current.baseOption, true);
				}
				else
				{
					$("[data-zr-dom-id*=_zrender_hover_]").css("display", "none");
					current.find(".noData").css("display", "none");
					ec.setOption(current.target, option, true);
				}
			}
			chartChangeEvent({
				target : current
			});
		}
	});
	//left-toolbar-draggable-controller
	$.fn.extend({
		chartTab : function(type, option, data, nodes, kpis, theme, timespan, dataType){
			var current = this;
			this.type = type;
			this.option = type;
			this.data = data;
			this.nodes = nodes;
			this.kpis = kpis;
			this.theme = theme;
			this.timespan = timespan;
			this.dataType = dataType;
			var numDom = $("<div>" +
				"<span id='num'>32<span><span id='unit'>个</span>" +
				"</div>");
			var label = $("<div>监测项目</div>");
			var resBtn = current.find("button.resources");
			current.find(".li_content").append(numDom).append(label);
			current.bindEvent();
			return this;
		}
	});
	$.fn.extend({
		toolbarDraggableCreator: function(width, height) {
			var current = this
			this.draggable({
				connectToSortable: "ul#sortable",
				revert: "invalid",
				start: startDrag,
				helper: createHelper
			});
			function startDrag(event, ui){
				drag_placeholder = $("<li class='item placeholder'></li>").css({
					width: width,
					height: height
				});
				return drag_placeholder;
			}
			function createHelper(){
				var elem = $("<div class='chart-handler'></div>");
				elem.css({
					width: width,
					height: height
				});
				return elem;
			}
		}
	});
	return profile;
}