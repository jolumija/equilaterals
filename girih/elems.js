const $ = (id)=> { 
	return document.getElementById(id)
}

const elem = (type, parent, clazz, text, attrs)=> {
	var e = document.createElement(type)
	if (parent) 
		parent.appendChild(e)
	if (clazz) 
		e.className = clazz
	if (text != null) 
		e.appendChild(document.createTextNode(text))
	if (attrs) 
		for (attr in attrs) 
			e.setAttribute(attr, attrs[attr])
	return e
}

const Footer = function(keyListener, footer, states, actions) 
{
	let state = null
	let keys = []

	const change = (row)=> {
		if (row.action) {
			const a = actions[row.action]
			if (a && typeof a === "function")
				a(row.params)
		}
		setState(row.next)
	}

	const keyCode = (code)=> {
		keys.forEach(k => {
			if (code == "Key" + k.c) {
				change(k)
	      	}
		})
	}

	const setState = (key)=> {
		state = states[key]
		if (!state)
			return
		footer.innerHTML = ""
		const buttons = elem("div", footer, "buttons", null, {})
		elem("div", buttons, "label", key, {})
		keys = []
		state.forEach(row => {
			const btn = elem("div", buttons, "button")
			row.name.split("").forEach(l => {
				const clazz = l == row.c ? "mark" : null
				elem("span", btn, clazz, l)
			})
			btn.onclick = ()=> {
				change(row)
			}
			keys.push(row)
		})
	}
	setState("Init")
	keyListener.onkeyup = function(e) {
	    const ev = e || event
	    keyCode(ev.code)
	}
}

