var numDen = {
	B: [  1,  3 ],
	C: [  1,  5 ], D: [  3,  5 ],
	E: [  1,  7 ], F: [  3,  7 ], G: [  5,  7 ],
	H: [  1,  4 ],
	I: [  1,  9 ], J: [  5,  9 ], K: [  7,  9 ],
	L: [  1, 11 ], M: [  3, 11 ], N: [  5, 11 ], O: [  7, 11 ], P: [  9, 11 ],
	Q: [  1, 13 ], R: [  3, 13 ], S: [  5, 13 ], T: [  7, 13 ], U: [  9, 13 ], V: [ 11, 13 ],
	W: [  1, 15 ], X: [  7, 15 ], Y: [ 11, 15 ], Z: [ 13, 15 ],
	a: [  1,  8 ],
	b: [  1, 17 ], c: [  3, 17 ], d: [  5, 17 ], e: [  7, 17 ], f: [  9, 17 ], g: [ 11, 17 ], 
	h: [ 13, 17 ], i: [ 15, 17 ],
	j: [  1, 19 ], k: [  3, 19 ], l: [  5, 19 ], m: [  7, 19 ], n: [  9, 19 ], o: [ 11, 19 ],
	p: [ 13, 19 ], q: [ 15, 19 ], r: [ 17, 19 ], s: [  1, 21 ], t: [  5, 21 ], u: [ 11, 21 ],
	v: [ 13, 21 ], w: [ 17, 21 ], x: [ 19, 21 ]
};


function $(id) { return document.getElementById(id); }
function elem(type, parent, clazz, text, attrs) {
	var e = document.createElement(type);
	if (parent) parent.appendChild(e);
	if (clazz) e.className = clazz;
	if (text != null) e.appendChild(document.createTextNode(text));
	if (attrs) for (attr in attrs) e.setAttribute(attr, attrs[attr]);
	return e;
}
function svg(type, parent, clazz, text, attrs) {
	var e = document.createElementNS("http://www.w3.org/2000/svg", type);
	if (parent) parent.appendChild(e);
	if (clazz) e.setAttribute("class", clazz);
	if (text) e.appendChild(document.createTextNode(text));
	if (attrs) for (attr in attrs) e.setAttribute(attr, attrs[attr]);
	return e;
}

function circles(b, c) {
	circle_tables($(b), B);
	circle_tables($(c), C);
}

var AF = function() {
	this.name = "A";
	this.x = 0;
	this.y = -1;
	this.xy = [
		[  this.x,  this.y ],
		[  this.x, -this.y ],
		[ -this.y,  this.x ],
		[  this.y, -this.x ]
	];
};

var F4 = function(name, n, d) {
	this.name = name;
	this.x = Math.sin(n * Math.PI / d);
	this.y = Math.cos(n * Math.PI / d);
	this.xy = [
		[  this.x,  this.y ],
		[  this.x, -this.y ],
		[ -this.y,  this.x ],
		[ -this.y, -this.x ]
	];
}

var F8 = function(name, n, d) {
	this.name = name;
	this.x = Math.sin(n * Math.PI / d);
	this.y = Math.cos(n * Math.PI / d);
	this.xy = [
		[  this.x,  this.y ],
		[ -this.x,  this.y ],
		[  this.x, -this.y ],
		[ -this.x, -this.y ],
		[  this.y,  this.x ],
		[ -this.y,  this.x ],
		[  this.y, -this.x ],
		[ -this.y, -this.x ]
	];
}

/*
function family_vertices(canvas, d, R, length, family) {
	for (var p=0; p < length; p++) {
		var xy = family.xy[p];
		var x = xy[0] * R;
		var y = xy[1] * R;
		svg("circle", canvas, "dot", null, { cx:d + x, cy:d + y, r:4 });
		svg("text", canvas, "number", family.name + p, { x: d + parseInt(1.2*x), y:parseInt(d + 1.2*y) });
	}
}
*/

var Family = function() {
	//this.f = {};
	this.p = {};
	this.a4 = function(n) {
		var nd = numDen["A"];
		var f = new AF();
		for (var i=0; i < n; i++)
			this.p["A" + i] = f.xy[i];
		//this.f["A"] = { n: n, f: f };
	}
	this.v4 = function(n, key) {
		var nd = numDen[key];
		var f = new F4(key, nd[0], nd[1]);
		for (var i=0; i < n; i++)
			this.p[key + i] = f.xy[i];
		//this.f[key] = { n: n, f: f };
	}
	this.v8 = function(n, key) {
		var nd = numDen[key];
		var f = new F8(key, nd[0], nd[1]);
		for (var i=0; i < n; i++)
			this.p[key + i] = f.xy[i];
		//this.f[key] = { n: n, f: f };
	};
	this.sort = function(n) {
		// 1. A0 (0,-1) always
		// 2. [+,-] from min-x to max-x;
		// 3. A2 (1,0) if exists
		// 4. [+,+] from min-y to max-y
		// 5. A1 (0,1) if exists
		// 6. [-,+] from max-y to min-y
		// 7. A3 (-1,0) if exists
		// 8. [-,-] from max-x to min-x
	};

	this.vertices = function(canvas, d, R) {
		for (_ in this.p) {
			var p = this.p[_];
			var x = p[0] * R;
			var y = p[1] * R;
			svg("circle", canvas, "dot", null, { cx:d + x, cy:d + y, r:4 });
			svg("text", canvas, "number", _, { x: d + parseInt(1.2*x), y:parseInt(d + 1.2*y) });
		}
	}

	this.debug = function(parent) {
		var table = elem("table", parent);
		for (_ in this.p) {
			var p = this.p[_];
			var tr = elem("tr", table);
			elem("td", tr, null, _);
			elem("td", tr, null, JSON.stringify(p));
		}
	}
}

function polygon(n) {
	var f = new Family();
	if (n==3) {
		f.a4(1);
		f.v8(2, "B");
	} else
	if (n==4) {
		f.a4(4);
	} else
	if (n==5) {
		f.a4(1);
		f.v8(2, "C");
		f.v8(2, "D");
	} else
	if (n==6) {
		f.a4(2);
		f.v8(4, "B");
	} else
	if (n==7) {
		f.a4(1);
		f.v8(2, "E");
		f.v8(2, "F");
		f.v8(2, "G");
	} else
	if (n==8) {
		f.a4(4);
		f.v4(4, "H");
	} else
	if (n==9) {
		f.a4(1);
		f.v8(2, "I");
		f.v8(2, "B");
		f.v8(2, "J");
		f.v8(2, "K");
	} else
	if (n==10) {
		f.a4(2);
		f.v8(4, "C");
		f.v8(4, "D");
	} else
	if (n==11) {
		f.a4(1);
		f.v8(2, "L");
		f.v8(2, "M");
		f.v8(2, "N");
		f.v8(2, "O");
		f.v8(2, "P");
	} else
	if (n==12) {
		f.a4(4);
		f.v8(8, "B");
	} else
	if (n==13) {
		f.a4(1);
		f.v8(2, "Q");
		f.v8(2, "R");
		f.v8(2, "S");
		f.v8(2, "T");
		f.v8(2, "U");
		f.v8(2, "V");
	} else
	if (n==14) {
		f.a4(2);
		f.v8(4, "E");
		f.v8(4, "F");
		f.v8(4, "G");
	} else
	if (n==15) {
		f.a4(1);
		f.v8(2, "W");
		f.v8(2, "C");
		f.v8(2, "B");
		f.v8(2, "X");
		f.v8(2, "D");
		f.v8(2, "Y");
		f.v8(2, "Z");
	} else
	if (n==16) {
		f.a4(4);
		f.v4(4, "H");
		f.v8(8, "a");
	} else
	if (n==17) {
		f.a4(1);
		f.v8(2, "b");
		f.v8(2, "c");
		f.v8(2, "d");
		f.v8(2, "e");
		f.v8(2, "f");
		f.v8(2, "g");
		f.v8(2, "h");
		f.v8(2, "i");
	} else
	if (n==18) {
		f.a4(2);
		f.v8(4, "I");
		f.v8(4, "B");
		f.v8(4, "J");
		f.v8(4, "K");
	} else
	if (n==19) {
		f.a4(1);
		f.v8(2, "j");
		f.v8(2, "k");
		f.v8(2, "l");
		f.v8(2, "m");
		f.v8(2, "n");
		f.v8(2, "o");
		f.v8(2, "p");
		f.v8(2, "q");
		f.v8(2, "r");
	} else
	if (n==20) {
		f.a4(4);
		f.v8(8, "C");
		f.v8(8, "D");
	} else 
	if (n==21) {
		f.a4(1);
		f.v8(2, "s");
		f.v8(2, "E");
		f.v8(2, "t");
		f.v8(2, "B");
		f.v8(2, "F");
		f.v8(2, "u");
		f.v8(2, "v");
		f.v8(2, "G");
		f.v8(2, "w");
		f.v8(2, "x");
	} else
	if (n==22) {
		f.a4(2);
		f.v8(4, "L");
		f.v8(4, "M");
		f.v8(4, "N");
		f.v8(4, "O");
		f.v8(4, "P");
	}
	f.sort(n);
	return f;
}

function vertices(b, c) {
	$(b).innerHTML = "";
	$(c).innerHTML = "";
	var d = 130;
	var R = 80;
	var table = elem("table", $(b));
	for (var p=3; p <= 22; p++) {
		var tr = elem("tr", table);
		elem("td", tr, null, p);
		var td = elem("td", tr);
	    var canvas = createSVG(td, 2*d, 2*d);
		svg("circle", canvas, "circle", null, { cx:d, cy:d, r:R });
		svg("circle", canvas, "dot", null, { cx:d, cy:d, r:4 });
		var f = polygon(p);
		f.vertices(canvas, d, R);
		var td2 = elem("td", tr);
		f.debug(td2);
	}
}



//  p  n,f,r,m
//  1  1,1,0,0
//  2  2,1,1,1
//  3  2,2,0,0
//  4  3,1,2,1
//  5  3,3,0,0
//  6  4,1,3,1
//  7  4,2,2,2
//  8  4,4,0,0
//  9  5,1,4,1
// 10  5,2,3,2
// 11  5,5,0,0
//                    +---+-------------------+
// 12  6,1,5,1 -> 6/1 | 1 |            5/1+   | 5/1+ means 5/1, 5/2 and 5/5
//                    |---+---+---------------|                
// 13  6,2,4,2 -> 6/2 |   2   |        4/2+   | 4/2+ means 4/2 and 4/4
//                    |---+---+---+-----------|
// 14  6,3,3,3 -> 6/3 |     3     |    3/3+   | 3/3+ means 3/3
//                    |---+---+---+---+---+---|
// 15  6,6,0,0 -> 6/6 |          6            | 
//                    +-----------------------+
// n = number of angles
// array position (p) of first n: 
//    n even = n(n+2)/4
//    n odd  = ((n+1)/2)^2
function Partitions(max, rows) 
{
	this.a = [];
	for (var i=1; i <= max; i++) {
		for (j=1; j <= i; j++) {
			if (j <= i/2) {
				this.a.push([i, j, i-j, j]);
			} else {
				this.a.push([i, i, 0, 0]);
				break;
			}
		}
	}
	
	this.position = function(n) {
		return (n % 2) ? (n+1)*(n+1) / 4 : n*(n+2) / 4;
	};
	
	this.count = 0;
	this.newArray = [];
	this.counters = function() {
		this.newArray = [];
		for (var i=1; i <= max; i++) {
			this.count = 0;
			this.recurse(i, 1);
			rows.push("count " + i + " = " + this.count);
		}
	}
	
	this.recurse = function(pos, start) {
		for (var i=this.position(pos)-1; i < this.a.length; i++) {
			var row = this.a[i];
			if (row[0] != pos)
				break;
			if (row[1] >= start) {
				this.newArray.push(row[1]);
				if (row[2] == 0) { rows.push(JSON.stringify(this.newArray)); 
					this.count++;
				} else {
					this.recurse(row[2], row[3]);
				}
				this.newArray.pop();
			}
		}
	}
}

function eulerian(n) {
	return Math.pow(2,n) - n - 1;
}

function necklaces(array, rows) {
	rows.push(JSON.stringify(array));
}



function count(div) {
	var rows = [];
	div.innerHTML = "";
	/*
	var p = new Partitions(25, rows);
	p.counters();
	*/
	//necklaces([1,1,1,2,2], rows);
	for (var i=1; i < 14; i++)
		rows.push("i=" + i + " eulerian=" + eulerian(i));
	
	var s = rows.join("\n");
	div.innerHTML = "<pre>" + s + "</pre>";
	
}






var B = 
{
	pos : [
	 1,       
	 (Math.sqrt(2*(5 + Math.sqrt(5)))) / 4, // sin(2pi/5);
	 (Math.sqrt(5) + 1) / 4,                // cos(pi/5);
	 (Math.sqrt(10 - Math.sqrt(20))) / 4,   // sin(pi/5);
	 (Math.sqrt(5) - 1) / 4                 // cos(2pi/5);
	],
	points : {
	 "A": [ [ 0, 0], [-1, 0] ],
	 "B": [ [ 1, 3], [-1, 2] ],
	 "C": [ [ 1, 1], [-1, 4] ],
	 "D": [ [ 1, 1], [ 1, 4] ],
	 "E": [ [ 1, 3], [ 1, 2] ],
	 "a": [ [ 0, 0], [ 1, 0] ],
	 "b": [ [-1, 3], [ 1, 2] ],
	 "c": [ [-1, 1], [ 1, 4] ],
	 "d": [ [-1, 1], [-1, 4] ],
	 "e": [ [-1, 3], [-1, 2] ]
    }
};

var C = 
{
	pos : [
	 1,
	 Math.sqrt(3) / 2.0, // cos pi/6
	 1 / 2.0             // cos pi/3
	],
	points : {
	 "A": [ [ 0, 0], [-1, 0] ],
	 "B": [ [ 1, 2], [-1, 1] ],
	 "C": [ [ 1, 1], [-1, 2] ],
	 "D": [ [ 1, 0], [ 0, 0] ],
	 "E": [ [ 1, 1], [ 1, 2] ],
	 "F": [ [ 1, 2], [ 1, 1] ],
	 "a": [ [ 0, 0], [ 1, 0] ],
	 "b": [ [-1, 2], [ 1, 1] ],
	 "c": [ [-1, 1], [ 1, 2] ],
	 "d": [ [-1, 0], [ 0, 0] ],
	 "e": [ [-1, 1], [-1, 2] ],
	 "f": [ [-1, 2], [-1, 1] ]
    }
};

function createSVG(parent, w, h) {
    var xmlns = "http://www.w3.org/2000/svg";
    var canvas = document.createElementNS (xmlns, "svg");
    canvas.setAttributeNS (null, "viewBox", "0 0 " + w + " " + h);
    canvas.setAttributeNS (null, "width", w);
    canvas.setAttributeNS (null, "height", h);
    canvas.style.display = "block";
    parent.appendChild(canvas);
    return canvas;
}

function circle_tables(div, circle) {
	div.innerHTML = "";
	var points = circle.points;
	var pos = circle.pos;
	var vectors = circle.vectors;
	var t0 = elem("table", div);
	var tr0 = elem("tr", t0);
	var left = elem("td", tr0);
	var right = elem("td", tr0);
	
	var t1 = elem("table", left);
	var tr = elem("tr", t1);
	elem("th", tr, null, "pos");
	elem("th", tr, null, "value");
	for (p in pos) {
		var tr = elem("tr", t1);
		elem("td", tr, null, p);
		elem("td", tr, null, pos[p].toFixed(5));
	}
	
	var d = 130;
	var R = 80;
    var canvas = createSVG(left, 2*d, 2*d);
	//svg("circle", canvas, "circle", null, { cx:d, cy:d, r:R });
	var table = elem("table", right);
	var head = elem("tr", table);
	elem("th", head, null, "point");
	elem("th", head, null, "X dir");
	elem("th", head, null, "X pos");
	elem("th", head, null, "Y dir");
	elem("th", head, null, "Y pos");
	for (point in points) {
		var p = points[point];
		var tr = elem("tr", table);
		elem("td", tr, null, point);
		elem("td", tr, null, p[0][0]);
		elem("td", tr, null, p[0][1]);
		elem("td", tr, null, p[1][0]);
		elem("td", tr, null, p[1][1]);
		var x = R * (p[0][0] * pos[p[0][1]]);
		var y = R * (p[1][0] * pos[p[1][1]]);
		svg("line", canvas, "ray", null, { x1:d, y1:d, x2:d + x, y2:d + y, stroke:"#888" });
		svg("circle", canvas, "dot", null, { cx:d + x, cy:d + y, r:4 });
		svg("text", canvas, "number", point, { x: d + parseInt(1.2*x), y:parseInt(d + 1.2*y) });
	}
}

