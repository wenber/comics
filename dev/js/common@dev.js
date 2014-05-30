
;(function(__context){
    var module = {
        id : "a16bfcc40c3f50f8de864f0f54ce3cb5" , 
        filename : "common.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

        window.config = {
	      "common": {
	        "error": "Error loading json document",//错误提示信息
	        "url_search": "/qunar/seven/comics/search.do",//搜索请求地址
	        "url_detailComics": "/qunar/seven/comics/getcomics.do?id=",//漫画详情请求地址
	        "url_updateSource":"/qunar/seven/comics/replace.do?id=",//更新漫画来源请求地址
	        "url_similarClass":"/qunar/seven/comics/getsimilar.do",//同类漫画请求地址
	        "url_oneClass": "/qunar/seven/comics/getspecies.do",//某一类漫画请求地址
	        "url_relocation":"/qunar/seven/comics/relocation.do",//搜索重定向
          "url_perComic":"/qunar/seven/comics/gotoShowUI.do?episodeId=",//某一话显示地址
          "url_getcomicslist":"/qunar/seven/comics/getcomicslist.do",
          "url_post":"/qunar/seven/comics/post.do",
          "url_getposts":"/qunar/seven/comics/getposts.do",
	        "initFlag":0
	      }
    };
    
     //搜索框获得焦点
    $("#search-text").focus(function() {
      var $this = $("#search-text");
      if ($this.val() === "请输入漫画名、作者名...") {
        $this.val("");
        $this.removeClass("searchWarm");
      }
    });

     //回车触发搜索
    $("#search-text").on("keydown", function(event) {
      if (event.which == 13) {
    	  var $this = $("#search-text");
          var searchVal = $this.val();
          if (!searchVal || searchVal == "请输入漫画名、作者名...") {
            $this.addClass("searchWarm");
            return false;
          } else {
            $this.removeClass("searchWarm");
            location.href=config.common.url_relocation+"?query="+searchVal;
          }
      }
    });

     //搜索框失去焦点
    $("#search-text").blur(function() {
      var $this = $("#search-text");
      if (!$this.val() || $this.val() == " ") {
        $this.val("请输入漫画名、作者名...");
      }
    });
     //单击找漫画按钮
    $("#search-btn").bind("click", function() {
      var $this = $("#search-text");
      var searchVal = $this.val();
      if (!searchVal || searchVal == "请输入漫画名、作者名...") {
        $this.addClass("searchWarm");
        return false;
      } else {
        $this.removeClass("searchWarm");
        location.href=config.common.url_relocation+"?query="+searchVal;
      }
    });

    //同类漫画加载     
    exports.get_similarClass=function(typeid) {
      $.ajax({
        url: config.common.url_similarClass,
        type: 'GET',
        dataType: 'json',
        data: {
          "typeid": typeid
        },
        error: function() {
          alert(config.common.error);
        },
        success: function(reData) {
          if (reData.ret) {
            var html = "";
            var data = reData.data.resource;
           // alert(data[0].name);
            for (var i = 0; data[i]; i++) {
              html = html + ('<li class="every-pic"><dl><dt><a href="' + config.common.url_detailComics + data[i].comicsId + '&typeId='+data[i].typeId+'">'
            		  +'<img src="' + data.comicsCoverURL + '" class="c-p-one"/></a></dt>'
            		  +'<dd><p><a href="' + config.common.url_detailComics + data[i].comicsId + '&typeId='+data[i].typeId+'" class="hua-name-class">' + data[i].name + '</a></p></dd></dl></li>');
            }
            $("#li-wrap-id").empty().append(html);
          }
        }
      });
    }
    
  //获取某一类漫画
   exports.get_oneClass=function(page, limit) {
	//获取参数
    var param = location.search.substr(1);
    var typeId = param.split("=")[1];
    if(typeId.indexOf("#")>-1){
      typeId.length=typeId.length-1;
    }
    //console.log(page);
    //console.log(limit);
    //样式
    $(".h-menu>a").eq(0).removeClass("sel");
    $(".h-menu>a").eq(typeId.substr(1,2)).addClass("sel");
    
    $.ajax({
      url: config.common.url_oneClass,
      type: "get",
      data: {
        "typeId": typeId,
        "page":page,
        "limit": limit
      },
      dataType: "json",
      error: function() {
    	  alert(config.common.error);
      },
      success: function(reData) {
        if (reData.ret) {
          var html = "";
          var data = reData.data.comics_attr;
          for (var i = 0; data[i]; i++) {
            html = html + ('<li class="c-li"><dl><dt><a href="'+config.common.url_detailComics+data[i].comicsId+'&typeId='+data[i].typeId+'">'
            		+'<img src="' + data[i].comicsCoverURL + '"  class="c-img"/></a></dt><dd>'
            		+'<p><a href="'+config.common.url_detailComics+data[i].comicsId+'&typeId='+data[i].typeId+'" class="hua-name">' + data[i].name + '</a></p>'
            		+'<p class="updateCounts">' + data[i].latest + '</p><div class="c-detail"><p>更新于：<span>' + data[i].updateTime + '</span></p>'
            		+'<p>状态：<span>' + data[i].state + '</span></p><p>简介：<span>' + data[i].briefIntro + '</span></p></div></dd></dl></li>');
            $("#one-class-ul").empty().append(html);
            $(".c-li").each(function() {
              if (($(this).index() + 1) % 3 == 0) {
                $(this).addClass("modi-left");
              }
            });
          }
          var total = reData.data.count;
          $("#comics_total").text(total);
          var num_entries = Math.ceil(total/12);
          if(config.common.initFlag==0){
	      	    // 创建分页，
	      	    $("#Pagination").pagination(num_entries, {
	      	    	num_edge_entries: 1, //边缘页数
      				num_display_entries: 3, //主体页数
      				callback: classCallback,
      				items_per_page: 1,//每页显示1项
      				prev_text:"上一页",
			      	next_text:"下一页"
	      	    });
	      	   config.common.initFlag = 1;
          }//end if 只用来初始化
        } else {
          alert(reData.errmsg);
        }
      }

    });
  }
  
  
  //搜索结果显示
   exports.get_search=function(page,limit) {
    //样式
    $(".h-menu>a").removeClass("sel");
    var query=location.search.substr(1).split("=")[1];
    if(query.indexOf("#")>-1){
      query.length=query.length-1;
    }
    query = decodeURI(query);
    
    //查询key
    $("#search-text").val(query);
    $.ajax({
      url: config.common.url_search,
      type: "get",
      data: {
        "query":query,
        "page":page,
        "limit":limit
      },
      dataType: "json",
      error: function() {
    	  alert(config.common.error);
      },
      success: function(reData) {
        if (reData.ret) {
          var html = "";
          var data = reData.data.comic_attr;
  
          for (var i = 0; i<data.length; i++) {
            html = html + ('<li class="c-li"><dl><dt><a href="'+config.common.url_detailComics+data[i].comicsId+'&typeId='+data[i].typeId+'">'
            		+'<img src="' + data[i].comicsCoverURL + '"  class="c-img"/></a></dt><dd>'
            		+'<p><a href="'+config.common.url_detailComics+data[i].comicsId+'&typeId='+data[i].typeId+'" class="hua-name">' + data[i].name + '</a></p>'
            		+'<p class="updateCounts">' + data[i].latest + '</p><div class="c-detail"><p>更新于：<span>' + data[i].updateTime + '</span></p>'
            		+'<p>状态：<span>' + data[i].state + '</span></p><p>简介：<span>' + data[i].briefIntro + '</span></p></div></dd></dl></li>');
            $("#one-class-ul").empty().append(html);
            $(".c-li").each(function() {
              if (($(this).index() + 1) % 3 == 0) {
                $(this).addClass("modi-left");
              }
            });
          }
          var total = reData.data.count;
          $("#comics_total").text(total);
          var num_entries =Math.ceil(total/12);
          if(config.common.initFlag==0){
	      	    // 创建分页，
	      	    $("#Pagination").pagination(num_entries, {
	      				num_edge_entries: 1, //边缘页数
	      				num_display_entries: 4, //主体页数
	      				callback: searchCallback,
	      				items_per_page: 1, //每页显示1项	      			
			      	    prev_text:"上一页",
			      	    next_text:"下一页"
	      	    });
	      	   config.common.initFlag = 1;
          }//end if 只用来初始化
        } else {
          alert(reData.errmsg);
        }
      }
    });
  }
  	//分页回调
  	function searchCallback(page_index, jq){
  		exports.get_search(page_index, 12);
	  }
  	function classCallback(page_index, jq){
  		exports.get_oneClass(page_index, 12);
	  }

    })( module.exports , module , __context );
    __context.____MODULES[ "a16bfcc40c3f50f8de864f0f54ce3cb5" ] = module.exports;
})(this);
