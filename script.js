//IMPORTANT: the local storage might need to be manually cleared if the top 3 best times are not displaying/are not displaying correctly as it might get
  //filled with old or corrupted data. To fix this, open DevTools and run the below command:
    //localStorage.clear();

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

let wordsTyped = 0;
let wpmDisplay = document.querySelector("#wpm");

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
    //If the values of both the user input and the test text are strictly the same (even case sensitivity is checked) then stop the timer (set isRunning = false)
    // I used testArea.value to access the actual value inside of the test-area HTML element.
    //originText already contains a value of type "String" from the paragraph element in which the test text is found in.
    if (testArea.value === originText && isRunning) {
      testWrapper.style.border = "10px solid #DAFE73"; //If both the user input text and the test text match, border displays a green color
      //Clear the current time interval
      clearInterval(timer);
      //Set an elapsed time which is the current time minus the time that the test was started on
      elapsedTime = Date.now() - startTime;
      isRunning = false;
      testArea.blur(); //Used to remove focus in the testArea for when user has succesfully typed the correct input. Prevents accidental keyboard click when test is done
      
      storeBestTimes(elapsedTime);
      displayBestTimes();
      calculateWPM();
    }
}

// Reset everything:
function reset() {
  //Clear the timer
  clearInterval(timer);
  //Also reset the rest of the variables
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
    } else { //Else, we turn the box's border color to #ff5757(red to signify no match in the text) 
      testWrapper.style.border = "10px solid #ff5757";
    }
  }
  //For handling if all the characters match, then we must call the stop() function to signify user is done with the test
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
//Function to save the best times using the local storage
function storeBestTimes(time) { //elapsedTime will be used as a parameter, and it is passed in milliseconds by default.
  //Use JSON.parse(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    //This is to parse a JSON string to construct a localStorage object
  let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
  //Add element to the end of the array using .push() method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
  bestTimes.push(time);
  //Sort times from ascending to descending order to display the best time at the top of the list and the following times afterwards
  bestTimes.sort((a,b) => a - b);
  //Only display the top 3 highest scores/times 
  bestTimes = bestTimes.slice(0,3);
  //Add the passed key name and value to the localStorage object: https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
  //Use .stringify, a static method that converts a JavaScript value to a JSON string: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
}

//Function to display the best times. Converts the passed elapsedTime (which is in milliseconds) into the correct format of mm:ss:mm
function displayBestTimes() {
  //Retrieve items from the localStorage using the key "bestTimes"  (which returns a string)
  let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
  //Get the unordered list in the HTML code by its ID of "bestTimesList" and store it into a variable
  let bestTimesList = document.getElementById("bestTimesList");
  bestTimesList.innerHTML = ""; //Clears any previous list of fastest times (clears content of the unordered list of ID "bestTimesList") 
  
  //Create a forEach loop for each of the times stored in the localStorage object and append it to the list by creating a list element using .createElement("li"); 
  bestTimes.forEach(time => {
    let listItem = document.createElement("li");
    
    //Convert elapsedTime to a readable format (minute/second/hundredths) since in the function it was passed in milliseconds
    let minutes = Math.floor(time / (1000 * 60) % 60);
    let seconds = Math.floor(time / 1000 % 60);
    //elapsedTime is already in milliseconds which is 4 digits, so divide it by 10 to get only the first two digits.
    let milliseconds = Math.floor(time % 1000 / 10);
    
    //*************Add leading zero to numbers 9 or below (purely for aesthetics):*************
    minutes = String(minutes).padStart(2,"0");
    seconds = String(seconds).padStart(2,"0");
    milliseconds = String(milliseconds).padStart(2,"0");
    
    //Order the string of numbers into the format mm:ss:mm
    let formattedTime = `${minutes}:${seconds}:${milliseconds}`;
    //Set the textContent of the unordered list to the string of numbers that were ordered in the format mm:ss:mm
    listItem.textContent = formattedTime;

    //Add the listElement as a child of the bestTimesList list
    bestTimesList.appendChild(listItem);
  });
}

function calculateWPM() {
  //Store the value of the types user input text into a variable
  const userInputText = testArea.value;
  //Store the word count by splitting the typed text into an array using spaces as chopping points and get the length using .lenght
  const wordCount = userInputText.split(" ").length;
  //Convert the elapsedTime from milliseconds to minutes by dividing by 60000
  const timeInMinutes = elapsedTime / 60000;
  //Round up the result from dividing the wordCount / elapsedTimeInMinutes (this is the wpm formula)
  const wpm = Math.round(wordCount / timeInMinutes);
  //Display this result to the HTML element I allocated in the HTML file
  wpmDisplay.textContent = `wpm: ${wpm}`;
}