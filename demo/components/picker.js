var MobileArea = function() {
  this.gearArea
  this.index = 0
  this.value = [0, 0, 0]
    // this.column = 3
}
MobileArea.prototype = {
  init: function(params) {
    this.params = params
    this.trigger = document.querySelector(params.trigger)
    this.column = params.column
    this.eT = params.endTime
    this.sT = params.startTime
    this.bindEvent()
  },
  bindEvent: function() {
    var _self = this
      // 呼出插件
    function popupArea(e) {
      _self.gearArea = document.querySelector('.gearArea')
      _self.gearArea.innerHTML = '<div class="areaCtrl slideInUp">' +
        '<div class="areaBtnBox">' +
        '<div class="areaBtn lareaCancel">取消</div>' +
        '<div class="areaBtn lareaFinish">确定</div>' +
        '</div>' +
        '<div class="lareaRollMask">' +
        '<div class="areaRoll">' +
        '<div>' +
        '<div class="gear areaProvince" data-areatype="areaProvince"></div>' +
        '<div class="areaGrid">' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div class="gear areaCity" data-areatype="areaCity"></div>' +
        '<div class="areaGrid">' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div class="gear areaCounty" data-areatype="areaCounty"></div>' +
        '<div class="areaGrid">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
      document.body.appendChild(_self.gearArea)
      areaCtrlInit()
      var lareaCancel = _self.gearArea.querySelector('.lareaCancel')
      lareaCancel.addEventListener('touchstart', function(e) {
        _self.close(e)
      })
      var lareaFinish = _self.gearArea.querySelector('.lareaFinish')
      lareaFinish.addEventListener('touchstart', function(e) {
        _self.finish(e)
      })

      var areaProvince = _self.gearArea.querySelector('.areaProvince')
      var areaCity = _self.gearArea.querySelector('.areaCity')
      var areaCounty = _self.gearArea.querySelector('.areaCounty')
      if (_self.column === 2) {
        areaCounty.parentNode.style.display = 'none'
      }
      if (_self.column === 1) {
        areaCounty.parentNode.style.display = 'none'
        areaCity.parentNode.style.display = 'none'
      }
      areaProvince.addEventListener('touchstart', gearTouchStart)
      areaProvince.addEventListener('touchmove', gearTouchMove)
      areaProvince.addEventListener('touchend', gearTouchEnd)
      areaCity.addEventListener('touchstart', gearTouchStart)
      areaCity.addEventListener('touchmove', gearTouchMove)
      areaCity.addEventListener('touchend', gearTouchEnd)
      areaCounty.addEventListener('touchstart', gearTouchStart)
      areaCounty.addEventListener('touchmove', gearTouchMove)
      areaCounty.addEventListener('touchend', gearTouchEnd)
    }
    // 初始化插件默认值
    function areaCtrlInit() {
      _self.gearArea.querySelector('.areaProvince').setAttribute('val', _self.value[0])
      _self.gearArea.querySelector('.areaCity').setAttribute('val', _self.value[1])
      _self.gearArea.querySelector('.areaCounty').setAttribute('val', _self.value[2])
      _self.setGearTooth()
    }
    // 触摸开始
    function gearTouchStart(e) {
      e.preventDefault()
      var target = e.target
      while (true) {
        if (!target.classList.contains('gear')) {
          target = target.parentElement
        } else {
          break
        }
      }
      clearInterval(target['int_' + target.id])
      target['old_' + target.id] = e.targetTouches[0].screenY
      target['o_t_' + target.id] = (new Date()).getTime()
      var top = target.getAttribute('top')
      if (top) {
        target['o_d_' + target.id] = parseFloat(top.replace(/em/g, ''))
      } else {
        target['o_d_' + target.id] = 0
      }
      target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms'
    }
    // 手指移动
    function gearTouchMove(e) {
      e.preventDefault()
      var target = e.target
      while (true) {
        if (!target.classList.contains('gear')) {
          target = target.parentElement
        } else {
          break
        }
      }
      target['new_' + target.id] = e.targetTouches[0].screenY
      target['n_t_' + target.id] = (new Date()).getTime()
      var f = (target['new_' + target.id] - target['old_' + target.id]) * 30 / window.innerHeight
      target['pos_' + target.id] = target['o_d_' + target.id] + f
      target.style['-webkit-transform'] = 'translate3d(0,' + target['pos_' + target.id] + 'em,0)'
      target.style['transform'] = 'translate3d(0,' + target['pos_' + target.id] + 'em,0)'
      target.setAttribute('top', target['pos_' + target.id] + 'em')
      if (e.targetTouches[0].screenY < 1) {
        gearTouchEnd(e)
      }
    }
    // 离开屏幕
    function gearTouchEnd(e) {
      e.preventDefault()
      var target = e.target
      while (true) {
        if (!target.classList.contains('gear')) {
          target = target.parentElement
        } else {
          break
        }
      }
      var moveDiff = target['new_' + target.id] - target['old_' + target.id]
      var flag = moveDiff / (target['n_t_' + target.id] - target['o_t_' + target.id])
      if (Math.abs(flag) <= 0.2) {
        target['spd_' + target.id] = (flag < 0 ? -0.08 : 0.08)
      } else {
        if (Math.abs(flag) <= 0.5) {
          target['spd_' + target.id] = (flag < 0 ? -0.16 : 0.16)
        } else {
          if (target['new_' + target.id] === undefined) {
            flag = 0
          }
          target['spd_' + target.id] = flag / 2
        }
      }
      if (!target['pos_' + target.id]) {
        target['pos_' + target.id] = 0
      }
      rollGear(target)
    }
    // 缓动效果
    function rollGear(target) {
      var d = 0
      var stopGear = false

      function setDuration() {
        target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms'
        stopGear = true
      }
      clearInterval(target['int_' + target.id])
      target['int_' + target.id] = setInterval(function() {
        var pos = target['pos_' + target.id]
        var speed = target['spd_' + target.id] * Math.exp(-0.03 * d)
        pos += speed
        if (Math.abs(speed) > 0.1) {} else {
          var b = Math.round(pos / 2) * 2
          pos = b
          setDuration()
        }
        if (pos > 0) {
          pos = 0
          setDuration()
        }
        var minTop = -(target.dataset.len - 1) * 2
        if (pos < minTop) {
          pos = minTop
          setDuration()
        }
        if (stopGear) {
          var gearVal = Math.abs(pos) / 2
          setGear(target, gearVal)
          clearInterval(target['int_' + target.id])
        }
        target['pos_' + target.id] = pos
        target.style['-webkit-transform'] = 'translate3d(0,' + pos + 'em,0)'
        target.style['transform'] = 'translate3d(0,' + pos + 'em,0)'
        target.setAttribute('top', pos + 'em')
        d++
      }, 30)
    }
    // 控制插件滚动后停留的值
    function setGear(target, val) {
      val = Math.round(val)
      target.setAttribute('val', val)
      _self.setGearTooth()
    }
    popupArea()
  },
  // 重置节点个数
  setGearTooth: function() {
    var _self = this
    const childData = _self.getData()
    var itemStr = ''
    var l = childData.length
    var gearChild = _self.gearArea.querySelectorAll('.gear')
    var gearVal = gearChild[_self.index].getAttribute('val')
    var maxVal = l - 1
    if (gearVal > maxVal) {
      gearVal = maxVal
    }
    gearChild[_self.index].setAttribute('data-len', l)
    for (let i = 0; i < l; i++) {
      itemStr += "<div class='tooth'>" + childData[i] + '</div>'
    }
    gearChild[_self.index].innerHTML = itemStr
    gearChild[_self.index].style['-webkit-transform'] = 'translate3d(0,' + (-gearVal * 2) + 'em,0)'
    gearChild[_self.index].style['transform'] = 'translate3d(0,' + (-gearVal * 2) + 'em,0)'
    gearChild[_self.index].setAttribute('top', -gearVal * 2 + 'em')
    gearChild[_self.index].setAttribute('val', gearVal)
    _self.index++
    if (_self.index > 2) {
      _self.index = 0
      return
    }
    _self.setGearTooth(childData)
  },
  getData: function() {
    switch (this.index) {
      case 0:
        var sT = this.sT
        var eT = this.eT
        var yearArr = []
        for (; sT <= eT; sT++) {
          yearArr.push(sT + '年')
        }
        this.yearArr = yearArr
        return yearArr
      case 1:
        this.monthArr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        return this.monthArr
      case 2:
        const yearVal = this.gearArea.querySelector('.areaProvince').getAttribute('val')
        const monthVal = this.gearArea.querySelector('.areaCity').getAttribute('val')
        const year = parseInt(this.yearArr[yearVal])
        const month = parseInt(this.monthArr[monthVal])
        if (!year || !month) {
          return false
        }
        const isR = year % 4 === 0
        var dayLength
        this.dayArr = []
        if (month === 2) {
          if (isR) {
            dayLength = 29
          } else {
            dayLength = 28
          }
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
          dayLength = 30
        } else {
          dayLength = 31
        }
        for (let i = 1; i <= dayLength; i++) {
          this.dayArr.push(`${i}日`)
        }
        return this.dayArr
    }
  },
  finish: function(e) {
    e.preventDefault()
    var _self = this
    var areaProvince = _self.gearArea.querySelector('.areaProvince')
    var areaCity = _self.gearArea.querySelector('.areaCity')
    var areaCounty = _self.gearArea.querySelector('.areaCounty')
    var provinceVal = parseInt(areaProvince.getAttribute('val'))
    var provinceText = areaProvince.childNodes[provinceVal].textContent
    var cityVal = parseInt(areaCity.getAttribute('val'))
    var cityText = areaCity.childNodes[cityVal].textContent
    var countyVal = parseInt(areaCounty.getAttribute('val'))
    var countyText = areaCounty.childNodes[countyVal].textContent
    _self.value = [provinceVal, cityVal, countyVal]
    var nameText = ''
    if (_self.column === 1) {
      nameText = provinceText
      _self.trigger.value = parseInt(provinceText)
    } else if (_self.column === 2) {
      nameText = provinceText + ' ' + cityText
      _self.trigger.value = `${parseInt(provinceText)}-${parseInt(cityText)}`
    } else {
      nameText = provinceText + ' ' + cityText + ' ' + countyText
      _self.trigger.value = `${parseInt(provinceText)}-${parseInt(cityText)}-${parseInt(countyText)}`
    }
    _self.trigger.style.color = '#333'
      // 记录当前选择的日期
    this.location = nameText
    var evt = new CustomEvent('input')
    _self.trigger.dispatchEvent(evt)
  },
  close: function(e) {
    e.preventDefault()
    var _self = this
    var evt = new CustomEvent('input')
    if (this.location) {
      _self.setLocation(this.location)
    }
    _self.trigger.dispatchEvent(evt)
  },
  setGear: function(target, val) {
    val = Math.round(val)
    target.setAttribute('val', val)
  },
  setLocation(location) {
    var dateVal, arr
    if (typeof location === 'object') {
      dateVal = location.date
    } else {
      dateVal = location
    }
    // 兼容设置的默认参数格式为‘2017-1-5’
    if (dateVal.indexOf('-') > -1) {
      dateVal = this.transLateToCN(dateVal)
    }
    arr = dateVal.split(' ')
    if (arr.length !== this.column) {
      throw new Error('传入的column值与设定的默认时间格式不匹配')
    }
    const provArr = this.yearArr.filter((one) => {
      return one === arr[0]
    })
    const provInd = this.yearArr.indexOf(provArr[0])
    if (this.column === 1) {
      this.setPos(provInd, 0, 0)
    } else if (this.column === 2) {
      const cityArr = this.monthArr.filter((one) => {
        return one === arr[1]
      })
      const cityInd = this.monthArr.indexOf(cityArr[0])
      this.setPos(provInd, cityInd, 0)
    } else {
      const cityArr = this.monthArr.filter((one) => {
        return one === arr[1]
      })
      const cityInd = this.monthArr.indexOf(cityArr[0])
      const townArr = this.dayArr.filter((one) => {
        return one === arr[2]
      })
      const townInd = this.dayArr.indexOf(townArr[0])
      this.setPos(provInd, cityInd, townInd)
    }
      // 记录当前选择的日期
    this.location = location.date || location
    if (location.showDate !== false) {
      this.trigger.style.color = '#333'
    }
    if (location.showDate === false) {
      return false
    }
    if (location.indexOf('-') > -1) {
      this.trigger.value = location
    } else {
      this.trigger.value = this.transLateToLine(location)
    }
  },
  setPos: function(pInd, cInd, tInd) {
    const areaProvince = document.querySelector('.areaProvince')
    const areaCity = document.querySelector('.areaCity')
    const areaCounty = document.querySelector('.areaCounty')
    areaProvince.style.transform = `translate3d(0px, ${-2 * pInd}em, 0px)`
    areaProvince.setAttribute('top', `${-2 * pInd}em)`)
    areaProvince.setAttribute('val', pInd)
    this.setGear(areaProvince, pInd)
    areaCity.setAttribute('val', cInd)
    areaCity.style.transform = `translate3d(0px, ${-2 * cInd}em, 0px)`
    areaCity.setAttribute('top', `${-2 * cInd}em)`)
    this.setGear(areaCity, cInd)
    areaCounty.setAttribute('val', tInd)
    areaCounty.style.transform = `translate3d(0px, ${-2 * tInd}em, 0px)`
    areaCounty.setAttribute('top', `${-2 * tInd}em)`)
  },
  transLateToLine(str) {
    var arr = str.split(' ')
    if (this.column === 1) {
      const f = parseInt(arr[0])
      return `${f}`
    } else if (this.column === 2) {
      const f = parseInt(arr[0])
      const s = parseInt(arr[1])
      return `${f}-${s}`
    } else {
      const f = parseInt(arr[0])
      const s = parseInt(arr[1])
      const t = parseInt(arr[2])
      return `${f}-${s}-${t}`
    }
  },
  // 将2015-1-5转为2015年1月5日
  transLateToCN(str) {
    var arr = str.split('-')
    if (this.column === 1) {
      const f = parseInt(arr[0])
      return `${f}年`
    } else if (this.column === 2) {
      const f = parseInt(arr[0])
      const s = parseInt(arr[1])
      return `${f}年 ${s}月`
    } else {
      const f = parseInt(arr[0])
      const s = parseInt(arr[1])
      const t = parseInt(arr[2])
      return `${f}年 ${s}月 ${t}日`
    }
  }
}
export default MobileArea
