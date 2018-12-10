export function addClass (el, className) {
  if (!hasClass(el, className)) {
     let newClass = el.className.split(' ')
     newClass.push(className)
     el.className = newClass.join('')
  }
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData (el, name, value) {
  name = 'data-' + name

  if (value) {
    el.setAttribute(name, value)
  } else {
    return el.getAttribute(name)
  }
}

let vendor = (() => {
  let elementStyle = document.createElement('div').style

  let transfromNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transfromNames) {
    if (transfromNames.hasOwnProperty(key)) {
      if (elementStyle[transfromNames[key]] !== undefined) {
        return key
      }
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) return false

  if (vendor === 'standard') {
    return style
  } else {
    return vendor + style.slice(0, 1).toUpperCase() + style.slice(1)
  }
}
