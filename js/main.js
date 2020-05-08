import { buildWatch } from '../minified/logic.min.js'
import * as data from '../minified/data.min.js'

buildWatch()
  .then(date => {
    const amPmDiv = document.querySelector('.am-pm')
    const dateDiv = document.querySelector('.date')
    document.querySelector('.watch').classList.remove('d-none')
    amPmDiv.classList.remove('d-none')
    dateDiv.classList.remove('d-none')
    amPmDiv.textContent = date[0].split(':')[0] > 12 ? 'PM' : 'AM'
    dateDiv.textContent = date[1]
  })

// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../sw_cached_site.js')
      .catch(err => console.log(`Service Worker: Error: ${err}`));
  });
}

const input = document.querySelector('input[name="country"]')
input.addEventListener('input', (e) => {
  const filterDiv = document.querySelector('.filter-div')
  if (e.target.value.length >= 2) {
  let split = ''
  if (e.target.value.length > 2) {
    split = e.target.value.split(e.target.value.charAt(2))[0]
  } else if (e.target.value.length === 2) {
    split = e.target.value
  } else {
    split = e.target.value + ' '
  }
  window.persistSearch = split.toUpperCase()

  let filtered = []
  data.data.forEach(el => {
    if (el.country.toLowerCase().includes(e.target.value.toLowerCase())) {
      filtered.push(el)
    }
  })

  if (filtered.length > 0) {
    filterDiv.innerHTML = ''
    filtered.forEach(f => {
      filterDiv.innerHTML += `<span class="filtered"><a>${f.country}</a></span>`
    })
    filterDiv.querySelectorAll('a').forEach((a, index) => {
      a.addEventListener('click', () => {
        calcTime(filtered[index].UTCoffset)
        afterTimeZoneSelection(filtered[index])
      })
    })
  } 
  // else if (filtered.length === 1) {
  //   calcTime(filtered[0].UTCoffset)
  //   afterTimeZoneSelection(filtered[0])
  // } 
  else {
    filterDiv.textContent = 'Sorry, No match found.'
  }
  } else {
    emptyParent(filterDiv)
  }
})

function calcTime(offset) {
  const amPmDiv = document.querySelector('.am-pm')
  const dateDiv = document.querySelector('.date')
  let formatted
  if (offset.includes(':30')) {
    formatted = offset.replace(':30', '.5')
  } else if (offset.includes(':45')) {
    formatted = offset.replace(':45', '.75')
  } else formatted = offset.replace(':', '.')
  buildWatch(true, formatted).then(date => {
    amPmDiv.textContent = date[0].split(':')[0] > 12 ? 'PM' : 'AM'
    dateDiv.textContent = date[1]
  })
}

function afterTimeZoneSelection(data) {
  const filterDiv = document.querySelector('.filter-div')
  const currentZone = document.querySelector('.current-zone')
  const dstInfo = document.querySelector('.dst-info')
  const input = document.querySelector('input[name="country"]')
  const likeBtn = document.querySelector('input[type="checkbox"][name="checkLike"]')
  likeBtn.checked = false
  emptyParent(filterDiv)
  input.value = ''
  currentZone.textContent = `Current zone: ${data.country}`
  const dstToggle = document.querySelector('#day-saving-checkbox')
  dstInfo.innerHTML = formatDSTinfo(data)
  dstToggle.checked = false
  dstToggle.disabled = (data.DST === '-') ? true : false
  const favArray = JSON.parse(localStorage.getItem('fav-array')) || []
  const selected = favArray.filter(f => f.country === currentZone.textContent.split('zone: ')[1])[0]
  if (selected) likeBtn.checked = true
  if (favOptWrapper.classList.contains('show')) favOptWrapper.classList.remove('show')
}

function formatDSTinfo(info) {
  if (info.DST !== '-') {
    let startDate
    let endDate
    if (info.country !== 'Chatham Islands (New Zealand)' && info.country !== 'Iran') {
      startDate = info.DSTperiodStartEnd.split(':00 ')[0] + ':00'
      endDate = info.DSTperiodStartEnd.split(':00 ')[1]
    } else if (info.country === 'Chatham Islands (New Zealand)') {
      startDate = info.DSTperiodStartEnd.split(':45 ')[0] + ':45'
      endDate = info.DSTperiodStartEnd.split(':45 ')[1]
    } else if (info.country === 'Iran') {

    }
    return `<div class="start"><span>Starts on:</span><span>${startDate}</span></div>
          <div class="end"><span>Ends on:</span><span>${endDate}</span></div>`
  } else { return '' }

}

function emptyParent(parent) {
  while (parent.children.length !== 0) {
    parent.childNodes[0].remove()
  }
}

const favTrigger = document.querySelector('.fav__trigger')
const favOptWrapper = document.querySelector('.fav__option-wrapper')
favTrigger.addEventListener('click', () => {
  const favArray = JSON.parse(localStorage.getItem('fav-array')) || []
  const persistPref = JSON.parse(localStorage.getItem('persist-pref')) || []
  favOptWrapper.classList.toggle('show')
  if (favOptWrapper.classList.contains('show')) {
    emptyParent(favOptWrapper)
    persistPref.forEach(a => {
      favOptWrapper.innerHTML += `<button class="fav__option">${a}</button>`
    })
  }
  Array.from(favOptWrapper.children).forEach(o => {
    o.addEventListener('click', () => {
      favOptWrapper.classList.toggle('show')
      const index = persistPref.indexOf(o.textContent)
      if (index > -1) {
        calcTime(favArray[index].UTCoffset)
        afterTimeZoneSelection(favArray[index])
      }
    })
  })
})



let favArray
let persistPref

const likeBtn = document.querySelector('input[type="checkbox"][name="checkLike"]')
likeBtn.addEventListener('change', (e) => {
  if (favOptWrapper.classList.contains('show')) favOptWrapper.classList.remove('show')
  let currentZone = document.querySelector('.current-zone').textContent
  if (currentZone === 'Local') return
  currentZone = currentZone.split('zone: ')[1]
  const findZone = data.data.filter(z => z.country === currentZone)[0]
  if (e.target.checked === true) { 
    favArray = JSON.parse(localStorage.getItem('fav-array')) || []
    if (favArray.length > 4) favArray.length = 4
    favArray.unshift(findZone)
    localStorage.setItem('fav-array', JSON.stringify(favArray))

    persistPref = JSON.parse(localStorage.getItem('persist-pref')) || []
    if (persistPref.length > 4) persistPref.length = 4
    if (window.persistSearch) {
      persistPref.unshift(window.persistSearch)
    } else {
      persistPref.unshift(currentZone.split(currentZone.charAt(2))[0].toUpperCase()) 
    }
    localStorage.setItem('persist-pref', JSON.stringify(persistPref))
  } else {
    favArray = JSON.parse(localStorage.getItem('fav-array'))
    persistPref = JSON.parse(localStorage.getItem('persist-pref'))
    const toBeUnSelected = favArray.filter(f => f.country === currentZone)[0]
    const num = favArray.filter(f => f.country === currentZone).length
    const index = favArray.indexOf(toBeUnSelected)
    if (index > -1) {
      favArray.splice(index, num)
      persistPref.splice(index, num)
    }
    localStorage.setItem('fav-array', JSON.stringify(favArray))
    localStorage.setItem('persist-pref', JSON.stringify(persistPref))
  }
})

const dayLightSaving = document.querySelector('#day-saving-checkbox')
dayLightSaving.addEventListener('change', (e) => {
  const currentZone = document.querySelector('.current-zone').textContent.split('zone: ')[1]
  const findZone = data.data.filter(z => z.country === currentZone)[0]
  e.target.checked ? calcTime(findZone.DST) : calcTime(findZone.UTCoffset)
})

window.fixedViewportHeight = window.innerHeight

window.onresize = () => {
  if (window.innerHeight < window.fixedViewportHeight) {
    document.body.classList.add('keyboard-open')
  } else if (window.innerHeight === window.fixedViewportHeight) {
    document.body.classList.remove('keyboard-open')
  } else {
    document.body.classList.remove('keyboard-open')
  }
}