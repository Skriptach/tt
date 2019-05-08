'use strict';

window.getWeightOf = function (c, factor=2, stepsLimit=64, radius=2) {
	let n=0, Zn = c;
	for (; n < stepsLimit && Zn.r <= radius ; n++) {
		//Zn = Zn.pow2Nadd(c);
		Zn = Zn.powNadd(factor, c);
	}
	return {n, Zn};
};
