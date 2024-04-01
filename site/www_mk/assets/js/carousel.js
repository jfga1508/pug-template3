$window = $(window);
const gallery_slider = $(".product-gallery");
const products_slider = $(".multiple-items");
const gallery_settings = {
  infinite: true,
  arrows: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};
const products_settings = {
  infinite: true,
  dots: true,
  arrows: false,
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
};
const slickHeight = $(".multiple-items .slick-track").outerHeight();
const slideHeight = $(".multiple-items .slick-track")
  .find(".slick-slide")
  .outerHeight();

function resizeSlider() {
  $(".slick-track")
    .find(".slick-slide .slide-wrap")
    .css("height", slickHeight + "px");
}

if ($window.width() <= 991) {
  gallery_slider.slick(gallery_settings);
}

products_slider.slick(products_settings).on("setPosition", function () {
  resizeSlider();
});

$window.on("resize", function (e) {
  resizeSlider();
  if ($window.width() > 990) {
    if (gallery_slider.hasClass("slick-initialized"))
      gallery_slider.slick("unslick");
    return;
  }
  if (!gallery_slider.hasClass("slick-initialized"))
    return gallery_slider.slick(gallery_settings);
});
