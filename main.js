'use strict';

( () => {

	// Aliases
	const {cos, sin, PI, min, max} = Math;

	class Complex {
		constructor (Re, Im) {
			this.Re = Re;
			this.Im = Im;
		}

		get r    () { return (this.Re ** 2 + this.Im ** 2) ** 0.5 ;}
		get phi  () { return Math.atan2(this.Im, this.Re);}

		pow (p) {
			return new Complex( this.r**p * cos(p*this.phi), this.r**p * sin(this.phi) );
		}

		add (c) {
			return new Complex(this.Re + c.Re, this.Im + c.Im);
		}

		powNadd (p, c) {
			return new Complex( this.r**p * cos(p*this.phi) + c.Re, this.r**p * sin(p*this.phi) + c.Im);
		}

		pow2Nadd (c) {
			return new Complex( this.Re**2 - this.Im**2 + c.Re, 2*this.Re*this.Im + c.Im);
		}

		toString() {
			return `${this.Re} ${this.Im} i`;
		}
	};


	const canvas = document.getElementById('tutorial');
	const WIDTH = canvas.clientWidth;
	const HEIGHT = canvas.clientHeight;

	const ORIGIN_X = WIDTH/2;
	const ORIGIN_Y = HEIGHT/2;
	const MARGIN = 0;//WIDTH/20;
	const RADIUS = HEIGHT/2 - MARGIN;
	//const L = 2*PI*RADIUS;

	let ctx;
	let factor = 0;
	let N = 1;
	let C = 1;

	const nStep = 1;
	const step = 0.02;
	const nLast = 500;
	const factorLast = 50;

	let loopFrameDelay = 50;

	function coordToPlot (point) {
		return {
			x: 2*point.x/RADIUS,
			y: 2*point.y/RADIUS
		};
	}

	function plotCoordToPixel (point) {
		return {
			x: ORIGIN_X + point.x,
			y: ORIGIN_Y - point.y
		};
	}

	function pixelToCoord (point) {
		return {
			x: point.x - ORIGIN_X + MARGIN,
			y: ORIGIN_Y - point.y - MARGIN
		};
	};

	function degToRad (deg) {
		return deg*PI/180;
	}

	function lengthToAlpha (l) {
		return (l*360)/N;
	}

	function lengthToCoord (l) {
		const phi = degToRad(lengthToAlpha(l));
		return {
			x: - (RADIUS * cos(phi)),
			y: RADIUS * sin(phi)
		};
	}

	function getStepsAuto () {
		return min(100, max(factor*40, 5));
	}

	function toHexPad(int) {
		return `00${int.toString(16)}`.slice(-2);
	}

	function chord (begin, end) {
		const beginCoords = plotCoordToPixel(lengthToCoord(begin));
		const endCoords = plotCoordToPixel(lengthToCoord(end));

		ctx.beginPath();
		ctx.lineWidth = 0.8;
		const stepsLimit = getStepsAuto();
		const L = new Complex( (endCoords.x - beginCoords.x)*factor, endCoords.y - beginCoords.y);
		const rgb = window.weightToColor(C, stepsLimit, L);
		ctx.strokeStyle = `#${rgb.map(toHexPad).join('')}`;
		ctx.moveTo(beginCoords.x, beginCoords.y);
		ctx.lineTo(endCoords.x, endCoords.y);

		ctx.stroke();
	}

	function circle () {
		ctx.beginPath();
		ctx.strokeStyle = '#BBBBBB';
		ctx.lineWidth = 2.5;

		const center = plotCoordToPixel({x: 0, y: 0});
		ctx.arc(center.x, center.y, RADIUS, 0, PI*2);

		ctx.stroke();
	}


	function drawEachToEach () {
		for (let i = 0; i < N; i++) {
			for (let j = i; j < N; j++) {
				chord(i, j);
			}
		}
	}

	function drawMulti () {
		ctx.clearRect(0,0,WIDTH,HEIGHT);
		circle();
		for (let i = 0; i < N; i++) {
			chord(i, factor*i);
		}
	}

	function drawMand () {
		loopFrameDelay = 10;
		const stepsLimit = getStepsAuto();
		const width = WIDTH - MARGIN*2;
		const height = HEIGHT - MARGIN*2;
		const img = ctx.createImageData(width, height);

		let plotDot, weight, rgb;
		let x, y;
		for (let k = 0; k < img.data.length/4; k++) {
			x = k % height;
			y = (k - x) / height;
			if (y >= height/2) {
				img.data[k*4  ] =  img.data[((height-y-1)*height + x)*4];
				img.data[k*4+1] =   img.data[((height-y-1)*height + x)*4+1];
				img.data[k*4+2] =   img.data[((height-y-1)*height + x)*4+2];
			} else {
				plotDot = coordToPlot(pixelToCoord({x, y}));
				weight = window.getWeightOf(new Complex(plotDot.x, plotDot.y), factor, stepsLimit);
				rgb = window.weightToColor(stepsLimit, weight.n, weight.Zn);
				img.data[k*4] =  rgb[0];
				img.data[k*4+1] = rgb[1];
				img.data[k*4+2] = rgb[2];
			}
			img.data[k*4+3] = 255;
		}
		ctx.putImageData(img, MARGIN, MARGIN);
	}

	function nextFrame (drawFunc) {
		window.factorSpan.innerText = factor.toFixed(2);
		window.numberSpan.innerText = N.toFixed(1);
		drawFunc();
		if (factor >= factorLast &&
			N >= nLast) {return;}
		N < nLast ? N += nStep : '';
		C += nStep;
		factor += step;
		setTimeout(nextFrame.bind(null, drawFunc), loopFrameDelay);
	}

	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		setTimeout(nextFrame.bind(null, drawMulti), loopFrameDelay);
	}

})();