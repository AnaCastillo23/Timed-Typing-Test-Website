const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");

// Add leading zero to numbers 9 or below (purely for aesthetics):


// Run a standard minute/second/hundredths timer:
  //Source code inspiration: https://youtu.be/d8-LGhKtzRw?si=O8R5Pxtvj2TZ1toP
//Get ID of the display and store a reference to it
const theTimer = document.querySelector(".timer");

//Create a clock that will hold the ID of the interval so we can keep track of it
let timer = null; //has no value here

let startTime = 0;
let elapsedTime = 0;
//Set to a boolean value where if the clock is running, we set it to true. False by default
let isRunning = false;

function update() {
  //Access what is the date right now and calculate the elapsed time
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  
  //Convert elapsedTime to a readable format (minute/second/hundredths)
  let minutes = elapsedTime / (1000 * 60) % 60;
  
}


// Match the text entered with the provided text on the page:


  //Notify user of progress using the text box border coloring (green=correct input is being typed, red=incorrect input is being typed)


// Start the timer:
function start() {
  //Need to check if the stopwatch is currently running. If not, we need to set the start time.
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    //Set timer equal to the setInterval() function
      //Call the update() function every 10 milliseconds
    timer = setInterval(update, 10);
    isRunning = true;
  }
}

// Reset everything:
function reset() {
  
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener('keydown', start());
resetButton.addEventListener('click', reset());

//Store best times and display the top three high scores:
