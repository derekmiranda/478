import poem from './poem.json'

const MIN_SCALE = 0.5
const MAX_SCALE = 1
const IN_TIME = 4
const HOLD_TIME = 7
const OUT_TIME = 8

const container = document.getElementById('container')
const lineEl = document.getElementById('line')
const continueEl = document.getElementById('continue')

let _currLine = 0

function pulseAnim(pulseFreq) {
  const tl = gsap.timeline({
    repeat: -1
  })
  return tl.to(container, {
      scale: MAX_SCALE,
      duration: pulseFreq
    })
    .to(container, {
      scale: MIN_SCALE,
      duration: pulseFreq
    })
}

const anims = {
  in () {
    gsap.fromTo(container, IN_TIME, {
      scale: MIN_SCALE
    }, {
      scale: MAX_SCALE
    })
  },
  out() {
    gsap.fromTo(container, OUT_TIME, {
      scale: MAX_SCALE
    }, {
      scale: MIN_SCALE
    })
  },
  pulse1() {
    gsap.fromTo(container, IN_TIME, {
      scale: MIN_SCALE
    }, {
      scale: MAX_SCALE
    })
  },
}

function processLine() {
  const lineData = poem[_currLine]
  lineEl.innerText = lineData.text

  if (lineData.anim) {
    anims[lineData.anim]()
  }

  _currLine++
}

function main() {
  processLine()
}

main()