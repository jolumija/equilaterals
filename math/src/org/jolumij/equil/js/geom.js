// geom.js
function geometry(symm) 
{
	this.symm = symm;
	this.x = [];
	this.y = [];
	this.vx = [];
	this.vy = [];
	var a = 2*Math.PI / (2*symm);
	var t = Math.ceil(2*symm / 4);
	for (var i=0; i < t; i++) {
		this.x.push(+Math.sin(a*i));
		this.y.push(-Math.cos(a*i));
	}
	var ms = [1,-1];
	for (m in ms) { var M = ms[m];
		for (var i=0; i < t; i++) { // quarters 1,3 (t)
			var bx = [], by = [];
			for (var j=0; j < t; j++) {
				bx.push((i==j) ? +M : 0);
				by.push((i==j) ? +M : 0);
			}
			this.vx.push(bx);
			this.vy.push(by);
		}
		for (var i=0; i < t-1; i++) { // quarters 2,4 (t-1)
			var bx = [], by = [];
			for (var j=t-1; j >= 0; j--) {
				bx.push((i==j) ? +M : 0);
				by.push((i==j) ? -M : 0);
			}
			this.vx.push(bx);
			this.vy.push(by);
		}
	}
}

geometry.prototype.guides = function() {
	_ = { x1:[], y1:[], x2:[], y2:[] }
	var a = Math.PI/this.symm;
	for (i=0; i < this.symm; i++) {
		var a1 = a*2*i;
		_.x1.push(+Math.sin(a1));
		_.y1.push(-Math.cos(a1));
		var a2 = a*(2*i + 1);
		_.x2.push(+Math.sin(a2));
		_.y2.push(-Math.cos(a2));
	}
	return _;
}

geometry.prototype.add = function(first, next) {
	var _ = [];
	for (var i=0; i < this.x.length; i++) {
		var f = (first && first.length > i) ? first[i] : 0;
		var n = (next && next.length > i) ? next[i] : 0;
		_.push(f + n);
	}
	return _;
}

geometry.prototype.to_xy = function(v) {
	var _ = { x:0, y:0 }
	for (var i=0; i < this.x.length; i++) {
		_.x += this.vx[v][i] * this.x[i];
		_.y += this.vy[v][i] * this.y[i];
	}
	return _;
}


geometry.prototype.pos = function(vx, vy) {
	var x=0, y=0;
	for (var i=0; i < vx.length; i++) {
		x += vx[i] * this.x[i];
		y += vy[i] * this.y[i];
	}
	return {
		x: x,
		y: y
	};
}

geometry.prototype.points = function(border) {
	var p = [];
	for (b in border) {
		var X = border[b][0];
		var Y = border[b][1];
		var x=0, y=0;
		for (var i=0; i < X.length; i++) x += X[i] * this.x[i];
		for (var i=0; i < Y.length; i++) y += Y[i] * this.y[i]; 
		p.push([x, y]);
	}
	return p;
}

geometry.prototype.polyline = function(xy0, rot, angles) {
	var border = [];
	rot *= 2;
	var v = rot % (2*this.symm);
	if (xy0) {
		border.push([xy0[0], xy0[1]]);
	}
	var vX = this.add(this.vx[v], xy0 ? xy0[0] : null);
	var vY = this.add(this.vy[v], xy0 ? xy0[1] : null);
	border.push([vX, vY]);

	var pos = this.pos(vX, vY);
	for (var a=0; a < angles.length; a++) {
		rot += 2*angles[a] + this.symm;
		v = rot % (2*this.symm);
		var g = this.to_xy(v);
		vX = this.add(vX, this.vx[v]);
		vY = this.add(vY, this.vy[v]);
		border.push([vX, vY]);
	}
	return border;
}

function draw_polyline(parent, geom, border, draw) {
	var p = geom.points(border);
	svgPolyline(parent, p, draw.stroke, draw.fill, draw.opacity, 0.05);
}



