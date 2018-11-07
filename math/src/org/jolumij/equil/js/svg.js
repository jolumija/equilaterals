//svg.js
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




