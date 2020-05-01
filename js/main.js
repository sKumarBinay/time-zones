import { buildWatch } from './logic.js'
import * as data from '../data.min.js'

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
input.addEventListener('change', (e) => {
  const dayLightSaving = document.querySelector('#day-saving-checkbox')

  dayLightSaving.addEventListener('change', (e) => {
    const currentZone = document.querySelector('.current-zone').textContent.split('zone: ')[1]
    const findZone = data.data.filter(z => z.country === currentZone)[0]
    e.target.checked ? calcTime(findZone.DST) : calcTime(findZone.UTCoffset)
  })

  let filtered = []
  data.data.forEach(el => {
    if (el.country.toLowerCase().includes(e.target.value.toLowerCase())) {
      filtered.push(el)
    }
  })

  const filterDiv = document.querySelector('.filter-div')
  if (filtered.length > 1) {
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
  } else if (filtered.length === 1) {
    calcTime(filtered[0].UTCoffset)
    afterTimeZoneSelection(filtered[0])
  } else {
    filterDiv.textContent = 'Sorry, No match found.'
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
  emptyParent(filterDiv)
  input.value = ''
  currentZone.textContent = `Current zone: ${data.country}`
  const dstToggle = document.querySelector('#day-saving-checkbox')
  dstInfo.innerHTML = formatDSTinfo(data)
  dstToggle.checked = false
  dstToggle.disabled = (data.DST === '-') ? true : false

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
  favOptWrapper.classList.toggle('show')
})

const likeBtn = document.querySelector('input[type="checkbox"][name="checkLike"]')
const span = document.querySelector('input[type="checkbox"][name="checkLike"] + span')
likeBtn.addEventListener('change', (e) => {
  if (e.target.checked === true) {
    span.style.color = 'red'
  } else span.style.color = 'white'
})