
require("./common.js");
//add className
setTimeout(function(){
    $("#h-menuId").children("a").first().addClass("sel");
},200);

//the last pic of every row modify margin-right
$(".li-wrap>.every-pic").each(function() {
    if (($(this).index() + 1) % 7 == 1) {
        $(this).addClass("modi-left");
    }
});

//change hot or new
$("#c-menu").delegate("span", "click", function(event) {
    var $this = $(this);
    $this.addClass("c-m-sel");
    $this.siblings("span").removeClass("c-m-sel");
    if (event.target.id === "c-hot") {
        $("#new-ul").hide();
        $("#hot-ul").show();
    }else{
        $("#hot-ul").hide();
        $("#new-ul").show();
    }
    event.preventDefault();
});
