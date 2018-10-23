define(["jquery", "jquery-ui", "profile", "setting", "codeMirrorEditor"],
	function (jquery, jui, profile, setting, cm) {
		var dom = {};
		var optionUpdated_callback;
		var resBtn_click_callback;
		var codeBtn_click_callback;
		var nodeSelectEvent;
		var saveImageEvent;
		var resourceChanged;
		var saveDataEvent;
		dom.fn = fn;
		dom.on = onEvent;
		dom.saveData = saveData;
		dom.enableScroll = enableScroll;
		dom.disableScroll = disableScroll;
		dom.renderGraphList = renderGraphList;
		dom.createChart = createChart;
		dom.disableBodyScroll = disableBodyScroll;
		dom.enableBodyScroll = enableBodyScroll;
		dom.addLoadingIcon = addLoadingIcon;
		dom.removeLoadingIcon = removeLoadingIcon;
		dom.pagesetting = pagesetting;
		dom.openImage = openImage;
		dom.addNewLabel = addNewLabel;
		dom.setFocus = setFocus;
		dom.renderPreview = renderPreview;
		function renderPreview(data)
		{
			profile.renderPreview(data);
		}
		function setFocus(){
			var currentProfile = $("[currentProfile=true]");
			currentProfile.find("#HeaderInput").focus();
		}
		function openImage(imgSrc){
			var oPop = window.open(imgSrc,"","width=1, height=1, top=5000, left=5000");
			for(; oPop.document.readyState != "complete"; )
			{
				if (oPop.document.readyState == "complete")break;
			}
			oPop.document.execCommand("SaveAs");
			oPop.close();
			/*
			 window.open(imgSrc);
			 var pic = window.open(imgSrc);
			 setTimeout(function(){
			 pic.document.execCommand("SaveAs");
			 }, 500)
			 setTimeout(win.document.execCommand("SaveAs"), 500);
			 */
		}
		function addNewLabel(label){
			profile.addNewLabel(label);
		}
		function removeLoadingIcon(){
			$("#tempSvBtn").animate({
				"opacity" : 0
			},200,function(){
				$("#tempSvBtn").remove()
			});
			$("#tempBg").animate({
				"opacity" : 0
			},100,function(){
				$("#tempBg").remove()
			});
			return dom;
		}
		function addLoadingIcon(){
			var left = $("#saveBtn").offset().left;
			var top = $("#saveBtn").offset().top;
			var saveBtn = $("#saveBtn").clone();
			var nbg = $("<div class='bgcover' id='loadingIcon'></div>");
			var loadinIcon = $("<span class='lodingIcon'></div>");
			loadinIcon.css({
				"margin-top" : 5,
				"display" : "inline-block",
				"width" : 45,
				"height" : 45,
				"background-size" : "cover",
				"background-image" : "url(images/loading_spinner.gif)"
			});
			nbg.attr("id", "tempBg")
				.css({
					"z-index" : 9999999990,
					"opacity" : 0,
				}).animate({
					"opacity" :.8,
				},100,function(){

				});
			saveBtn
				.attr("id", "tempSvBtn")
				.css({
					"margin-top" : top,
					"margin-left" : left,
					width : 90,
					height : 34,
					"position" : "absolute",
					"z-index" : 9999999999,
					"border" : "1px solid #888",
					"background-color" : "#444"
				}).animate({
					"margin-top" : top - 20,
					"margin-left" : left + 10,
					width : 70,
					height : 70,
					"background-color" : "#000"
				},200,function(){

				});
			saveBtn.html('').append(loadinIcon);
			$("body").prepend(saveBtn);
			$("body").prepend(nbg);
			return dom;
		}
		function disableBodyScroll(){
			$("body").css("overflow-y", "hidden");
			return dom;
		}
		function enableBodyScroll(){
			$("body").css("overflow-y", "auto");
			return dom;
		}
		function saveData(){
			var returnData = {};
			var currentProfile = $("[currentProfile=true]");
			var errorMsg;
			returnData = [];
			console.log(profile.getElementList());
			var elements = profile.getElementList();
			var title = profile.getChartTitle();
			elements.each(function(element){
				widthPersent = (element.width() - 2) / (currentProfile.width() - 20) * 100;
				widthheightPortion = element.height() / element.width();
				if((element.kpis == undefined)||(element.nodes == undefined))
				{
					errorMsg = '有视图尚未绑定数据'
				}
				returnData.push({
					option : element.option,
					modelId : element.modelId == "" ? undefined : element.modelId,
					category : element.category,
					type : element.type,
					formatStr : element.formatStr,
					kpis : element.kpis,
					nodes : (element.nodes instanceof Array && element.nodes.length > 0) ? element.nodes : undefined,
					theme : element.theme,
					timespan : parseInt(element.timespan * 60 * 1000),
					dataType : element.dataType,
					width_absolute : element.width(),
					layout : {
						width : widthPersent,
						widthheightPortion : widthheightPortion,
						row : parseInt($(element).attr("row")),
						col : parseInt($(element).attr("col"))
					}
				});
			});
			return {
				title : title,
				data : returnData,
				errorMsg : errorMsg
			};
		}
		function fn(toolBarList){
			var html = '';
			var currentProfile;
			var startDatePicker = $("#startDatePicker");
			var endDatePicker = $("#endDatePicker");
			$("[toolbar_id*=toolbar_]").on({
				"mouseenter" : function(event){
					event.stopPropagation();
					$(".tooltips").css("opacity", 0);
					$(event.target).parent().parent().find(".tooltips").css("opacity", 1);
				},
				"mouseleave" : function(event){
					event.stopPropagation();
					$(".tooltips").css("opacity", 0);
				}
			});
			preloadImages(toolBarList);
			$("#colorPicker_page").spectrum({
				color: "#fff",
				showInput: true,
				className: "full-spectrum",
				showInitial: true,
				showPalette: true,
				showSelectionPalette: true,
				maxPaletteSize: 10,
				preferredFormat: "hex",
				change: function(color) {
					var currentProfile = $("[currentProfile*=true]");
					var colorCode = color.toHexString();
					$("#page-setting").attr({
						"value_color" : colorCode
					});
				},
				palette: [
					["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)","rgb(183, 183, 183)",
						"rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)", "rgb(243, 243, 243)", "rgb(255, 255, 255)"],
					["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
						"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
					["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
						"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
						"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
						"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
						"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
						"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
						"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
						"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
						"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
						"rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",
						"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
						"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
				]
			});
			currentProfile = profile.createNewProfile();
			profile.on("editBtn_click", function(event){
				optionUpdated_callback(event);
			});
			profile.on("resBtn_click", function(event){
				resBtn_click_callback(event);
			});
			profile.on("codeBtn_click", function(event){
				codeBtn_click_callback(event);
			});
			profile.on("saveImage", function(event, toolbox){
				saveImageEvent(event, toolbox);
			});
			profile.on("resourceChanged", function(target, event){
				resourceChanged(target, event);
			});
			cm.init();
			setting.init();
			function preloadImages(toolBarList)
			{
				for(var i in toolBarList){
					for(var j in toolBarList[i].sub){
						html += "<img src='images/" + toolBarList[i].sub[j].src + ".png' />"
					}
				}
				$("#img_preload").html(html);
			}
		}
		function pagesetting(){
			var currentProfile = $("[currentProfile*=true]");
			var widthPresentage = currentProfile.width() / $(window).width();
			var heightPresentage = currentProfile.height() / $(window).height();
			var width = parseInt(widthPresentage * 100);
			var height = parseInt(heightPresentage * 100);
			$("#pageWidth").slider({
				range: "min",
				max: 100,
				value: width,
				slide: pageWidthRefresh,
			});
			$("#pageHeight").slider({
				range: "min",
				max: 100,
				value: height,
				slide: pageHeightRefresh,
			});
			function pageWidthRefresh(event, ui){
				var currentProfile = $("[currentProfile*=true]");
				var target = $("#page-setting");
				target.attr({
					"value_width" : ui.value * $(window).width() / 100
				});
			}
			function pageHeightRefresh(event, ui){
				var currentProfile = $("[currentProfile*=true]");
				var target = $("#page-setting");
				target.attr({
					"value_height" : ui.value * $(window).width() / 100
				});
			}
		}
		function onEvent(eventName, callback){
			switch(eventName)
			{
				case "optionUpdated":
					optionUpdated_callback = callback;
					break;
				case "resBtn_click":
					resBtn_click_callback = callback;
					break;
				case "codeBtn_click":
					codeBtn_click_callback = callback;
					break;
				case "onNodeSelect":
					nodeSelectEvent = callback;
					break;
				case "saveData":
					saveDataEvent = callback;
				case "resourceChanged":
					resourceChanged = callback;
					break;
				case "saveImage":
					saveImageEvent = callback;
					break;
				default :
					break;
			}
		}
		function enableScroll(){
			$("body").css("overflow-y", "auto");
		}
		function disableScroll(){
			$("body").css("overflow-y", "hidden");
			var mt = ($(window).height() - 500)/2;
		}
		function createChart(type, optionName, dataType){
			profile.createChart(type, optionName, dataType);
		}
		function renderGraphList(title, content, callback){
			profile.renderGraphList(title, content, callback);
		}
		return dom;
	});