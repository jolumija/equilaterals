

const polygon = function(m)
{
	/*
	m = 0 : Hexagon
	m = 1 : Decagon
	m = 2 : 14-gon...
	*/
	this.n = 6 + 4*m

	/* 
	Example: Decagon (m=1) n = 10 = 6 + 4*m
	         0
	     9   |   1        x0 = sin(0pi/10) = 0
	      \  |  /         x1 = sin(2pi/10) = 0.587+
	 8 _   \ | /   _ 2    x2 = sin(4pi/10) = 0.951+
	     ~ _\|/_ ~ 
	       _ + _          y0 = cos(0pi/10) = 1
	   _ ~  /|\  ~ _      y1 = cos(2pi/10) = 0.809+
	 7     / | \     3    y2 = cos(4pi/10) = 0.309+
	      /  |  \ 
	     6   |   4
	         5
	*/
	this.x = [] // m size
	this.y = [] // m size
	for (let i=0; i < (m+2); i++) {
		this.x.push(Math.sin(2*i*Math.PI/this.n))
		this.y.push(Math.cos(2*i*Math.PI/this.n))
	}

	/*
	       v8 v9 v0 v1 v2 |  v3 v4 v5 v6 v7
	       ===============================
	   x2  -           +  |  +           -
	   x1     -     +     |     +     -
	   x0        0        |        0
	       ===============================
	   y2  +           +  |  -           -
	   y1     +     +     |     -     -    
	   y0        +        |        - 
	*/

	/*
	v0 = [ [1,0,0], [1,0,0] ]
	v1 = [ [0,1,0], [] ]
	v2 = [ []]
	*/

	this.v = []

}

const decagon = new polygon(1)

console.log(decagon.n)
console.log(decagon.x)
console.log(decagon.y)



