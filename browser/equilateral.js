function $(id) { 
	return document.getElementById(id); 
}

function elem(type, parent, clazz, text, attrs) {
	var e = document.createElement(type);
	if (parent) 
		parent.appendChild(e);
	if (clazz) 
		e.className = clazz;
	if (text != null) 
		e.appendChild(document.createTextNode(text));
	if (attrs) 
		for (attr in attrs) 
			e.setAttribute(attr, attrs[attr]);
	return e;
}

function selectElem(parent, optionsMap, value) {
	var s = elem("select", parent);
	for (var k in optionsMap) {
	    if (optionsMap.hasOwnProperty(k))
	        elem("option", s, null, k, { value: optionsMap[k] });
	}
	if (value)
		s.value = value;
	return s;
}

function change(elem, change) {
	elem.addEventListener("change", function(){
		change(this.value);
	});
	elem.dispatchEvent(new Event('change'));
}

function buttonElem(parent, clazz, text, click) {
	var b = elem("button", parent, clazz, text);
	b.addEventListener("click", function() {
		click();
	});
	return b;
}

function svgRoot(parent, w, h) {
    var xmlns = "http://www.w3.org/2000/svg";
    var _ = document.createElementNS(xmlns, "svg");
    _.setAttributeNS (null, "viewBox", "0 0 " + w + " " + h);
    _.setAttributeNS (null, "width", w);
    _.setAttributeNS (null, "height", h);
    _.style.display = "block";
    parent.appendChild(_);
    return _;
}

function svgElem(type, parent, clazz, text, attrs) {
	var e = document.createElementNS("http://www.w3.org/2000/svg", type);
	if (parent) 
		parent.appendChild(e);
	if (clazz) 
		e.setAttribute("class", clazz);
	if (text) 
		e.appendChild(document.createTextNode(text));
	if (attrs) 
		for (attr in attrs) 
			e.setAttribute(attr, attrs[attr]);
	return e;
}

function svgG(parent, translate, scale) {
	attrs = {};
	var t = [];
	if (translate)
		t.push("translate(" + translate[0] + "," + translate[1] + ")");
	if (scale)
		t.push("scale(" + scale + "," + scale + ")");
	if (t.length > 0)
		attrs.transform = t.join(" ");
	return svgElem("g", parent, null, null, attrs);
}

function svgLine(parent, first, last, stroke) {
	return svgElem("line", parent, null, null, {
		x1: first[0], y1: first[1],
		x2: last[0], y2: last[1],
		stroke: stroke
	});
}

function svgCircle(parent, center, radius, fill) {
	return svgElem("circle", parent, null, null, {
		cx: center[0],
		cy: center[1],
		r: radius,
		fill: fill
	});
}

function svgPolyline(parent, points, stroke, fill, opacity, strokeWidth) {
	var p = [];
	for (var _ in points)
		p.push(points[_][0] + "," + points[_][1]);
	var style = [];
	if (stroke)
		style.push("stroke:" + stroke + ";")
	if (fill)
		style.push("fill:" + fill + ";");
	if (opacity)
		style.push("fill-opacity:" + opacity + ";");
	if (strokeWidth)
		style.push("stroke-width:" + strokeWidth + ";");


	return svgElem("polyline", parent, null, null, {
		points:p.join(" "),
		style: style.join(" ")
	});
}

// returns a window W=3S, H=6S
// with two groups at top y bottom
function svgTopBottom(parent, S) {
	parent.innerHTML = "";
	var W=3*S, H=2*W;
	var _ = svgRoot(parent, W, H);
	return {
		top:    svgG(_, [ W/2,   H/4 ]), 
		bottom: svgG(_, [ W/2, 3*H/4 ])
	}
}

function geom(n) 
{
	const symm = (6 + 4*n) / 2
	const _x = [], _y = [], _vx = [], _vy = []

	const a = 2 * Math.PI / (2*symm)
	const t = Math.ceil(2*symm / 4)
	for (var i=0; i < t; i++) {
		_x.push( + Math.sin( a*i ))
		_y.push( - Math.cos( a*i ))
	}
	const ms = [1,-1]
	for (let m in ms) { var M = ms[m]
		for (var i=0; i < t; i++) { // quarters 1,3 (t)
			var bx = [], by = []
			for (var j=0; j < t; j++) {
				bx.push((i==j) ? +M : 0)
				by.push((i==j) ? +M : 0)
			}
			_vx.push(bx)
			_vy.push(by)
		}
		for (var i=0; i < t-1; i++) { // quarters 2,4 (t-1)
			const bx = [], by = []
			for (var j=t-1; j >= 0; j--) {
				bx.push((i==j) ? +M : 0)
				by.push((i==j) ? -M : 0)
			}
			_vx.push(bx)
			_vy.push(by)
		}
	}

	this.symm = function() {
		return symm
	}

this.guides = function() {
	_ = { x1:[], y1:[], x2:[], y2:[] }
	var a = Math.PI / symm
	for (i=0; i < symm; i++) {
		const a1 = a*2*i
		_.x1.push(+Math.sin(a1))
		_.y1.push(-Math.cos(a1))
		const a2 = a*(2*i + 1)
		_.x2.push(+Math.sin(a2))
		_.y2.push(-Math.cos(a2))
	}
	return _
}


this.to_xy = function(v) {
	var _ = { x:0, y:0 }
	for (var i=0; i < _x.length; i++) {
		_.x += _vx[v][i] * _x[i];
		_.y += _vy[v][i] * _y[i];
	}
	return _;
}


this.points = function(border) {
	var p = [];
	for (let b in border) {
		var X = border[b][0];
		var Y = border[b][1];
		var x=0, y=0;
		for (var i=0; i < X.length; i++) x += X[i] * _x[i];
		for (var i=0; i < Y.length; i++) y += Y[i] * _y[i]; 
		p.push([x, y]);
	}
	return p;
}

	this.polyline = function(xy0, rot, angles) {
		const P = []
		rot *= 2
		var v = rot % (2*symm)
		if (xy0) {
			P.push([ xy0[0], xy0[1] ])
		}
		var vX = _add(_vx[v], xy0 ? xy0[0] : null)
		var vY = _add(_vy[v], xy0 ? xy0[1] : null)
		P.push([vX, vY])

		var pos = _pos(vX, vY)
		for (var a=0; a < angles.length; a++) {
			rot += 2*angles[a] + symm
			v = rot % (2*symm)
			var g = this.to_xy(v)
			vX = _add(vX, _vx[v])
			vY = _add(vY, _vy[v])
			P.push([vX, vY])
		}
		return P
	}

	const _add = function(first, next) {
		var _ = [];
		for (var i=0; i < _x.length; i++) {
			var f = (first && first.length > i) ? first[i] : 0;
			var n = (next && next.length > i) ? next[i] : 0;
			_.push(f + n);
		}
		return _;
	}

	const _pos = function(vx, vy) {
		var x=0, y=0
		for (var i=0; i < vx.length; i++) {
			x += vx[i] * _x[i]
			y += vy[i] * _y[i]
		}
		return { x: x, y: y }
	}

}

function draw_polyline(parent, g, polyline, s) {
	var p = g.points(polyline)
	svgPolyline(parent, p, s.stroke, s.fill, s.opacity, 0.05)
}






