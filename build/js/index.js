var js_ = {
  index: function() {
    /*banner轮播图*/
    if($('.module1').length>0){
      var mySwiper = new Swiper('#home .swiper-container', {
          autoplay: 5000, //可选选项，自动滑动
          loop: true, //循环
          pagination: '.swiper-pagination', //导航
      });
    }
    if($('.module2').length>0){
      var mySwiper = new Swiper('#home .swiper-container', {
          noSwiping : true,
      });
    }
    /*banner轮播图结束*/

    /*倒计时*/
    $('#home .timeOutText').downCount({
        date: '6/16/2017 17:30:50',
        offset: +8
        //别删
    }, function() {
        //倒计时结束后
        $('#home .timeOutText .days').text('0天');
        $('#home .timeOutText .hours').text('0时');
        $('#home .timeOutText .minutes').text('0分');
        $('#home .timeOutText .seconds').text('0秒');
        //alert('倒计时结束!');
    });
    /*倒计时 结束*/

    /*数字持续增加*/
    var numOptions = {
      useEasing : false,
      useGrouping : false,
      separator : ',',
      decimal : '.',
    };

    var demo = new CountUp("applyNum", 0, 100, 0, 1, numOptions);
    var demo2 = new CountUp("voteNum", 0, 14532, 0, 1, numOptions);
    var demo3 = new CountUp("visitedNum", 0, 56528, 0, 1, numOptions);
    var t = setTimeout(function() {
      demo.start();
  		demo2.start();
  		demo3.start();
    },2000);
    /*数字持续增加结束*/

    /*加载更多*/
    $( window ).on( "load", function(){
        waterfall('container','box');

        //模拟数据json
        var dataJson = {'data': [
          {'src':'img1.jpg'},
          {'src':'img2.jpg'},
          {'src':'img3.jpg'},
          {'src':'img4.jpg'},
          {'src':'img5.jpg'},
          {'src':'img6.jpg'},
          {'src':'img7.jpg'},
          {'src':'img1.jpg'},
          {'src':'img2.jpg'},
          {'src':'img3.jpg'}
        ]};

          //window.onscroll=function(){
          $('#btnMore').click(function(){
            var isPosting = false;
            if(checkscrollside('container','box') && !isPosting){
                isPosting = true;
                $.each(dataJson.data,function(index,dom){
                    //var $box = $('<div class="box"></div>');
                    // $box.html('<div class="pic"><img src="./img/'+$(dom).attr('src')+'"></div>');
                    // $('#home .listWrap').append($box);
                    //$('.listWrap').append('<div class="box"><div class="boxMain p-r"><img class="d-b onload" src="./img/'+$(dom).attr('src')+'"><span class="numId d-b p-a">1000号</span><div class="textBox clear"><div class="name d-b f-l">某某某70票</div><a class="btn d-b f-r" href="player.html">给他投票</a></div></div></div>');
                    $('.listWrap').append('<div class="box"><div class="boxMain p-r"><img class="d-b onload" src="./img/'+$(dom).attr('src')+'"> <span class="numId d-b p-a">1000号<span class="nd-b">，10票</span></span><div class="textBox clear"><div class="name d-b f-l">某某某 <span>70票</span></div><a class="btn d-b f-r" href="player.html"><span>给他</span>投票</a></div></div></div>');

                });
                  var imgNum = $('.listWrap .box img.onload').length;
                  //console.log(imgNum);
                  $('.loader').show(500);
                  $(".listWrap .box img.onload").each(function(){
                    var image = new Image();
                    image.src = $(this).attr('src');
                    if (image.complete){
                      imageLoaded(imgNum);
                    }else{
                      image.onload = imageLoaded;
                    }
                  });
                  
            }

          });
          var curt = 0;
          function imageLoaded(total){
            curt+=1;
            if(curt==total){
              $('.listWrap .box img.onload').removeClass('onload');
              $('.loader').hide();
              waterfall('container','box');
              isPosting = false;
              curt = 0;
            }
          }

          /*弹窗*/
          // $('.popupBox,.popupWrap').show();
          // $('.popupWrap .btn').click(function(){
          //   $('.popupBox,.popupWrap').hide();
          // });
          /*弹窗结束*/

    });

    /*
     parend 父级id
     clsName 元素class
     */
    function waterfall(parent,clsName){
        var $parent = $('#'+parent);//父元素
        var $boxs = $parent.find('.'+clsName);//所有box元素
        //console.log('box:'+$boxs.length);
        var iPinW = $boxs.eq( 0 ).width();// 一个块框box的宽
        var cols = Math.floor( $( window ).width() / iPinW );//列数
        //$parent.width(iPinW * cols).css({'margin': '0 auto'});

        var pinHArr=[];//用于存储 每列中的所有块框相加的高度。
        var minH;
        $boxs.each( function( index, dom){
            if( index < 2 ){
                pinHArr[ index ] = $(dom).height(); //所有列的高度
            }else{
                minH = Math.min.apply( null, pinHArr );//数组pinHArr中的最小值minH
                //console.log('最小列的高度'+minH);
                var minHIndex = $.inArray( minH, pinHArr );
                $(dom).css({
                    'position': 'absolute',
                    'top': minH + 0,
                    'left': $boxs.eq( minHIndex ).position().left
                });
                //添加元素后修改pinHArr
                pinHArr[ minHIndex ] += $(dom).height() + 0;//更新添加了块框后的列高
                //console.log('整理后的列高'+pinHArr[ minHIndex ]);
            }
        });
        var listWrapHeight = parseFloat($('#home .listWrap').children(".box:last-child").height())+minH;
        $('#home .listWrap').css('height',listWrapHeight+'px');
    }

    //检验是否满足加载数据条件，即触发添加块框函数waterfall()的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    function checkscrollside(parent,clsName){
        //最后一个块框
        var $lastBox = $('#'+parent).find('.'+clsName).last(),
            lastBoxH = $lastBox.offset().top + $lastBox.height()/ 2,
            scrollTop = $(window).scrollTop(),
            documentH = $(document).height();
        return lastBoxH < scrollTop + documentH ? true : false;
    }
    /*加载更多 结束*/
  },player: function() {

    var dataJson = {'data': [
      {'src':'sendImg1.jpg'},
      {'src':'sendImg2.jpg'},
      {'src':'sendImg1.jpg'},
      {'src':'sendImg2.jpg'},
      {'src':'sendImg1.jpg'},
      {'src':'sendImg2.jpg'},
    ]};

    $('#player #btnMore').click(function(){
      for(var i=0;i<dataJson.data.length;i++){
        $('#player .sendList').append('<div class="box d-b clear"><img class="sendImg d-b f-l" src="img/'+dataJson.data[i].src+'" alt=""><dl class="d-b f-l"><dt>不语，给他送了1朵鲜花</dt><dd>2017-06-07 10:59:48</dd></dl></div>');
      }
    });

    $('#player .tabShow .box').click(function(){
      $(this).addClass('choose').siblings().removeClass('choose');
      var thisTabNum = $(this).index();
      $('#player .showTabWrap>div').eq(thisTabNum).show().siblings().hide();
    });

    /*弹窗*/
    $('.footerPlayer .vote .btn').click(function(){
      $('.popupBox,.popupWrap').show();
    });

    $('.popupWrap .btn').click(function(){
      $('.popupBox,.popupWrap').hide();
    });
    /*弹窗结束*/

    /*拉票*/
    $('#player .tabNav div.box').click(function(){
      $('#player .helpTicket').show();
    });
    $('#player .helpTicket').click(function(){
      $(this).hide();
    });
    /*拉票结束*/
  },rankingList:function(){

  },apply:function(){
    $('.apply .applyBox .sexBox .sexWrap .checkbox').click(function(){
      if($(this).hasClass('choose')){
        $(this).removeClass('choose').siblings().addClass('choose');
      }else{
        $(this).addClass('choose').siblings().removeClass('choose');
      }
    });
  },sendFlower:function(){
    $('#sendFlower .flowerBox .flowerWrap .box').click(function(){
      $(this).addClass('choose').siblings().removeClass('choose');
      var dataNum = $(this).attr('data-num');
      $('#sendFlower #payNum').val(dataNum);
    });
  },activity:function(){

  },prize:function(){

  }
};
