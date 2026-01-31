class AIArena {
  constructor() {
    this.selected = [];
    this.votes = this.loadVotes();
    this.currentBattle = null;
    this.currentSort = 'overall';
    this.activeFilter = null;
    this._cinematicTimeouts = [];
    this.init();
  }

  init() {
    sfx = new SoundFX();
    this.initSoundToggle();
    this.renderSelect();
    this.renderRankings();
    this.setupNav();
    this.createStickyBar();
    this.checkURL();
  }

  // === SOUND TOGGLE ===
  initSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;
    btn.textContent = sfx.muted ? '🔇' : '🔊';
    btn.addEventListener('click', () => this.toggleSound());
  }

  toggleSound() {
    const muted = sfx.toggleMute();
    const btn = document.getElementById('sound-toggle');
    if (btn) btn.textContent = muted ? '🔇' : '🔊';
  }

  // === NAV ===
  setupNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showScreen(btn.dataset.screen));
    });
  }

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`screen-${name}`)?.classList.add('active');
    document.querySelector(`[data-screen="${name}"]`)?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // === URL ===
  checkURL() {
    const p = new URLSearchParams(window.location.search);
    const b = p.get('battle');
    if (b) {
      const [a, c] = b.split('-vs-');
      const t1 = TOOLS.find(t => t.id === a);
      const t2 = TOOLS.find(t => t.id === c);
      if (t1 && t2) { this.selected = [t1, t2]; this.startBattle(); return; }
    }
    this.showScreen('select');
  }

  // === STICKY BATTLE BAR ===
  createStickyBar() {
    const bar = document.createElement('div');
    bar.id = 'sticky-bar';
    bar.className = 'sticky-bar';
    bar.innerHTML = `
      <div class="sticky-bar-inner">
        <span class="sticky-bar-text" id="sticky-text">Select 2 tools to battle</span>
        <button class="sticky-bar-btn" id="sticky-btn" onclick="arena.startBattle()">⚔️ Battle!</button>
      </div>
    `;
    document.body.appendChild(bar);
  }

  updateStickyBar() {
    const bar = document.getElementById('sticky-bar');
    const text = document.getElementById('sticky-text');
    const btn = document.getElementById('sticky-btn');
    const n = this.selected.length;

    if (n === 0) {
      bar.classList.remove('visible');
    } else if (n === 1) {
      bar.classList.add('visible');
      text.innerHTML = `<strong>${this.selected[0].name}</strong> selected — pick an opponent`;
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
    } else {
      bar.classList.add('visible');
      text.innerHTML = `<strong>${this.selected[0].name}</strong> vs <strong>${this.selected[1].name}</strong>`;
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
    }
  }

  // === SELECT ===
  renderSelect(filterCategories, filterLabel) {
    const grid = document.getElementById('tools-grid');
    let toolsToShow = TOOLS;

    if (filterCategories) {
      toolsToShow = TOOLS.filter(t => filterCategories.includes(t.category));
      this.activeFilter = filterLabel;
    } else {
      this.activeFilter = null;
    }

    // Update the filter header
    const filterHeader = document.getElementById('filter-header');
    if (filterCategories && filterHeader) {
      filterHeader.innerHTML = `
        <div class="filter-active">
          <span>${filterLabel || 'Filtered'} — ${toolsToShow.length} tools</span>
          <button class="filter-clear" onclick="arena.clearFilter()">✕ Show all</button>
        </div>`;
      filterHeader.style.display = 'block';
    } else if (filterHeader) {
      filterHeader.style.display = 'none';
    }

    grid.innerHTML = toolsToShow.map(tool => {
      const overall = this.getOverall(tool);
      const tier = getTierLabel(overall);
      const catInfo = TOOL_CATEGORIES[tool.category];
      return `
        <div class="tool-card ${this.selected.find(s=>s.id===tool.id)?'selected':''}" 
             data-id="${tool.id}" 
             style="--tool-color:${tool.color};--tool-rgb:${tool.colorRgb}">
          <div class="tool-tier" style="color:${tier.color}">${tier.tier}</div>
          <a class="tool-card-link" href="${tool.url}" target="_blank" rel="noopener" title="Visit ${tool.name}" onclick="event.stopPropagation()">↗</a>
          <div class="tool-card-top">
            <div class="tool-logo">
              <img src="${tool.logo}" alt="${tool.name}" onerror="this.parentElement.innerHTML='<span class=tool-logo-fallback>${tool.name[0]}</span>'">
            </div>
            <div class="tool-info">
              <h3>${tool.name}</h3>
              <span class="maker">${tool.maker} · ${catInfo.icon} ${catInfo.name}</span>
            </div>
          </div>
          <div class="tool-model">${tool.model}</div>
          <div class="tool-desc">${tool.simpleDesc}</div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', () => this.toggleSelect(card));
    });

    this.renderQuickPick();
    this.initHolographicCards();
  }

  clearFilter() {
    this.renderSelect();
  }

  renderQuickPick() {
    const container = document.getElementById('quick-pick-options');
    if (!container) return;
    container.innerHTML = USE_CASES.map(uc =>
      `<button class="quick-pick-btn ${this.activeFilter === uc.desc ? 'active' : ''}" data-label="${uc.desc}" data-cats='${JSON.stringify(uc.categories)}' data-sort="${uc.sortBy}">${uc.label}</button>`
    ).join('');

    container.querySelectorAll('.quick-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cats = JSON.parse(btn.dataset.cats);
        const label = btn.dataset.label;
        this.selected = [];
        this.updateStickyBar();
        this.renderSelect(cats, label);
      });
    });
  }

  toggleSelect(card) {
    const id = card.dataset.id;
    const tool = TOOLS.find(t => t.id === id);
    const idx = this.selected.findIndex(t => t.id === id);

    if (idx >= 0) {
      this.selected.splice(idx, 1);
      card.classList.remove('selected');
    } else if (this.selected.length < 2) {
      this.selected.push(tool);
      card.classList.add('selected');
    } else {
      const old = this.selected[0].id;
      document.querySelector(`.tool-card[data-id="${old}"]`)?.classList.remove('selected');
      this.selected.shift();
      this.selected.push(tool);
      card.classList.add('selected');
    }

    sfx.pop();
    this.updatePrompt();
    this.updateStickyBar();
  }

  updatePrompt() {
    const el = document.getElementById('select-prompt');
    const btn = document.getElementById('fight-btn');
    const n = this.selected.length;
    if (n === 0) {
      el.innerHTML = 'Select <span class="highlight">2 tools</span> to compare';
      btn.classList.remove('ready');
    } else if (n === 1) {
      el.innerHTML = `<span class="highlight">${this.selected[0].name}</span> — now pick an opponent`;
      btn.classList.remove('ready');
    } else {
      el.innerHTML = `<span class="highlight">${this.selected[0].name}</span> vs <span class="highlight">${this.selected[1].name}</span>`;
      btn.classList.add('ready');
    }
  }

  // === HOLOGRAPHIC 3D CARD EFFECT ===
  initHolographicCards() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.tool-card').forEach(card => {
      this.setupHolographic(card, 15);
    });
  }

  initFighterHolographic() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.fighter-card').forEach(card => {
      this.setupHolographic(card, 8);
    });
  }

  setupHolographic(card, maxTilt) {
    // Inject overlay elements
    if (!card.querySelector('.holo-overlay')) {
      const holo = document.createElement('div');
      holo.className = 'holo-overlay';
      card.appendChild(holo);

      const glare = document.createElement('div');
      glare.className = 'holo-glare';
      card.appendChild(glare);
    }

    const holo = card.querySelector('.holo-overlay');
    const glare = card.querySelector('.holo-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentX = (x - centerX) / centerX; // -1 to 1
      const percentY = (y - centerY) / centerY; // -1 to 1

      // 3D tilt
      const rotY = percentX * maxTilt;
      const rotX = -percentY * maxTilt;
      card.style.transition = 'border-color 0.35s, box-shadow 0.35s';
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.02)`;

      // Holographic rainbow shift
      const holoX = 50 + percentX * 40;
      const holoY = 50 + percentY * 40;
      holo.style.backgroundPosition = `${holoX}% ${holoY}%`;
      holo.style.opacity = '0.18';

      // Glare light spot
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 25%, transparent 55%)`;
      glare.style.opacity = '1';

      // Intensify border glow
      const toolColor = getComputedStyle(card).getPropertyValue('--tool-color').trim() ||
                         getComputedStyle(card).getPropertyValue('--fighter-color').trim();
      if (toolColor) {
        card.style.borderColor = toolColor;
        card.style.boxShadow = `0 0 30px ${toolColor}55, 0 0 60px ${toolColor}20, 0 8px 32px rgba(0,0,0,0.3)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = '';
      card.style.borderColor = '';
      card.style.boxShadow = '';
      holo.style.opacity = '0';
      glare.style.opacity = '0';
    });
  }

  // === BATTLE ===
  startBattle() {
    if (this.selected.length !== 2) return;

    // Clear any pending cinematic timeouts
    this._cinematicTimeouts.forEach(clearTimeout);
    this._cinematicTimeouts = [];

    sfx.whoosh();

    const [t1, t2] = this.selected;
    this.currentBattle = { left: t1, right: t2 };
    const url = new URL(window.location);
    url.searchParams.set('battle', `${t1.id}-vs-${t2.id}`);
    window.history.pushState({}, '', url);
    document.getElementById('sticky-bar').classList.remove('visible');
    this.renderBattle(t1, t2);
    this.showScreen('battle');
  }

  renderBattle(t1, t2) {
    const el = document.getElementById('screen-battle');
    const o1 = this.getOverall(t1), o2 = this.getOverall(t2);
    const wId = o1 > o2 ? t1.id : o2 > o1 ? t2.id : null;
    const cat1 = TOOL_CATEGORIES[t1.category], cat2 = TOOL_CATEGORIES[t2.category];

    el.innerHTML = `
      <div class="container">
        <div class="battle-fighters">
          <div class="fighter-card left ${wId === t1.id ? 'winner' : wId ? 'loser' : ''}" style="--fighter-color:${t1.color};--fighter-rgb:${t1.colorRgb}">
            <div class="fighter-logo">
              <img src="${t1.logo}" alt="${t1.name}" onerror="this.parentElement.innerHTML='<span style=font-size:1.5rem>${t1.name[0]}</span>'">
            </div>
            <div class="fighter-name">${t1.name}</div>
            <div class="fighter-maker">${t1.maker} · ${cat1.icon} ${cat1.name}</div>
            <div class="fighter-model">${t1.model}</div>
            <a class="fighter-visit" href="${t1.url}" target="_blank" rel="noopener">Visit ${t1.name} →</a>
            ${wId === t1.id ? '<span class="crown">👑</span>' : ''}
          </div>
          <div class="vs-center"><span class="vs-badge">VS</span></div>
          <div class="fighter-card right ${wId === t2.id ? 'winner' : wId ? 'loser' : ''}" style="--fighter-color:${t2.color};--fighter-rgb:${t2.colorRgb}">
            <div class="fighter-logo">
              <img src="${t2.logo}" alt="${t2.name}" onerror="this.parentElement.innerHTML='<span style=font-size:1.5rem>${t2.name[0]}</span>'">
            </div>
            <div class="fighter-name">${t2.name}</div>
            <div class="fighter-maker">${t2.maker} · ${cat2.icon} ${cat2.name}</div>
            <div class="fighter-model">${t2.model}</div>
            <a class="fighter-visit" href="${t2.url}" target="_blank" rel="noopener">Visit ${t2.name} →</a>
            ${wId === t2.id ? '<span class="crown">👑</span>' : ''}
          </div>
        </div>

        <div class="verdict">
          <div class="verdict-label">The Verdict</div>
          ${wId
            ? `<div class="verdict-winner">🏆 <span class="name">${wId === t1.id ? t1.name : t2.name}</span> wins</div>
               <div class="verdict-score">${Math.max(o1,o2).toFixed(1)} vs ${Math.min(o1,o2).toFixed(1)} overall</div>`
            : `<div class="verdict-winner">⚔️ Dead even</div>
               <div class="verdict-score">Both score ${o1.toFixed(1)}</div>`}
        </div>

        <div class="categories" id="battle-cats"></div>

        <div class="vote-card">
          <div class="vote-title">Who gets your vote?</div>
          <div class="vote-subtitle">Based on your experience — not just the numbers</div>
          <div class="vote-btns">
            <button class="vote-btn" id="vote-left" style="--btn-color:${t1.color};--btn-rgb:${t1.colorRgb}" 
                    onclick="arena.castVote('${t1.id}','${t2.id}','left')">
              ${t1.name}<span class="vote-count" id="vc-left">${this.getVoteCount(t1.id,t2.id,'left')} votes</span>
            </button>
            <button class="vote-btn" id="vote-draw" onclick="arena.castVote('${t1.id}','${t2.id}','draw')">
              🤝 Draw<span class="vote-count" id="vc-draw">${this.getVoteCount(t1.id,t2.id,'draw')} votes</span>
            </button>
            <button class="vote-btn" id="vote-right" style="--btn-color:${t2.color};--btn-rgb:${t2.colorRgb}"
                    onclick="arena.castVote('${t1.id}','${t2.id}','right')">
              ${t2.name}<span class="vote-count" id="vc-right">${this.getVoteCount(t1.id,t2.id,'right')} votes</span>
            </button>
          </div>
        </div>

        <div class="details-section">
          ${this.renderDetailPanel(t1)}
          ${this.renderDetailPanel(t2)}
        </div>

        <div class="battle-actions">
          <button class="btn" onclick="arena.newBattle()">← New Battle</button>
          <button class="btn" onclick="arena.randomBattle()">🎲 Random</button>
          <button class="btn btn-primary" onclick="arena.shareBattle()">Share Battle</button>
        </div>
      </div>`;

    this.renderCategoryBars(t1, t2, false);
    this.highlightVoted(t1.id, t2.id);
    this.initFighterHolographic();
    this.cinematicReveal(t1, t2);
  }

  // === CINEMATIC BATTLE REVEAL ===
  cinematicReveal(t1, t2) {
    const container = document.querySelector('#screen-battle .container');
    if (!container) return;

    const fighters = container.querySelector('.battle-fighters');
    const vs = container.querySelector('.vs-badge');
    const verdict = container.querySelector('.verdict');
    const catRows = container.querySelectorAll('.cat-row');
    const voteCard = container.querySelector('.vote-card');
    const details = container.querySelector('.details-section');
    const actions = container.querySelector('.battle-actions');

    // Hide all elements immediately (before browser paints)
    if (vs) { vs.style.opacity = '0'; vs.style.animation = 'none'; }
    if (verdict) { verdict.style.opacity = '0'; verdict.style.transform = 'translateY(15px)'; }
    if (voteCard) { voteCard.style.opacity = '0'; voteCard.style.transform = 'translateY(15px)'; }
    if (details) { details.style.opacity = '0'; details.style.transform = 'translateY(15px)'; }
    if (actions) { actions.style.opacity = '0'; actions.style.transform = 'translateY(15px)'; }
    catRows.forEach(row => {
      row.style.opacity = '0';
      row.style.transform = 'scaleX(0.8) translateY(5px)';
      row.style.animation = 'none';
    });

    // 0ms: Fighter cards slide in (handled by existing CSS animation)
    // 400ms: VS badge + impact + screen shake
    this._cinematicTimeouts.push(setTimeout(() => {
      if (vs) {
        vs.style.opacity = '';
        vs.style.animation = 'vsFlash 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both';
      }
      sfx.impact();
      if (fighters) {
        fighters.classList.add('shake');
        this._cinematicTimeouts.push(setTimeout(() => fighters.classList.remove('shake'), 300));
      }
    }, 400));

    // 800ms: Verdict fades in
    this._cinematicTimeouts.push(setTimeout(() => {
      if (verdict) {
        verdict.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        verdict.style.opacity = '1';
        verdict.style.transform = 'translateY(0)';
      }
    }, 800));

    // 1000ms: Victory/Draw sound
    this._cinematicTimeouts.push(setTimeout(() => {
      const o1 = this.getOverall(t1), o2 = this.getOverall(t2);
      if (o1 !== o2) sfx.victory(); else sfx.draw();
    }, 1000));

    // 1200ms+: Category bars appear ONE AT A TIME
    catRows.forEach((row, i) => {
      this._cinematicTimeouts.push(setTimeout(() => {
        row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        row.style.opacity = '1';
        row.style.transform = 'scaleX(1) translateY(0)';
        sfx.tick();
        // Animate this row's bar fills
        row.querySelectorAll('.cat-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
      }, 1200 + i * 150));
    });

    // After all bars: vote card, details, actions fade in
    const afterBars = 1200 + catRows.length * 150 + 200;
    const revealQueue = [voteCard, details, actions].filter(Boolean);
    revealQueue.forEach((el, i) => {
      this._cinematicTimeouts.push(setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, afterBars + i * 120));
    });
  }

  renderDetailPanel(t) {
    const cat = TOOL_CATEGORIES[t.category];
    const useCasesHtml = (t.topUseCases && t.topUseCases.length > 0)
      ? `<div class="detail-use-cases">
          <h4>🎯 Top Use Cases</h4>
          ${t.topUseCases.map((uc, i) => `<div class="use-case-item"><span class="use-case-num">${i + 1}</span>${uc}</div>`).join('')}
        </div>`
      : '';
    return `
      <div class="detail-panel" style="--panel-color:${t.color};--panel-rgb:${t.colorRgb}">
        <h4>${cat.icon} ${t.name} — ${cat.name}</h4>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:14px;line-height:1.5">${t.simpleDesc}</p>
        
        <h4 style="margin-top:14px">✅ Strengths</h4>
        ${t.pros.map(p => `<span class="detail-tag pro">${p}</span>`).join('')}
        
        <h4 style="margin-top:14px">⚠️ Weaknesses</h4>
        ${t.cons.map(c => `<span class="detail-tag con">${c}</span>`).join('')}

        ${useCasesHtml}
        
        <h4 style="margin-top:14px">💰 Pricing</h4>
        <div class="detail-pricing">
          <span class="label">Free:</span> ${t.pricing.free}<br>
          <span class="label">Pro:</span> ${t.pricing.pro}<br>
          <span class="label">Top:</span> ${t.pricing.top}
        </div>

        <div class="detail-best-for"><strong>Best for:</strong> ${t.bestFor}</div>
        <div class="detail-who">👤 ${t.whoFor}</div>
        <a class="detail-try-btn" href="${t.url}" target="_blank" rel="noopener">Try ${t.name} →</a>
      </div>`;
  }

  renderCategoryBars(t1, t2, autoAnimate = true) {
    const container = document.getElementById('battle-cats');
    container.innerHTML = CATEGORIES.map((cat, i) => {
      const r1 = t1.ratings[cat.id], r2 = t2.ratings[cat.id];
      const w1 = (r1 / 10) * 100, w2 = (r2 / 10) * 100;
      const win = r1 > r2 ? 'left' : r2 > r1 ? 'right' : 'tie';

      const reason1 = (t1.ratingReasons && t1.ratingReasons[cat.id]) || '';
      const reason2 = (t2.ratingReasons && t2.ratingReasons[cat.id]) || '';

      return `
        <div class="cat-row" style="animation-delay:${0.1 + i * 0.05}s" onclick="this.classList.toggle('expanded')">
          <div class="cat-score-label left ${win==='left'?'winning':''}" style="color:${t1.color}">
            <span class="cat-score-num">${r1}</span>
            <span class="cat-score-text">${getScoreLabel(r1)}</span>
          </div>
          <div class="cat-bar-container">
            <div class="cat-bar-fill left ${win==='left'?'winning':''}" data-w="${w1}" 
                 style="width:0%;background:${t1.color};--bar-rgb:${t1.colorRgb}">
            </div>
          </div>
          <div class="cat-center">
            <span class="cat-icon">${cat.icon}</span>
            <div class="cat-name">${cat.name}</div>
          </div>
          <div class="cat-bar-container">
            <div class="cat-bar-fill right ${win==='right'?'winning':''}" data-w="${w2}" 
                 style="width:0%;background:${t2.color};--bar-rgb:${t2.colorRgb}">
            </div>
          </div>
          <div class="cat-score-label right ${win==='right'?'winning':''}" style="color:${t2.color}">
            <span class="cat-score-num">${r2}</span>
            <span class="cat-score-text">${getScoreLabel(r2)}</span>
          </div>
          <div class="cat-expand-hint">click for details</div>
          <div class="cat-reasons">
            <div class="cat-reason" style="--reason-color:${t1.color}">
              <span class="reason-tool" style="color:${t1.color}">${t1.name}</span>
              ${reason1}
            </div>
            <div class="cat-reason" style="--reason-color:${t2.color}">
              <span class="reason-tool" style="color:${t2.color}">${t2.name}</span>
              ${reason2}
            </div>
          </div>
        </div>`;
    }).join('');

    if (autoAnimate) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          container.querySelectorAll('.cat-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.w + '%';
          });
        }, 150);
      });
    }
  }

  // === VOTING ===
  loadVotes() { try { return JSON.parse(localStorage.getItem('arena-votes') || '{}'); } catch { return {}; } }
  saveVotes() { localStorage.setItem('arena-votes', JSON.stringify(this.votes)); }
  voteKey(a, b) { return [a, b].sort().join(':'); }
  getVoteCount(a, b, side) { return this.votes[this.voteKey(a, b)]?.counts?.[side] || 0; }

  castVote(a, b, side) {
    const k = this.voteKey(a, b);
    if (!this.votes[k]) this.votes[k] = { counts: { left: 0, right: 0, draw: 0 }, user: null };
    const d = this.votes[k];
    if (d.user) d.counts[d.user]--;
    d.user = d.user === side ? null : side;
    if (d.user) d.counts[d.user]++;
    this.saveVotes();
    this.updateVoteUI(a, b);
    sfx.pop();
  }

  updateVoteUI(a, b) {
    const d = this.votes[this.voteKey(a, b)] || { counts: { left:0, right:0, draw:0 }, user: null };
    document.getElementById('vc-left').textContent = `${d.counts.left} votes`;
    document.getElementById('vc-right').textContent = `${d.counts.right} votes`;
    document.getElementById('vc-draw').textContent = `${d.counts.draw} votes`;
    ['left','right','draw'].forEach(s => {
      const btn = document.getElementById(`vote-${s}`);
      const isVoted = d.user === s;
      btn.classList.toggle('voted', isVoted);
      btn.style.background = isVoted
        ? (s === 'left' ? this.currentBattle.left.color : s === 'right' ? this.currentBattle.right.color : '#444')
        : '';
    });
  }

  highlightVoted(a, b) { if (this.votes[this.voteKey(a, b)]?.user) this.updateVoteUI(a, b); }

  // === RANKINGS ===
  renderRankings() { this.renderSortBar(); this.updateRankings(); }

  renderSortBar() {
    const el = document.getElementById('sort-bar');
    const items = [{ id: 'overall', icon: '🏆', name: 'Overall' }, ...CATEGORIES];
    el.innerHTML = items.map(i =>
      `<button class="sort-btn ${i.id === this.currentSort ? 'active' : ''}" 
              onclick="arena.sortBy('${i.id}')">${i.icon || ''} ${i.name}</button>`
    ).join('');
  }

  sortBy(cat) { this.currentSort = cat; this.renderSortBar(); this.updateRankings(); }

  updateRankings() {
    const sorted = [...TOOLS].sort((a, b) => {
      const sa = this.currentSort === 'overall' ? this.getOverall(a) : a.ratings[this.currentSort];
      const sb = this.currentSort === 'overall' ? this.getOverall(b) : b.ratings[this.currentSort];
      return sb - sa;
    });
    const maxS = this.currentSort === 'overall' ? this.getOverall(sorted[0]) : sorted[0].ratings[this.currentSort];

    document.getElementById('rank-list').innerHTML = sorted.map((t, i) => {
      const score = this.currentSort === 'overall' ? this.getOverall(t) : t.ratings[this.currentSort];
      const pct = (score / maxS) * 100;
      const cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      const cat = TOOL_CATEGORIES[t.category];
      return `
        <div class="rank-row" onclick="arena.quickBattle('${t.id}')">
          <span class="rank-pos ${cls}">${i + 1}</span>
          <div class="rank-tool">
            <div class="rank-logo">
              <img src="${t.logo}" alt="${t.name}" onerror="this.parentElement.innerHTML='<span>${t.name[0]}</span>'">
            </div>
            <div>
              <div class="rank-name">${t.name}</div>
              <div class="rank-maker">${cat.icon} ${cat.name} · ${t.model.split(',')[0]}</div>
            </div>
          </div>
          <div class="rank-bar"><div class="rank-bar-inner" style="width:${pct}%;background:${t.color}"></div></div>
          <span class="rank-score" style="color:${t.color}">${score.toFixed(1)}</span>
        </div>`;
    }).join('');
  }

  quickBattle(id) {
    const tool = TOOLS.find(t => t.id === id);
    if (!tool) return;
    if (this.selected.length === 1 && this.selected[0].id !== id) {
      this.selected.push(tool);
      this.startBattle();
    } else {
      this.selected = [tool];
      this.showScreen('select');
      this.renderSelect();
      document.querySelectorAll('.tool-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
      this.updatePrompt();
      this.updateStickyBar();
    }
  }

  // === SHARE ===
  shareBattle() {
    if (!this.currentBattle) return;
    const { left, right } = this.currentBattle;
    const url = `${window.location.origin}${window.location.pathname}?battle=${left.id}-vs-${right.id}`;
    document.getElementById('share-input').value = url;
    document.getElementById('share-modal').classList.add('open');
  }
  closeShare() { document.getElementById('share-modal').classList.remove('open'); }
  copyURL() {
    navigator.clipboard.writeText(document.getElementById('share-input').value);
    const btn = document.querySelector('.cp-btn');
    btn.textContent = '✅ Copied';
    setTimeout(() => btn.textContent = '📋 Copy', 2000);
  }
  shareX() {
    const { left, right } = this.currentBattle;
    const url = document.getElementById('share-input').value;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`⚔️ ${left.name} vs ${right.name} — who wins?\n\n${url}\n\n#AIArena`)}`, '_blank');
  }
  shareLI() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(document.getElementById('share-input').value)}`, '_blank'); }

  // === HELPERS ===
  getOverall(t) { const v = Object.values(t.ratings); return v.reduce((a, b) => a + b, 0) / v.length; }

  newBattle() {
    // Clear cinematic timeouts
    this._cinematicTimeouts.forEach(clearTimeout);
    this._cinematicTimeouts = [];

    this.selected = [];
    this.updateStickyBar();
    this.renderSelect();
    this.updatePrompt();
    const url = new URL(window.location);
    url.searchParams.delete('battle');
    window.history.pushState({}, '', url);
    this.showScreen('select');
  }

  randomBattle() {
    const cats = Object.keys(TOOL_CATEGORIES);
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const catTools = TOOLS.filter(t => t.category === cat);
    if (catTools.length < 2) { this.randomBattle(); return; }
    const s = [...catTools].sort(() => Math.random() - 0.5);
    this.selected = [s[0], s[1]];
    this.startBattle();
  }
}

let arena;
document.addEventListener('DOMContentLoaded', () => { arena = new AIArena(); });
