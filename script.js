/* ===== PAGE MANAGEMENT ===== */
const pages = document.querySelectorAll('.page');
let currentPageIndex = 0;

const show = (pageId) => {
  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;

  const currentPage = pages[currentPageIndex];
  
  // Add exit animation to current page
  if (currentPage && currentPage !== targetPage) {
    currentPage.classList.add('exit');
    setTimeout(() => {
      currentPage.classList.remove('active', 'exit');
    }, 500);
  }

  // Show new page with entrance animation
  setTimeout(() => {
    targetPage.classList.add('active');
    targetPage.scrollTop = 0;
    window.scrollTo(0, 0);
    createFloatingElements();
  }, 10);

  // Update current page index
  currentPageIndex = Array.from(pages).indexOf(targetPage);
};

// Initialize first page
pages[0].classList.add('active');

/* ===== FLOATING ELEMENTS ===== */
function createFloatingElements() {
  const container = document.getElementById('floatingContainer');
  container.innerHTML = '';
  const elements = ['❤️', '💕', '🌹', '💐', '✨'];
  
  for (let i = 0; i < 12; i++) {
    const element = document.createElement('div');
    element.classList.add('floating-element');
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = Math.random() * 100 + '%';
    element.style.animationDuration = (Math.random() * 3 + 6) + 's';
    element.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(element);
  }
}

// Initialize floating elements
createFloatingElements();

/* ===== PAGE 1: YES/NO BUTTONS ===== */
let yesSize = 18;
let noSize = 18;

const noBtnEl = document.getElementById('noBtn');
const yesBtnEl = document.getElementById('yesBtn');

// Initialize NO button position for mobile and desktop
function initializeNoButton() {
  const isMobile = window.innerWidth <= 767;
  
  noBtnEl.style.position = 'fixed';
  
  if (isMobile) {
    // Mobile: position in bottom-right away from center
    noBtnEl.style.right = '15px';
    noBtnEl.style.bottom = '60px';
    noBtnEl.style.left = 'auto';
    noBtnEl.style.top = 'auto';
  } else {
    // Desktop: position away from YES button
    noBtnEl.style.right = '60px';
    noBtnEl.style.bottom = '100px';
    noBtnEl.style.left = 'auto';
    noBtnEl.style.top = 'auto';
  }
}

initializeNoButton();
window.addEventListener('resize', initializeNoButton);

noBtnEl.addEventListener('click', (e) => {
  e.preventDefault();
  
  const isMobile = window.innerWidth <= 767;
  
  // Move NO button to random position (but within safe bounds)
  const maxX = Math.max(window.innerWidth - 120, 100);
  const maxY = Math.max(window.innerHeight - 150, 100);
  
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  
  noBtnEl.style.left = randomX + 'px';
  noBtnEl.style.top = randomY + 'px';
  noBtnEl.style.right = 'auto';
  noBtnEl.style.bottom = 'auto';
  
  // Increase YES size
  yesSize += 6;
  yesBtnEl.style.fontSize = yesSize + 'px';
  yesBtnEl.style.padding = (14 + (6 - (yesSize - 18) / 6)) + 'px ' + (35 + (10 - (yesSize - 18) / 10)) + 'px';
  
  // Decrease NO size
  noSize = Math.max(10, noSize - 2);
  noBtnEl.style.fontSize = noSize + 'px';
  noBtnEl.style.padding = (12 + (noSize - 18) / 2) + 'px ' + (22 + (noSize - 18) / 2) + 'px';
  
  createFloatingElements();
});

yesBtnEl.addEventListener('click', () => {
  show('page2');
  yesSize = 18;
  noSize = 18;
  noBtnEl.style.fontSize = '18px';
  noBtnEl.style.position = 'static';
});

/* ===== PAGE 2: OVERLAY POPUP ===== */
const popupElement = document.getElementById('popup');

// Ensure popup is hidden initially
popupElement.classList.add('overlay-hidden');

document.getElementById('lateBtn').addEventListener('click', () => {
  popupElement.classList.remove('overlay-hidden');
  popupElement.style.display = 'flex';
});

document.getElementById('goBack').addEventListener('click', () => {
  popupElement.classList.add('overlay-hidden');
  popupElement.style.display = 'none';
});

document.getElementById('readLetter').addEventListener('click', () => {
  popupElement.classList.add('overlay-hidden');
  popupElement.style.display = 'none';
  show('page3');
});

// Close popup when clicking outside
popupElement.addEventListener('click', (e) => {
  if (e.target === popupElement) {
    popupElement.classList.add('overlay-hidden');
    popupElement.style.display = 'none';
  }
});

/* ===== PAGE 3: MEMORIES ===== */
document.getElementById('memories').addEventListener('click', () => {
  show('page4');
});

/* ===== PAGE 4: MEMORY CARDS WITH TOGGLE ===== */
document.querySelectorAll('.heart-card').forEach(card => {
  card.addEventListener('click', function() {
    this.classList.toggle('revealed');
  });

  // Keyboard accessibility
  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.classList.toggle('revealed');
    }
  });
});

document.getElementById('playPuzzle').addEventListener('click', () => {
  show('page5');
});

/* ===== PAGE 5: PUZZLE GAME ===== */
const puzzleElement = document.getElementById('puzzle');
let order = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 8 is empty
let emptyIndex = 8;

function drawPuzzle() {
  puzzleElement.innerHTML = '';
  order.forEach((i, idx) => {
    const pieceDiv = document.createElement('div');
    pieceDiv.setAttribute('role', 'button');
    pieceDiv.setAttribute('tabindex', '0');
    pieceDiv.setAttribute('aria-label', `Puzzle piece ${i}`);
    
    if (i === 8) {
      pieceDiv.classList.add('empty');
    } else {
      const col = i % 3;
      const row = Math.floor(i / 3);
      pieceDiv.style.backgroundPosition = `${-col * 100}px ${-row * 100}px`;
    }
    
    pieceDiv.addEventListener('click', () => movePiece(idx));
    pieceDiv.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        movePiece(idx);
      }
    });
    
    puzzleElement.appendChild(pieceDiv);
  });
}

function movePiece(idx) {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;
  
  if (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  ) {
    [order[idx], order[emptyIndex]] = [order[emptyIndex], order[idx]];
    emptyIndex = idx;
    drawPuzzle();
    checkWin();
  }
}

function checkWin() {
  if (order.every((val, idx) => val === idx)) {
    setTimeout(() => {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==');
      audio.play().catch(() => {});
      alert('🎉🎊 You fixed my heart! I love you! 💕\n\nYou are my greatest love!');
      show('page6');
    }, 300);
  }
}

document.getElementById('shuffle').addEventListener('click', () => {
  do {
    order.sort(() => Math.random() - 0.5);
  } while (!isSolvable());
  emptyIndex = order.indexOf(8);
  drawPuzzle();
});

function isSolvable() {
  let inversions = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 9; j++) {
      if (order[i] > order[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}

document.getElementById('whyLove').addEventListener('click', () => {
  show('page6');
});

drawPuzzle();

/* ===== PAGE 6: 10 REASONS ===== */
document.getElementById('final').addEventListener('click', () => {
  show('page7');
});

/* ===== PAGE 7: CELEBRATION & RESTART ===== */
document.getElementById('final').addEventListener('click', () => {
  show('page7');
  triggerCelebration();
});

function triggerCelebration() {
  // Trigger fireworks
  createFireworks();
  
  // Trigger confetti
  createConfetti();
}

function createFireworks() {
  const container = document.getElementById('fireworksContainer');
  
  // Create multiple fireworks
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.6;
      createFireworkBurst(container, x, y);
    }, i * 300);
  }
}

function createFireworkBurst(container, x, y) {
  const colors = ['#ff1744', '#e91e63', '#ff69b4', '#ffb3d9', '#ff3d82'];
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.classList.add('firework-particle');
    
    const angle = (i / 30) * Math.PI * 2;
    const distance = 150 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    container.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => particle.remove(), 5500);
  }
}

function createConfetti() {
  const container = document.getElementById('confettiContainer');
  const confettiPieces = ['💕', '', '✨', '', '💖', '💝', '', ''];
  
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.classList.add('confetti');
      piece.textContent = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
      piece.style.left = Math.random() * window.innerWidth + 'px';
      piece.style.fontSize = (1 + Math.random() * 1.5) + 'em';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      
      container.appendChild(piece);
      
      // Remove after animation
      setTimeout(() => piece.remove(), 3500);
    }, i * 50);
  }
}

document.getElementById('restart').addEventListener('click', () => {
  yesSize = 18;
  noSize = 18;
  noBtnEl.style.position = 'fixed';
  noBtnEl.style.left = '0';
  noBtnEl.style.top = '0';
  noBtnEl.style.fontSize = '18px';
  noBtnEl.style.padding = '16px 40px';
  show('page1');
});

/* ===== SMOOTH TRANSITIONS ===== */
document.addEventListener('DOMContentLoaded', () => {
  createFloatingElements();
  
  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

/* ===== KEYBOARD NAVIGATION ===== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!document.getElementById('popup').classList.contains('overlay-hidden')) {
      document.getElementById('popup').classList.add('overlay-hidden');
      document.getElementById('popup').style.display = 'none';
    }
  }
});

/* ===== PERFORMANCE OPTIMIZATION ===== */
let scrollTimeout;
document.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Defer heavy operations
  }, 100);
});

/* ===== TOUCH SUPPORT ===== */
document.addEventListener('touchstart', function() {}, true);
