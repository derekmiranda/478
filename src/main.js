import qs, {
  parse
} from 'query-string'

import poem from './poem.json'

const MIN_SCALE = 1
const MAX_SCALE = 1.3
const IN_TIME = 4
const HOLD_TIME = 7
const OUT_TIME = 8
const EASE = "power1.inOut"

const container = document.getElementById('container')
const lineEl = document.getElementById('line')
const continueEl = document.getElementById('continue')
const debugEl = document.querySelector('.debug')

let _currLine = 0
let _canProgress = true
let _queryParams, _currPulseTl, _currPulseFreq

function pulseAnim(pulseFreq) {
  if (_currPulseTl) {
    // change curr tweens' duration
    _currPulseTl.timeScale(_currPulseFreq / pulseFreq)
    _currPulseFreq = pulseFreq
  } else {
    _currPulseTl = gsap.timeline({
      repeat: -1,
      yoyo: true
    })
    _currPulseTl.fromTo(container, {
      scale: MIN_SCALE
    }, {
      scale: MAX_SCALE,
      duration: pulseFreq,
      ease: EASE
    }).fromTo(container, {
      scale: MAX_SCALE
    }, {
      scale: MIN_SCALE,
      duration: pulseFreq,
      ease: EASE
    })
    _currPulseFreq = pulseFreq
  }
}

function endAnyPulse(onComplete) {
  if (_currPulseTl) {
    _currPulseTl.repeat(0)
    _currPulseTl.yoyo(false)
    _currPulseTl.eventCallback('onComplete', () => {
      _currPulseTl.kill()
      _currPulseTl = null
      onComplete && onComplete.call(null)
    })
  } else {
    onComplete && onComplete.call(null)
  }
}

function disableBtn() {
  continueEl.classList.add('continue--inactive')
  _canProgress = false
}

function enableBtn() {
  continueEl.classList.remove('continue--inactive')
  _canProgress = true
}

function handleClick(e) {
  if (_canProgress) {
    _currLine++
    processLine()
  }
}

const anims = {
  in () {
    endAnyPulse()
    disableBtn()
    gsap.fromTo(container, IN_TIME, {
      scale: MIN_SCALE
    }, {
      scale: MAX_SCALE,
      onComplete() {
        enableBtn()
      }
    })
  },
  hold() {
    disableBtn()
    // TODO: passive anim
    gsap.delayedCall(HOLD_TIME, () => {
      enableBtn()
    })
  },
  out() {
    endAnyPulse
    disableBtn()
    gsap.fromTo(container, OUT_TIME, {
      scale: MAX_SCALE
    }, {
      scale: MIN_SCALE,
      onComplete() {
        enableBtn()
      }
    })
  },
  pulse1() {
    pulseAnim(4)
  },
  pulse2() {
    pulseAnim(2)
  },
  pulse3() {
    pulseAnim(1)
  },
  pulse4() {
    pulseAnim(0.3)
  },
  end() {
    removeContinue()
  }
}

function removeContinue() {
  continueEl.style.display = 'none'
}

function processLine() {
  const lineData = poem[_currLine]
  lineEl.innerHTML = lineData.text

  if (lineData.anim) {
    anims[lineData.anim]()
  }

  if (_queryParams.debug) {
    debugEl.innerText = `Line: ${_currLine}`
  }
}

function processQueryParams() {
  _queryParams = qs.parse(location.search)

  let parsedLineNo = parseInt(_queryParams.line)
  if (!isNaN(_queryParams.line)) {
    _currLine = parsedLineNo
  }

  if (_queryParams.debug) {
    debugEl.classList.add('debug--active')
  }
}

function main() {
  processQueryParams()
  processLine()
  continueEl.addEventListener('click', handleClick)
}

main()