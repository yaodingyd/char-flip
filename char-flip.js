import { g } from 'gelerator'

const padString = (str, len) => {
  if (str.length >= len) return str
  const fill = '_'
  const n = Math.floor((len - str.length) / 2)
  if (n) str = fill.repeat(n) + str + fill.repeat(n) 
  return str.length < len ? str + fill : str
}


export class Flip {
  constructor({
    node,
    from = '',
    to,
    duration = .5,
    delay,
    easeFn = (pos => (pos /= .5) < 1
                ? .5 * Math.pow(pos, 3)
                : .5 * (Math.pow((pos - 2), 3) + 2)),
    systemArr = 'abcdefghijklmnopqrstuvwxyz_'.split(''),
    direct = true,
    maxLength = 4
  }) {
    this.beforeArr = []
    this.afterArr = []
    this.ctnrArr = []
    this.duration = duration * 1000
    this.systemArr = systemArr
    this.easeFn = easeFn
    this.from = padString(from, maxLength)
    this.maxLength = maxLength
    this.to = to || ''
    this.node = node
    this.direct = direct
    this.base = this.systemArr.length
    this._initHTML(maxLength)
    if (to === undefined) return
    if (delay) setTimeout(() => this.flipTo({to: this.to, direct}), delay * 1000)
    else this.flipTo({to: this.to, direct})
  }

  _initHTML(digits) {
    this.node.classList.add('char-flip')
    this.node.style.position = 'relative'
    this.node.style.overflow = 'hidden'
    ;[...Array(digits).keys()].forEach(i => {
      const ctnr = g(`ctnr ctnr${i}`)(
        ...this.systemArr.map(i => g('digit')(i)),
        g('digit')(this.systemArr[0])
      )
      ctnr.style.position = 'relative'
      ctnr.style.display = 'inline-block'
      this.ctnrArr.push(ctnr)
      this.node.appendChild(ctnr)
      this.beforeArr.push(this.systemArr[0])
    })
    this.height = this.ctnrArr[0].clientHeight / (this.systemArr.length + 1)
    this.node.style.height = this.height + 'px'
    for (let d = 0, len = this.ctnrArr.length; d < len; d += 1)
      this._draw({
        digit: d,
        per: 1,
        alter: ~~(this.systemArr.indexOf(this.from[d]))
      })
  }

  _draw({per, alter, digit}) {
    const from = this.systemArr.indexOf(this.beforeArr[digit])
    const modNum = ((per * alter + from) % this.base + this.base) % this.base
    const translateY = `translateY(${- modNum * this.height}px)`
    this.ctnrArr[digit].style.webkitTransform = translateY
    this.ctnrArr[digit].style.transform = translateY
  }

  flipTo({
    to,
    duration,
    easeFn,
    direct = true
  }) {
    const len = this.ctnrArr.length
    this.beforeArr = this.from.split('')
    this.afterArr = padString(to, this.maxLength).split('')
    const draw = per => {
      let temp = 0
      for (let d = this.ctnrArr.length - 1; d >= 0; d -= 1) {
        let alter = this.systemArr.indexOf(this.afterArr[d]) - this.systemArr.indexOf(this.beforeArr[d])
        temp += alter
        const fn = easeFn || this.easeFn
        this._draw({
          digit: d,
          per: fn(per),
          alter: direct ? alter : temp
        })
        temp *= 10
      }
    }
    const start = performance.now()
    const dur = (duration * 1000) || this.duration
    const tick = now => {
      let elapsed = now - start
      draw(elapsed / dur)
      if (elapsed < dur) requestAnimationFrame(tick)
      else {
        this.from = to
        draw(1)
      }
    }
    requestAnimationFrame(tick)
  }
}