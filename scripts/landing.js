var pointsArray = document.getElementsByClassName('point');

var revealPoint = function(point){

      point.style.opacity= 1;
      point.style.transform = "scaleX(1) translateY(0)";
      point.style.msTransform = "scaleX(1) translateY(0)";
      point.style.WebKitTransform = "scaleX(1) translateY(0)";
    }

 var animatePoints = function(points){
forEach(points , revealPoint);




}
window.onload = function(){
  var sellingpoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingpoints.getBoundingClientRect().top - window.innerHeight + 200;
window.addEventListener('scroll',function(event) {
 if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance){
       animatePoints(pointsArray);
 }if(window.innerHeight > 950){
    animatePoints(pointsArray);
 }
  });
}