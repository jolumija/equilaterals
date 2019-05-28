const Geom = function(n) 
{
	const symm = 3 + 2*n
	const symm2 = parseInt(symm/2)

	const m = Math.PI / symm
	const angles = {
		all: [],
		m: m,
	}
	for (let a=1; a < symm; a++) 
		angles.all.push(a); // [1,2,...8]
	const as = []
	for (let a=0; a <= (symm-1)/2; ++a) 
		as.push(a) // [0,1,2,3,4]
	angles.cos = as.map(a => { return Math.cos(a*m) })
	angles.sin = as.map(a => { return Math.sin(a*m) })


	// symm=9 (x=>angles, y=>segments)
	// angle =>   1  2  3  4  5  6  7  8   red blue
	//                                     === ====
	// seg 0 => [ 8, 7, 6, 5, 4, 3, 2, 1 ]  1   10
	// seg 1 => [ 0, 8, 7, 6, 5, 4, 3, 2 ]  2   11
	// seg 2 => [ 1, 0, 8, 7, 6, 5, 4, 3 ]  3   12
	// seg 3 => [ 2, 1, 0, 8, 7, 6, 5, 4 ]  4   13
	// seg 4 => [ 3, 2, 1, 0, 8, 7, 6, 5 ]  5   14
	// seg 5 => [ 4, 3, 2, 1, 0, 8, 7, 6 ]  6   15
	// seg 6 => [ 5, 4, 3, 2, 1, 0, 8, 7 ]  7   16
	// seg 7 => [ 6, 5, 4, 3, 2, 1, 0, 8 ]  8   17
	// seg 8 => [ 7, 6, 5, 4, 3, 2, 1, 0 ]  9   18 
	const rows = []
	for (let r=0; r < symm; r++) { // segments
		const cols = []
		const first = symm + r
		for (let c=1; c < symm; c++) // angles
			cols.push((first - c)%symm)
		rows.push(cols)
	}
	const segments = []
	rows.forEach(row => {
		segments.push({
			next: row.map(r => { return r+symm })
		})
	})
	rows.forEach(row => {
		segments.push({
			next:row
		})
	})


	const xs = []
	const ys = []
	const L = ["a","b","c","d","e","f","g","h","i","j","k","l","m"]
	xs.push("1") // cos(0)
	ys.push("0") // cos(1)
	{
		let c = 0
		for (let x=0; x < symm2; x++, c++) { 
			xs.push(L[c]) 
		}
		for (let y=0; y < symm2; y++, c++) { 
			ys.push(L[c]) 
		}
	}
	function array(i) {
		const rows = []
		for (let a=0; a < symm2 + 1; a++) {
			const cols = []
			for (let b=0; b < symm2 + 1; b++)
				cols.push((a == b) ? i : 0)
			rows.push(cols)
		}
		return rows
	}
	const plus = array(+1)
	const minus = array(-1)

	const positions = [] // 1,15,2,16,3,17,4...
	{
		const xyp = []
		xyp.push(0) // 1,0
		const N = (symm - 1) / 2
		for (let i=1; i <= N; i++) { xyp.push(i) }
		for (let i=N; i >= 1; i--) { xyp.push(i) }

		for (let i=0; i < 2*symm; i++) {
			const p = { }
			if (i%2==0) {
				p.seg = 1 + (i)/2
				p.clazz = "r"
			} else {
				const diff = ((i+symm)/2) % symm
				p.seg = 1 + symm + diff
				p.clazz = "b"
			}
			const pos = xyp[i%symm]
			const x = (i < symm/2) || (i > 3*symm/2) // ok
			const y = !(i < symm) // ok
			positions.push(p)

			const seg = p.seg - 1
			segments[seg].x = x ? plus[pos] : minus[pos]
			segments[seg].y = y ? plus[pos] : minus[pos]
			segments[seg].pos = {
				p: pos,
				x: x,
				y: y
			}
		}
	}

	this.toString = function() { return `Geom n=${n} symm=${symm}` }
	this.symmetry = function() { return symm }
	this.segments = function() { return segments }
	this.rows     = function() { return rows }
	this.angles   = function() { return angles }

	this.xs = function() { return xs }
	this.ys = function() { return ys }

	this.zero = function() { // return new copies
		const zero = []
		for (let a=0; a < symm2 + 1; a++)
			zero.push(0)
		return zero
	}
	const g = this

	this.pos = function() { return positions }

	this.add = function(base, incr) {
		for (let i=0; i < base.length; i++) {
			base[i] += incr[i]
		}
	}

	const segmentClass = function(s) {
		return s < symm ? "r" : "b"
	}

	this.Vertices = function(x0, y0)
	{
		const min = { x:+Number.MAX_VALUE, y:+Number.MAX_VALUE }
		const max = { x:-Number.MAX_VALUE, y:-Number.MAX_VALUE }
		const vertices = {}
	
		const x = function() {
			let x = 0
			let pos = 0
			angles.cos.forEach(cos => {
				x += cos*x0[pos]
				pos++
			})
			if (x < min.x) min.x = x;
			if (x > max.x) max.x = x;
			return x
		}
		const y = function() {
			let y = 0
			let pos = 0
			angles.sin.forEach(sin => {
				y += sin*y0[pos]
				pos++
			})
			if (y < min.y) min.y = y;
			if (y > max.y) max.y = y;
			return y
		}
		
		let n=0
		
		const addVertex = function(xs, ys, figureIds) {
			for (let i=0; i < x0.length; i++) {	x0[i] += xs[i] }
			for (let i=0; i < y0.length; i++) {	y0[i] += ys[i] }
			const id = JSON.stringify([x0,y0])
			if (!vertices[id]) {
				const data = {
					id: id,
					xy: JSON.parse(id), // last copy
					x: x(),
					y: y(),
					n: n++
				}
				vertices[id] = data
			}
			if (figureIds)
				figureIds.push(id)
			return vertices[id]
		}

		this.vertex = function(id) {
			return vertices[id]
		}

		this.limits = function(lim) {
			const margin = lim.margin || 1
			const zoom = lim.zoom || 30
			return {
				min: {
					x: zoom*(min.x - margin),
					y: zoom*(min.y - margin)
				},
				max: {
					x: zoom*(max.x + margin),
					y: zoom*(max.y + margin)
				}
			}
		}

		this.Figure = function() 
		{
			let last = 0
			const ids = []
			const adds = []

			const self = this

			this.init = function(segments, _last, angles) {
				ids.push(segments.a)
				ids.push(segments.b)
				//console.log("segments", JSON.stringify(segments))
				const v = vertices[segments.b]
				//console.log("v", JSON.stringify(v.xy))
				for (let i=0; i < x0.length; i++) {	x0[i] = v.xy[0][i] }
				for (let i=0; i < y0.length; i++) {	y0[i] = v.xy[1][i] }
				last = _last
				angles.forEach(angle => {
					self.add(angle)
				})
				/*self.add(3)
				self.add(4)
				self.add(2)
				self.add(3)
				self.add(4)*/

			}

			this.segments = function(pos) {
				return {
					a: ids[pos], 
					b: ids[pos-1],
					c: adds[pos],
					d: adds[pos-1]
				}
			}

			this.add0 = function(x, y) {
				return addVertex(x, y, ids)
			}

			this.add = function(angle) {
				const newAdd = {
					angle:angle,
					last1:last,
					id1: ids[ids.length-1]
				}
				if (angle <= 0) {
					last = 0
				} else {
					last = segments[last].next[angle-1]
				}
				const x = segments[last].x
				const y = segments[last].y
				const v = addVertex(x, y, ids)

				newAdd.id2 = ids[ids.length-1]
				newAdd.last2 = last
				newAdd.v = v
				adds.push(newAdd)
				console.log("add newAdd", newAdd)
				return v
			}

			this.last = function() {
				return {
					clazz: segmentClass(last),
					segment: last + 1,
					x: segments[last].x,
					y: segments[last].y
				}
			}

			this.polyline = function(ZOOM) {
				const polyline = []
				ids.forEach(id => {
					const data = vertices[id]
					if (data) {
						polyline.push({
							x: ZOOM * data.x,
							y: ZOOM * data.y
						})
					}
				})
				return polyline
			}

			this.xys = function() {
				return ids.map(id => {
					return vertices[id]
				})
			}

			this.adds = function() {
				return adds
			}
		}
	}
}
