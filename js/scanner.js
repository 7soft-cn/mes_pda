//搜索蓝牙打印机函数
var ScanBarcode = function() {

	/*dom变量定义*/
	var ScanBtn = document.getElementById("ScanBtn"), //最下边的按钮
		scanList = document.getElementById("scanList"), //数据列表
		loadImgHtml = '<img src="images/ring.gif" class="loadImg"/>'; //加载图像HTML


	var openAction = "raindi.decoder.OPEN";
	var closeAction = "raindi.decoder.CLOSE";
	var scanAction = "raindi.decoder.SCAN";
	var stopAcion = "raindi.decoder.STOP";

	/*plus变量定义*/
	var main, IntentFilter, receiver, Bundle, Intent; //有些我也不知道是啥意思-_-!;


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

			ScanBtn.addEventListener("tap", function() {
					//new
					self.OpenBarcode();
					self.Scan();

			});

		},

		OpenBarcode: function() {
			debug && console.log("发送开启电源的广播...");
			var action = new Intent("raindi.decoder.OPEN");
			// 设置包名
			// action.setComponent(main.getComponentName());
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

				// scanList.innerHTML = '';


				receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
					onReceive: onReceiveFn
				});
				
			filter.addAction("barcodeservice.decoder.RESULT");
			filter.addAction("raindi.decoder.RESULT");
			filter.addAction("android.senraise.scan");
			main.registerReceiver(receiver, filter); //注册监听事件

			//监听回调函数
			function onReceiveFn(context, intent) {
				plus.android.importClass(intent); //通过intent实例引入intent类，方便以后的‘.’操作

				//new
				// if(intent.getAction() === 'action_barcode_broadcast'){
				//  debug && console.log("收到广播数据：" );
				//   var data= intent.getStringExtra("key_barcode_string");
				
				//    debug && console.log("数据"+data);
				// };
				//接收按键广播
				if (intent.getAction() === 'barcodeservice.decoder.RESULT') {
					debug && console.log("收到广播数据barcodeservice：");
					var data = intent.getStringExtra("DATA");
					debug && console.log("数据" + data);
				};
				//接收命令发送广播
				if (intent.getAction() === 'raindi.decoder.RESULT') {
					debug && console.log("收到广播数据raindi：");
					var data = intent.getStringExtra("DATA");
					debug && console.log("数据" + data);
				};
				// main.unregisterReceiver(receiver); //取消监听
				data = intent.getStringExtra("result")
				self.SetpairedListHtml(scanList, "data", data);

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
