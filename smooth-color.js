'use strict';

(() => {

	const logBase = 1.0 / Math.log(2.0);
	const logHalfBase = Math.log(0.5)*logBase;

	function smoothColor(n, c) {
		return 5 + n - logHalfBase - Math.log(Math.log(c.r))*logBase;
	}

	function hsv_to_rgb (h, s, v) {
		if ( v > 1.0 ){ v = 1.0; }
		const hp = h/60.0;
		const c = v * s;
		const x = c*(1 - Math.abs((hp % 2) - 1));
		let rgb = [0,0,0];

		if ( 0<=hp && hp<1 ) { rgb = [c, x, 0]; }
		if ( 1<=hp && hp<2 ) { rgb = [x, c, 0]; }
		if ( 2<=hp && hp<3 ) { rgb = [0, c, x]; }
		if ( 3<=hp && hp<4 ) { rgb = [0, x, c]; }
		if ( 4<=hp && hp<5 ) { rgb = [x, 0, c]; }
		if ( 5<=hp && hp<6 ) { rgb = [c, 0, x]; }

		const m = v - c;
		rgb[0] += m;
		rgb[1] += m;
		rgb[2] += m;

		rgb[0] *= 255;
		rgb[1] *= 255;
		rgb[2] *= 255;
		return rgb;
	}

	window.weightToColor = function (steps, n, c) {
		const v = smoothColor(n, c);
		return hsv_to_rgb(360.0*v/steps, 1.0, 10.0*v/steps);
	};

})();