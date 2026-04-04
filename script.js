/* ============================================
   NICO VAN DER WOUDE — Main Site JavaScript
   ============================================ */

// ---- Firebase Init ----
const firebaseConfig = {
  apiKey: "AIzaSyA0L4JMYF3M_BMFcWE6gx7OnATBYW7FxZM",
  authDomain: "nicovanderwoude-232f6.firebaseapp.com",
  projectId: "nicovanderwoude-232f6",
  storageBucket: "nicovanderwoude-232f6.firebasestorage.app",
  messagingSenderId: "84684203191",
  appId: "1:84684203191:web:1d05cbe71a81403a0b5932",
  measurementId: "G-FQKPQCQQHB"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ---- Data Store ----
const DataStore = {
  _posts: [],
  _research: [],
  _categories: [],
  _settings: {},

  getDefaultPosts() {
    return [
      {
        id: '1',
        title: 'Familieleden bij oprichting Universiteit van Franeker',
        slug: 'familieleden-oprichting-universiteit-franeker',
        excerpt: 'Op 14 april 1584 tekenen de Fryske Steaten het oprichtingsbesluit van de Franeker Akademy: er is een nieuwe universiteit.',
        content: 'Op 14 april 1584 tekenen de Fryske Steaten het oprichtingsbesluit van de Franeker Akademy: er is een nieuwe universiteit. Bij...',
        category: 'Genealogie',
        tags: [],
        status: 'published',
        date: '2023-04-15',
        image: '',
        views: 0
      },
      {
        id: '2',
        title: 'De Friese komaf van Meindert Hobbema',
        slug: 'friese-komaf-meindert-hobbema',
        excerpt: 'Amsterdammer Meindert Hobbema had nog weet van zijn Friese komaf en penseelde zijn sinds ca. 1575 ondergedoken familienaam de internationale...',
        content: 'Amsterdammer Meindert Hobbema had nog weet van zijn Friese komaf en penseelde zijn sinds ca. 1575 ondergedoken familienaam de internationale...',
        category: 'Genealogie',
        tags: [],
        status: 'published',
        date: '2023-01-26',
        image: '',
        views: 0
      },
      {
        id: '3',
        title: 'Kollum, 1625',
        slug: 'kollum-1625',
        excerpt: 'Mijn directe voorvader Saecke Sircx als eiser voor het gerecht. In respectievelijk 1620-1621 en in 1623 was hij nog adelborst...',
        content: 'Mijn directe voorvader Saecke Sircx als eiser voor het gerecht. In respectievelijk 1620-1621 en in 1623 was hij nog adelborst...',
        category: 'Genealogie',
        tags: [],
        status: 'published',
        date: '2022-04-04',
        image: '',
        views: 0
      },
      {
        id: '4',
        title: 'Lucinda David',
        slug: 'lucinda-david',
        excerpt: 'Aardige apologie voor het debat. Uit mijn hart gegrepen, ook na bijna twintig jaren scholierendebat. Voor wie internethaast heeft of...',
        content: 'Aardige apologie voor het debat. Uit mijn hart gegrepen, ook na bijna twintig jaren scholierendebat. Voor wie internethaast heeft of...',
        category: 'Debat',
        tags: [],
        status: 'published',
        date: '2016-03-20',
        image: '',
        views: 0
      },
      {
        id: '5',
        title: 'Leraar24',
        slug: 'leraar24',
        excerpt: 'Professionele ruimte – een portret Relevante video Intro van het filmpje: ‘Nico van der Woude vindt dat mondelinge taalvaardigheid veel...',
        content: 'Professionele ruimte – een portret Relevante video Intro van het filmpje: ‘Nico van der Woude vindt dat mondelinge taalvaardigheid veel...',
        category: 'Debat',
        tags: [],
        status: 'published',
        date: '2016-03-19',
        image: '',
        views: 0
      },
      {
        id: '6',
        title: 'Omhoog die hei',
        slug: 'omhoog-die-hei',
        excerpt: 'Kerels van graniet moeten het geweest zijn, de mannen die hun brood verdienden aan de heistelling. Het beuken van de...',
        content: 'Kerels van graniet moeten het geweest zijn, de mannen die hun brood verdienden aan de heistelling. Het beuken van de...',
        category: 'Geschiedenis',
        tags: [],
        status: 'published',
        date: '2016-03-19',
        image: '',
        views: 0
      },
      {
        id: '7',
        title: 'Recensie ‘Poilu Hedeman, Jules’ in Tubantia',
        slug: 'recensie-poilu-hedeman-jules-tubantia',
        excerpt: 'De hellegang van ’n Almeloër Een ‘factieve roman’ noemt Nico van der Woude zijn boek over de Almelose fabrikantenzoon Jules...',
        content: 'De hellegang van ’n Almeloër Een ‘factieve roman’ noemt Nico van der Woude zijn boek over de Almelose fabrikantenzoon Jules...',
        category: 'Hedeman',
        tags: [],
        status: 'published',
        date: '2016-09-14',
        image: '',
        views: 0
      },
      {
        id: '8',
        title: 'Steun & stut uniek onderzoek',
        slug: 'steun-stut-uniek-onderzoek',
        excerpt: '“War costs money, and money we must have, and money we shall get” Dit is een ouderwetse bedelbrief. Daar is...',
        content: '“War costs money, and money we must have, and money we shall get” Dit is een ouderwetse bedelbrief. Daar is...',
        category: 'PHD VDW',
        tags: [],
        status: 'published',
        date: '2025-05-29',
        image: '',
        views: 0
      }
    ];
  },

  getDefaultResearch() {
    return [
      {
        id: 'r1',
        title: 'Stedelijke mobiliteitspatronen in Nederlandse steden',
        description: 'Een longitudinaal onderzoek naar hoe bewoners zich door stedelijke gebieden bewegen, met focus op de invloed van infrastructuur, weer en beleidsmaatregelen.',
        status: 'active',
        tags: ['Mobiliteit', 'Data-analyse', 'Stadsplanning'],
        year: '2024 — heden'
      },
      {
        id: 'r2',
        title: 'Impact van AI op leerprestaties in het hoger onderwijs',
        description: 'Onderzoek naar de effecten van AI-gestuurde leermiddelen op studieresultaten en studenttevredenheid aan drie Nederlandse universiteiten.',
        status: 'active',
        tags: ['AI', 'Onderwijs', 'Kwantitatief'],
        year: '2025 — heden'
      },
      {
        id: 'r3',
        title: 'Digitale welzijnsinterventies: een meta-analyse',
        description: 'Systematische review van 47 studies naar de effectiviteit van digitale detox-programma\'s en schermtijdinterventies.',
        status: 'completed',
        tags: ['Welzijn', 'Meta-analyse', 'Digitaal'],
        year: '2024 — 2025'
      }
    ];
  },

  getDefaultCategories() {
    return ['Genealogie', 'Debat', 'Geschiedenis', 'Hedeman', 'PHD VDW'];
  },

  getDefaultSettings() {
    return {
      siteName: 'Nico van der Woude',
      siteSubtitle: 'Onderzoeker & Schrijver',
      aboutText: 'Voor wie dit leest. Deze site is de neerslag van mijn jarenlange wederwaardigheden op drie onderscheiden gebieden: genealogie, geschiedenis en debat.\n\nMijn voorouders heb ik persoonlijk leren kennen in de archieven. Geloof me: generaties overbruggend reiken we elkaar de hand en ze fluisteren me van alles in. Die opgeduikelde tijden, namen en plaatsen vertrouw ik in overdachte mededeelzaamheid toe aan het papier, in verhalen en genealogische publicaties.\n\nWie doorwrocht archiefonderzoek doet en in het leven goed uit zijn doppen kijkt, kan daar in meerdere opzichten over verhalen. Dat is hier samengebald in allerhande artikelen over geschiedenis. Nu eens spraakmakende voorvallen, dan weer pure petite histoire. Het waaiert soms breed uit, maar altijd is er een verband met mezelf, wie voor mij was of na mij komt.\n\nDan is er nog het debat. Al bijna twintig jaar geef ik onderricht in die kunst der welsprekendheid en ik kijk met veel plezier terug op en vooruit naar de puike (wedstrijd)verrichtingen van mijn debaters. Zo af en toe verneem ik wel eens iets. Ze zijn toch nog goed terecht gekomen: in jaarclubs, studentenverenigingen, journalistiek en politieke partijen – en naar ik hoop in hun beroep en verdere leven.\n\nVoor wie daar niet aan wil en hoe verschillend de onderwerpen ook mogen lijken; ze zijn absoluut verenigbaar. Deze site is er het bewijs van en alle betrokkenen weten het.',
      aboutSubtitle: 'Genealogie, Geschiedenis en Debat'
    };
  },

  async init() {
    try {
      // Load Settings and Categories
      const settingsDoc = await db.collection('app').doc('settings').get();
      if (!settingsDoc.exists) {
        this._settings = this.getDefaultSettings();
        await db.collection('app').doc('settings').set(this._settings);
      } else {
        this._settings = settingsDoc.data();
      }

      const categoriesDoc = await db.collection('app').doc('categories').get();
      if (!categoriesDoc.exists) {
        this._categories = this.getDefaultCategories();
        await db.collection('app').doc('categories').set({ list: this._categories });
      } else {
        this._categories = categoriesDoc.data().list || [];
      }

      // Load Posts
      const postsSnap = await db.collection('posts').get();
      if (postsSnap.empty) {
        this._posts = this.getDefaultPosts();
        const batch = db.batch();
        this._posts.forEach(p => {
          batch.set(db.collection('posts').doc(p.id.toString()), p);
        });
        await batch.commit();
      } else {
        this._posts = postsSnap.docs.map(d => d.data());
      }

      // Load Research
      const resSnap = await db.collection('research').get();
      if (resSnap.empty) {
        this._research = this.getDefaultResearch();
        const batch = db.batch();
        this._research.forEach(r => {
          batch.set(db.collection('research').doc(r.id.toString()), r);
        });
        await batch.commit();
      } else {
        this._research = resSnap.docs.map(d => d.data());
      }
    } catch (e) {
      console.error("Firebase fetch error", e);
      this._posts = this.getDefaultPosts();
      this._research = this.getDefaultResearch();
      this._categories = this.getDefaultCategories();
      this._settings = this.getDefaultSettings();
    }
  },

  getPosts() { return this._posts; },
  getPublishedPosts() { 
    return this._posts.filter(p => p.status === 'published').sort((a,b) => new Date(b.date) - new Date(a.date)); 
  },
  getPostBySlug(slug) { return this._posts.find(p => p.slug === slug); },
  getResearch() { return this._research; },
  getCategories() { return this._categories; },
  getSettings() { return this._settings; },

  async savePosts(posts) {
    const oldIds = this._posts.map(p => p.id.toString());
    const newIds = posts.map(p => p.id.toString());
    const toDelete = oldIds.filter(id => !newIds.includes(id));

    this._posts = posts;
    const batch = db.batch();
    
    posts.forEach(p => {
      batch.set(db.collection('posts').doc(p.id.toString()), p);
    });
    toDelete.forEach(id => {
      batch.delete(db.collection('posts').doc(id.toString()));
    });
    await batch.commit();
  },
  async saveResearch(research) {
    const oldIds = this._research.map(r => r.id.toString());
    const newIds = research.map(r => r.id.toString());
    const toDelete = oldIds.filter(id => !newIds.includes(id));

    this._research = research;
    const batch = db.batch();

    research.forEach(r => {
      batch.set(db.collection('research').doc(r.id.toString()), r);
    });
    toDelete.forEach(id => {
      batch.delete(db.collection('research').doc(id.toString()));
    });
    await batch.commit();
  },
  async saveCategories(categories) {
    this._categories = categories;
    await db.collection('app').doc('categories').set({ list: categories });
  },
  async saveSettings(settings) {
    this._settings = settings;
    await db.collection('app').doc('settings').set(settings);
  },
  async incrementViews(slug) {
    const post = this._posts.find(p => p.slug === slug);
    if(post) {
       post.views = (post.views || 0) + 1;
       db.collection('posts').doc(post.id.toString()).update({ views: post.views }).catch(e => console.error(e));
    }
  }
};

// ---- Markdown Parser ----
function parseMarkdown(md) {
  if (!md) return '';
  let html = md;

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');
  html = html.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>');
  html = html.replace(/((?:<oli>.*<\/oli>\s*)+)/g, function(match) {
    return '<ol>' + match.replace(/<\/?oli>/g, function(tag) {
      return tag.replace('oli', 'li');
    }) + '</ol>';
  });
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[1-3]>)/g, '$1');
  html = html.replace(/(<\/h[1-3]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ol>)/g, '$1');
  html = html.replace(/(<\/ol>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, '$1');

  return html;
}

// ---- Utilities ----
function formatDate(dateStr) {
  const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(dateStr) {
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function createPostCard(post) {
  const imageHtml = post.image
    ? `<img class="post-image" src="${post.image}" alt="${post.title}" loading="lazy">`
    : `<div class="post-image-placeholder">📝</div>`;

  return `
    <article class="post-card">
      ${imageHtml}
      <div class="post-body">
        <div class="post-meta">
          <span class="post-category">${post.category}</span>
          <span class="post-date">📅 ${formatDate(post.date)}</span>
        </div>
        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <a href="post.html?slug=${post.slug}" class="read-more">Verder lezen</a>
      </div>
    </article>
  `;
}

function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- Navigation ----
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
  }
}

// ---- Sidebar ----
function initSidebar() {
  // Render categories
  const catList = document.getElementById('sidebarCategories');
  if (catList) {
    const categories = DataStore.getCategories();
    catList.innerHTML = categories.map(c =>
      `<li><a href="blog.html">${c}</a></li>`
    ).join('');
  }

  // Render archives
  const archiveList = document.getElementById('sidebarArchives');
  if (archiveList) {
    const posts = DataStore.getPublishedPosts();
    const monthSet = new Map();
    posts.forEach(p => {
      const key = formatDateShort(p.date);
      if (!monthSet.has(key)) monthSet.set(key, 0);
      monthSet.set(key, monthSet.get(key) + 1);
    });
    archiveList.innerHTML = Array.from(monthSet.entries()).map(([label, count]) =>
      `<li><a href="blog.html?archive=${encodeURIComponent(label)}">${label} (${count})</a></li>`
    ).join('');
  }
}

// ---- Homepage ----
function initHomepage() {
  const statsRow = document.getElementById('statsRow');
  const recentPosts = document.getElementById('recentPosts');

  if (!statsRow && !recentPosts) return;

  const posts = DataStore.getPublishedPosts();
  const allPosts = DataStore.getPosts();
  const research = DataStore.getResearch();

  if (statsRow) {
    statsRow.innerHTML = `
      <div class="stat-card">
        <div class="stat-number">${posts.length}</div>
        <div class="stat-label">Artikelen</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${research.length}</div>
        <div class="stat-label">Onderzoeken</div>
      </div>
    `;
  }

  if (recentPosts) {
    recentPosts.innerHTML = posts.slice(0, 4).map(createPostCard).join('');
  }
}

// ---- Blog Page ----
function initBlogPage() {
  const blogPostsEl = document.getElementById('blogPosts');
  if (!blogPostsEl) return;

  const searchInput = document.getElementById('searchInput');
  const filterTagsEl = document.getElementById('filterTags');
  const paginationEl = document.getElementById('pagination');
  const emptyState = document.getElementById('emptyState');

  const POSTS_PER_PAGE = 6;
  let currentPage = 1;
  let currentCategory = 'all';
  let searchQuery = '';
  
  // Read URL params for archive filtering
  const params = new URLSearchParams(window.location.search);
  const archiveFilter = params.get('archive');

  if (archiveFilter) {
    const titleEl = document.querySelector('.page-title-block h1');
    if (titleEl) titleEl.textContent = `Archief: ${archiveFilter}`;
    const descEl = document.querySelector('.page-title-block p');
    if (descEl) descEl.textContent = `Alle artikelen uit deze periode`;
  }

  const categories = DataStore.getCategories();
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tag';
    btn.dataset.category = cat;
    btn.textContent = cat;
    filterTagsEl.appendChild(btn);
  });

  function getFilteredPosts() {
    let posts = DataStore.getPublishedPosts();
    if (currentCategory !== 'all') {
      posts = posts.filter(p => p.category === currentCategory);
    }
    if (archiveFilter) {
      posts = posts.filter(p => formatDateShort(p.date) === archiveFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return posts;
  }

  function render() {
    const filtered = getFilteredPosts();
    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
    currentPage = Math.min(currentPage, totalPages || 1);
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);

    if (pagePosts.length === 0) {
      blogPostsEl.innerHTML = '';
      emptyState.style.display = 'block';
      paginationEl.innerHTML = '';
    } else {
      emptyState.style.display = 'none';
      blogPostsEl.innerHTML = pagePosts.map(createPostCard).join('');
      if (totalPages > 1) {
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
          html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        paginationEl.innerHTML = html;
      } else {
        paginationEl.innerHTML = '';
      }
    }
  }

  searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; currentPage = 1; render(); });

  filterTagsEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-tag')) {
      filterTagsEl.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      currentPage = 1;
      render();
    }
  });

  paginationEl.addEventListener('click', (e) => {
    if (e.target.dataset.page) {
      currentPage = parseInt(e.target.dataset.page);
      render();
      window.scrollTo({ top: blogPostsEl.offsetTop - 80, behavior: 'smooth' });
    }
  });

  render();
}

// ---- Single Post ----
function initPostPage() {
  const postHeader = document.getElementById('postHeader');
  const postContent = document.getElementById('postContent');
  const postHeroImage = document.getElementById('postHeroImage');

  if (!postHeader || !postContent) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    postHeader.innerHTML = '<h1>Artikel niet gevonden</h1>';
    postContent.innerHTML = '<p>Ga terug naar de <a href="blog.html">blog</a>.</p>';
    return;
  }

  const post = DataStore.getPostBySlug(slug);
  if (!post) {
    postHeader.innerHTML = '<h1>Artikel niet gevonden</h1>';
    postContent.innerHTML = '<p>Dit artikel bestaat niet of is verwijderd.</p>';
    return;
  }

  DataStore.incrementViews(slug);
  document.title = `${post.title} — Nico van der Woude`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = post.excerpt;

  const words = (post.content || '').trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  postHeader.innerHTML = `
    <h1>${post.title}</h1>
    <div class="post-meta">
      <span class="post-category">${post.category}</span>
      <span class="post-date" style="margin-right: 12px;">📅 ${formatDate(post.date)}</span>
      <span class="post-readtime">⏱️ ${readTime} min. lezen</span>
    </div>
    ${post.tags ? `<div class="tags-list">${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
  `;

  if (post.image && postHeroImage) {
    postHeroImage.src = post.image;
    postHeroImage.alt = post.title;
    postHeroImage.style.display = 'block';
  }

  postContent.innerHTML = parseMarkdown(post.content);

  // Related Posts
  const related = DataStore.getPublishedPosts()
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);
  
  let relatedHTML = '';
  if (related.length > 0) {
    relatedHTML = `
      <div class="related-posts" style="margin-top: 48px; border-top: 2px solid var(--border); padding-top: 32px;">
        <h3 style="margin-bottom: 24px; font-family: var(--font-heading); font-style: italic;">Misschien vind je dit ook interessant...</h3>
        <div class="posts-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
          ${related.map(createPostCard).join('')}
        </div>
      </div>
    `;
  }

  // Share Buttons
  const shareURL = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);
  
  const shareHTML = `
    <div class="share-bar" style="margin-top: 48px; padding: 24px; background: var(--surface); border-radius: 12px; border: 1px solid var(--border);">
      <h4 style="margin-bottom: 16px; margin-top: 0; font-family: var(--font-heading);">Deel dit artikel</h4>
      <div class="share-buttons" style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${shareURL}&title=${shareTitle}" target="_blank" class="btn btn-sm btn-secondary share-btn linkedin">💼 LinkedIn</a>
        <a href="https://twitter.com/intent/tweet?url=${shareURL}&text=${shareTitle}" target="_blank" class="btn btn-sm btn-secondary share-btn twitter">🐦 X (Twitter)</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareURL}" target="_blank" class="btn btn-sm btn-secondary share-btn facebook">📘 Facebook</a>
        <a href="https://api.whatsapp.com/send?text=${shareTitle}%20${shareURL}" target="_blank" class="btn btn-sm btn-secondary share-btn whatsapp">💬 WhatsApp</a>
        <a href="mailto:?subject=${shareTitle}&body=${shareURL}" class="btn btn-sm btn-secondary share-btn email">✉️ E-mail</a>
        <div style="flex: 1; min-width: 10px;"></div>
        <button onclick="window.print()" class="btn btn-sm btn-primary share-btn print">🖨️ Opslaan als PDF / Print</button>
      </div>
    </div>
  `;

  // Insert below post content
  // Remove previously added elements if they exist (in case of re-init)
  const existingExtras = document.querySelectorAll('.post-extras');
  existingExtras.forEach(el => el.remove());

  const extrasDiv = document.createElement('div');
  extrasDiv.className = 'post-extras container'; // To align with main layout
  extrasDiv.innerHTML = shareHTML + relatedHTML;
  
  postContent.parentNode.insertBefore(extrasDiv, postContent.nextSibling);
}

// ---- Research Page ----
function initResearchPage() {
  const grid = document.getElementById('researchGrid');
  const emptyEl = document.getElementById('researchEmpty');
  if (!grid) return;

  const research = DataStore.getResearch();
  if (research.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  grid.innerHTML = research.map(r => `
    <div class="research-card">
      <span class="research-status ${r.status}">${r.status === 'active' ? 'Lopend' : 'Afgerond'}</span>
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <p style="font-size: 0.8rem; color: var(--text-meta); margin-bottom: 10px;">📅 ${r.year}</p>
      <div class="research-tags">
        ${r.tags.map(t => `<span class="research-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ---- About Page ----
function initAboutPage() {
  const aboutText = document.getElementById('aboutText');
  const aboutSubtitle = document.getElementById('aboutSubtitle');
  if (!aboutText) return;

  const settings = DataStore.getSettings();
  if (settings.aboutText) {
    const paragraphs = settings.aboutText.split('\n\n');
    aboutText.innerHTML = `
      <h2>${settings.siteName || 'Nico van der Woude'}</h2>
      ${paragraphs.map(p => `<p>${p}</p>`).join('')}
    `;
  }
  if (settings.aboutSubtitle && aboutSubtitle) {
    aboutSubtitle.textContent = settings.aboutSubtitle;
  }
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  await DataStore.init();
  initNavigation();
  initSidebar();
  initHomepage();
  initBlogPage();
  initPostPage();
  initResearchPage();
  initAboutPage();
});
