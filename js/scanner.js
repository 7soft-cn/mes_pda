//扫描条码函数
var ScanBarcode = function(callbackFun) {
	/*dom变量定义*/
	// scanList = document.getElementById("scanList"); //数据列表
	/*plus变量定义*/
	var main, IntentFilter, receiver;
	debug = true; //调试模式
	
	return {
		//初始化方法
		Init: function(callbackFun) {
			var self = this;
			main = plus.android.runtimeMainActivity(),
			IntentFilter = plus.android.importClass('android.content.IntentFilter');
			
			var self = this;
			//注册广播并监听回调
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
            	// console.log('result=>'+data)
				callbackFun(data)
            }
			debug && console.log(" 扫描=>开启");
		}
	}
}();
