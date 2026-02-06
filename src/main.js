import './style.css'

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Smooth Scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Update active link on scroll
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= (sectionTop - 100)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Modal System logic
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.querySelector('.modal-close');
const researchCards = document.querySelectorAll('.research-card, .member-card, #publications-tile');

function openModal(targetId) {
  const template = document.getElementById(targetId);
  if (!template) return;

  const clone = template.content.cloneNode(true);
  modalContent.innerHTML = '';
  modalContent.appendChild(clone);

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
  setTimeout(() => {
    modalContent.innerHTML = '';
  }, 300);
}

// Initial binding for static cards (members, etc.)
researchCards.forEach(card => {
  card.addEventListener('click', () => {
    const targetId = card.getAttribute('data-target');
    openModal(targetId);
  });
});

// --- Dynamic Research Themes Logic ---
const researchThemes = [
  {
    id: 'research-modal-1',
    title: 'イネ遺伝解析・QTL探索',
    desc: '多様な遺伝資源と統計手法を用いた、次世代のイネ育種基盤の開発。',
    img: './original/gallery/gallery2.png'
  },
  {
    id: 'research-modal-2',
    title: 'イネNAM集団の構築',
    desc: '複雑な農業形質の遺伝背景を解明する、大規模かつ精密な集団解析。',
    img: './original/hero.jpg'
  },
  {
    id: 'research-modal-3',
    title: 'スマート農業・センシング',
    desc: 'ドローンやICTを用いた、環境と植物生体情報のリアルタイム計測。',
    img: './original/research4.jpg'
  },
  {
    id: 'research-modal-4',
    title: '土壌原生生物の機能',
    desc: '土壌生態系のキーストーン「捕食性原生生物」の多様性と役割。',
    img: './original/research2.png'
  },
  {
    id: 'research-modal-5',
    title: '根圏微生物食物連鎖',
    desc: 'イネの遺伝型が支配する、根圏微生物コミュニティの構造と機能。',
    img: './original/research3.png'
  },
  {
    id: 'research-modal-6',
    title: 'データ駆動型作物モデル',
    desc: 'センシングデータと生育シミュレーションの融合による予測技術。',
    img: './original/research5.png'
  },
  {
    id: 'research-modal-7',
    title: '水田土壌の物質循環',
    desc: '酸化還元境界層における微生物動態と温室効果ガス代謝の解明。',
    img: './original/gallery/gallery4.png'
  }
];

const researchGrid = document.getElementById('research-grid');
const expandBtn = document.getElementById('research-expand-btn');
let isExpanded = false;
let shuffleInterval;
let currentIndices = [0, 1, 2]; // Keep track of what's currently shown

function createCardHTML(theme) {
  return `
    <div class="card research-card reveal active" data-target="${theme.id}" style="transition: opacity 0.5s ease; opacity: 1;">
      <div class="research-img-box">
        <img src="${theme.img}" alt="${theme.title}">
      </div>
      <h3>${theme.title}</h3>
      <p>${theme.desc}</p>
    </div>
  `;
}

function renderThemes(indices) {
  if (!researchGrid) return;
  researchGrid.innerHTML = indices.map(i => createCardHTML(researchThemes[i])).join('');
  // Re-bind click events for new cards
  bindCardEvents();
}

function bindCardEvents() {
  document.querySelectorAll('#research-grid .research-card').forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.getAttribute('data-target'));
    });
  });
}

function startShuffle() {
  // Initial render
  currentIndices = [0, 1, 2];
  renderThemes(currentIndices);

  if (shuffleInterval) clearInterval(shuffleInterval);

  // Update one card randomly
  shuffleInterval = setInterval(() => {
    if (isExpanded) return;

    // Pick one of the 3 slots (0, 1, or 2)
    const slotToUpdate = Math.floor(Math.random() * 3);

    // Pick a new theme index that is NOT currently visible
    let newThemeIndex;
    do {
      newThemeIndex = Math.floor(Math.random() * researchThemes.length);
    } while (currentIndices.includes(newThemeIndex));

    // Update state
    currentIndices[slotToUpdate] = newThemeIndex;

    // DOM Manipulation to animate just this card
    const cards = researchGrid.querySelectorAll('.research-card');
    if (cards[slotToUpdate]) {
      const card = cards[slotToUpdate];
      card.style.opacity = '0'; // Fade out

      setTimeout(() => {
        // Replace content
        const theme = researchThemes[newThemeIndex];
        const newHTML = `
          <div class="research-img-box">
            <img src="${theme.img}" alt="${theme.title}">
          </div>
          <h3>${theme.title}</h3>
          <p>${theme.desc}</p>
        `;
        card.innerHTML = newHTML;
        card.setAttribute('data-target', theme.id);
        bindCardEvents(); // Re-bind click for this card
        card.style.opacity = '1'; // Fade in
      }, 500); // Wait for fade out
    }
  }, 4000); // 4 seconds interval
}

if (researchGrid && expandBtn) {
  startShuffle();

  const toggleExpand = () => {
    isExpanded = !isExpanded;
    const expandText = document.getElementById('research-expand-text');

    if (isExpanded) {
      clearInterval(shuffleInterval);
      renderThemes([0, 1, 2, 3, 4, 5, 6]); // Show all
      expandBtn.textContent = '閉じる (Shuffleに戻る)';
      expandBtn.style.background = 'var(--accent)';
      expandBtn.style.color = 'white';
      if (expandText) expandText.textContent = 'Close';
    } else {
      expandBtn.textContent = '全ての研究テーマを見る (+4)';
      expandBtn.style.background = '';
      expandBtn.style.color = '';
      if (expandText) expandText.textContent = 'Click to expand (+4)';
      startShuffle();
    }
  };

  expandBtn.addEventListener('click', toggleExpand);

  const headerExpandLink = document.getElementById('research-expand-text');
  if (headerExpandLink) {
    headerExpandLink.addEventListener('click', toggleExpand);
  }
}

// --- Hero Slideshow Logic ---
const heroImages = document.querySelectorAll('.hero-bg img');
if (heroImages.length > 0) {
  let currentHeroIndex = 0;
  setInterval(() => {
    heroImages[currentHeroIndex].classList.remove('active');
    currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
    heroImages[currentHeroIndex].classList.add('active');
  }, 5000);
}

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});
