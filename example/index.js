import { Flip } from '../char-flip'

const $ = s => document.querySelector(s)

const flip = new Flip({
  node: $('.flip'),
  from: 'developer',
  easeFn: function(pos) {
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
    return 0.5 * (Math.pow((pos-2),3) + 2);
  },
  maxLength: 12
})

const title = [
  'developer',
  'designer',
  'manager',
  'contributer'
]

let cnt = 0

$('button').onclick = () => {
  flip.flipTo({to: title[++cnt%4]})
}