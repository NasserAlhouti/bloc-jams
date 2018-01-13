$(window).load(function() { // load function when the window loads do this
  // #1 //
  if ($(window).height() > 950) {
    animatePoints();
  } // this condition would be true if you view bloc jams on the big screen
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
  $(window).scroll(function(event) {


    var animatePoints = function() {
      var revealPoint = function() {
        $(this).css({
          opacity: 1,
          transform: 'scaleX(1) translateY(0)'
        }); // for css
      }
      $.each($('.point'), revealPoint);
    }; //for the reveal points function
    if ($(window).scrollTop() >= scrollDistance) {
      animatePoints();
    }
  });
}); // checked
