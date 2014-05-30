require("jquery.js");
require("config.js");

$.ajax({
	url: config.common.url_head,
	type: 'GET',
	dataType: 'json',
	cache: false,
	error: function() {
		alert(config.common.error);
	},
	success: function(reData) {
		if (reData.ret) {
			var html = ['<a href="/qunar/seven/comics/homepage.do">首页</a>'];
			var data = reData.data;
			for (var i = 0, len = data.length; i < len; i++) {
				html.push('<a href="/qunar/seven/comics/getClassUI.do?typeId=' + data[i].typeId + '">' + data[i].name + '</a>');
			}
		
				$("#h-menuId").empty().append(html.join(""));

			
		} else {
			alert("请重新加载！");
		}
	}
});
