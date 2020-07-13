import qs, {
  parse
} from 'query-string'

import poem from './poem.json'

const MIN_SCALE = 0.8
const MAX_SCALE = 1
const IN_TIME = 1 // 4
const HOLD_TIME = 1 // 7
const OUT_TIME = 1 // 8
// const EASE

const container = document.getElementById('container')
const lineEl = document.getElementById('line')
const continueEl = document.getElementById('continue')
const debugEl = document.querySelector('.debug')

let _currLine = 0
let _canProgress = true
let _queryParams, _currPulseTl

function pulseAnim(pulseFreq) {
  function setNewPulse() {
    _currPulseTl = gsap.timeline({
      repeat: -1,
      yoyo: true
    })
    _currPulseTl.fromTo(container, {
      scale: MIN_SCALE
    }, {
      scale: MAX_SCALE,
      duration: pulseFreq,
      ease: 'none'
    })
  }

  // wrap up curr pulse anim if any
  endAnyPulse(() => {
    setNewPulse()
  })
}

function endAnyPulse(onComplete) {
  if (_currPulseTl) {
    _currPulseTl.repeat(0)
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
    gsap.fromTo(container, OUT_TIME, {
      scale: MAX_SCALE
    }, {
      scale: MIN_SCALE
    })
  },
  pulse1() {
    pulseAnim(4)
    // pulseAnim(1)
  },
  pulse2() {
    pulseAnim(2)
    // pulseAnim(1)
  },
  pulse3() {
    pulseAnim(1)
    // pulseAnim(1)
  },
  pulse4() {
    pulseAnim(0.3)
    // pulseAnim(1)
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
  lineEl.innerText = lineData.text

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