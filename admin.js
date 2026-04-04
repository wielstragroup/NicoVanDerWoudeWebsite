/* ============================================
   ADMIN DASHBOARD — JavaScript
   Google Sign-In + email/password auth
   ============================================ */


const ADMINS_KEY = 'nvdw_admins';
const MEDIA_KEY = 'nvdw_media';
const CURRENT_USER_KEY = 'nvdw_current_user';

// ---- Default admins ----
function getDefaultAdmins() {
  return [
    {
      email: 'wielstragroup@gmail.com',
      name: 'Wielstra Group',
      role: 'hoofdbeheerder',
      authMethod: 'google'
    }
  ];
}

function getAdmins() {
  const settings = DataStore.getSettings() || {};
  if (!settings.admins || settings.admins.length === 0) {
    settings.admins = getDefaultAdmins();
    DataStore.saveSettings(settings); // Sync back to Firebase initially if empty
    return settings.admins;
  }
  return settings.admins;
}

function saveAdmins(admins) {
  const settings = DataStore.getSettings() || {};
  settings.admins = admins;
  DataStore.saveSettings(settings);
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem(CURRENT_USER_KEY) || 'null');
}

// ---- Google Sign-In Callback (vervangen via Firebase) ----

// Tonen van inlogfouten
function showLoginError(message) {
  const el = document.getElementById('loginError');
  el.textContent = message;
  el.style.display = 'block';
}

// ---- Authentication ----
// ---- Authentication ----
function initLogin() {
  const overlay = document.getElementById('loginOverlay');
  const layout = document.getElementById('adminLayout');
  const loginBtn = document.getElementById('loginBtn');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const wrapper = document.getElementById('googleSignInWrapper');

  // Controleer Firebase Auth Status
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const admins = getAdmins();
      // Validatie of de user wel als 'admin' in dit lokale dashboard mag
      if (!admins.find(a => a.email.toLowerCase() === user.email.toLowerCase()) && user.email !== 'wielstragroup@gmail.com') {
         firebase.auth().signOut();
         showLoginError('Toegang geweigerd. Neem contact op met een beheerder.');
         return;
      }
      
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        email: user.email,
        name: user.displayName || user.email,
        role: 'beheerder',
        method: 'firebase'
      }));
      overlay.style.display = 'none';
      layout.style.display = 'flex';
      initDashboard();
    } else {
      sessionStorage.removeItem(CURRENT_USER_KEY);
      overlay.style.display = 'flex';
      layout.style.display = 'none';
    }
  });

  // Render een handmatige Google Login knop
  if (wrapper) {
     wrapper.innerHTML = `
      <button class="btn btn-secondary" style="width:100%; border:1px solid #ccc; background:#fff; color:#333; height:40px;" onclick="signInWithGoogle()">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="18" height="18" style="vertical-align:middle; margin-right:8px;">
        Inloggen met Google
      </button>
     `;
  }

  function attemptLogin() {
    const email = loginEmail.value.trim().toLowerCase();
    const pw = loginPassword.value;
    if(!email || !pw) return showLoginError('Vul e-mail en wachtwoord in.');
    
    firebase.auth().signInWithEmailAndPassword(email, pw)
      .catch(err => {
        showLoginError('Inloggen is niet gelukt. Controleer je gegevens.');
        loginPassword.value = '';
      });
  }

  loginBtn.addEventListener('click', attemptLogin);

  loginEmail.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginPassword.focus();
  });
  loginPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .catch(err => {
      showLoginError('Google inlog is mislukt: ' + err.message);
    });
}

// ---- Sidebar Navigation ----
function initSidebar() {
  const links = document.querySelectorAll('.sidebar-nav a');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSection(link.dataset.section);
    });
  });

  // Mobile sidebar toggle
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (toggle) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Show current user in sidebar
  const user = getCurrentUser();
  if (user) {
    const footer = document.querySelector('.sidebar-footer');
    if (footer) {
      footer.innerHTML = `
        <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-bottom: 8px;">
          Ingelogd als: <strong style="color: rgba(255,255,255,0.7);">${user.name}</strong>
        </div>
        <a href="index.html"><span>←</span> Terug naar site</a>
        <a href="#" onclick="logout(); return false;" style="margin-top: 6px; color: rgba(255,255,255,0.3);"><span>🚪</span> Uitloggen</a>
      `;
    }
  }
}

function logout() {
  sessionStorage.removeItem(CURRENT_USER_KEY);
  location.reload();
}

function navigateToSection(sectionName) {
  const links = document.querySelectorAll('.sidebar-nav a');
  const sections = document.querySelectorAll('.editor-section');

  links.forEach(l => l.classList.remove('active'));
  sections.forEach(s => s.classList.remove('active'));

  const targetLink = document.querySelector(`.sidebar-nav a[data-section="${sectionName}"]`);
  const targetSection = document.getElementById(`section-${sectionName}`);

  if (targetLink) targetLink.classList.add('active');
  if (targetSection) targetSection.classList.add('active');

  document.getElementById('adminSidebar')?.classList.remove('open');

  if (sectionName === 'dashboard') renderDashboard();
  if (sectionName === 'posts') renderPostsTable();
  if (sectionName === 'editor') prepareEditor();
  if (sectionName === 'research') renderResearchTable();
  if (sectionName === 'media') renderMediaLibrary();
  if (sectionName === 'settings') loadSettings();
}

// ---- Dashboard ----
function initDashboard() {
  initSidebar();
  renderDashboard();
  initEditorFeatures();
  initMediaUpload();
  initImportExport();
}

function renderDashboard() {
  const statsEl = document.getElementById('dashStats');
  const recentEl = document.getElementById('dashRecentPosts');

  const posts = DataStore.getPosts();
  const published = posts.filter(p => p.status === 'published');
  const drafts = posts.filter(p => p.status === 'draft');
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const media = getMedia();

  statsEl.innerHTML = `
    <div class="dash-stat-card">
      <div class="dash-stat-icon purple">📝</div>
      <div class="dash-stat-info">
        <h3>${published.length}</h3>
        <p>Gepubliceerd</p>
      </div>
    </div>
    <div class="dash-stat-card">
      <div class="dash-stat-icon yellow">📋</div>
      <div class="dash-stat-info">
        <h3>${drafts.length}</h3>
        <p>Concepten</p>
      </div>
    </div>
    <div class="dash-stat-card">
      <div class="dash-stat-icon blue">👁</div>
      <div class="dash-stat-info">
        <h3>${totalViews}</h3>
        <p>Weergaven</p>
      </div>
    </div>
    <div class="dash-stat-card">
      <div class="dash-stat-icon green">🖼️</div>
      <div class="dash-stat-info">
        <h3>${media.length}</h3>
        <p>Media bestanden</p>
      </div>
    </div>
  `;

  const recent = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  recentEl.innerHTML = recent.map(postToTableRow).join('');

  if (typeof Chart !== 'undefined') {
    renderChart(posts);
  }
}

let dashboardChartInstance = null;
function renderChart(posts) {
  const ctx = document.getElementById('viewsChart');
  if (!ctx) return;
  
  if (dashboardChartInstance) {
    dashboardChartInstance.destroy();
  }

  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  const labels = topPosts.map(p => p.title.length > 30 ? p.title.substring(0, 30) + '...' : p.title);
  const data = topPosts.map(p => p.views || 0);

  dashboardChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Aantal weergaven',
        data: data,
        backgroundColor: '#2563eb',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function postToTableRow(post) {
  return `
    <tr>
      <td class="post-title-cell">${post.title}</td>
      <td><span class="post-category">${post.category}</span></td>
      <td><span class="status-badge ${post.status}">${post.status === 'published' ? 'Gepubliceerd' : 'Concept'}</span></td>
      <td>${formatDate(post.date)}</td>
      <td>${post.views || 0}</td>
      <td class="actions-cell">
        <button class="action-btn" onclick="editPost('${post.id}')" title="Bewerken">✏️</button>
        <button class="action-btn delete" onclick="confirmDeletePost('${post.id}')" title="Verwijderen">🗑️</button>
      </td>
    </tr>
  `;
}

// ---- Posts Table ----
function renderPostsTable(filter = '') {
  const tbody = document.getElementById('allPostsTable');
  let posts = DataStore.getPosts().sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filter) {
    const q = filter.toLowerCase();
    posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  tbody.innerHTML = posts.length ? posts.map(postToTableRow).join('') :
    `<tr><td colspan="6" style="text-align: center; padding: 28px; color: var(--text-meta);">Geen posts gevonden</td></tr>`;

  const searchInput = document.getElementById('adminSearchPosts');
  if (searchInput && !searchInput._bound) {
    searchInput._bound = true;
    searchInput.addEventListener('input', (e) => renderPostsTable(e.target.value));
  }
}

// ---- Post Editor ----
function prepareEditor(postId = null) {
  const titleEl = document.getElementById('editorTitle');
  const idEl = document.getElementById('editPostId');
  const titleInput = document.getElementById('postTitleInput');
  const categorySelect = document.getElementById('postCategory');
  const excerptInput = document.getElementById('postExcerpt');
  const tagsInput = document.getElementById('postTags');
  const contentInput = document.getElementById('postContentInput');
  const featuredPreview = document.getElementById('featuredImagePreview');

  const categories = DataStore.getCategories();
  categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');

  if (postId) {
    const post = DataStore.getPosts().find(p => p.id === postId);
    if (post) {
      titleEl.textContent = 'Post bewerken';
      idEl.value = post.id;
      titleInput.value = post.title;
      categorySelect.value = post.category;
      excerptInput.value = post.excerpt;
      tagsInput.value = (post.tags || []).join(', ');
      contentInput.value = post.content;

      if (post.image) {
        featuredPreview.innerHTML = `
          <div class="image-preview-item">
            <img src="${post.image}" alt="Featured">
            <button class="remove-image" onclick="removeFeaturedImage()">✕</button>
          </div>`;
      } else {
        featuredPreview.innerHTML = '';
      }
      return;
    }
  }

  titleEl.textContent = 'Nieuwe post';
  idEl.value = '';
  titleInput.value = '';
  categorySelect.selectedIndex = 0;
  excerptInput.value = '';
  tagsInput.value = '';
  contentInput.value = '';
  featuredPreview.innerHTML = '';
  document.getElementById('editorPreview').style.display = 'none';
}

function editPost(postId) {
  navigateToSection('editor');
  setTimeout(() => prepareEditor(postId), 50);
}

function savePost(status) {
  const idEl = document.getElementById('editPostId');
  const title = document.getElementById('postTitleInput').value.trim();
  const category = document.getElementById('postCategory').value;
  const excerpt = document.getElementById('postExcerpt').value.trim();
  const tagsRaw = document.getElementById('postTags').value;
  const content = document.getElementById('postContentInput').value;
  const featuredPreview = document.getElementById('featuredImagePreview');

  if (!title) { showToast('Vul een titel in', 'error'); return; }
  if (!content) { showToast('Vul de inhoud in', 'error'); return; }

  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 60);
  const imgEl = featuredPreview.querySelector('img');
  const image = imgEl ? imgEl.src : '';
  const posts = DataStore.getPosts();
  const existingId = idEl.value;

  if (existingId) {
    const idx = posts.findIndex(p => p.id === existingId);
    if (idx !== -1) {
      posts[idx] = { ...posts[idx], title, slug, category, excerpt, content, tags, status, image };
      DataStore.savePosts(posts);
      showToast('Post bijgewerkt!', 'success');
    }
  } else {
    posts.unshift({
      id: Date.now().toString(),
      title, slug,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content, category, tags, status,
      date: new Date().toISOString().split('T')[0],
      image, views: 0
    });
    DataStore.savePosts(posts);
    showToast(status === 'published' ? 'Post gepubliceerd!' : 'Concept opgeslagen!', 'success');
  }

  navigateToSection('posts');
}

function confirmDeletePost(postId) {
  const modal = document.getElementById('deleteModal');
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  modal.classList.add('show');

  confirmBtn.onclick = () => {
    const posts = DataStore.getPosts().filter(p => p.id !== postId);
    DataStore.savePosts(posts);
    closeDeleteModal();
    renderDashboard();
    renderPostsTable();
    showToast('Post verwijderd', 'success');
  };
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('show');
}

// ---- Editor Features ----
function initEditorFeatures() {
  const zone = document.getElementById('featuredImageZone');
  const input = document.getElementById('featuredImageInput');

  if (zone && input) {
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.style.borderColor = 'var(--accent)'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
    zone.addEventListener('drop', (e) => {
      e.preventDefault(); zone.style.borderColor = '';
      if (e.dataTransfer.files.length) handleFeaturedImage(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', () => { if (input.files.length) handleFeaturedImage(input.files[0]); });
  }

  const contentInput = document.getElementById('postContentInput');
  if (contentInput) {
    contentInput.addEventListener('input', updatePreview);
    contentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = contentInput.selectionStart;
        const end = contentInput.selectionEnd;
        contentInput.value = contentInput.value.substring(0, start) + '  ' + contentInput.value.substring(end);
        contentInput.selectionStart = contentInput.selectionEnd = start + 2;
      }
    });
  }
}

function handleFeaturedImage(file) {
  if (file.size > 2 * 1024 * 1024) { showToast('Afbeelding is te groot (max 2MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('featuredImagePreview').innerHTML = `
      <div class="image-preview-item">
        <img src="${e.target.result}" alt="Featured">
        <button class="remove-image" onclick="removeFeaturedImage()">✕</button>
      </div>`;
    saveToMediaLibrary(e.target.result, file.name);
  };
  reader.readAsDataURL(file);
}

function removeFeaturedImage() {
  document.getElementById('featuredImagePreview').innerHTML = '';
  document.getElementById('featuredImageInput').value = '';
}

function insertMd(before, after) {
  const textarea = document.getElementById('postContentInput');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const replacement = before + (selected || 'tekst') + after;
  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  textarea.focus();
  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = start + before.length + (selected || 'tekst').length;
  updatePreview();
}

function insertImage() {
  const url = prompt('Voer de afbeeldings-URL in (of kopieer deze vanuit de mediabibliotheek):');
  if (url) insertMd(`![afbeelding](${url})`, '');
}

function togglePreview() {
  const preview = document.getElementById('editorPreview');
  const btn = document.getElementById('previewToggle');
  if (preview.style.display === 'none') {
    preview.style.display = 'block'; btn.textContent = '✏️ Editor'; updatePreview();
  } else {
    preview.style.display = 'none'; btn.textContent = '👁 Preview';
  }
}

function updatePreview() {
  const content = document.getElementById('postContentInput').value;
  const el = document.getElementById('previewContent');
  if (el) el.innerHTML = parseMarkdown(content);
}

// ---- Research Manager ----
function renderResearchTable() {
  const tbody = document.getElementById('researchTable');
  const research = DataStore.getResearch();
  tbody.innerHTML = research.length ? research.map(r => `
    <tr>
      <td class="post-title-cell">${r.title}</td>
      <td><span class="status-badge ${r.status}">${r.status === 'active' ? 'Lopend' : 'Afgerond'}</span></td>
      <td>${r.year}</td>
      <td class="actions-cell">
        <button class="action-btn" onclick="editResearch('${r.id}')">✏️</button>
        <button class="action-btn delete" onclick="deleteResearch('${r.id}')">🗑️</button>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="4" style="text-align:center; padding:28px; color:var(--text-meta);">Geen projecten</td></tr>`;
}

function showResearchForm() {
  document.getElementById('researchForm').style.display = 'block';
  document.getElementById('editResearchId').value = '';
  document.getElementById('researchTitle').value = '';
  document.getElementById('researchDesc').value = '';
  document.getElementById('researchStatus').value = 'active';
  document.getElementById('researchYear').value = '';
  document.getElementById('researchTags').value = '';
}

function hideResearchForm() { document.getElementById('researchForm').style.display = 'none'; }

function editResearch(id) {
  const r = DataStore.getResearch().find(r => r.id === id);
  if (!r) return;
  document.getElementById('researchForm').style.display = 'block';
  document.getElementById('editResearchId').value = r.id;
  document.getElementById('researchTitle').value = r.title;
  document.getElementById('researchDesc').value = r.description;
  document.getElementById('researchStatus').value = r.status;
  document.getElementById('researchYear').value = r.year;
  document.getElementById('researchTags').value = (r.tags || []).join(', ');
}

function saveResearch() {
  const id = document.getElementById('editResearchId').value;
  const title = document.getElementById('researchTitle').value.trim();
  const description = document.getElementById('researchDesc').value.trim();
  const status = document.getElementById('researchStatus').value;
  const year = document.getElementById('researchYear').value.trim();
  const tags = document.getElementById('researchTags').value.split(',').map(t => t.trim()).filter(Boolean);
  if (!title) { showToast('Vul een titel in', 'error'); return; }

  const research = DataStore.getResearch();
  if (id) {
    const idx = research.findIndex(r => r.id === id);
    if (idx !== -1) research[idx] = { ...research[idx], title, description, status, year, tags };
  } else {
    research.push({ id: 'r' + Date.now(), title, description, status, year, tags });
  }
  DataStore.saveResearch(research);
  hideResearchForm();
  renderResearchTable();
  showToast('Project opgeslagen!', 'success');
}

function deleteResearch(id) {
  if (!confirm('Weet je zeker dat je dit project wilt verwijderen?')) return;
  DataStore.saveResearch(DataStore.getResearch().filter(r => r.id !== id));
  renderResearchTable();
  showToast('Project verwijderd', 'success');
}

// ---- Media Library ----
function getMedia() { return JSON.parse(localStorage.getItem(MEDIA_KEY) || '[]'); }
function saveMedia(media) { localStorage.setItem(MEDIA_KEY, JSON.stringify(media)); }

function saveToMediaLibrary(dataUrl, fileName) {
  const media = getMedia();
  media.unshift({ id: 'm' + Date.now(), url: dataUrl, name: fileName || 'image', date: new Date().toISOString() });
  saveMedia(media);
}

function initMediaUpload() {
  const uploadInput = document.getElementById('mediaUploadInput');
  const dropZone = document.getElementById('mediaDropZone');

  if (uploadInput) {
    uploadInput.addEventListener('change', () => {
      Array.from(uploadInput.files).forEach(processMediaFile);
      uploadInput.value = '';
    });
  }

  if (dropZone) {
    dropZone.addEventListener('click', () => uploadInput?.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent)'; });
    dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault(); dropZone.style.borderColor = '';
      Array.from(e.dataTransfer.files).forEach(processMediaFile);
    });
  }
}

function processMediaFile(file) {
  if (!file.type.startsWith('image/')) { showToast('Alleen afbeeldingen ondersteund', 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast(`${file.name} is te groot (max 2MB)`, 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    saveToMediaLibrary(e.target.result, file.name);
    renderMediaLibrary();
    showToast('Afbeelding geüpload!', 'success');
  };
  reader.readAsDataURL(file);
}

function renderMediaLibrary() {
  const grid = document.getElementById('mediaGrid');
  const emptyEl = document.getElementById('mediaEmpty');
  if (!grid) return;
  const media = getMedia();
  if (media.length === 0) { grid.innerHTML = ''; if (emptyEl) emptyEl.style.display = 'block'; return; }
  if (emptyEl) emptyEl.style.display = 'none';
  grid.innerHTML = media.map(m => `
    <div class="image-preview-item" style="aspect-ratio: 1;">
      <img src="${m.url}" alt="${m.name}" loading="lazy">
      <button class="remove-image" onclick="deleteMedia('${m.id}')">✕</button>
      <button class="copy-url" onclick="copyMediaUrl('${m.id}')">📋 Kopieer URL</button>
    </div>
  `).join('');
}

function deleteMedia(id) {
  saveMedia(getMedia().filter(m => m.id !== id));
  renderMediaLibrary();
  showToast('Afbeelding verwijderd', 'success');
}

function copyMediaUrl(id) {
  const m = getMedia().find(m => m.id === id);
  if (m) {
    navigator.clipboard.writeText(m.url).then(() => {
      showToast('URL gekopieerd! Plak in je post met ![afbeelding](url)', 'success');
    }).catch(() => prompt('Kopieer deze URL:', m.url));
  }
}

// ---- Settings ----
function loadSettings() {
  const settings = DataStore.getSettings();
  document.getElementById('settingSiteName').value = settings.siteName || '';
  document.getElementById('settingSiteSubtitle').value = settings.siteSubtitle || '';
  document.getElementById('settingAboutSubtitle').value = settings.aboutSubtitle || '';
  document.getElementById('settingAboutText').value = settings.aboutText || '';
  renderCategories();
  renderAdminsTable();
}

function saveSettings() {
  const settings = {
    siteName: document.getElementById('settingSiteName').value,
    siteSubtitle: document.getElementById('settingSiteSubtitle').value,
    aboutSubtitle: document.getElementById('settingAboutSubtitle').value,
    aboutText: document.getElementById('settingAboutText').value
  };
  DataStore.saveSettings(settings);
  showToast('Instellingen opgeslagen!', 'success');
}

function renderCategories() {
  const list = document.getElementById('categoriesList');
  list.innerHTML = DataStore.getCategories().map(c => `
    <div class="category-item">${c}<button onclick="removeCategory('${c}')" title="Verwijderen">✕</button></div>
  `).join('');
}

function addCategory() {
  const input = document.getElementById('newCategoryInput');
  const name = input.value.trim();
  if (!name) return;
  const cats = DataStore.getCategories();
  if (cats.includes(name)) { showToast('Categorie bestaat al', 'error'); return; }
  cats.push(name);
  DataStore.saveCategories(cats);
  input.value = '';
  renderCategories();
  showToast('Categorie toegevoegd!', 'success');
}

function removeCategory(name) {
  DataStore.saveCategories(DataStore.getCategories().filter(c => c !== name));
  renderCategories();
  showToast('Categorie verwijderd', 'success');
}

function changePassword() {
  const current = document.getElementById('currentPassword').value;
  const newPw = document.getElementById('newPassword').value;
  const user = getCurrentUser();
  if (!user) return;

  const admins = getAdmins();
  const admin = admins.find(a => a.email === user.email);
  if (!admin) return;

  if (current !== admin.password) { showToast('Huidig wachtwoord is onjuist', 'error'); return; }
  if (newPw.length < 4) { showToast('Nieuw wachtwoord moet minimaal 4 tekens zijn', 'error'); return; }

  admin.password = newPw;
  saveAdmins(admins);
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  showToast('Wachtwoord gewijzigd!', 'success');
}

// ---- Admin Management ----
function renderAdminsTable() {
  const tbody = document.getElementById('adminsTable');
  if (!tbody) return;
  const admins = getAdmins();
  const currentUser = getCurrentUser();

  tbody.innerHTML = admins.map(a => {
    const isCurrentUser = currentUser && currentUser.email === a.email;
    const isSuperAdmin = a.role === 'hoofdbeheerder';
    return `
      <tr>
        <td>${a.email} ${isCurrentUser ? '<span style="color: var(--accent); font-size: 0.72rem;">(jij)</span>' : ''}</td>
        <td>${a.name}</td>
        <td><span class="status-badge ${isSuperAdmin ? 'published' : 'draft'}">${a.role}</span></td>
        <td class="actions-cell">
          ${!isSuperAdmin ? `<button class="action-btn delete" onclick="removeAdmin('${a.email}')" title="Verwijderen">🗑️</button>` : '<span style="color:var(--text-meta); font-size: 0.75rem;">—</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function addAdmin() {
  const email = document.getElementById('newAdminEmail').value.trim().toLowerCase();
  const name = document.getElementById('newAdminName').value.trim();
  const password = document.getElementById('newAdminPassword').value.trim();

  if (!email || !name || !password) { showToast('Vul alle velden in', 'error'); return; }
  if (!email.includes('@')) { showToast('Ongeldig e-mailadres', 'error'); return; }
  if (password.length < 4) { showToast('Wachtwoord moet minimaal 4 tekens zijn', 'error'); return; }

  const admins = getAdmins();
  if (admins.find(a => a.email === email)) { showToast('Dit e-mailadres bestaat al', 'error'); return; }

  admins.push({ email, name, password, role: 'beheerder' });
  saveAdmins(admins);

  document.getElementById('newAdminEmail').value = '';
  document.getElementById('newAdminName').value = '';
  document.getElementById('newAdminPassword').value = '';

  renderAdminsTable();
  showToast(`${name} toegevoegd als beheerder!`, 'success');
}

function removeAdmin(email) {
  const admins = getAdmins();
  const admin = admins.find(a => a.email === email);
  if (!admin) return;
  if (admin.role === 'hoofdbeheerder') { showToast('Hoofdbeheerder kan niet worden verwijderd', 'error'); return; }
  if (!confirm(`Weet je zeker dat je ${admin.name} wilt verwijderen als beheerder?`)) return;

  saveAdmins(admins.filter(a => a.email !== email));
  renderAdminsTable();
  showToast('Beheerder verwijderd', 'success');
}

// ---- Import / Export ----
function initImportExport() {
  const importFile = document.getElementById('importFile');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.posts) localStorage.setItem(DataStore.POSTS_KEY, JSON.stringify(data.posts));
          if (data.research) localStorage.setItem(DataStore.RESEARCH_KEY, JSON.stringify(data.research));
          if (data.categories) localStorage.setItem(DataStore.CATEGORIES_KEY, JSON.stringify(data.categories));
          if (data.settings) localStorage.setItem(DataStore.SETTINGS_KEY, JSON.stringify(data.settings));
          if (data.media) localStorage.setItem(MEDIA_KEY, JSON.stringify(data.media));
          if (data.admins) localStorage.setItem(ADMINS_KEY, JSON.stringify(data.admins));
          showToast('Data succesvol geïmporteerd!', 'success');
          setTimeout(() => location.reload(), 1500);
        } catch { showToast('Ongeldig JSON-bestand', 'error'); }
      };
      reader.readAsText(file);
      importFile.value = '';
    });
  }
}

function exportData() {
  const data = {
    posts: DataStore.getPosts(),
    research: DataStore.getResearch(),
    categories: DataStore.getCategories(),
    settings: DataStore.getSettings(),
    media: getMedia(),
    admins: getAdmins(),
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nvdw-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data geëxporteerd!', 'success');
}

function resetData() {
  if (!confirm('WAARSCHUWING: Dit verwijdert ALLE data (posts, media, instellingen). Weet je het zeker?')) return;
  if (!confirm('Laatste waarschuwing: dit kan niet ongedaan worden gemaakt. Doorgaan?')) return;
  localStorage.removeItem(DataStore.POSTS_KEY);
  localStorage.removeItem(DataStore.RESEARCH_KEY);
  localStorage.removeItem(DataStore.CATEGORIES_KEY);
  localStorage.removeItem(DataStore.SETTINGS_KEY);
  localStorage.removeItem(MEDIA_KEY);
  // Keep admins
  DataStore.init();
  showToast('Alle data is gereset naar standaardwaarden', 'info');
  setTimeout(() => location.reload(), 1500);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
});
