define(['directives/directives'], function(directives) {
	'use strict';
	directives.initDirective('topoDiv', function($timeout) {
		return {
			restrict: 'AE',
			controller: ['$scope', '$element', '$attrs',
				function($scope, $element, $attrs) {
					var mainControl = $id("mainControl");
					mainControl.style.width = (document.body.offsetWidth - 412) + "px";
					var bgImg = "url(images/bg.gif)";
					var backColor = "#e0ecff";
					var topoStr;

					function hOnMouseOver(tagObj, index) {
						var h1 = $id("h1");
						var h2 = $id("h2");
						var h3 = $id("h3");
						var tab1 = $id("tab1");
						var tab2 = $id("tab2");
						var tab3 = $id("tab3");
						var setHClass = function(obj, colorValue, indexValue) {
							obj.style.background = colorValue;
							obj.style.zIndex = indexValue;
						}
						var setTagClass = function(obj, className) {
							obj.setAttribute("class", className);
							obj.setAttribute("className", className);
						}
						setHClass(h1, bgImg, "1");
						setHClass(h2, bgImg, "1");
						setHClass(h3, bgImg, "1");
						setTagClass(tab1, "htab");
						setTagClass(tab2, "htab");
						setTagClass(tab3, "htab");
						setHClass(tagObj, backColor, "3");
						setTagClass($id("tab" + index), "htabup");
					}
					var launchExample = function() {
						$id("h1").style.background = "#e0ecff";
						$id("h1").style.zIndex = "3";
						var global = com.proudsmart.Global;
						var graphUtils = com.proudsmart.Utils.create({
							contextBody: 'contextBody',
							width: 1600,
							height: 1000,
							smallMap: 'smallMap',
							mainControl: 'mainControl',
							historyMessage: 'historyMessage',
							prop: 'prop'
						});
						graphUtils.nodeDrag($id("baseLine1"), true, 1);
						graphUtils.nodeDrag($id("baseLine2"), true, 2);
						graphUtils.nodeDrag($id("baseLine3"), true, 3);
						var modes = jQuery("[divType='mode']");
						var modeLength = modes.length;
						for (var i = 0; i < modeLength; i++) {
							graphUtils.nodeDrag(modes[i]);
						}
						document.body.onclick = function() {
							if (!stopEvent) {
								global.modeTool.clear();
							}
						}

						function countModule() {
							stopEvent = false;
							var lineCount = global.lineMap.size();
							var modeCount = global.modeMap.size();
							var contextCount = global.baseTool.contextMap.size();
							$id("lineCount").innerHTML = "线总数:" + lineCount;
							$id("modeCount").innerHTML = "模型数:" + modeCount;
							$id("contextCount").innerHTML = "区域数:" + contextCount;
						}
						countModule();
						document.onclick = countModule;
						document.onkeydown = KeyDown;
						//				topoStr = '<?xml version="1.0"?><modes><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="122" title="完成" backImgSrc="images/end.png" top="817" left="935" zIndex="60" width="104" height="43"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="120" title="会计分录" backImgSrc="images/business.png" top="810" left="648" zIndex="60" width="105" height="56"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="112" title="进帐单" backImgSrc="images/handBus.png" top="810" left="386" zIndex="60" width="105" height="56"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="108" title="进帐单" backImgSrc="images/switch.png" top="685" left="648" zIndex="60" width="105" height="56"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="102" title="进帐单" backImgSrc="images/business.png" top="544" left="472" zIndex="60" width="105" height="56"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="100" title="进帐单" backImgSrc="images/business.png" top="534" left="832" zIndex="60" width="105" height="56"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="96" title="进帐单" backImgSrc="images/switch.png" top="449" left="648" zIndex="60" width="105" height="56"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="84" title="进帐单" backImgSrc="images/business.png" top="330" left="648" zIndex="60" width="105" height="56"/><mode class="module" contentEditable="inherit" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" id="60" title="开始" backImgSrc="images/start.png" top="205" left="648" zIndex="60" width="105" height="56"/><line strokeweight="1.35" strokecolor="black" d="M 648 478 L 648 477,525 477,525 544" brokenType="2" contentEditable="inherit" id="line37" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module102" wIndex="2" xBaseMode="module96" xIndex="4" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="m701 263 L 701 330 z" brokenType="1" contentEditable="inherit" id="line34" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module84" wIndex="2" xBaseMode="module60" xIndex="7" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="m493 839 L 648 839 z" brokenType="1" contentEditable="inherit" id="line32" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module120" wIndex="4" xBaseMode="module112" xIndex="5" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="M 755 839 L 935 839 z" brokenType="1" contentEditable="inherit" id="line30" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module122" wIndex="4" xBaseMode="module120" xIndex="5" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="m701 743 L 701 810 z" brokenType="1" contentEditable="inherit" id="line28" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module120" wIndex="2" xBaseMode="module108" xIndex="7" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="M 648 714 L 439 810 z" brokenType="1" contentEditable="inherit" id="line26" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module112" wIndex="2" xBaseMode="module108" xIndex="4" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="M 884 589 L 884 619,701 619,701 685" brokenType="2" contentEditable="inherit" id="line24" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module108" wIndex="2" xBaseMode="module100" xIndex="7" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="M 524 597 L 524 619,701 619,701 685" brokenType="2" contentEditable="inherit" id="line22" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module108" wIndex="2" xBaseMode="module102" xIndex="7" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="M 755 478 L 755 478,884 478,884 534 z" brokenType="2" contentEditable="inherit" id="line20" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module100" wIndex="2" xBaseMode="module96" xIndex="5" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/><line strokeweight="1.35" strokecolor="black" d="m701 388 L 701 449 z" brokenType="1" contentEditable="inherit" id="line16" style="WIDTH: 100px; CURSOR: pointer; POSITION: absolute; HEIGHT: 100px; fill: none; stroke: black; stroke-width: 1.7999999999999998;fill: none; stroke: black; stroke-width: 1.7999999999999998" marker-end="url(#arrow)" wBaseMode="module96" wIndex="2" xBaseMode="module84" xIndex="7" attr_prop_attri1="2" attr_prop_attri2="3" attr_prop_attri3="4" attr_prop_attri4="5"/></modes>';
						//				topoStr=topoStr.replace(/[\r\n]/ig,'');
						graphUtils.loadTextXml(topoStr);
					};
					$scope.$on('TopoStatusInit', function(event, args) {
						topoStr = args.option[0];
						launchExample();
					});

				}
			]
		}
	});

});