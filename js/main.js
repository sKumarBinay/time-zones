import { buildWatch } from './logic.js'
import * as data from '../data.js'

buildWatch().then(() => {
  setTimeout(() => {
    document.querySelector('.watch').classList.remove('d-none')
  }, 1000)
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
        const offsetSelection = dayLightSaving.checked ? filtered[index].DST : filtered[index].UTCoffset
        calcTime(offsetSelection)
        afterTimeZoneSelection(filtered[index])
      })
    })
  } else {
    const offsetSelection = dayLightSaving.checked ? filtered[0].DST : filtered[0].UTCoffset
    calcTime(offsetSelection)
    afterTimeZoneSelection(filtered[0])
  }

})

function calcTime (offset) {
  let formatted
  if (offset.includes(':30')) {
    formatted = offset.replace(':30', '.5')
  } else if (offset.includes(':45')) {
    formatted = offset.replace(':45', '.75')
  } else formatted = offset.replace(':', '.')
  buildWatch(true, formatted)
}

function afterTimeZoneSelection (data) {
  const filterDiv = document.querySelector('.filter-div')
  const currentZone = document.querySelector('.current-zone')
  const dstInfo = document.querySelector('.dst-info')
  const input = document.querySelector('input[name="country"]')
  emptyParent(filterDiv)
  input.value = ''
  currentZone.textContent = `Current zone: ${data.country}`
  dstInfo.innerHTML = formatDSTinfo(data)
  if (data.DST === '-') {
    document.querySelector('#day-saving-checkbox').disabled = true
  }
}

function formatDSTinfo (info) {
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

function emptyParent (parent) {
while (parent.children.length !== 0) {
  parent.childNodes[0].remove()
}
}