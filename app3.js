//Game Values


let min = 0,
  max = 9999,

  guessesLeft = 10;

// UI Elements
const game = document.querySelector('#game'),
  guessBtn = document.querySelector('#guess-btn'),
  guessInput = document.querySelector('#guess-input'),
  message = document.querySelector('.message'),
  collection = document.querySelector('.collection');
loader = document.getElementById('loading');

guessInput.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    guessBtn.click();
  }
});

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
  } else if (checkForUnique(guessInput.value) === false) {
    setMessage(`Please enter unique digits!`, 'red')
  } else {

    setMessage('Computing', 'green');
    loader.style.display = 'block';
    setTimeout(function () {
      loader.style.display = 'none';
      playSingle(guessInput.value);
      gameOver(true, `Game over, I win!`)
    }, 2000);


  }

});


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


// Set Message
function setMessage(msg, color) {
  message.style.color = color;
  message.textContent = msg;
}

function addElement(guess, b, c) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(`${guess} - ${b} Bulls and ${c} Cows`));
  collection.appendChild(li);


}

function addFinalElement(guess, play_count) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(`Got it! Is your number ${guess}? I got it in ${play_count} tries!`));
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
  return [bulls, cows];
}






function checkForUnique(str) {
  var hashtable = {};
  for (var i = 0, len = str.length; i < len; i++) {
    if (hashtable[str[i]] != null) {
      hashtable[str[i]] = 1;
      return false;
    } else {
      hashtable[str[i]] = 0;
    }
  }
  return true;
}

function genAll(n) {
  var set = [];
  var max = parseFloat(new Array(n + 1).join('9'));
  var num;
  var isUnique;
  for (var i = 0; i <= max; i++) {
    num = ('0000000000' + i).slice(-n);
    isUnique = true;
    for (var j = 0; j < n - 1; j++) {
      for (var k = j + 1; k < n; k++) {
        if (num[j] == num[k]) isUnique = false;
      }
    }
    if (isUnique)
      set.push(num);
  }

  return set;
}

let zeros = (w, h, v = 0) => Array.from(new Array(h), _ => Array(w).fill(v));

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - size,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function chooseone(code_set) {
  var remain_table = zeros(code_set.length);
  for (const [idx, element] of code_set.entries()) {
    code_idx = [...Array(code_set.length).keys()];
    code_idx = removeItemOnce(code_idx, idx);
    if (code_idx.length > 100) {
      var S = getRandomSubarray(code_idx, 100);
    } else {
      var S = getRandomSubarray(code_idx, code_idx.length);
    }
    var remain = 0;
    for (idxx in S) {
      const [A, B] = getHint(code_set[idxx].toString(), code_set[idx].toString());
      for (k in S) {
        const [a, b] = getHint(code_set[k].toString(), code_set[idx].toString());
        if (a === A && b === B) {
          remain = remain + 1;
        }
      }
    }
    remain_table[0][idx] = remain;
  }
  var mindex = remain_table[0].indexOf(Math.min.apply(Math, remain_table[0]));
  return code_set[mindex];
}

function getfix(code_set, A, B, guess) {
  var code = [];
  for (t in code_set) {
    const [C, D] = getHint(code_set[t].toString(), guess);
    var value = code_set[t];
    if ((C == A && D == B)) {
      code.push(value);
    }
  }
  return code;
}

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

function playSingle(code) {
  var guess = getRandomNum();
  var code_set = genAll(4);
  var [A, B] = getHint(code, guess);
  play_count = 1;
  //console.log(code)
  addElement(guess, A, B)
  //console.log(play_count + " " + guess + " B:" + A + " C:" + B);
  while (A < 4) {
    play_count += 1;
    code_set = getfix(code_set, A, B, guess)
    guess = chooseone(code_set);

    [A, B] = getHint(code, guess);
    addElement(guess, A, B)

    //console.log(play_count + " " + guess + " B:" + A + " C:" + B);
  }
  addFinalElement(guess, play_count)
  //console.log(`Got it!, is your guess ${guess} ? I got it in ${play_count} tries`)
  if (play_count == 7) {
    //console.log("Congratulations you hit my worst case! This was hard to compute.")
  }
}