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

const $style = (e, styles)=> {
	Object.keys(styles || {}).forEach(k => {
		e.style[k] = styles[k]
	})
}

const Footer = function(keyListener, footer, states, action) 
{
	let state = null
	let keys = []

	const change = (row)=> {
		action(row.key, row.action)
		setState(row.next)
	}

	const keyCode = (e)=> {
		for (let a=0; a < keys.length; a++) {
			const k = keys[a]
			const match = (code)=> {
				if (!code)
					return false
				if (e.key.toUpperCase() == code.toUpperCase()) {
					change(k)
					return true
				}
			}
			if (Array.isArray(k.c)) {
				for (let i=0; i < k.c.length; i++) {
					if (match(k.c[i]))
						return
				}
			} else {
				if (match(k.c))
					return
			}
		}
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
			let found = false
			row.name.split("").forEach(l => {
				const c = (Array.isArray(row.c)) ? row.c[0] : row.c
				let clazz = ""
				if (!found) {
					if (l == c) {
						found = true
						clazz = "mark"
					}
				}
				elem("span", btn, clazz, l)
			})
			const r = {
				key: key,
				c: row.c,
				action: row.action,
				next: row.next
			}
			btn.onclick = ()=> {
				change(r)
			}
			keys.push(r)
		})
	}
	setState("Init")
	keyListener.onkeyup = function(e) {
	    keyCode(e || event)
	}
}

