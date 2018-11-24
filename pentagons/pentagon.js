// @ib18
const Pentagon = function() 
{
	const v0 = [ 0, 0 ] // fixed
	const v1 = [ 1, 0 ] // fixed
	const v2 = [ 0, 0 ]
	const v3 = [ 1, 0 ]
	const v4 = [ 0, 0 ]

	let a1 = 1
	let a2 = 1
	let a3 = 1

	let angle = 1

	const self = this

	this.set = function(_a1, _a2, _a3) {
		a1 = _a1
		a2 = _a2
		a3 = _a3
	}

	this.move = function(_angle) 
	{
		angle = _angle
		const b1 = Math.PI - angle*a1
		const b2 = Math.PI - angle*a2
		const b3 = Math.PI - angle*a3

		v2[0] = v1[0] + Math.cos(b1)
		v2[1] = v1[1] + Math.sin(b1)

		v3[0] = v2[0] + Math.cos(b1 + b2)
		v3[1] = v2[1] + Math.sin(b1 + b2)

		v4[0] = v3[0] + Math.cos(b1 + b2 + b3)
		v4[1] = v3[1] + Math.sin(b1 + b2 + b3)
	}

	this.lastEdge = function() {
		const d04 = Math.sqrt(v4[0]*v4[0] + v4[1]*v4[1])
		return d04
	}

	this.a4 = function() {
		const d04_2 = v4[0]*v4[0] + v4[1]*v4[1]
		const d03_2 = v3[0]*v3[0] + v3[1]*v3[1]
		const cos4 = (d04_2 + 1 - d03_2) / (2*Math.sqrt(d04_2))
		return Math.acos(cos4) / angle;
	}

	this.points = function() {
		return `${v0[0]},${v0[1]} ${v1[0]},${v1[1]} ${v2[0]},${v2[1]} ${v3[0]},${v3[1]} ${v4[0]},${v4[1]}`
	}
}
