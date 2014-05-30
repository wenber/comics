
;(function(__context){
    var module = {
        id : "5849111ddb46139f7c72041a09b26958" , 
        filename : "goto.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    (function() {
  var goTop = $("#div_gotop");
  GotopApp = {
    init: function() {
      if (!-[1,]&&!window.XMLHttpRequest) {
        this.scrollMethod(".page", ".page");
      } else {
        this.scrollMethod(window, "body,html");
      }
    },
    scrollMethod: function(window, body) {
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
    }
  }
  GotopApp.init();
})();


    })( module.exports , module , __context );
    __context.____MODULES[ "5849111ddb46139f7c72041a09b26958" ] = module.exports;
})(this);
