const Canvas = function(canvas, debug)
{
	let X = 100
	let Y = 100
	let Z = 1.0

	this.zoom = (z) => {
		if (z > 0) {
			Z *= 1.1
			if (Z > 10)
				Z = 10.0
		} else
		if (z < 0) {
			Z /= 1.1
			if (Z < 0.1)
				Z = 0.1
		} else {
			Z = 1.0
		}
		debug(`zoom: ${Z.toFixed(2)}`)
	}

	this.pan = (x, y)=> {
		if (x > 0) { // right
			X += 10
		} else 
		if (x < 0) { // lefth
			X -= 10
		} else {
			if (y > 0) { // up
				Y -= 10
			} else
			if (y < 0) { // down
				Y += 10
			} else { // center
				X = 100
				Y = 100
			}
		}
		debug(`position: ${X},${Y}`)
	}
}

const Selection = function(canvas, debug) 
{
	let f = 0
	let m = 0
	let r = 0
	const forms = [
		{ name: "rhombus",  moves: 4, rotations: 10 },
		{ name: "pentagon", moves: 5, rotations: 10 },
		{ name: "convex",   moves: 6, rotations: 10 },
		{ name: "concave",  moves: 6, rotations: 10 },
		{ name: "decagon",  moves:10, rotations: 10 }
	]

	this.change = (which)=> {
		if (!which)
			f++
		if (f >= forms.length)
			f = 0
		m = 0
		r = 0
		debug(`Change to form ${forms[f].name}`)
	}

	this.move = (pos)=> {
		if (!pos)
			m++
		if (m >= forms[f].moves)
			m = 0
		debug(`Change ${forms[f].name} position ${m}`)
	}

	this.rotate = (pos)=> {
		if (!pos)
			r++
		if (r >= forms[f].rotations)
			r = 0
		debug(`Change ${forms[f].name} rotation ${r}`)
	}

	this.add = ()=> {
		debug(`Add ${forms[f].name} position ${m} rotation ${r}`)
	}
}

const Forms = function(canvas, debug) 
{

	this._new = (what)=> {
		switch (what) {
			case "pre":  /*TODO*/ break; // paint drawing to be cleared
			case "yes":  /*TODO*/ break; // clear drawing
			case "post": /*TODO*/ break; // paint drawing cleared
			default:
				return debug(`ERROR: forms._new wrong param ${what}`)
		}
		debug(`new ${what}`)
	}
	this.save = (what)=> {
		switch (what) {
			case "pre":  /*TODO*/ break; // paint drawing to be saved
			case "yes":  /*TODO*/ break; // save drawing
			case "post": /*TODO*/ break; // paint drawing saved
			default:
				return debug(`ERROR: forms.save wrong param ${what}`)
		}
		debug(`save ${what}`)
	}
	this.delete = (what)=> {
		switch (what) {
			case "pre":  /*TODO*/ break; // paint form to deleted
			case "yes":  /*TODO*/ break; // delete form
			case "post": /*TODO*/ break; // paint form not to be deleted
			default:
				return debug(`ERROR: forms.save wrong param ${what}`)
		}
		debug(`save ${what}`)
	}
}



const Gui = function(editor)
{
	const canvasE = elem("canvas", editor, "canvas")

	let timeout
	const debugElem = elem("div", editor, "fade")

	const debug = (text)=> {
		debugElem.innerHTML = text
		debugElem.style.opacity = "1"
		if (timeout)
			clearTimeout(timeout)
		timeout = setTimeout(function() {
			debugElem.style.opacity = "0"
			timeout = null
		}, 2000)
	}

	const debugNoParamsError = (key)=> {
		debug(`ERROR: ${key} with no parameters`)
	}
	const debugWrongParamError = (key, param)=> {
		debug(`ERROR: ${key} wrong param ${param}`)
	}

	const canvas    = new Canvas   (canvasE, debug)
	const selection = new Selection(canvasE, debug)
	const forms     = new Forms    (canvasE, debug)

	const action = (key, params, options)=> {
		if (!params || params.length < 1)
			return debugNoParamsError(key)
		for (let o=0; o < options.length; o++) {
			const O = options[o]
			if (O.param == params[0]) {
				if (O.f && typeof O.f === "function") {
					O.f.apply(null, O.args);	
					return
				}
			}
		}
		return debugWrongParamError("pan", params[0])
	}


	const actions = 
	{
		Zoom: (params)=> {
			action("zoom", params, [
				{ param:"+", f:canvas.zoom, args:[ +1 ] },
				{ param:"1", f:canvas.zoom, args:[  0 ] },
				{ param:"-", f:canvas.zoom, args:[ -1 ] }
			])
		},
		Pan: (params)=> {
			action("pan", params, [
				{ param: "U", f: canvas.pan, args: [  0, +1 ] },
				{ param: "R", f: canvas.pan, args: [ +1,  0 ] },
				{ param: "C", f: canvas.pan, args: [  0,  0 ] },
				{ param: "D", f: canvas.pan, args: [  0, -1 ] },
				{ param: "L", f: canvas.pan, args: [ -1,  0 ] },
			])
		},
		Init: (params)=> {
			action("init", params, [
				{ param:"new",  f:forms._new, args:["pre"] },
				{ param:"save", f:forms.save, args:["pre"] }
			])
		},
		New: (params)=> {
			action("new", params, [
				{ param: "yes",    f: forms._new, args: [ "yes" ] },
				{ param: "cancel", f: forms._new, args: [ "post" ] },
			])
		},
		Save: (params)=> {
			action("save", params, [
				{ param: "yes",    f: forms.save, args: [ "yes" ]  },
				{ param: "cancel", f: forms.save, args: [ "post" ] },
			])
		},
		Form: (params)=> {
			action("form", params, [
				{ param:"change", f: selection.change, args:[] },
				{ param:"move",   f: selection.move,   args:[] },
				{ param:"rotate", f: selection.rotate, args:[] },
				{ param:"add",    f: selection.add,    args:[] },
				{ param:"delete", f: forms.delete,     args:["pre"] }
			])
		},
		Delete: (params)=> {
			action("delete", params, [
				{ param:"yes",    f: forms.delete, args:[ "yes" ] },
				{ param:"cancel", f: forms.delete, args:[ "post "] }
			])
		},
		Forms: (params)=> {
			console.log("forms", params)
		},
		Vertices: (params)=> {
			console.log("Vertices", params)
		}
	}

	this.action = (key, action) => {
		if (key && action) {
			//console.log("gui.action", key, action)
			const f = actions[key]
			if (f && typeof f === "function") {
				f(action)
			} else {
				console.log("Error. key=" + key + " action=" + JSON.stringify(action))
			}
		}
	}
}