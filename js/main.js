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

const input = document.querySelector('input')
input.addEventListener('change', (e) => {
  let offset
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
      let formattedCountry
      formattedCountry = filtered[index].country.replace('(', '-')
      formattedCountry = formattedCountry.replace(')', '')
      a.addEventListener('click', () => {
        calcTime(formattedCountry, filtered[index].UTCoffset)
        filterDiv.innerHTML = ''
      })
    })
  } else {
    filterDiv.innerHTML = ''
    calcTime(filtered[0].country, filtered[0].UTCoffset)
  }

})

function calcTime (city, offset) {
  const formatted = offset.includes(':30') ? offset.replace(':30', '.5') : offset.replace(':', '.')
  buildWatch(true, formatted)
}



{/* <script> 
    var g1 = new Date(); 
    // (YYYY-MM-DD) 
    var g2 = new Date(2019 - 08 - 03); 
    if (g1.getTime() < g2.getTime()) 
        document.write("g1 is lesser than g2"); 
    else if (g1.getTime() > g2.getTime()) 
        document.write("g1 is greater than g2"); 
    else
        document.write("both are equal"); 
  
javascript: ;  
</script>  */}