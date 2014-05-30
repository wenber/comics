   require("./jquery.js");
   require("./form.js");
   require("./config.js");
   var globle = "";
   $("#addFile").click(function() { 
     $("#form_1").show();
     $("#form_2").hide();
   });
   var options = {
     success: showResponse,
     dataType: "json",
     timeout: 3000
   };
   $("#close_1").click(function() { 
     showRequest();
   });

   function showRequest() {
     var file1_path = $("#file_1").val();
     var file2_path = $("#file_2").val();
     if ((file1_path != "") && (file2_path != "")) {
       isEmpt(file1_path,file2_path);
     } else {
       globle = "请选择文件";
       showDialog(globle);
       $("#div3").empty();
     }
   }

   function isEmpt(a,b) {
     var file1_txt = a.substring(a.length - 3, a.length);
     var file2_txt = b.substring(b.length - 3, b.length);
     if (file1_txt != "txt" || file2_txt != "txt") {
       globle = "请选择正确的格式";
       showDialog(globle);
       $("#div3").empty();
     } else {
       $("#form_1").ajaxSubmit(options);
        $("#div3").empty();
     }
   }

   function showDialog(data) {
     clearDiv();
     setTimeout(function() {
       $("#div3").append("<p id='appendColor'><h1>" + globle + "</h1></p>");
     }, 100);

   }

   function showResponse(responseText) {
     if (responseText.ret) {
       $("#div2").fadeIn(1000).fadeOut(2000);
       clearFile();
     } else {
       globle = responseText.errmsg;
       showDialog(globle);
        $("#div3").empty();
     }
   }

   function clearDiv() {
     $("#div3").fadeIn(1000).fadeOut(2000);
   }

   function clearFile() {
     $("#div3").empty();
     $("#file_1").val("");
     $("#file_2").val("");
   }
   $("#addManager").click(function() { 
     $("#form_2").show();
     $("#form_1").hide();
   });
   $("#close_2").click(function() {
     var name = $("#nameManager").val();
     if (name != "") {
       $.ajax({
         url: config.common.url_addAdmin,
         type: "POST",
         dataType: "json",
         catch:false,
         data: {
           "username": name
         },
         error: function() {
           alert("添加出错");
         },
         success: function(data) {
           if (data.ret) {
             $("#div2").fadeIn(1000).fadeOut(2000);
           } else {
             globle = data.errmsg;
             showDialog(globle);
           }
           $("#nameManager").val(""); //清空之前添加管理员的文本框
         }
       });
     } else {
       globle = "管理员名字不能为空哦！";
       showDialog(globle);
       $("#div3").empty();
     }
     return false;
   });