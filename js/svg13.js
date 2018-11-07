const fs = require("fs")
const s = fs.createWriteStream("13.svg")

const w = 600
const h = 400
const svg = `width="${w}" height="${h}" \
	xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"`

s.once("open", (fd)=>{
	//s.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
	s.write(`<svg ${svg}>\n`)
	s.write(' <g stroke="red" stroke-width="1">\n')
	for (let i=0; i < 13; i++) {
		const a = 2*Math.PI*i/13
		const x = 40*Math.sin(a) + 50
		const y = 40*Math.cos(a) + 50
		s.write(`  <line x1="50" y1="50" x2="${x}" y2="${y}"/>\n`)
	}
	s.write(' </g>\n')
	s.write(' <g stroke="blue" stroke-width="1">\n')
	for (let i=0; i < 13; i++) {
		const a = 2*Math.PI*i/13
		const x = -40*Math.sin(a) + 150
		const y = -40*Math.cos(a) + 50
		s.write(`  <line x1="150" y1="50" x2="${x}" y2="${y}"/>\n`)
	}
	s.write(' </g>\n')

	s.write(star1(13, "fill:#f008;stroke:#f00;stroke-width:2"))

	s.write('</svg>\n')
})

function star1(n, style) {
	const l = 40
	const o = [250,150]
	const points = []
	for (let i=0; i < n; i++) {
		const a = 2*Math.PI*i/n
		const x1 = -l*Math.sin(a) + o[0]
		const y1 = -l*Math.cos(a) + o[1]
		points.push(`${x1},${y1}`)

		const b = 2*Math.PI*(i+1)/n
		const x2 = -l*Math.sin(b) + x1
		const y2 = -l*Math.cos(b) + y1
		points.push(`${x2},${y2}`)
	}
	return `<polyline points="${points.join(" ")}" style="${style}" />`
}


function circle(style) {
	const points = [ "20,20", "40,25", "60,40", "80,120", "120,140", "200,180" ]
	return `<polyline points="${points.join(" ")}" style="${style}" />`
}
