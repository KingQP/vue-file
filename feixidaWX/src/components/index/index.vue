<template>
	<div class='container'>
		<div class="charts">
			<div id="myCharts" :style='{width: "95vw",height: "20vh" }'></div>
		</div>
		<div id="index-btn">
			<div class='index-module'>扫描通讯模块</div>
			<div class='index-device'>扫描设备</div>
			<div class='index-data'>链接设备</div>
		</div>
	</div>
</template>

<script>
	import wx from "weixin-js-sdk";
	import { vajax, layerMsg } from "@/common/js/common.js";
	export default {
		data() {
			return {
				show: false,
				moduleValue: [{
						id: "name",
						name: "设备名称:",
						placeholder: "请输入名称",
						value: ""
					},
					{
						id: "address",
						name: "服务器地址:",
						placeholder: "请输入地址",
						value: ""
					},
					{
						id: "list",
						name: "设备序列号:",
						value: ""
					},
					{
						id: "Location",
						name: "坐标",
						value: ""
					}
				],
				deviceValue: [{
						id: "name",
						name: "设备名称:",
						placeholder: "请输入名称",
						value: ""
					},
					{
						id: "address",
						name: "服务器地址:",
						placeholder: "请输入地址",
						value: ""
					},
					{
						id: "list",
						name: "设备序列号:",
						value: ""
					},
					{
						id: "Location",
						name: "坐标",
						value: "123"
					}
				],
				device: [{
						val: "device1",
						textVal: "设备1"
					},
					{
						val: "device2",
						textVal: "设备2"
					},
					{
						val: "device3",
						textVal: "设备3"
					},
					{
						val: "device4",
						textVal: "设备4"
					}
				],
				xAxisDatas: ['11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30'],
				seriesDatas: [270, 682, 91, 134, 890, 623, 521]
			}
		},
		methods: {
			createHtml(temp,sele) {
				let html = "", selectHtml = "", tempHtml = "", key;
				if(sele !== "") {
					for(key in sele) {
						selectHtml += '<option value="' + sele[key].val + '">' + sele[key].textVal + '</option>';
					}
					selectHtml = '<div><label for="device">设备列表：</label><select id="device">' + selectHtml + '</select></div>';
				}
				for(key in temp) {
					if(temp[key].placeholder === undefined) {
						tempHtml += '<div><label for="' + temp[key].id + '">' + temp[key].name + '</label><p style="margin:0px;" id="' + temp[key].id +'">' + temp[key].value + '</p></div>';
					}else {
						tempHtml += '<div><label for="' + temp[key].id + '">' + temp[key].name + '</label><input type="text" id="' + temp[key].id + '" placeholder="' + temp[key].placeholder + '" /></div>';
					}
				}
				html = '<form class="index">' + selectHtml + tempHtml + "</form>";
				return html;
			},
			callBackDevice(res) {
				let _this = this;
				_this.device = res;
				let html = _this.createHtml(_this.deviceValue, _this.device);
				layer.open({
					content: html,
					btn: ['确定', '取消'],
					yes: (index) => {
						let name 		= $("#name").val(),
							address 	= $("#address").val(),
							list 		= $("#list").text(),
							_location 	= $("#Location").text(),
							device 		= $(".index select").val(),
							form 		= new FormData(),
							_url 		= _this.$storeUrl.ipconfig + _this.$storeUrl.device;
						if(name == "" || name == null || name == undefined) {
							$("#name").focus().attr("placeholder", "设备名称未填写");
						}else if(address == "" || address == null || address == undefined) {
							$("#address").focus().attr("placeholder", "设备地址未填写");
						}else {
							form.append("name", name);
							form.append("address", address);
							form.append("list", list);
							form.append("location", _location);
							form.append("serial", "serial");
							form.append("master", "0");
							vajax(this, "POST", _url, form)
						}
					}
				});
			},
			wxInit(res) {
				let _this = this;
				wx.config({
					debug: true,
					appId: "wx43aba188c3b04c72",
					timestamp: res.timestamp,
					nonceStr: res.nonceStr,
					signature: res.signature,
					jsApiList: ['checkJsApi','scanQRCode', 'getLocation','configWXDeviceWiFi']
				});
				wx.ready(function() {
					wx.getLocation({
					    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					    success: function (res) {
					        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					        var longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
					        var speed = res.speed; // 速度，以米/每秒计
					        var accuracy = res.accuracy; // 位置精度
					        _this.moduleValue[3].value = latitude + "," + longitude;
					        _this.deviceValue[3].value = latitude + "," + longitude;
					    }
					});
					
					document.querySelector(".index-module").onclick = function() {
						wx.scanQRCode({
							needResult: 1,
							scanType: ["qrCode","barCode"],
							success: function(res) {
								var result = res.resultStr;
								_this.moduleValue[2].value = result;
								let html = _this.createHtml(_this.moduleValue, "");
								layer.open({
									content: html,
									btn: ['确定', '取消'],
									yes: (index) => {
										let name = $("#name").val(),
											address = $("#address").val(),
											list = $("#list").text(),
											Location = $("#Location").text(),
											form = new FormData(),
											_url = _this.$storeUrl.ipconfig + _this.$storeUrl.device;
											
										if(name == "" || name == null || name == undefined) {
											$("#name").focus().attr("placeholder", "设备名称未填写");
										}else if(address == "" || address == null || address == undefined) {
											$("#name").focus().attr("placeholder", "设备地址未填写");
										}else {
											form.append("name", name);
											form.append("address", address);
											form.append("list", list);
											form.append("Location", Location);
											form.append("serial", "serial");
											form.append("master", "0");
											vajax(_this, "POST", _url, form)
										}
									}
								});
							}
						});
					};
					document.querySelector(".index-device").onclick = function() {
						wx.scanQRCode({
							needResult: 1,
							scanType: ["qrCode","barCode"],
							success: function(res) {
								let result 	= res.resultStr,
								master 		= "0",
								_url 		= _this.$storeUrl.ipconfig + _this.$storeUrl.device + 'master=' + master;
								_this.deviceValue[2].value = result;
								vajax(this, "GET", _url, master, this.callBackDevice);
							}
						});
					};
					document.querySelector(".index-data").onclick = function() {
						wx.checkJsApi({
							jsApiList: ['configWXDeviceWiFi'],
							success: function(res) {
								WeixinJSBridge.invoke('configWXDeviceWiFi', {}, function(res) {
									var err_msg = res.err_msg;
				                    if(err_msg == 'configWXDeviceWiFi:ok') {
				                        console.log("配置成功！")
				                    } else {
				                    	console.log("配置失败！")
				                    }
								})
							}
						})
					}
				});
			},
			getDeviceValue(res) {
				console.log(res)
				//let time = new Date(),series = res.value;
				//this.xAxisDatas.push(series)
				//this.seriesDatas.push(series)
				let option = chart.getOption();
				option.xAxis = this.xAxisDatas;
				option.series[0].data = this.seriesDatas;
				chart.setOption(option);
			},
			dataCharts() {
				
				/*wx.config({
					debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					//debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: "wx38cee820fe22a840", // 必填，公众号的唯一标识
					timestamp: , // 必填，生成签名的时间戳
					nonceStr: '', // 必填，生成签名的随机串
					signature: "", // 必填，签名，见附录1
					jsApiList: ['checkJsApi', 'scanQRCode', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				wx.ready(function() {
					wx.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
						scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
						success: function(res) {
							var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							console.log(res);
							//		                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							//		                    sessionStorage.setItem('saomiao_result',result);
							//其它网页调用二维码扫描结果： 
							//var result=sessionStorage.getItem('saomiao_result');
						}
					});
					wx.getLocation({
					    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					    success: function (res) {
					        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					        var longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
					        var speed = res.speed; // 速度，以米/每秒计
					        var accuracy = res.accuracy; // 位置精度
					    }
					});
				});*/
			}
		},
		mounted() {
			//window.clearInterval(realTimeValue);
			let _this = this;
			let urls = window.location.href + window.location.hash;
			this.$axios({
				method: "GET",
				url: this.$storeUrl.ipconfigWX
			}).then((response) => {
				let res = response.data;
				this.wxInit(res)
			})
			var chart = this.$echarts.init(document.getElementById("myCharts"));
			var option = {
				title: {
					text: ''
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ""
				},
				toolbox: {
				},
				grid: {
					left: '3%',
					right: '6%',
					bottom: '3%',
					top: "10%",
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: this.xAxisDatas
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '电压',
					type: 'line',
					stack: '销量',
					areaStyle: {
						normal: {}
					},
					data: this.seriesDatas
				}]
			};
			chart.setOption(option);
			//let _url = this.$storeUrl.ipconfig + "",form = new FormData(),form.append("",);
			/*let realTimeValue = window.setInterval(function(){
				//这里不推荐使用setInterval 因为使用setInterval去进行ajax请求的话 会导致服务器请求过多
				//（当网络出现延迟时，而setInterval还在执行，这样会导致ajax堆积过多）
				//最好是在ajax中使用回调，当请求成功后在success函数中在调用ajax去获取新参数
				//这样虽然解决了服务器压力的问题，但是无法控制数据获取的间隔（clearInterval）
				//vajax(this, "POST", _url, form, this.getDeviceValue);
			},5000);*/
			
			//device list start
			
			//device list end
		}
	}
</script>

<style scoped>
	@import "./index.css";
</style>