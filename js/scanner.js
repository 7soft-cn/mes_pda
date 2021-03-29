//扫描条码函数
var ScanBarcode = function() {
	/*dom变量定义*/
	scanList = document.getElementById("scanList"), //数据列表
	loadImgHtml = '<img src="images/ring.gif" class="loadImg"/>'; //加载图像HTML
	/*plus变量定义*/
	var main, IntentFilter, receiver, Bundle, Intent;
	debug = true; //调试模式
	
	return {
		//初始化方法
		Init: function() {
			var self = this;
			main = plus.android.runtimeMainActivity(),
			IntentFilter = plus.android.importClass('android.content.IntentFilter'),
			//new
			Bundle = plus.android.importClass("android.os.Bundle");
			Intent = plus.android.importClass("android.content.Intent");
			var self = this;
			//开启电源
			self.OpenBarcode();
            //扫描
			self.Scan();
            //注册广播并接收回调数据
			self.RegisterReceiver();
			debug && console.log(" 正在开启扫描...");
		},
		OpenBarcode: function() {
			debug && console.log("发送开启电源的广播...");
			var action = new Intent("raindi.decoder.OPEN");
			// 设置包名
			action.setClassName('com.huayusoft.barcodeadmin', 'com.huayusoft.barcodeadmin.receiver.decoderReceiver');
			main.sendBroadcast(action);
		},
		Scan: function() {
			debug && console.log("发送扫描的广播...");
			var action = new Intent("raindi.decoder.SCAN");
			action.setComponent(main.getComponentName());
			// 设置包名
			action.setClassName('com.huayusoft.barcodeadmin', 'com.huayusoft.barcodeadmin.receiver.decoderReceiver');
			main.sendBroadcast(action);
		},
		//注册广播并监听回调
		RegisterReceiver: function() {
			var self = this;

			var filter = new IntentFilter(),
			receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
				onReceive: onReceiveFn
			});
			filter.addAction("android.senraise.scan");
			main.registerReceiver(receiver, filter); //注册监听事件
			//监听回调函数
			function onReceiveFn(context, intent) {
				plus.android.importClass(intent); 
				data = intent.getStringExtra("result")
				self.SetpairedListHtml(scanList, "结果", data);
			}
		},
		SetpairedListHtml: function(parentEl, bleName, bleId) {
			var li = document.createElement('li');
			li.setAttribute("data-id", bleId);
			li.innerHTML = bleName + "<span>" + bleId + "</span>";
			parentEl.appendChild(li);
		},
	}
}();
