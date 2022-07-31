const timeOptionInput = document.getElementById( "timeOptionInput" )
const optionSaveBtn = document.getElementById( "optionSaveBtn" )

timeOptionInput.addEventListener( "change", ( e ) => {
  const {value} = e.target
  if ( value < 0 && value > 60 ) {
    timeOptionInput.value = 25
  }
} )

optionSaveBtn.addEventListener( "click", () => {
  chrome.storage.local.set( {
    timer: 0,
    timeOption: timeOptionInput.value,
    isRunning: false,
  } )
} )

chrome.storage.local.get( ["timeOption"], ( res ) => {
  timeOptionInput.value = res.timeOption ?? 25
} )