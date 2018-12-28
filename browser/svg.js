const SVG = function(parent, min, max)
{
	const minX   = min.x
	const minY   = min.y
	const width  = max.x - min.x
	const height = max.y - min.y
    const xmlns = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(xmlns, "svg")
    svg.setAttributeNS(null, "viewBox", `${minX} ${minY} ${width} ${height}`)
    svg.setAttributeNS(null, "width", width)
    svg.setAttributeNS(null, "height", height)
    svg.style.display = "block"
    parent.appendChild(svg)

	function elem(type, parent, clazz, text, attrs) {
		var e = document.createElementNS(xmlns, type)
		if (parent) 
			parent.appendChild(e)
		if (clazz) 
			e.setAttribute("class", clazz)
		if (text) 
			e.appendChild(document.createTextNode(text))
		if (attrs) 
			for (attr in attrs) 
				e.setAttribute(attr, attrs[attr])
		return e
	}

	this.polyline = function(points, s) {
		const p = points.map(p => { 
			return `${p.x},${p.y}`
		})
		var style = []
		if (s.stroke)
			style.push("stroke:" + s.stroke + ";")
		if (s.fill)
			style.push("fill:" + s.fill + ";")
		if (s.opacity)
			style.push("fill-opacity:" + s.opacity + ";")
		if (s.strokeWidth)
			style.push("stroke-width:" + s.strokeWidth + ";")
		return elem("polyline", svg, null, null, {
			points: p.join(" "),
			style: style.join(" ")
		})
	}
}
