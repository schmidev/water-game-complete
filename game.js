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

// Add Return to Menu button for mode 1
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || '1';

if (mode === '1') {
  const gameArea = document.querySelector('.game-area');
  if (gameArea && !document.getElementById('return-menu-btn')) {
    const menuBtn = document.createElement('button');
    menuBtn.textContent = 'Return to Menu';
    menuBtn.className = 'menu-btn';
    menuBtn.id = 'return-menu-btn';
    menuBtn.style.marginTop = '16px';
    menuBtn.onclick = () => window.location.href = 'index.html';
    gameArea.appendChild(menuBtn);
  }
}

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

  // Move score above h2 and add jerry-can above score
  const gameArea = document.querySelector('.game-area');
  const h2 = gameArea.querySelector('h2');
  // Add jerry-can image above score
  const jerryCanImg = document.createElement('img');
  jerryCanImg.src = 'images/charity-water-jerry-can.png';
  jerryCanImg.className = 'jerry-can';
  jerryCanImg.alt = 'Charity Water Jerry Can';
  jerryCanImg.style.width = '70px';
  jerryCanImg.style.height = 'auto';
  jerryCanImg.style.marginBottom = '8px';
  gameArea.insertBefore(jerryCanImg, h2);

  let score = 0;
  const scoreDiv = document.createElement('div');
  scoreDiv.id = 'score-counter';
  scoreDiv.style.color = '#fff';
  scoreDiv.style.fontSize = '1.5em';
  scoreDiv.style.marginBottom = '8px';
  scoreDiv.textContent = 'Score: 0';
  gameArea.insertBefore(scoreDiv, h2);

  // Top scores display
  let topScores = JSON.parse(localStorage.getItem('topScores') || '[]');
  const topScoresDiv = document.createElement('div');
  topScoresDiv.id = 'top-scores';
  topScoresDiv.style.position = 'absolute';
  topScoresDiv.style.top = '60px';
  topScoresDiv.style.right = '24px';
  topScoresDiv.style.color = '#222';
  topScoresDiv.style.background = 'rgba(255,255,255,0.85)';
  topScoresDiv.style.padding = '10px 18px';
  topScoresDiv.style.borderRadius = '8px';
  topScoresDiv.style.fontSize = '1.1em';
  topScoresDiv.style.textAlign = 'right';
  topScoresDiv.style.zIndex = '200';
  function updateTopScores(newScore) {
    if (typeof newScore === 'number') {
      topScores.push(newScore);
      topScores.sort((a, b) => b - a);
      if (topScores.length > 3) topScores = topScores.slice(0, 3);
      localStorage.setItem('topScores', JSON.stringify(topScores));
    }
    if (topScores.length > 0) {
      topScoresDiv.innerHTML = '<b>Top Scores:</b><br>' + topScores.map((s, i) => `${i+1}. ${s}`).join('<br>');
    } else {
      topScoresDiv.innerHTML = '';
    }
  }
  updateTopScores();
  document.body.appendChild(topScoresDiv);

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
    bottleWrap.style.background = 'transparent';
    if (isCorrect) bottleWrap.classList.add('yes');
    if (isCorrect) bottleWrap.style.cursor = 'pointer';
    else bottleWrap.style.cursor = 'pointer'; // All bottles clickable

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

    // Add click handler directly to each mole-hole
    bottleWrap.addEventListener('click', function() {
      if (bottleWrap.classList.contains('yes')) {
        score += 1000;
        scoreDiv.textContent = 'Score: ' + score;
        bottleWrap.classList.remove('yes');
        bottleWrap.style.cursor = 'default';
        // Show green checkmark for correct
        const checkMark = document.createElement('div');
        checkMark.textContent = '✓';
        checkMark.style.position = 'absolute';
        checkMark.style.top = '40px';
        checkMark.style.left = '0';
        checkMark.style.width = '100%';
        checkMark.style.textAlign = 'center';
        checkMark.style.fontSize = '3em';
        checkMark.style.color = 'limegreen';
        checkMark.style.pointerEvents = 'none';
        checkMark.style.userSelect = 'none';
        checkMark.style.zIndex = '10';
        bottleWrap.appendChild(checkMark);
      } else if (!bottleWrap.classList.contains('clicked-x')) {
        // Show red X for incorrect
        const xMark = document.createElement('div');
        xMark.textContent = '✗';
        xMark.style.position = 'absolute';
        xMark.style.top = '40px';
        xMark.style.left = '0';
        xMark.style.width = '100%';
        xMark.style.textAlign = 'center';
        xMark.style.fontSize = '3em';
        xMark.style.color = 'red';
        xMark.style.pointerEvents = 'none';
        xMark.style.userSelect = 'none';
        xMark.style.zIndex = '10';
        bottleWrap.appendChild(xMark);
        bottleWrap.classList.add('clicked-x');
        bottleWrap.style.cursor = 'default';
        score -= 500;
        if (score < 0) score = 0;
        scoreDiv.textContent = 'Score: ' + score;
      }
    });

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

  // Timer
  let timeLeft = 30;
  const timerDiv = document.getElementById('timer');
  timerDiv.style.display = 'block';
  function updateTimer() {
    timerDiv.textContent = 'Time: ' + timeLeft + 's';
  }
  updateTimer();
  // Move bottles more slowly (every 3.0s)
  let moleInterval = setInterval(() => {
    randomizeGrid();
    whackAMoleAnim();
  }, 3000);

  let countdown = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    }
    if (timeLeft <= 0) {
      clearInterval(countdown);
      clearInterval(moleInterval); // Stop bottles from moving
      timerDiv.textContent = 'Time: 0s - Game Over!';
      grid.style.pointerEvents = 'none';
      updateTopScores(score);
      // Show reset and return to menu buttons
      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.justifyContent = 'center';
      btnContainer.style.gap = '24px';
      btnContainer.style.margin = '32px auto 0 auto';
      btnContainer.style.width = '100%';

      const resetBtn = document.createElement('button');
      resetBtn.textContent = 'Restart';
      resetBtn.className = 'menu-btn';
      resetBtn.onclick = () => window.location.reload();
      btnContainer.appendChild(resetBtn);

      const menuBtn = document.createElement('button');
      menuBtn.textContent = 'Return to Menu';
      menuBtn.className = 'menu-btn';
      menuBtn.onclick = () => window.location.href = 'index.html';
      btnContainer.appendChild(menuBtn);

      gameArea.appendChild(btnContainer);
    }
  }, 1000);
}

// Hide drag-items if mode=2
if (mode === '2') {
  const dragItems = document.querySelector('.drag-items');
  if (dragItems) dragItems.style.display = 'none';
} else if (mode === '1') {
  const dragItems = document.querySelector('.drag-items');
  if (dragItems) dragItems.style.display = 'flex';
}