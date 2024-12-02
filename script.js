const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");

//*************Run a standard minute/second/hundredths timer:*************
  //Source code inspiration: https://youtu.be/d8-LGhKtzRw?si=O8R5Pxtvj2TZ1toP
//Get ID of the display and store a reference to it
const theTimer = document.querySelector(".timer");
//Create a clock that will hold the ID of the interval so we can keep track of it
let timer = null; //has no value here
let startTime = 0;
let elapsedTime = 0;
//Set to a boolean value where if the clock is running, we set it to true. False by default
let isRunning = false;

//Start the timer:
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

function stop() {
  //*************Match the text entered with the provided text on the page:*************
    //If the values of both the user input and the test text are strictly the same (even case sensitivity is checked) then stop the timer
    // i used testArea.value to access the actual value inside of the test-area HTML element
    //originText already contains the value of type "String" from the paragraph element in which the test text is found in
    if (testArea.value === originText && isRunning) {
      testWrapper.style.border = "10px solid #DAFE73"; //If both the user input text and the test text match, border displays a green color
      clearInterval(timer);
      elapsedTime = Date.now() - startTime;
      isRunning = false;
    }
}

// Reset everything:
function reset() {
  //Clear the timer
  clearInterval(timer);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  //Resets the value of the timer
  theTimer.textContent = "00:00:00";
  //Resets the value of the input that user entered in case user finished typing text or they exited out of tying test by clicking the "Start Over" button
  testArea.value = "";
  //Reset the border color to gray when resetButton is pressed
  testWrapper.style.border = "10px solid grey";
}

function update() {
  //Access what is the date right now and calculate the elapsed time
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  
  //Convert elapsedTime to a readable format (minute/second/hundredths)
  let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
  let seconds = Math.floor(elapsedTime / 1000 % 60);
  //elapsedTime is already in milliseconds which is 4 digits, so divide it by 10 to get only the first two digits.
  let milliseconds = Math.floor(elapsedTime % 1000 / 10);
  
  //*************Add leading zero to numbers 9 or below (purely for aesthetics):*************
  //Convert minutes, seconds and milliseconds into a string before displaying it:
    //Typecast minutes, seconds and milliseconds as a string, use the padStart method and signal that for the first two digits, add a zero
  minutes = String(minutes).padStart(2,"0");
  seconds = String(seconds).padStart(2,"0");
  milliseconds = String(milliseconds).padStart(2,"0");
  
  //Change the display's content by accessing the textContent of it
  theTimer.textContent = `${minutes}:${seconds}:${milliseconds}`;
}

//*************Notify user of progress using the text box border coloring (green=correct input is being typed, red=incorrect input is being typed)*************
//We will need to check text matching character by character to give this feedback
function checkCharacterMatching() {
  //Store the value of the user's input by accessing it using testArea.value
  let userInput = testArea.value;
  
  //Use a loop to traverse through each of the characters in the userInput to compare with the test text
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === originText[i]) { //If both texts match, we turn the box's border color to #DAFE73 (green to signify a match in the text) 
      testWrapper.style.border = "10px solid #DAFE73";
    } else { //Else, we turn the box's border color to #ff5757(green to signify a match in the text) 
      testWrapper.style.border = "10px solid #ff5757";
    }
  }
  
  //For handling if all the characters match
  if (userInput === originText) {
    stop();
  }
} 

//*************Event listeners for keyboard input and the reset button:*************
testArea.addEventListener('input', function() {
  start(); //calls the start() function to start the timer
  checkCharacterMatching(); //calls the checkCharacterMatching() function to check character by character the user input text with the test text
});

resetButton.addEventListener('click', reset); //calls the reset() function once the resetButton is pressed

//*************Store best times and display the top three high scores:*************
