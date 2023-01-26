const addTaskBtn = document.getElementById( "addTaskBtn" )
const startTimerBtn = document.getElementById( "startTimerBtn" )
const resetTimerBtn = document.getElementById( "resetTimerBtn" )
const taskContainer = document.getElementById( "taskContainer" )
const timer = document.getElementById( "timer" )

const updateTime = () => {
  chrome.storage.local.get( ["timer","timeOption"], ( res ) => {
    const minutes = `${res.timeOption - Math.ceil( res.timer / 60 )}`.padStart( 2, "0" )
    let seconds = "00"
    if ( res.timer % 60 !== 0 || 60 - res.timer % 60 !== 60 ) {
      seconds = `${60 - res.timer % 60}`.padStart( 2, "0" )
    }
    timer.textContent = `${minutes}:${seconds}`
  } )
}

updateTime()
setInterval( updateTime, 1000 )

startTimerBtn.addEventListener( "click", () => {
  chrome.storage.local.get( ["isRunning"], ( res ) => {
    chrome.storage.local.set( {
      isRunning: !res.isRunning
    }, () => {
      startTimerBtn.textContent = !res.isRunning ? "Pause timer" : "Resume timer"
    } )
  } )
} )

resetTimerBtn.addEventListener( "click", () => {
  chrome.storage.local.set( {
    timer: 0,
    isRunning: false
  } )
} )

addTaskBtn.addEventListener( "click", () => addTask() )

let tasks = []

chrome.storage.sync.get( ["tasks"], ( res ) => {
  tasks = res.tasks || []
  renderTasks()
} )

const saveTasks = () => {
  chrome.storage.sync.set( {tasks} )
}

const renderTask = ( taskNum ) => {
  const taskRow = document.createElement( "div" )

  const textInput = document.createElement( "input" )
  textInput.type = "text"
  textInput.placeholder = "Enter your task..."
  textInput.value = tasks[taskNum]

  textInput.addEventListener( "change", () => {
    tasks[taskNum] = textInput.value
    saveTasks()
  } )

  const deleteBtn = document.createElement( "button" )
  deleteBtn.innerHTML = "&times;"

  deleteBtn.addEventListener( "click", () => {
    deleteTask( taskNum )
    saveTasks()
  } )

  taskRow.appendChild( textInput )
  taskRow.appendChild( deleteBtn )

  taskContainer.appendChild( taskRow )
}

const addTask = () => {
  const taskNum = tasks.length
  tasks.push( "" )
  renderTask( taskNum )
}


const deleteTask = ( taskNum ) => {
  tasks.splice( taskNum, 1 )
  renderTasks()
}

const renderTasks = () => {
  taskContainer.textContent = ""
  tasks.forEach( ( _item, index ) => {
    renderTask( index )
  } )
}