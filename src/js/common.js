    require("./jquery.js");
    require("./config.js");
    var PARAM = {
      "defaultVal": "请输入漫画名、作者名..."
    };

    function oSearchSuggest(inputId, searBtn, tipsId) {
      this.input = $('#' + inputId);
      this.suggestWrap = $('#' + tipsId);
      this.searBtn = $("#" + searBtn);
    }

    oSearchSuggest.prototype.init = function() {
      var me = this;
      me._init();

      me.input.bind({
        keyup: function(event) {
          me.inputKeyup(event.which, me.input.val());
        },
        blur: function() {
          me.inputBlur(me.input.val());
        },
        focus: function() {
          me.inputFocus(me.input.val());
        }
      });

      me.searBtn.bind({
        click: function(evt) {
          me.search(me.input.val());
          evt.preventDefault();
        }
      });
    };

    oSearchSuggest.prototype._init = function(evt) {
      var me = this;
      $(document).click(function(evt) {
        if (evt.target.id !== "search-text") {
          me.suggestWrap.empty().hide();
        }
      });
    };

    oSearchSuggest.prototype.inputKeyup = function(which, val) {
      Keyup.types[switchType(which)].trydo(val);
    };

    oSearchSuggest.prototype.inputBlur = function(val) {
      var val1 = $.trim(val);
      if (!val1) {
        this.input.val(PARAM.defaultVal);
      }
    };

    oSearchSuggest.prototype.inputFocus = function(val) {
      var val1 = val;
      if (val1 == PARAM.defaultVal) {
        this.input.val("");
      } else if (val1 !== "" || !val1) {
        this.getTips(val1);
      }
    };

    oSearchSuggest.prototype.search = function(searchVal) {
      searchSuggest.suggestWrap.hide();
      if (searchVal == PARAM.defaultVal) {
        return;
      }
      location.href = config.common.url_relocation + "?query=" + searchVal;
    };

    oSearchSuggest.prototype.dataDisplay = function(reData) {
      var me = this,
        html = [],
        data = reData.data,
        len = data.length,
        i = 0;

      if (!data || !data.length || data.length === 0) {
        return;
      }
      for (; i < len; i++) {
        html.push("<li>", data[i], "</li>");
      }
      me.suggestWrap.empty().append(html.join(""));
      me.suggestWrap.show();

      //为下拉选项绑定鼠标事件  
      me.suggestWrap.find('li').hover(function() {
        me.suggestWrap.find('li').removeClass('hover');
        $(this).addClass('hover');

      }, function() {
        $(this).removeClass('hover');
      }).bind('click', function() {
        me.input.val(this.innerHTML);
        me.suggestWrap.hide();
      });
    };

    oSearchSuggest.prototype.getTips = function(val) {
      var me = this;
      $.ajax({
        url: config.common.url_searchTips,
        type: "POST",
        data: {
          "query": val
        },
        dataType: "json",
        error: function() {
             alert(config.common.error);    
        },
        success: function(reData) {
          if (reData.ret) {
            if (reData.data.length === 0) {
              me.suggestWrap.empty();
              me.suggestWrap.hide();
              return;
            }
            me.dataDisplay(reData);
          }


        }
      });
    };

    var searchSuggest = new oSearchSuggest("search-text", "search-btn", "inputTipsId");
    searchSuggest.init();


    function switchType(code) {
      switch (code) {
        case 38:
          return "toUp";
          break;

        case 40:
          return "toDown";
          break;

        case 13:
          return "toSearch";
          break;
        default:
          return "toGetTips";
      }
    }


    /*****策略模式**********/
    var Keyup = {
      types: {
        toUp: {},
        toDown: {},
        toSearch: {},
        toGetTips: {}
      }
    };

    Keyup.types.toUp = {
      trydo: function(val) {
        var current = searchSuggest.suggestWrap.find('li.hover');
        if (current.length > 0) {
          var prevLi = current.removeClass('hover').prev();
          if (prevLi.length > 0) {
            prevLi.addClass('hover');
            searchSuggest.input.val(prevLi.html());
          }
        } else {
          var last = searchSuggest.suggestWrap.find('li:last');
          last.addClass('hover');
          searchSuggest.input.val(last.html());
        }
      }
    };

    Keyup.types.toDown = {
      trydo: function(val) {
        var current = searchSuggest.suggestWrap.find('li.hover');
        if (current.length > 0) {
          var nextLi = current.removeClass('hover').next();
          if (nextLi.length > 0) {
            nextLi.addClass('hover');
            searchSuggest.input.val(nextLi.html());
          }
        } else {
          var first = searchSuggest.suggestWrap.find('li:first');
          first.addClass('hover');
          searchSuggest.input.val(first.html());
        }
      }
    };


    Keyup.types.toSearch = {
      trydo: function(val) {
        searchSuggest.search(val);
      }
    };

    Keyup.types.toGetTips = {
      trydo: function(val) {
        var valText = $.trim(val);
        if (valText === '' || valText === PARAM.defaultVal || !valText) {
          searchSuggest.suggestWrap.empty().hide();
          return;
        }
        searchSuggest.getTips(valText);
      }
    };



     //同类漫画加载     
    exports.get_similarClass = function(typeid) {
      $.ajax({
        url: config.common.url_similarClass,
        type: 'GET',
        cache: false,
        dataType: 'json',
        data: {
          "typeid": typeid
        },
        error: function() {
          alert(config.common.error);
        },
        success: function(reData) {
          if (reData.ret) {
            var html = [],
              data = reData.data.resource,
              i=0;

            for (; data[i]; i++) {
              html.push('<li class="every-pic"><dl><dt><a href="' + config.common.url_detailComics + data[i].comicsId + '&typeId=' + data[i].typeId + '">' + '<img src="' + data[i].comicsCoverURL + '" class="c-p-one"/></a></dt>' + '<dd><p><a title="' + data[i].name + '" href="' + config.common.url_detailComics + data[i].comicsId + '&typeId=' + data[i].typeId + '" class="hua-name-class">' + data[i].name + '</a></p></dd></dl></li>');
            }
            $("#li-wrap-id").empty().append(html.join(""));
          }
        }
      });
    }

     //获取某一类漫画
    exports.get_oneClass = function(page, limit) {
      var param = location.search.substr(1),
          typeId = param.split("=")[1];
      if (typeId.indexOf("#") > -1) {
        typeId.length = typeId.length - 1;
      }
      //样式
      $(".h-menu>a").eq(0).removeClass("sel");
      $(".h-menu>a").eq(typeId.substr(1, 2)).addClass("sel");

      $.ajax({
        url: config.common.url_oneClass,
        type: "get",
        cache: false,
        data: {
          "typeId": typeId,
          "page": page,
          "limit": limit
        },
        dataType: "json",
        error: function() {
          alert(config.common.error);
        },
        success: function(reData) {
          if (reData.ret) {
            var html = [],
                data = reData.data.comics_attr,
                i=0;
            for (; data[i]; i++) {
              html.push('<li class="c-li"><dl><dt><a href="' + config.common.url_detailComics + data[i].comicsId + '&typeId=' + data[i].typeId + '">' + '<img src="' + data[i].comicsCoverURL + '"  class="c-img"/></a></dt><dd>' + '<p><a href="' + config.common.url_detailComics + data[i].comicsId + '&typeId=' + data[i].typeId + '" class="hua-name">' + data[i].name + '</a></p>' + '<p class="updateCounts">' + data[i].latest + '</p><div class="c-detail"><p>更新于：<span>' + data[i].updateTime + '</span></p>' + '<p>状态：<span>' + data[i].state + '</span></p><p>简介：<span title="' + data[i].briefIntro + '">' + data[i].briefIntro + '</span></p></div></dd></dl></li>');
            }
            $("#one-class-ul").empty().append(html.join(""));

            $(".c-li").each(function() {
              if (($(this).index() + 1) % 3 === 0) {
                $(this).addClass("modi-left");
              }
            });

            var total = reData.data.count;
            $("#comics_total").text(total);
            var num_entries = Math.ceil(total / 12);
            if (config.common.initFlag === 0) {
              // 创建分页，
              $("#Pagination").pagination(num_entries, {
                num_edge_entries: 1, //边缘页数
                num_display_entries: 3, //主体页数
                callback: classCallback,
                items_per_page: 1, //每页显示1项
                prev_text: "上一页",
                next_text: "下一页"
              });
              config.common.initFlag = 1;
            } //end if 只用来初始化
          } else {
            alert(reData.errmsg);
          }
        }
      });
    }


     //搜索结果显示
    exports.get_search = function(page, limit) {
      //样式
      $(".h-menu>a").removeClass("sel");
      var query = location.search.substr(1).split("=")[1];
      if (query.indexOf("#") > -1) {
        query.length = query.length - 1;
      }
      query = decodeURI(query);

      //查询key
      $("#search-text").val(query);
      $.ajax({
        url: config.common.url_search,
        type: "get",
        cache: false,
        data: {
          "query": query,
          "page": page,
          "limit": limit
        },
        dataType: "json",
        error: function() {
          alert(config.common.error);
        },
        success: function(reData) {
          if (reData.ret) {
            var html = [],
             data = reData.data.comic_attr,
             i=0,
             total = reData.data.count,
             num_entries = Math.ceil(total / 12);
             
            $("#comics_total").text(total);

            for (; i < data.length; i++) {
              html.push('<li class="c-li"><dl><dt><a href="' + config.common.url_detailComics + data[i].comicsId + '&typeId=' + data[i].typeId + '">' + '<img src="' + data[i].comicsCoverURL + '"  class="c-img"/></a></dt><dd>' + '<p><a href="' + config.common.url_detailComics + data[i].comicsId + '&typeId=' + data[i].typeId + '" class="hua-name">' + data[i].name + '</a></p>' + '<p class="updateCounts">' + data[i].latest + '</p><div class="c-detail"><p>更新于：<span>' + data[i].updateTime + '</span></p>' + '<p>状态：<span>' + data[i].state + '</span></p><p>简介：<span title="' + data[i].briefIntro + '">' + data[i].briefIntro + '</span></p></div></dd></dl></li>');
              $("#one-class-ul").empty().append(html.join(""));
              $(".c-li").each(function() {
                if (($(this).index() + 1) % 3 == 0) {
                  $(this).addClass("modi-left");
                }
              });
            }
            
            
            if (config.common.initFlag == 0) {
              // 创建分页，
              $("#Pagination").pagination(num_entries, {
                num_edge_entries: 1, //边缘页数
                num_display_entries: 4, //主体页数
                callback: searchCallback,
                items_per_page: 1, //每页显示1项             
                prev_text: "上一页",
                next_text: "下一页"
              });
              config.common.initFlag = 1;
            } //end if 只用来初始化
          } else {
            alert(reData.errmsg);
          }
        }
      });
    }
     //分页回调
    function searchCallback(page_index, jq) {
      exports.get_search(page_index, 12);
    }

    function classCallback(page_index, jq) {
      if (config.common.initFlag === 0) {
        return;
      }
      exports.get_oneClass(page_index, 12);
    }