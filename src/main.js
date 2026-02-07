import './style.css'
import { marked } from 'marked';

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

// --- Dynamic Research Themes Logic ---
const researchThemes = [
  {
    id: 'research-modal-1',
    title: 'イネ遺伝解析・QTL探索',
    desc: '多様な遺伝資源と統計手法を用いた、次世代のイネ育種基盤の開発。',
    img: './research_themes/crossing.jpg',
    mdFile: './research_themes/crossing.md'
  },
  {
    id: 'research-modal-2',
    title: 'イネNAM集団の構築',
    desc: '複雑な農業形質の遺伝背景を解明する、大規模かつ精密な集団解析。',
    img: './research_themes/nam.jpg',
    mdFile: './research_themes/nam.md'

  },
  {
    id: 'research-modal-3',
    title: 'スマート農業・センシング',
    desc: 'ドローンやICTを用いた、環境と植物生体情報のリアルタイム計測。',
    img: './research_themes/sorghambiomass.jpg',
    mdFile: './research_themes/sorghambiomass.md'
  },
  {
    id: 'research-modal-4',
    title: '土壌原生生物の機能',
    desc: '土壌生態系のキーストーン「捕食性原生生物」の多様性と役割。',
    img: './research_themes/rhizo_diversity.jpg',
    mdFile: './research_themes/rhizo_diversity.md'
  },
  {
    id: 'research-modal-5',
    title: '根圏微生物食物連鎖',
    desc: 'イネの遺伝型が支配する、根圏微生物コミュニティの構造と機能。',
    img: './research_themes/rhizosphere.png',
    mdFile: './research_themes/rhizosphere.md'
  },
  {
    id: 'research-modal-6',
    title: 'データ駆動型作物モデル',
    desc: 'センシングデータと生育シミュレーションの融合による予測技術。',
    img: './research_themes/datadriven.png',
    mdFile: './research_themes/datadriven.md'
  },
  {
    id: 'research-modal-7',
    title: '水田土壌の物質循環',
    desc: '酸化還元境界層における微生物動態と温室効果ガス代謝の解明。',
    img: './research_themes/o2dist.png',
    mdFile: './research_themes/o2dist.md'
  },
  {
    id: 'research-modal-8',
    title: 'イネ登熟の遺伝解析',
    desc: '多収化に伴う登熟不良を改善する有用遺伝子の探索。',
    img: './research_themes/toujuku.jpg',
    mdFile: './research_themes/toujuku.md'
  },
  {
    id: 'research-modal-9',
    title: 'WISHプロジェクト',
    desc: '名古屋大学発の「世界の稲作をよくする」プロジェクトへの参画。',
    img: './research_themes/wish.jpg',
    mdFile: './research_themes/wish.md'
  }
];

// Modal System logic
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.querySelector('.modal-close');
const researchCards = document.querySelectorAll('.member-card, #publications-tile');

async function openModal(targetId) {
  // Check if it's a research theme
  const theme = researchThemes.find(t => t.id === targetId);

  if (theme) {
    // Load Markdown content
    try {
      modalContent.innerHTML = '<div style="padding:2rem; text-align:center;">Loading...</div>';
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      const response = await fetch(theme.mdFile);
      if (!response.ok) throw new Error('Failed to load content');
      let text = await response.text();

      // Fix relative image paths in markdown
      // "./image.jpg" -> "/repo-name/research_themes/image.jpg"
      // Use import.meta.env.BASE_URL to get the correct base path (e.g., "/info-sci-agri-togo-test-2026-02/")
      const baseUrl = import.meta.env.BASE_URL;
      text = text.replace(/!\[(.*?)\]\(\.\/(.*?)\)/g, (match, p1, p2) => {
        return `![${p1}](${baseUrl}research_themes/${p2})`;
      });

      const htmlContent = marked.parse(text);

      modalContent.innerHTML = `<div class="modal-body markdown-body">${htmlContent}</div>`;
    } catch (error) {
      console.error(error);
      modalContent.innerHTML = '<p>Error loading content.</p>';
    }
  } else {
    // Fallback for static templates (Members, Publications)
    const template = document.getElementById(targetId);
    if (!template) return;

    const clone = template.content.cloneNode(true);
    modalContent.innerHTML = '';
    modalContent.appendChild(clone);

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    modalContent.innerHTML = '';
  }, 300);
}

// Initial binding for static cards
researchCards.forEach(card => {
  card.addEventListener('click', () => {
    const targetId = card.getAttribute('data-target');
    openModal(targetId);
  });
});

const researchGrid = document.getElementById('research-grid');
const expandBtn = document.getElementById('research-expand-btn');
let isExpanded = false;
let shuffleInterval;
let currentIndices = [0, 1, 2];

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
  currentIndices = [0, 1, 2];
  renderThemes(currentIndices);

  if (shuffleInterval) clearInterval(shuffleInterval);

  shuffleInterval = setInterval(() => {
    if (isExpanded) return;
    const slotToUpdate = Math.floor(Math.random() * 3);
    let newThemeIndex;
    do {
      newThemeIndex = Math.floor(Math.random() * researchThemes.length);
    } while (currentIndices.includes(newThemeIndex));

    currentIndices[slotToUpdate] = newThemeIndex;

    const cards = researchGrid.querySelectorAll('.research-card');
    if (cards[slotToUpdate]) {
      const card = cards[slotToUpdate];
      card.style.opacity = '0';

      setTimeout(() => {
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
        bindCardEvents();
        card.style.opacity = '1';
      }, 500);
    }
  }, 4000);
}

if (researchGrid && expandBtn) {
  startShuffle();
  const toggleExpand = () => {
    isExpanded = !isExpanded;
    const expandText = document.getElementById('research-expand-text');
    if (isExpanded) {
      clearInterval(shuffleInterval);
      renderThemes(Array.from({ length: researchThemes.length }, (_, i) => i));
      expandBtn.textContent = '閉じる (Shuffleに戻る)';
      expandBtn.style.background = 'var(--accent)';
      expandBtn.style.color = 'white';
      if (expandText) expandText.textContent = 'Close';
    } else {
      expandBtn.textContent = '全ての研究テーマを見る (+6)';
      expandBtn.style.background = '';
      expandBtn.style.color = '';
      if (expandText) expandText.textContent = 'Click to expand (+6)';
      startShuffle();
    }
  };
  expandBtn.addEventListener('click', toggleExpand);
  const headerExpandLink = document.getElementById('research-expand-text');
  if (headerExpandLink) headerExpandLink.addEventListener('click', toggleExpand);
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
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});
