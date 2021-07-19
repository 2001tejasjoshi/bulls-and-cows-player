//Game Values


let min = 0,
  max = 9999,
  winningNum = getRandomNum(),
  guessesLeft = 10;
console.log(winningNum);
// UI Elements
const game = document.querySelector('#game'),
  guessBtn = document.querySelector('#guess-btn'),
  guessInput = document.querySelector('#guess-input'),
  message = document.querySelector('.message'),
  collection = document.querySelector('.collection');



// Play again event listener
game.addEventListener('mousedown', function (e) {
  if (e.target.className === 'play-again') {
    window.location.reload();
  }
});

// Listen for guess
guessBtn.addEventListener('click', function () {
  let guess = parseInt(guessInput.value);


  //Validate
  if (isNaN(guess) || guess < min || guess > max) {
    setMessage(`Please enter a number between ${min} and ${max}`, 'red');
  } else if (guessInput.value.length < 4) {
    setMessage(`Please enter a 4 digit number`, 'red');
  }

  // Check if won
  else if (guess === parseInt(winningNum)) {
    // Game over WON
    gameOver(true, `${winningNum} is correct, YOU WIN!`);
  } else {
    // Wrong Number
    guessesLeft -= 1;
    if (guessesLeft === 0) {
      // Game over Lost

      gameOver(false, `Game Over, you lost. The correct number was ${winningNum}`);
    } else {
      // Game continues, answer wrong
      // Change border color
      guessInput.style.borderColor = 'red';

      // Clear Input
      bc = getHint(winningNum.toString(), guessInput.value);
      let current = guessInput.value;
      guessInput.value = '';
      // Tell user it's the wrong number
      setMessage(`${guessesLeft} guesses left.`, 'red');
      addElement(current, bc);
    }
  }
});

// Game over
function gameOver(won, msg) {
  let color;
  won == true ? color = 'green' : color = 'red';
  // Disable input
  guessInput.disabled = true;
  // Change border to green
  guessInput.style.borderColor = color;
  // Set message
  setMessage(msg, color);

  // Play again
  guessBtn.value = 'Play Again';
  guessBtn.className += 'play-again';
}


// Get winning number
function getRandomNum() {
  let min2 = 0;
  let max2 = 9;
  //Number of numbers to extract
  var stop = 4;

  var numbers = [];

  for (let i = 0; i < stop; i++) {
    var n = Math.floor(Math.random() * max2) + min2;
    var check = numbers.includes(n);

    if (check === false) {
      numbers.push(n);
    } else {
      while (check === true) {
        n = Math.floor(Math.random() * max2) + min2;
        check = numbers.includes(n);
        if (check === false) {
          numbers.push(n);
        }
      }
    }
  }
  return numbers.join('');
}


// Set Message
function setMessage(msg, color) {
  message.style.color = color;
  message.textContent = msg;
}

function addElement(guess, bc) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(`${guess} - ${bc}`));
  collection.appendChild(li);


}

// Get cows and bulls
function getHint(secret, guess) {
  var bulls = 0;
  var cows = 0;
  var numbers = new Array(10);
  for (var i = 0; i < 10; i++) {
    numbers[i] = 0;
  }
  for (var i = 0; i < secret.length; i++) {
    var s = secret.charCodeAt(i) - 48;
    var g = guess.charCodeAt(i) - 48;
    if (s == g) bulls++;
    else {
      if (numbers[s] < 0) cows++;
      if (numbers[g] > 0) cows++;
      numbers[s]++;
      numbers[g]--;
    }
  }
  return bulls + " Bulls" + " " + cows + " Cows";
}