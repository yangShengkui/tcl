define(["jquery", "jquery-ui"], function (jquery, jui) {
	var modelPanel = {};
	var currentType = '';
	var currentResourceId;
	var category = '';
	var onNodeSelect = function(){};
	modelPanel.renderModel = renderModel;
	modelPanel.updateModel = updateModel;
	modelPanel.on = onEvent;
	function onEvent(eventName, callback){
		switch(eventName)
		{
			case "onNodeSelect":
				onNodeSelect = callback;
				break;
			default :
				break;
		}
	}
	function updateModel(data){
		var nodes = data.nodes;
		var kpis = data.kpis;
		//console.log(data.nodes, data.kpis);
		currentType = data.type;
		switch(currentType){
			case "line":
				category = "time";
				break;
			case "bar":
				category = "time";
				break;
			case "pie":
				category = "ci";
				break;
			case "gauge":
				category = "ci";
				break;
		}
		if(currentType == 'gauge')
		{
			$("[gauge]").css({
				display : "block"
			});
			$("#applyBtn").off("click").on("click", applyBtn_gauge_click);
		}
		else
		{
			$("[gauge]").css({
				display : "none"
			});
			$("#applyBtn").off("click").on("click", applyBtn_normal_click);
		}
		if(nodes)
		{
			nodesIsFind();
		}
		else
		{
			nodesNotFind();
		}
		function nodesIsFind(){
			var resourcesId = nodes[0];
			var rightContent = $("#rightContent");
			var label = rightContent.find("[id=resourcesId_" + resourcesId + "]").attr("label");
			console.log("nodesIsFind");
			var resources = JSON.parse(rightContent.find("[id=resourcesId_" + resourcesId + "]").attr("resources"));
			var kpislist = JSON.parse(rightContent.find("[id=resourcesId_" + resourcesId + "]").attr("kpis"));
			if(currentType == 'gauge')
			{
				gaugeResourseCreator(label, resourcesId, resources, kpislist, kpis);
				gaugeResourseCreateComplete();
			}
			else
			{
				normalResourseCreator(label, resourcesId, resources, kpislist);
				normalResourseCreateComplete();
			}
			function gaugeResourseCreateComplete(){
				
			};
			function normalResourseCreateComplete()
			{
				$(".leftContent").css("display", "block");
				$("ul#nodelist input[name=resources]").removeAttr("checked");
				$("ul#kpislist input[name=kpis]").removeAttr("checked");
				for(var i in nodes)
				{
					var nodeId = nodes[i];
					$("ul#nodelist input[name=resources][resourceid=" + nodeId + "]").prop("checked", "checked");
				}
				for(var j in kpis)
				{
					var kpiId = kpis[j];
					$("ul#kpislist input[name=kpis][kpiId=" + kpiId + "]").prop("checked", "checked");
				}
			};
		};
		function nodesNotFind(){
			$(".leftContent").css("display", "none");
		};
	};
	function renderModel(data){
		console.log("renderModel", data);
		var modelData = data;
		var parentDom = $("#rightContent");
		var rs = modelData;
		traverse(rs, parentDom);
		function traverse(rs, parentDom){
			if(rs.sub){
				for(var i in rs.sub){
					if(rs.sub[i].label){
						if(rs.sub[i].sub)
						{
							var dom = $("<div id='modelId_" + rs.sub[i].id + "' class='model_item folder show'><span class='glyphicon glyphicon-folder-open'></span><span class='innerTxt'>" + rs.sub[i].label + "</span></div>");
						}
						else
						{
							var resources = rs.sub[i].resources;
							if(resources != undefined)
							{
								var dom = $("<div >\
										<span class='glyphicon glyphicon-zoom-out'></span>\
										<span class='innerTxt'>" + rs.sub[i].label + "<span>\
									</div>")
										.attr({
											id : "modelId_" + rs.sub[i].id
										})
										.addClass("model_item show");
								for(var j in resources)
								{
									var elem = $("<div>\
										<span class='glyphicon glyphicon-briefcase'></span>\
										<span class='innerTxt'>" + resources[j].label + "<span>\
									</div>")
										.attr({
											id : "resourcesId_" + resources[j].id,
											label : resources[j].label,
											resources : JSON.stringify(resources),
											kpis : JSON.stringify(rs.sub[i].kpis)
										})
										.addClass("model_item show");
									parentDom.append(elem);
								}
								
							}
							else
							{
								var dom = $("<div id='modelId_" + rs.sub[i].id + "' class='model_item'>" + rs.sub[i].label + "</div>");
							}
						}
						//parentDom.append(dom);
						traverse(rs.sub[i], dom);
					}
					else
					{
						traverse(rs.sub[i], parentDom);
					}
				}
			}
		};
		$("[id*=resourcesId_]").on("click", resourceClick);
		$("[id*=modelId_]").on("click", folderClick);
		function resourceClick(event){
			event.stopPropagation();
			switch(currentType){
				case "pie": case "line": case "bar":
					var label = $(event.currentTarget).attr("label");
					var resourcesId = $(event.currentTarget).attr("id").split("_")[1];
					var resources = JSON.parse($(event.currentTarget).attr("resources"));
					var kpis = JSON.parse($(event.currentTarget).attr("kpis"));
					normalResourseCreator(label, resourcesId, resources, kpis);
					break;
				case "gauge":
					var label = $(event.currentTarget).attr("label");
					var resourcesId = $(event.currentTarget).attr("id").split("_")[1];
					var resources = JSON.parse($(event.currentTarget).attr("resources"));
					var kpis = JSON.parse($(event.currentTarget).attr("kpis"));
					gaugeResourseCreator(label, resourcesId, resources, kpis);
					break;
			}
		};
		function folderClick(event)
		{
			event.stopPropagation();
			var target = $(event.currentTarget);
			var children = $(target).children(".model_item");
			var icon = $(target).children("span.glyphicon");
			if(children.hasClass('show'))
			{
				children.removeClass('show');
				if(icon.hasClass("glyphicon-folder-open"))
				{
					icon.removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close");
				}
			}
			else
			{
				children.addClass('show');
				if(icon.hasClass("glyphicon-folder-close"))
				{
					icon.removeClass("glyphicon-folder-close").addClass("glyphicon-folder-open");
				}
			}
		};
	};
	function gaugeResourseCreator(label, resourcesId, resources, kpis, kpival){
		var resourceTitle = $("#resourceTitle");
		var leftDom = $("#modelPanel").find(".leftContent");
		var kpislist = $("#kpislist");
		var nodelist = $("#nodelist");
		var label = label;
		var resourcesId = resourcesId;
		var resources = resources;
		var kpis = kpis;
		var kpival = kpival;
		var gauge = leftDom.find("[gauge]");
		resourceTitle
			.text(label)
			.attr({
				"resourceId" : resourcesId,
				"nodelabel" : label
			});
		leftDom.css("display", "block");
		$("#compare").css("display", "none");
		nodelist.html("");
		kpislist.html("");
		gauge.html("");
		for(var i in kpis)
		{
			var element = $("<li id='kpiItem_" + i + "' class='dragBox'>\
				<div>\
				" + kpis[i].label + " (" + kpis[i].unit + ")\
				</div>\
			</li>");
            element.find("div").attr({
				kpiId : kpis[i].id,
                kpiname : kpis[i].name,
                kpiunit : replaceChar(kpis[i].unit),
                kpiunit_char : kpis[i].unit,
                label : kpis[i].label
			});
			if(kpival != undefined){
				var find = kpival.indexOf(kpis[i].id);
				if(find != -1) {
					element.css("display", "none");
				}
			}
			kpislist.append(element);
		}
		kpislist.find("[id*=kpiItem_]").each(function(index, element){
			var id = $(element).attr("id");
			$("#" + id).draggable({
				revert: "invalid",
				cursor : "pointer",
				cursorAt : {top : 15 ,left : 50},
				helper : createHelper
			});
			function createHelper(event){
				var target = $(event.currentTarget).find("div");
                var elem = $("<div class='draghelper'></div>").text(target.attr("label"));
                return elem;
			}
		});
		var selectorWrap = $("<div class='wrap'></div>");
		var selectTemplate_0 = $("<div class='big' template><table><td></td></table></div>");
		var selectTemplate_1 = $("<div class='big' template><table><td></td></table></div>");
		var selectTemplate_2 = $("<div class='big' template><table><td></td></table></div>");
		var numberSelector = $('<div class="btn-group" role="toolbar" aria-label="..." style="margin-left : 80px;">\
 			<div id="n_1" class="btn btn-default" role="group">1</div>\
  			<div id="n_2" class="btn btn-default" role="group">2</div>\
  			<div id="n_3" class="btn btn-default" role="group">3</div>\
		</div>') 
		gauge.append($("<div class='title'>请选择图表个数</div>")).append(numberSelector).append(selectorWrap);
		numberSelector.find("[id*=n_]").on("click", numberClick);
		createCircle("" + (kpival ? (kpival.length > 0 ? kpival.length : 1) : 1));
		var inx = 0;
		$("[template]").each(function(index, element){
			if(kpival != undefined)
			{
				var kpiid = kpival[inx];
				find = (function(id){
					for(var i in kpis)
					{
						if(kpis[i].id == id)
						{
							return kpis[i];
						}
					}
					return undefined;
				})(kpiid);
				$(element).find("td").text(find.label);
			}
			inx++;
		});
		function numberClick(event){
			var target = $(event.currentTarget);
			var id = target.attr("id").split("n_")[1];
			createCircle(id);
		}
		function createCircle(num){
            function dropOption(greedy)
            {
                return {
                    greedy : greedy ? greedy : false,
                    tolerance : "pointer",
                    accept: ".dragBox",
                    activeClass: "active-highlight",
                    hoverClass: "hover-cls",
                    drop : dropEndFun
                };
            }
			switch(num){
				case "1":
					selectorWrap
						.html("")
						.append(selectTemplate_0);
					selectTemplate_0
						.removeClass()
						.addClass("big")
						.css("margin", "6px 0 0 70px")
						.droppable(dropOption());
					selectTemplate_1.removeElement();
					selectTemplate_2.removeElement();
					removeSelectItem();
					break;
				case "2":
					selectorWrap
						.html("")
						.append(selectTemplate_0)
						.append(selectTemplate_1);
					selectTemplate_0
						.removeClass()
						.addClass("middle")
						.css("margin", "12px 0 0 30px")
						.droppable(dropOption());
					selectTemplate_1
						.removeClass()
						.addClass("middle")
						.css("margin", "12px 0 0 140px")
						.droppable(dropOption(true));
					selectTemplate_2.removeElement();
					removeSelectItem();
					break;
				case "3":
					selectorWrap
						.html("")
						.append(selectTemplate_0)
						.append(selectTemplate_2)
						.append(selectTemplate_1);
					selectTemplate_0
						.removeClass()
						.addClass("small")
						.css("margin", "26px 0 0 10px")
						.droppable(dropOption());
					selectTemplate_1
						.removeClass()
						.addClass("middle")
						.css("margin", "16px 0 0 85px")
						.droppable(dropOption(true));
					selectTemplate_2
						.removeClass()
						.addClass("small")
						.css("margin", "26px 0 0 180px")
						.droppable(dropOption());
					break;
				default:
					break;
			}
		}
		function dropEndFun(event, ui){
            var target = $(ui.draggable).find("div");
            var attributes = {
                label : target.attr("label"),
                kpiid: target.attr("kpiid"),
                name: target.attr("kpiname"),
                unit: target.attr("kpiunit_char")
            };
			$(this)
                .attr(attributes)
                .find("td")
                .text(target.attr("label"));
			removeSelectItem();
		}
		function removeSelectItem(){
			kpislist.find("[id*=kpiItem_]").css("display", "block");
			selectorWrap.find("div").each(function(index, element){
				var kpiid = $(element).attr("kpiid");
				kpislist.find("[id*=kpiItem_] [kpiid=" + kpiid + "]").parent().css("display", "none");
			});
		}
	}
	$.fn.extend({
		removeElement : function(){
			$(this).find("td").text("");
			$(this).removeAttr("label");
			$(this).removeAttr("kpiid");
		}
	});
	function normalResourseCreator(label, resourcesId, resources, kpis){
		$("#compare").css("display", "block");
			var resourceTitle = $("#resourceTitle");
			var leftDom = $("#modelPanel").find(".leftContent");
			var kpislist = $("#kpislist");
			var nodelist = $("#nodelist");
			var label = label;
			var resourcesId = resourcesId;
			var resources = resources;
			var kpis = kpis;
			currentResourceId = resourcesId;
			leftDom
			.css("display", "block");
			resourceTitle
				.text(label)
				.attr("resourceId", resourcesId)
				.attr("nodelabel", label);
			kpislist.html("");
			nodelist.html("");
			for(var i in resources)
			{
				if(resourcesId != resources[i].id){
					var element = $("<li id='resourceItem' class='checkbox'>\
					  <label>\
					    <input type='checkbox'>\
					    " + resources[i].label + "\
					  </label>\
					</li>")
                    element.find("input:checkbox").attr({
						name : "resources",
						resourceId : resources[i].id,
						nodelabel : resources[i].label
					});
					nodelist.append(element);
				}
			}
			for(var i in kpis)
			{
				var element = $("<li id='kpiItem' class='checkbox'>\
				  <label>\
				    <input type='checkbox'>\
				    " + kpis[i].label + " (" + kpis[i].unit + ")\
				  </label>\
				</li>");
                element.find("input:checkbox").attr({
					name : "kpis",
					kpiId : kpis[i].id,
					kpiname : kpis[i].name,
					kpiunit : replaceChar(kpis[i].unit),
					kpiunit_char : kpis[i].unit,
					label : kpis[i].label
				});
				kpislist.append(element);
			}
			//$("input[name*=resources]").on('change', resourseOnChange);
			$("input[name*=kpis]").on('change', checkBoxOnChange);
			function resourseOnChange(event)
			{
				if($("input[name=resources]:checked").length)
				{
					var kpiId = $("input[name=kpis]:checked").first().attr("kpiId");
					$("input[name=kpis][kpiId!=" + kpiId + "]").removeAttr("checked");
					$("input[name=kpis]").parent().parent().removeClass("avaliable");
				}
				else
				{
					var kpiunit = $("input[name=kpis]:checked").attr("kpiunit");
					kpiunitChange = (function(ku){

					})(kpiunit)
					$("input[name=kpis][kpiunit*=" + kpiunit + "]").parent().parent().addClass("avaliable");
				}
			}
			function checkBoxOnChange(event)
			{
				var target = $(event.currentTarget);
				var kpiId = target.attr("kpiId");
				var unit = $(event.currentTarget).attr("kpiUnit");
				var allcheckItem = $("input[name*=kpis]");
				if(target.val())
				{
					$("input[name='kpis'][kpiunit!=" + unit + "]").removeAttr("checked");
					$("input[name='kpis'][kpiunit!=" + unit + "]").parent().parent().removeClass("avaliable")
					$("input[name='kpis'][kpiunit*=" + unit + "]").parent().parent().addClass("avaliable");
				}
				/*
				if(!$("input[name=kpis]:checked").length)
				{
					target.prop("checked", "checked");
					return;
				}
				if($("input[name=resources]:checked").length)
				{
					checkWhenResourcesNotEmpty();
				}
				else
				{
					checkWhenResourcesIsEmpty();
				}
				function checkWhenResourcesNotEmpty(){
					if(target.val())
					{
						$("input[name=kpis][kpiId!=" + kpiId + "]").removeAttr("checked");
						$("input[name=kpis][kpiId!=" + kpiId + "]").parent().parent().removeClass("avaliable");
					}
				}
				function checkWhenResourcesIsEmpty(){
					if(target.val())
					{
						$("input[name='kpis'][kpiunit!=" + unit + "]").removeAttr("checked");
						$("input[name='kpis'][kpiunit!=" + unit + "]").parent().parent().removeClass("avaliable")
						$("input[name='kpis'][kpiunit*=" + unit + "]").parent().parent().addClass("avaliable");
					}
				}
				*/
			}
	 }
	function applyBtn_gauge_click(event){
		var nodes = [];
		var kpis = [];
		var names = [];
		var units = [];
		var labels = [];
		var resourceTitle = $("#resourceTitle");
		nodes.push({
			nodeId : parseInt(resourceTitle.attr("resourceid")),
			label : resourceTitle.attr("nodelabel")
		});
		$("[gauge]").find("[template]").each(function(index, element){
			var kpi = {
				kpiId : parseInt($(element).attr("kpiId")),
				name : $(element).attr("name"),
				label : $(element).attr("label"),
				units : $(element).attr("unit")
			};
			kpis.push(kpi);
		});
		onNodeSelect({
			category : category,
			data : {
				nodes : nodes,
				kpis : kpis
			}
		});
	}
	function applyBtn_normal_click(event){
		var nodes = [];
		var kpis = [];
		var names = [];
		var units = [];
		var labels = [];
		var resourceTitle = $("#resourceTitle");
		nodes.push({
			nodeId : parseInt(resourceTitle.attr("resourceid")),
			label : resourceTitle.attr("nodelabel")
		});
		$("#nodelist").find("input").each(function(index, element){
			if($(element).is(":checked")){
				var node = {
					nodeId : parseInt($(element).attr("resourceId")),
					label : $(element).attr("nodelabel")
				};
				nodes.push(node);
			}
		});
		$("#kpislist").find("input").each(function(index, element){
			if($(element).is(":checked")){
				var kpi = {
					kpiId : parseInt($(element).attr("kpiId")),
					name : $(element).attr("kpiName"),
					label : $(element).attr("label"),
					units : $(element).attr("kpiunit_char")
				};
				kpis.push(kpi);
			}
		});
		onNodeSelect({
			category : category,
			data : {
				nodes : nodes,
				kpis : kpis,
			}
		})
	}
	return modelPanel;
});
function replaceChar(obj){
	return obj.replace("/", "dash").replace("%", "qmark");
}