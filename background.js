const POMODORO_TIMER = "pomodoro_timer"

// create alarm
chrome.alarms.create( POMODORO_TIMER, {
  periodInMinutes: 1 / 60
} )

// listen to alarm change
chrome.alarms.onAlarm.addListener( ( alarm ) => {
  // check if same timer
  if ( alarm.name === POMODORO_TIMER ) {
    // get timer value and check is running
    chrome.storage.local.get( ["timer", "isRunning", "timeOption"], ( res ) => {
      // if timer is running,
      if ( res.isRunning ) {
        // increment the timer and set new value
        let timer = res.timer + 1
        let isRunning = true

        if ( timer === 60 * res.timeOption ) {
          this.registration.showNotification( "Pomodoro Timer", {
            body: `${res.timeOption} mins has passed`,
            icon: "icon.png"
          } )
          timer = 0
          isRunning = false
        }
        chrome.storage.local.set( {
          timer,
          isRunning
        } )
      }
    } )
  }
} )

// get timer data when starts
chrome.storage.local.get( ["timer", "isRunning", "timeOption"], ( res ) => {
  // set timer data. And if not attributes are available, set default values
  chrome.storage.local.set( {
    timer: "timer" in res ? res.timer : 0,
    timeOption: "timeOption" in res ? res.timeOption : 25,
    isRunning: "isRunning" in res ? res.isRunning : false
  } )
} )