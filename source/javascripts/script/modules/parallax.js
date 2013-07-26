(function ($) {

   // alert('a');
if($(".parallax-layer").length>0){
$(".parallax-layer").insertBefore($(".l-page"));
var scrollorama = $.scrollorama({ blocks:'.parallax-layer' });
scrollorama
	.animate('#layer1',{ duration:1000, property:'top', start:80, end: -100 })
	.animate('#layer2',{ duration: 1000, property:'top', start:0, end: -100 })

	// change 180 to 280 and -400 to -1200 to make it faster
	//.animate('#layer1',{ duration:1000, property:'top', start:180, end: -400 })

	// .animate('#layer1',{ duration:1000, property:'top', start:80, end: -100 })
	// .animate('#layer2',{ duration: 1000, property:'top', start:0, end: -100 })
	// .animate('#layer1',{ duration:1000, property:'top', start:-100, end: 80 })
	// .animate('#layer2',{ duration: 1000, property:'top', start:-100, end: 0 })
}
}(jQuery));