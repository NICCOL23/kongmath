$(document).ready(function () {//시작
  $("header .inner .gnb > li").mouseenter(function () {
    $("header .depth2, header .depth2-bg").stop().fadeIn();
  });

  $("header").mouseleave(function () {
    $("header .depth2, header .depth2-bg").stop().fadeOut();
  });


  //mgnb
  $("header .inner .utill .ham").click(function () {
    $("header .mgnb-wrap").animate({ "right": "0" })
  })

  $(".mgnb-close").click(function () {
    $(".mgnb-wrap").animate({ "right": "-100%" });
  });


  $("header .mgnb-select").click(function () {
    // 하위 메뉴가 없는 항목은 X
    if (!$(this).next(".mdepth2").length) return;

    // 다른 메뉴 닫기
    $("header .mgnb-select").not(this).removeClass("active");
    $("header .mgnb-select").not(this)
      .next(".mdepth2").stop().slideUp();

    // 클릭한 메뉴 열기 / 닫기
    $(this).toggleClass("active");
    $(this).next(".mdepth2").stop().slideToggle();
  });

  // 하위 메뉴를 클릭하면 파란색으로 표시
  $("header .mdepth2 a").click(function () {
    $("header .mdepth2 a").removeClass("active");
    $(this).addClass("active");
  });

const treatmentSwiper = new Swiper(".treatment-swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  speed: 600,

  breakpoints: {
    0: {
      slidesPerView: 1.4,
      centeredSlides: true,
      spaceBetween: 15,
      
    },

    769: {
      slidesPerView: 2.2,
      centeredSlides: true,
      spaceBetween: 25,
      
    },

    1401: {
      slidesPerView: 3,
      centeredSlides: false,
      spaceBetween: 20,
      allowTouchMove: false,
      loop: false,
      
    },
  },
});


});//끝


