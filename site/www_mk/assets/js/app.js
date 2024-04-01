$window = $(window);
$gallery_slider = $('.product-gallery');
settings = {
  infinite: true,
  arrows: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000
};

if ($window.width() <= 991) {
  $gallery_slider.slick(settings);
}

const slickHeight = $(".slick-track").outerHeight();

const slideHeight = $(".slick-track").find(".slick-slide").outerHeight();

function resizeSlider() {
  $(".slick-track")
    .find(".slick-slide .slide-wrap")
    .css("height", slickHeight + "px");
}

function increment() {
  const input = $("#amount");
  const current = parseInt(input.val());
  const increment = current + 1;
  input.val(increment);
}

function decrement() {
  const input = $("#amount");
  const current = parseInt(input.val());
  const decrement = current <= 1 ? current : current - 1;
  input.val(decrement);
}

$(".multiple-items")
  .slick({
    infinite: true,
    dots: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    mobileFirst: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  })
  .on("setPosition", function () {
    resizeSlider();
  });

$(window).on("resize", function (e) {
  resizeSlider();
  if ($window.width() > 990) {
    if ($gallery_slider.hasClass("slick-initialized"))
      $gallery_slider.slick("unslick");
    return;
  }
  if (!$gallery_slider.hasClass("slick-initialized"))
    return $gallery_slider.slick(settings);
});
