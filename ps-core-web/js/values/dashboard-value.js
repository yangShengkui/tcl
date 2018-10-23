define(['../values/values.js'], function(values) {
	'use strict';
	values.value("defaultDashboard", {"rows":[{"type":"layout","show":false,"cols":[{"col":3,"type":"totalItems","rows":[{"type":"totalItems","attributes":{"color":"bg-light-blue","icon":"ps-number","ci":315390897627567,"kpi":3001}}]},{"col":3,"type":"totalItems","rows":[{"type":"totalItems","attributes":{"color":"bg-green","icon":"ps-fan","ci":315390897627567,"kpi":3002}}]},{"col":3,"type":"totalItems","rows":[{"type":"totalItems","attributes":{"color":"bg-red","icon":"ps-sandglass","ci":315390897627567,"kpi":3003}}]},{"col":3,"type":"totalItems","rows":[{"type":"totalItems","attributes":{"color":"bg-yellow","icon":"ps-edit","ci":315390897627567,"kpi":3004}}]}]},{"type":"layout","show":true,"title":"最近一周告警","cols":[{"col":12,"type":"layout","rows":[{"type":"layout","cols":[{"col":8,"type":"basicline","rows":[{"type":"basicline","attributes":{"nodes":[315390897627567],"kpis":[3006,3007,3008,3009]},"content":{"title":"title","elements":[{"category":"time","dataType":{"type":"line","limit":{"onlyDifferentKpi":false},"category":{"time":{"replace":true,"category":"time","series":{"model":"linear","value":"ci"},"xAxis":true,"legend":true}}},"option":{"animation":true,"grid":{"left":"0%","top":"15%","width":"90%","height":"80%","containLabel":true},"title":{"text":"","subtext":""},"tooltip":{"trigger":"axis"},"legend":{"data":["企业-warning告警统计(天)","企业-minor告警统计(天)","企业-major告警统计(天)","企业-critical告警统计(天)"]},"calculable":true,"xAxis":[{"type":"category","boundaryGap":false,"data":["5/27","5/28","5/29","5/30","5/31","6/1","6/2"]}],"yAxis":[{"type":"value","axisLabel":{"formatter":"{value}"}}],"series":[{"name":"企业-warning告警统计(天)","type":"line","markPoint":{"data":[{"type":"max","name":"最大值"}]},"markLine":{"data":[{"type":"max","name":"最大标准值"},{"type":"min","name":"最小标准值"}]},"data":[{"kpiCode":"3006","timeStamp":1464318546302},{"kpiCode":"3006","timeStamp":1464404946303},{"kpiCode":"3006","timeStamp":1464491346303},{"kpiCode":"3006","timeStamp":1464577746303},{"kpiCode":"3006","timeStamp":1464664146303},{"kpiCode":"3006","timeStamp":1464750546304},{"kpiCode":"3006","timeStamp":1464836946304}]},{"name":"企业-minor告警统计(天)","type":"line","markPoint":{"data":[{"type":"max","name":"最大值"}]},"markLine":{"data":[{"type":"max","name":"最大标准值"},{"type":"min","name":"最小标准值"}]},"data":[{"kpiCode":"3007","timeStamp":1464318546304},{"kpiCode":"3007","timeStamp":1464404946304},{"kpiCode":"3007","timeStamp":1464491346305},{"kpiCode":"3007","timeStamp":1464577746305},{"kpiCode":"3007","timeStamp":1464664146305},{"kpiCode":"3007","timeStamp":1464750546305},{"kpiCode":"3007","timeStamp":1464836946306}]},{"name":"企业-major告警统计(天)","type":"line","markPoint":{"data":[{"type":"max","name":"最大值"}]},"markLine":{"data":[{"type":"max","name":"最大标准值"},{"type":"min","name":"最小标准值"}]},"data":[{"kpiCode":"3008","timeStamp":1464318546306},{"kpiCode":"3008","timeStamp":1464404946307},{"kpiCode":"3008","timeStamp":1464491346307},{"kpiCode":"3008","timeStamp":1464577746307},{"kpiCode":"3008","timeStamp":1464664146308},{"kpiCode":"3008","timeStamp":1464750546308},{"kpiCode":"3008","timeStamp":1464836946308}]},{"name":"企业-critical告警统计(天)","type":"line","markPoint":{"data":[{"type":"max","name":"最大值"}]},"markLine":{"data":[{"type":"max","name":"最大标准值"},{"type":"min","name":"最小标准值"}]},"data":[{"kpiCode":"3009","timeStamp":1464318546308},{"kpiCode":"3009","timeStamp":1464404946309},{"kpiCode":"3009","timeStamp":1464491346309},{"kpiCode":"3009","timeStamp":1464577746309},{"kpiCode":"3009","timeStamp":1464664146309},{"kpiCode":"3009","timeStamp":1464750546309},{"kpiCode":"3009","timeStamp":1464836946310}]}]},"type":"line","formatStr":"月日","nodes":[315390897627567],"theme":"macarons","timespan":691200000,"layout":{"width":100,"widthheightPortion":0.6,"row":0,"col":0},"kpis":[3006,3007,3008,3009]}]}}]},{"col":4,"type":"progress","rows":[{"type":"header","attributes":{"text":"处理情况"}},{"type":"progress","attributes":{"ci":315390897627567,"kpi":100002}},{"type":"progress","attributes":{"ci":315390897627567,"kpi":100003}}]}]},{"type":"layout","cols":[{"col":3,"type":"downTab","rows":[{"type":"downTab","attributes":{"ci":315390897627567,"kpi":3006}}]},{"col":3,"type":"downTab","rows":[{"type":"downTab","attributes":{"ci":315390897627567,"kpi":3007}}]},{"col":3,"type":"downTab","rows":[{"type":"downTab","attributes":{"ci":315390897627567,"kpi":3008}}]},{"col":3,"type":"downTab","rows":[{"type":"downTab","attributes":{"ci":315390897627567,"kpi":3009}}]}]}]}]},{"type":"layout","show":true,"title":"","cols":[{"col":8,"type":"layout","rows":[{"type":"header","attributes":{"text":"设备运行情况"}},{"type":"layout","cols":[{"col":"11","type":"layout","rows":[{"type":"layout","cols":[{"col":9,"type":"map","rows":[{"type":"map","attributes":{}}]},{"col":3,"type":"sparkline","rows":[{"type":"sparkline","attributes":{"nodes":[315390897627567],"kpis":[3005,3012,100005]}}]}]}]},{"col":"1"}]}]},{"col":4,"type":"alertcommon","rows":[{"type":"header","attributes":{"text":"常见告警类型"}},{"type":"alertcommon","attributes":{"type":"alert"}}]}]},{"type":"layout","show":true,"title":"","cols":[{"col":12,"type":"layout","rows":[{"type":"layout","cols":[{"col":8,"type":"layout","rows":[{"type":"layout","cols":[{"col":"11","type":"listtwo","rows":[{"type":"header","attributes":{"text":"正在执行中工单 "}},{"type":"listtwo","attributes":{"fun":"ticketService.getTicketsByStatus"}}]},{"col":"1"}]}]},{"col":4,"type":"listone","rows":[{"type":"header","attributes":{"text":"最新上线设备 "}},{"type":"listone","attributes":{"fun":"resourceUIService.getLatestDevices"}}]}]},{"type":"layout","cols":[{"col":12}]}]}]}]})
	values.value("basiclineData", {
		title : 'title',
		elements : [{
			category : 'time',
			dataType : {
				type : "line",
				limit : {
					onlyDifferentKpi : false
				},
				category : {
					time : {
						replace : true,
						category : "time",
						series : {
							model : 'linear',
							value : 'ci'
						},
						xAxis : true,
						legend : true
					}
				}
			},
			option : {
				animation : false,
				title : {
					text: '',
					subtext: ''
				},
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:['室内温度','室外温度']
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						boundaryGap : false,
						data : ['13:00','13:30','14:00','14:30','15:00','15:30','16:00']
					}
				],
				yAxis : [
					{
						type : 'value',
						axisLabel : {
							formatter: '{value}'
						}
					}
				],
				series : [
					{
						name:'室内温度',
						type:'line',
						data:[11, 11, 15, 13, 12, 13, 10],
						itemStyle: {
							normal: {
								color : '#d99a37'
							}
						},
						lineStyle: {
							normal: {
								color : '#d99a37'
							}
						},
						areaStyle: {
							normal: {
								color : '#d99a37'
							}
						}
					}
				]
			},
			type : 'line',
			formatStr : '时分',
			nodes : [],
			theme : 'macarons',
			timespan : parseInt(30 * 60 * 60 * 1000),
			layout : {
				width : 100,
				widthheightPortion :.6,
				row : 0,
				col : 0
			}
		}]
	})
});