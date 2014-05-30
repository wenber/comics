require("./common.js");
var flag = 0;
var countImg = "";
var count = 0;
var srcArry = new Array();
var total = "";
var newd = [];
var pushCount = 1;

function p_Parent(content) {
    this.content = content; //有一个属性
};
p_Parent.prototype = {
    constructor: p_Parent,
    showMessage: function(divM, callback) { //显示留言板
        if (flag == 0) {
            $("#" + divM).show("fast", callback);
            flag = 1;
        }
    },
    addMessage: function(divM) { //当留言板获得焦点时改变样式
        $("#" + divM).css({
            "color": "black",
            "border": "1px solid #f6851f"
        });
    },
    removeMessage: function(divM) { //失去焦点是变回样式
        $("#" + divM).css("border", "1px solid black");
    },
    disableMessage: function(divM) { //关闭操作
        if (flag == 1) {
            $("#" + divM).hide("fast");
            flag = 0;
            $("#im2").show();
        }

    },
    centerMessage: function(divM) { //对位置的定位
        var Wi = $("#" + divM).width();
        var Hi = $("#" + divM).height();
        $("#" + divM).animate({
            "right": Wi / 20,
            "bottom": Hi / 9
        });
    },
    resizeMessage: function(divM) {
        var that = this;
        $(window).resize(function() {
            var H = document.documentElement.clientHeight;
            var W = document.documentElement.clientWidth;
            if (H < 425) {
                $("#" + divM).css({
                    'bottom': W * 0.01,
                    'right': H * 0.01
                });
            } else {
                // console.log("大于留言板的高度 恢复");
                that.centerMessage(divM);
            }
        });
    },
    centerRight: function(divM) { //对左右按钮的定位
        var that = this;
        var H = document.documentElement.clientHeight;
        var Hi = $("#" + divM).height();
        $("#" + divM).css("top", H / 2);
    },
    clearMessage: function(divM, defaultC) { //如果输入框内等于默认字则当获取焦点时清空
        if ($("#" + divM).val() == defaultC) {
            $("#" + divM).val(" ");
        } else {
            return false;
        }
    },
    restoration: function(divM) { //如果失去焦点时框内为空，则显示默认字
        if ($("#" + divM).val() == " ") {
            $("#" + divM).val("评论不能少于5字不能多于90个字哦！");
        } else {
            return false;
        }
    },
    clearAllMessage: function(divM) { //当按下清空按钮时的操作
        $("#" + divM).val(" ");
    },
    clearPeople: function(divM) { //当关闭留言板时会自动清空上面的所有数据
        $("#" + divM).text(" ");
    },
    appendDiv: function(data) { //将内容追加到指定区域
        var that = this;
        if (data.length > 10) {
            $("#context").append("<span>" + data + "</span><br><br><hr/>");
            that.scollTdis("other");
        }
    },
    getRequestData: function(callback, imageid) { //点击留言按钮时对后台发起的请求数据的请求
        // console.log(2);
        // console.log(imageid);
        var that = this;
        $.ajax({
            url: config.common.url_getposts,
            type: 'GET',
            dataType: 'json',
            cache: false,
            data: {
                "imageId": imageid
            },
            error: function(xhr) {
                alert("失败");
            },
            success: function(json) {
                if (json.ret) {
                    that.successmessage(json);
                }
                callback && callback();

            }
        });
    },
    submite: function(ID, cona) { //当输入完文字后点击发布时对后台的插入与返回的请求
        // console.log(ID);
        var that = this;
        $.ajax({
            url: config.common.url_post,
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                "imageId": ID,
                "context": cona,
            },
            error: function(xhr) {
                alert("失败");
            },
            success: function(data) {
                if (data.ret) {
                    that.successmessage(data);
                } else {
                    alert(data.errmsg);
                }
                that.scollTdis("other");
            }

        });

    },
    successmessage: function(data) { //将请求与发布的成功回调函数写在这里
        var that = this;
        var htm = "";
        var timeName = "";
        var con = "";
        if (data.ret) {
            var newd = data.data;
            var len = newd.length || 0;
            if (len != 0) {
                for (var i = 0; i < len; i++) {
                    timeName = '<hr/><p class="nametime">' + newd[i].username + '&nbsp;' + newd[i].time + '<span class="floor">' + (i + 1) + '楼</span></p><br/>';
                    if (i != len - 1) {
                        con = '<span>' + newd[i].context + '</span><br/><br/>';
                    } else {
                        con = '<span>' + newd[i].context + '</span>';
                    }
                    htm += timeName + con;
                }
            }
            that.appendDiv(htm);
            $(".nametime").addClass("addtnColor");
        } else {
            alert("亲，出错了，重新点击吧！");
        }
    },
    scollTdis: function(data) { //对滚动条的位置的要求直底部
        $("#" + data)[0].scrollTop = $("#context").height();

    },
    leftShoing: function(data) { //点击左边按钮的操作     
        var that = this;
        var arr = document.getElementsByTagName("li");
        var len = newd.length;
        var $u = $("#ul");
        var sum = "";
        if (countImg == len) {
            return false;
        } else {
            $("#current_list").empty();
            countImg++;
            $u.animate({
                left: "+=856px"
            }, 500);
            sum = len - countImg + 1;
            that.sumCount(sum);
            that.clearPeople("context");
            that.disableMessage("people");
        }
    },
    rightShoing: function(data) { //点击右边按钮的操作        
        var html = "";
        var that = this;
        var sum = "";
        var $u = $("ul");
        var len = newd.length;
        var mod = len % 5;
        if (countImg == 1) {
            return false;
        } else {
            $("#current_list").empty();
            countImg--;
            $u.animate({
                left: "-=856px"
            }, 500);
            pushCount++;
            if (pushCount % 5 == 0 && len - pushCount >=5) {
                for (var i = pushCount; i < pushCount + 5; i++) {
                    html = html + ("<li><img src='" + newd[i] + "' id='" + i + "' /></li>");
                }
                $("#ul").append(html);
            } else if (pushCount % 5 == 0 && len - pushCount <5) {
                for (var i = pushCount; i < pushCount + mod; i++) {
                    html = html + ("<li><img src='" + newd[i] + "' id='" + i + "' /></li>");
                }
                $("#ul").append(html);
            }
            sum = len - countImg + 1;
            that.sumCount(sum);
            that.clearPeople("context");
            that.disableMessage("people");
        }
    },
    getCookie: function(Name) {
        var search = Name + "=";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search);
            if (offset != -1) {
                return true;
            } else return false;
        } else {
            return false;
        }
    },
    sumCount: function(data) {
        $("#current_list").append("<span id='current_count'>第" + data + "/</span>");
    }
};

function p_Message() {
    p_Parent.call(this, "我是留言板");
    this.init = function() { //执行入口
        this.mouseOver();
        this.messageShow();
        this.changepart();
        this.messageClose();
        this.makesures();
        this.resetsBut();
        this.choosefont();
        this.textKeycount();
    };
    this.mouseOver = function() {
        var that = this;
        var $me = $("#mess");
        var $dito = $("#div_gotop");
        $me.mouseover(function() {
            $(this).attr("title", "我想说...");
        });
        $dito.mouseover(function() {
            $(this).attr("title", "返回顶部");
        });
    };
    this.messageShow = function() { //显示
        var that = this;
        var $m = $("#im2");
        $m.click(function() {
            var srcdata = srcArry[total - countImg];
            // console.log(srcdata);
            that.getRequestData(function() {
                that.centerMessage("people");
                that.resizeMessage("people");
                that.showMessage("people", function() {
                    $("#other")[0].scrollTop = $("#context").height();
                });
            }, srcdata);
            $m.hide();
            that.clearPeople("context");
        });
    };
    this.messageClose = function() { //关闭
        var that = this;
        var $clo = $("#closeC");
        $clo.click(function() {
            that.clearPeople("context");
            that.disableMessage("people");
            return false;
        });

    };
    this.changepart = function() { //改变内容
        var that = this;
        var content = $("#contentPart").val();
        $("#contentPart").focus(function() {
            that.addMessage("contentPart");
            that.clearMessage("contentPart", content);
        });

        $("#contentPart").blur(function() {
            that.removeMessage("contentPart");
            that.restoration("contentPart");
        });
    };
    this.makesures = function() { //发布
        var that = this;
        $("#makesure").click(function() {
            if (that.getCookie('ASBCG_JEVGX')) {
                var srcc = srcArry[total - countImg];
                var valu = $("#contentPart").val();
                var mess_age = "评论不能少于5字不能多于90个字哦！";
                if (valu == mess_age || valu == " " || valu.length < 6) {
                    alert("评论为空哦$*$");
                } else {
                    that.clearPeople("context");
                    that.submite(srcc, valu);
                }
                that.clearPeople("contentPart");
                that.clearAllMessage("contentPart");
            } else {
                alert("亲，需要登录哦$*$!");
            }
        });
    };
    this.resetsBut = function() { //清空
        var that = this;
        $("#resets").click(function() {
            that.clearAllMessage("contentPart");
        });
    };
    this.choosefont = function() { //改变字体大小
        var that = this;
        $("#fontSize").change(function() {
            $("#contentPart").css("fontSize", $("#fontSize").val());
        });
    };
    this.textKeycount = function() {
        var that = this;
        $("#contentPart").keydown(function(event) {
            if ($("#contentPart").val().length > 90) {
                //console.log("33");
                var val = $("#contentPart").val();
                $("#contentPart").val(val.substr(0, 90));
            }

        });
    };
};
p_Message.prototype = new p_Parent(); //对这个子类的一个实例化
var p = new p_Message();
p.init();
//左右键子类
function p_leftRight() {
    p_Parent.call(this, "左右图标");
    this.init = function() {
        this.imgAjax(); //入口
        this.leftShow();
        this.rightShow();
        this.goRight();
        this.goLeftRight();

    };
    this.imgAjax = function() { //进
        var paramete = location.search.split("?")[1];
        var partParamete = paramete.split("&")[0];
        var nameParamete = paramete.split("&")[1];
        var episode = partParamete.split("=")[1];
        var name = nameParamete.split("=")[1];
        $("#name_1").html(decodeURI(name));
        var htm = "";
        $.ajax({
            url: config.common.url_getcomicslist,
            type: 'GET',
            cache: false,
            dataType: "json",
            data: {
                "episodeId": episode
            },
            error: function(xhr) {
                alert('发生错误!');
            },
            success: function(json) {
                var that = this;
                if (json.ret) {
                    total = countImg = json.data.count; //得到漫画的总张数
                    $("#head_list").append("<span id='count_totle'>" + countImg + "张</span>");
                    newd = json.data.comic_attr;
                    var comicName = newd[0].split("/");
                    var leen = comicName.length;
                    var fontSr = comicName[leen - 2];
                    $("#number_1").append(fontSr); //获取到汉字了
                    var lens = newd.length;
                    var temp = new Array(lens);
                    var html = "";
                    if (lens <= 5) {
                        for (var i = 0; i < lens; i++) {
                            temp[i] = newd[i];
                            html = html + ("<li><img src='" + newd[i] + "' id='" + i + "' /></li>");
                        }
                    } else {
                        for (var i = 0; i < 5; i++) {
                            temp[i] = newd[i];
                            html = html + ("<li><img src='" + newd[i] + "' id='" + i + "' /></li>");
                        }
                    }

                    $("#ul").append(html);
                    for (var j = 0; j < lens; j++) {
                        srcArry[j] = newd[j];
                    }
                }
            }
        });
    };
    this.leftShow = function() { //左边按钮的显示

        var that = this;
         var time = null;
        $("#left_1").click(function() {
            clearTimeout(time);
             time = setTimeout(function(){
                that.leftShoing("left_1");
            }, 200);
            
        });

    };
    this.rightShow = function() { //右边按钮的显示

        var that = this;
        var time = null;
        $("#right_1").click(function() {
            clearTimeout(time);
            time = setTimeout(function(){
                that.rightShoing("right_1");
            }, 200);
            
        });
    };
    this.goRight = function() { //对第一个或是最后一个进行判断并相应的显示按钮
        var that = this;
        $(document).mousemove(function(e) {
            var W = document.documentElement.clientWidth; //获取页面宽度与高度        
            var arr = document.getElementsByTagName("li");
            var len = arr.length - 1;
            var left = $("#left_1");
            var right = $("#right_1");
            var $u = $("#ul").position().left;
            var hei = e.pageY - 30;
            var dis = len * (-856);
            var mousewid = e.pageX;
            if ((e.pageX > W * 0.5 || $u == 0) && $u != dis) {
                right.fadeIn(500);
                left.css("display", "none");
                that.centerRight("right_1");
            } else if (e.pageX < W * 0.5 || $u == dis) {
                left.fadeIn(500);
                right.css("display", "none");
                that.centerRight("left_1");
            }
        });
    };
    this.goLeftRight = function() { //按下键盘左右键对应的操作
        var that = this;
        $("body").keyup(function(event) {
            if (event.keyCode == 37) {
                that.leftShoing("left_1");
            } else if (event.keyCode == 39) {
                that.rightShoing("right_1");
            }
        });
    };
};
p_leftRight.prototype = new p_Parent(); //对这个子类的一个实例化
var pe = new p_leftRight();
pe.init();

function p_gotoTop() {
    p_Parent.call(this, "返回顶部");
    this.init = function() {
        this.startgotoTop();
        this.scrollMethod();
    };
    this.startgotoTop = function() {
        if (!-[1, ] && !window.XMLHttpRequest) {
            this.scrollMethod(".page", ".page");
        } else {
            this.scrollMethod(window, "body,html");
        }
    };

    this.scrollMethod = function(window, body) {
        var goTop = $("#div_gotop");
        $(window).scroll(function() {
            if ($(this).scrollTop() === 0) {
                goTop.fadeOut();
            }
            if ($(this).scrollTop() > 0) {
                goTop.fadeIn();
            }
        });
        goTop.click(function() {
            $(body).animate({
                scrollTop: 0
            }, 400, function() {
                goTop.stop().fadeOut();
            });
        });
    };
};
p_gotoTop.prototype = new p_Parent(); //对这个子类的一个实例化
var pt = new p_gotoTop();
pt.init();