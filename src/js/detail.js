var detail = require("./common.js");

$(".h-menu").children().removeClass();


//同类漫画加载     
var typeId = window.location.search.split("&")[1].split("=")[1];
if (typeId.indexOf("#") > -1) {
  typeId.length = typeId.length - 1;
}
detail.get_similarClass(typeId);
$(".source>a").first().addClass("s-sel");
get_updateSource($("#sourceid").children("a").first().attr("id"));

//剧集漫画变更    
var $hua = [],
  PAGELEN = 50;

function get_updateSource(resourceId) {
  $.ajax({
    url: config.common.url_updateSource,
    type: 'GET',
    dataType: 'json',
    cache: false,
    data: {
      "resourceId": resourceId
    },
    error: function() {
      alert(config.common.error);
    },
    success: function(reData) {
      console.log(reData.ret);
      if (reData.ret) {

        var data = reData.data.comic_attr,
          len = data.length,

          pages = Math.ceil(len / PAGELEN),
          page = [];

        $hua.length = 0;

        /**话分组**/
        if (pages == 1) {
          page.push('<span id="' + ((pages - 1) * PAGELEN) + '">1-' + len +
            '</span>');
        } else {
          for (var i = 0; i < pages - 1; i++) {
            page.push('<span id="' + (i * PAGELEN) + '">' + (i * PAGELEN + 1) + '-' + ((i + 1) * PAGELEN) +
              '</span>');
          }
          page.push('<span id="' + ((pages - 1) * PAGELEN) + '">' + ((pages - 1) * PAGELEN + 1) + '-' + len +
            '</span>');
        }

        //每一话
        for (var j = 0; j < len; j++) {
          $hua.push('<li><a title="' + data[j].name + '" id="' + data[j].id + '" href="' + config.common.url_perComic + data[j].episodeId + '&name=' + $(".hua-name").first().text() + '">' + data[j].name + '</a></li>');
        }
        $("#hua-pagesId").empty().append(page.join(""));
        $("#episodeId").empty().append(getComics(0));
        $(".hua-pages>span").first().trigger("click");

      } //end if
    } // end success
  }); // end ajax
} //end function

function getComics(pageStart) {

  return $hua.slice(pageStart, (parseInt(pageStart, 10) + parseInt(PAGELEN, 10))).join("");
}

$(".episode > li").each(function() {
  if (($(this).index() + 1) % 10 == 0) {
    $(this).addClass("episode-right");

  }

});

/**事件绑定区**/
//资源来源切换
$(".source>a").click(function() {
  var $this = $(this);
  $this.addClass("s-sel");
  $this.siblings().removeClass("s-sel");
  get_updateSource($this.attr("id"));
  $(".hua-pages>span").first().addClass("s-sel");
});
//集数切换
$(".hua-pages").first().delegate("span", "click", function() {
  var $this = $(this);
  $this.addClass("s-sel");
  $this.siblings().removeClass("s-sel");
  $("#episodeId").empty().append(getComics($this.attr("id")));


});
//集数划过效果
$("ul.episode").first().delegate("li", "mouseover", function() {
  var $this = $(this);
  $this.addClass("episode-sel");
});
//集数划过效果
$("ul.episode").first().delegate("li", "mouseleave", function() {
  var $this = $(this);
  $this.removeClass("episode-sel");
});