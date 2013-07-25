(function ($) {

   // alert('a');

var scrollorama = $.scrollorama({ blocks:'.parallax-layer' });
scrollorama
	.animate('#layer1',{ duration:1000, property:'top', start:-100, end: 80 })
	.animate('#layer2',{ duration: 1000, property:'top', start:-100, end: 0 })

}(jQuery));