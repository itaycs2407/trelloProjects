const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('focusin', ()=>{
  searchInput.removeAttribute('placeholder');
})

searchInput.addEventListener('focusout', ()=>{
  searchInput.setAttribute('placeholder', 'Search GitHub');
})


