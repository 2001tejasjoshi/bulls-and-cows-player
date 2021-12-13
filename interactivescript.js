const bullsElement = document.getElementById('BullsValue');
const cowsElement = document.getElementById('CowsValue');
const submitBtn = document.getElementById('reply');
const guessElement = document.getElementById('guess');
const message = document.querySelector('.message');
const collection = document.querySelector('.collection');

const triesCount = document.getElementById('triesCount');
const loader = document.getElementById('loading');
var guess = getRandomNum();
guessElement.innerText = guess;
var code_set = genAll(4);
var tries = 1;
// code_set = getfix(code_set, 3, 0, guess);
// console.log(code_set);
submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.className === 'play-again') {
    window.location.reload();
  }
  //console.log(`Bulls: ${bullsElement.value} Cows: ${cowsElement.value}`);

  var [A, B] = [+bullsElement.value, +cowsElement.value];

  if (A + B > 4) {
    setMessage('Number of Bulls plus Number of cows cannot exceed 4', 'red');
  } else if (A < 4) {
    setMessage('', 'green');
    var oldguess = guess;

    code_set = getfix(code_set, A, B, guess);
    console.log(code_set);

    guess = chooseone(code_set);

    if (guess === undefined) {
      setMessage('That is an impossible number! Please play again', 'red');
      submitBtn.innerText = 'Play Again';
      submitBtn.className = 'play-again';
    } else {
      tries++;
      guessElement.innerText = guess;
      const li = document.createElement('li');
      li.appendChild(
        document.createTextNode(`${oldguess} - ${A} Bulls and ${B} Cows`)
      );
      collection.appendChild(li);
      bullsElement.value = '0';
      cowsElement.value = '0';

      triesCount.innerText = +triesCount.innerText + 1;
    }
  } else if (A == 4) {
    setMessage(`I won! I got it in ${tries} tries`, 'green');
    submitBtn.innerText = 'Play Again';
    submitBtn.className = 'play-again';
  }
});

function setMessage(msg, color) {
  message.style.color = color;
  message.textContent = msg;
}

function getRandomNum() {
  let min = 0;
  let max = 9;
  //Number of numbers to extract
  var stop = 4;

  var numbers = [];

  for (let i = 0; i < stop; i++) {
    var n = Math.floor(Math.random() * max) + min;
    var check = numbers.includes(n);

    if (check === false) {
      numbers.push(n);
    } else {
      while (check === true) {
        n = Math.floor(Math.random() * max) + min;
        check = numbers.includes(n);
        if (check === false) {
          numbers.push(n);
        }
      }
    }
  }
  return numbers.join('');
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
    if (isUnique) set.push(num);
  }

  return set;
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
    if (isUnique) set.push(num);
  }

  return set;
}

let zeros = (w, h, v = 0) => Array.from(new Array(h), (_) => Array(w).fill(v));

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
    temp,
    index;
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
      const [A, B] = getHint(
        code_set[idxx].toString(),
        code_set[idx].toString()
      );
      for (k in S) {
        const [a, b] = getHint(
          code_set[k].toString(),
          code_set[idx].toString()
        );
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
    if (C == A && D == B) {
      code.push(value);
    }
  }
  return code;
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
