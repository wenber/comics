var classes = require("./common.js");
require("./jquery.pagination.js");
classes.get_oneClass(0,12);
setTimeout(function(){
var typeIds = location.search.split("=")[1];

if(typeIds.indexOf("#")>-1){
	typeIds= typeIds.split("#")[0];
}
$(".h-menu").children().each(function(){
	var $this = $(this);
	if($this.attr("href").indexOf(typeIds)>-1){
		$this.siblings().removeClass();
		$this.addClass("sel");
	}
});
},200);