(function ($) {

   // alert('a');

var scrollorama = $.scrollorama({ blocks:'.parallax-layer' });
scrollorama
	.animate('#layer1',{ duration:1000, property:'top', start:0, end: 180 })
	.animate('#layer2',{ duration: 1000, property:'top', start:0, end: 100 })

}(jQuery));