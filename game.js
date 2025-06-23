const bottleBody = document.getElementById('bottle-body');
const bottle = document.getElementById('bottle');
const items = document.querySelectorAll('.drag-item');
const message = document.getElementById('message');
const correctOrder = ['cotton', 'charcoal', 'sand', 'gravel'];
let currentStep = 0;
let timerValue = 0; // Stopwatch in seconds
let timerInterval = null;
const timerDiv = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
let topTimes = JSON.parse(localStorage.getItem('topTimes') || '[]');
const topTimesDiv = document.getElementById('top-times');

items.forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', item.id);
  });
});

bottleBody.addEventListener('dragover', e => {
  e.preventDefault();
});
bottleBody.addEventListener('drop', e => {
  e.preventDefault();
  const itemId = e.dataTransfer.getData('text/plain');
  if (itemId === correctOrder[currentStep]) {
    addLayer(itemId);
    currentStep++;
    if (currentStep === correctOrder.length) {
      message.textContent = 'Success! You built a DIY water filter!';
      enableGame(false);
      stopTimer();
      showResetButton();
      updateTopTimes(timerValue);
    } else {
      message.textContent = 'Good! Add the next material.';
    }
  } else {
    message.textContent = 'Wrong order! Start over.';
    resetBottle();
  }
});

function addLayer(itemId) {
  const div = document.createElement('div');
  div.classList.add('filter-layer');
  if (itemId === 'cotton') div.classList.add('layer-cotton');
  if (itemId === 'charcoal') div.classList.add('layer-charcoal');
  if (itemId === 'sand') div.classList.add('layer-sand');
  if (itemId === 'gravel') div.classList.add('layer-gravel');
  // Insert at the beginning so new layers appear at the bottom (closest to neck)
  if (bottleBody.firstChild) {
    bottleBody.insertBefore(div, bottleBody.firstChild);
  } else {
    bottleBody.appendChild(div);
  }
  // Always move the jerry-can-inside image to the end so it stays visible
}

function resetBottle() {
  bottleBody.innerHTML = '';
  currentStep = 0;
}

function startTimer() {
  timerValue = 0;
  timerDiv.textContent = `Time: 0.0s`;
  timerInterval = setInterval(() => {
    timerValue += 0.1;
    timerDiv.textContent = `Time: ${timerValue.toFixed(1)}s`;
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function showResetButton() {
  resetBtn.style.display = 'inline-block';
}

function hideResetButton() {
  resetBtn.style.display = 'none';
}

resetBtn.onclick = function() {
  resetBottle();
  message.textContent = '';
  hideResetButton();
  startTimer();
  enableGame(true);
};

function updateTopTimes(newTime) {
  if (typeof newTime === 'number') {
    topTimes.push(newTime);
    topTimes.sort((a, b) => a - b);
    if (topTimes.length > 3) topTimes = topTimes.slice(0, 3);
    localStorage.setItem('topTimes', JSON.stringify(topTimes));
  }
  if (topTimes.length > 0) {
    topTimesDiv.innerHTML = '<b>Top Times:</b><br>' + topTimes.map((t, i) => `${i+1}. ${t.toFixed(1)}s`).join('<br>');
  } else {
    topTimesDiv.innerHTML = '';
  }
}

function enableGame(enabled) {
  items.forEach(item => {
    item.draggable = enabled;
    if (!enabled) {
      item.classList.add('disabled-item');
    } else {
      item.classList.remove('disabled-item');
    }
  });
}

// Show top times on load
window.onload = function() {
  resetBottle();
  message.textContent = '';
  hideResetButton();
  startTimer();
  enableGame(true);
  updateTopTimes();
};

//Second game mode code:
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || '1';

if (mode === '2') {
  // Remove normal game UI
  document.querySelector('.jerry-can').style.display = 'none';
  document.querySelector('h2').textContent = 'Water Filter Collection';
  document.getElementById('timer').style.display = 'block';
  document.getElementById('reset-btn').style.display = 'none';
  document.querySelector('.water-bottle-area').style.display = 'none';
  document.querySelector('.drag-items').style.display = 'none';
  document.getElementById('top-times').style.display = 'none';
  document.getElementById('message').style.display = 'none';

  // Add score counter
  let score = 0;
  const scoreDiv = document.createElement('div');
  scoreDiv.id = 'score-counter';
  scoreDiv.style.position = 'absolute';
  scoreDiv.style.top = '16px';
  scoreDiv.style.left = '24px';
  scoreDiv.style.color = '#fff';
  scoreDiv.style.fontSize = '1.5em';
  scoreDiv.textContent = 'Score: 0';
  document.body.appendChild(scoreDiv);

  // Add 3x3 grid for bottles
  const grid = document.createElement('div');
  grid.id = 'bottle-grid';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(3, 60px)';
  grid.style.gridTemplateRows = 'repeat(3, 120px)';
  grid.style.gap = '32px';
  grid.style.margin = '60px auto 0 auto';
  grid.style.justifyContent = 'center';
  grid.style.alignItems = 'center';
  document.querySelector('.game-area').appendChild(grid);

  // Bottle layer options
  const allLayers = [
    ['gravel', 'sand', 'charcoal', 'cotton'], // correct
    ['sand', 'gravel', 'charcoal', 'cotton'],
    ['charcoal', 'sand', 'gravel', 'cotton'],
    ['gravel', 'charcoal', 'sand', 'cotton'],
    ['gravel', 'sand', 'cotton', 'charcoal'],
    ['sand', 'charcoal', 'gravel', 'cotton'],
    ['gravel', 'sand', 'charcoal', 'cotton'], // correct
    ['sand', 'gravel', 'cotton', 'charcoal'],
    ['gravel', 'sand', 'charcoal', 'cotton'], // correct
  ];

  // Helper to create a small bottle
  function createSmallBottle(layers, isCorrect) {
    const bottleWrap = document.createElement('div');
    bottleWrap.className = 'small-bottle-wrap mole-hole';
    bottleWrap.style.position = 'relative';
    bottleWrap.style.width = '60px';
    bottleWrap.style.height = '120px';
    bottleWrap.style.overflow = 'hidden';
    if (isCorrect) bottleWrap.classList.add('yes');

    const bottle = document.createElement('div');
    bottle.className = 'water-bottle upside-down small-bottle';
    bottle.style.width = '40px';
    bottle.style.height = '100px';
    bottle.style.position = 'absolute';
    bottle.style.bottom = '-100px'; // Start hidden
    bottle.style.left = '50%';
    bottle.style.transform = 'translateX(-50%)';
    bottle.style.transition = 'bottom 0.3s';

    const body = document.createElement('div');
    body.className = 'water-bottle-body';
    body.style.width = '32px';
    body.style.height = '70px';
    body.style.left = '50%';
    body.style.transform = 'translateX(-50%)';
    body.style.position = 'absolute';
    body.style.bottom = '0';
    body.style.background = '#b3e5fc';
    body.style.borderRadius = '16px 16px 10px 10px';
    body.style.border = '2px solid #0288d1';
    body.style.zIndex = '1';

    // Add layers
    const layerColors = {
      'cotton': '#fffde7',
      'charcoal': '#424242',
      'sand': '#ffe082',
      'gravel': '#bdbdbd',
    };
    const layerTops = [8, 24, 40, 56];
    layers.forEach((layer, i) => {
      const div = document.createElement('div');
      div.className = 'filter-layer';
      div.style.background = layerColors[layer];
      div.style.top = layerTops[i] + 'px';
      div.style.left = '50%';
      div.style.transform = 'translateX(-50%)';
      div.style.width = '28px';
      div.style.height = '12px';
      div.style.borderRadius = '6px';
      div.style.opacity = '0.85';
      div.style.position = 'absolute';
      div.style.border = '1px solid #0288d1';
      body.appendChild(div);
    });

    const neck = document.createElement('div');
    neck.className = 'water-bottle-neck';
    neck.style.width = '14px';
    neck.style.height = '20px';
    neck.style.top = '2px';
    neck.style.left = '50%';
    neck.style.transform = 'translateX(-50%)';
    neck.style.position = 'absolute';
    neck.style.background = '#81d4fa';
    neck.style.borderRadius = '6px 6px 5px 5px';
    neck.style.border = '1px solid #0288d1';
    neck.style.zIndex = '2';

    const cap = document.createElement('div');
    cap.className = 'water-bottle-cap';
    cap.style.width = '10px';
    cap.style.height = '8px';
    cap.style.top = '0';
    cap.style.left = '50%';
    cap.style.transform = 'translateX(-50%)';
    cap.style.position = 'absolute';
    cap.style.background = '#0288d1';
    cap.style.borderRadius = '3px 3px 4px 4px';
    cap.style.zIndex = '3';

    bottle.appendChild(body);
    bottle.appendChild(neck);
    bottle.appendChild(cap);
    bottleWrap.appendChild(bottle);
    return bottleWrap;
  }

  // Randomize bottles and show them as moles
  let holes = [];
  function randomizeGrid() {
    grid.innerHTML = '';
    holes = [];
    // Shuffle allLayers and pick 9
    const shuffled = allLayers.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < 9; i++) {
      const isCorrect = JSON.stringify(shuffled[i]) === JSON.stringify(['gravel','sand','charcoal','cotton']);
      const bottle = createSmallBottle(shuffled[i], isCorrect);
      grid.appendChild(bottle);
      holes.push(bottle);
    }
  }

  // Animate bottles rising up and down
  function whackAMoleAnim() {
    holes.forEach(hole => {
      const bottle = hole.querySelector('.small-bottle');
      bottle.style.bottom = '-100px';
    });
    setTimeout(() => {
      // Pick 3 random holes to rise up
      const up = holes.slice().sort(() => Math.random() - 0.5).slice(0, 3);
      up.forEach(hole => {
        const bottle = hole.querySelector('.small-bottle');
        bottle.style.bottom = '0px';
      });
    }, 200);
  }

  // Click handler
  grid.addEventListener('click', function(e) {
    let target = e.target;
    while (target && !target.classList.contains('mole-hole')) {
      target = target.parentElement;
    }
    if (target && target.classList.contains('yes')) {
      score++;
      scoreDiv.textContent = 'Score: ' + score;
      target.classList.remove('yes');
    }
  });

  // Timer
  let timeLeft = 60;
  const timerDiv = document.getElementById('timer');
  timerDiv.style.display = 'block';
  function updateTimer() {
    timerDiv.textContent = 'Time: ' + timeLeft + 's';
  }
  updateTimer();
  const countdown = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerDiv.textContent = 'Time: 0s - Game Over!';
      grid.style.pointerEvents = 'none';
    }
  }, 1000);

  // Start game
  randomizeGrid();
  whackAMoleAnim();
  setInterval(() => {
    randomizeGrid();
    whackAMoleAnim();
  }, 1200);
}

// Hide drag-items if mode=2
if (mode === '2') {
  const dragItems = document.querySelector('.drag-items');
  if (dragItems) dragItems.style.display = 'none';
} else if (mode === '1') {
  const dragItems = document.querySelector('.drag-items');
  if (dragItems) dragItems.style.display = 'flex';
}