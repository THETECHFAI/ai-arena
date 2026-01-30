// === AI ARENA - Main App ===

class AIArena {
  constructor() {
    this.selected = [];
    this.votes = this.loadVotes();
    this.currentBattle = null;
    this.currentSort = 'overall';
    this.init();
  }

  init() {
    this.renderSelectScreen();
    this.renderRankings();
    this.setupNav();
    this.checkURLBattle();
  }

  // === NAVIGATION ===
  setupNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.dataset.screen;
        this.showScreen(screen);
      });
    });
  }

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`screen-${name}`).classList.add('active');
    document.querySelector(`[data-screen="${name}"]`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // === URL ROUTING ===
  checkURLBattle() {
    const params = new URLSearchParams(window.location.search);
    const battle = params.get('battle');
    if (battle) {
      const [id1, id2] = battle.split('-vs-');
      const t1 = TOOLS.find(t => t.id === id1);
      const t2 = TOOLS.find(t => t.id === id2);
      if (t1 && t2) {
        this.selected = [t1, t2];
        this.startBattle();
        return;
      }
    }
    this.showScreen('select');
  }

  updateURL(t1, t2) {
    const url = new URL(window.location);
    url.searchParams.set('battle', `${t1.id}-vs-${t2.id}`);
    window.history.pushState({}, '', url);
  }

  // === SELECT SCREEN ===
  renderSelectScreen() {
    const grid = document.getElementById('tools-grid');
    grid.innerHTML = TOOLS.map(tool => {
      const overall = this.getOverall(tool);
      return `
        <div class="tool-card" data-id="${tool.id}" style="--tool-color: ${tool.color}">
          <div class="tool-overall">${overall.toFixed(1)}</div>
          <div class="tool-icon">${tool.icon}</div>
          <div class="tool-name">${tool.name}</div>
          <div class="tool-maker">${tool.maker}</div>
          <div class="tool-tagline">${tool.tagline}</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', () => this.toggleSelect(card));
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
      // Deselect first, select new
      const oldId = this.selected[0].id;
      document.querySelector(`.tool-card[data-id="${oldId}"]`).classList.remove('selected');
      this.selected.shift();
      this.selected.push(tool);
      card.classList.add('selected');
    }

    this.updateSelectUI();
  }

  updateSelectUI() {
    const btn = document.getElementById('fight-btn');
    const prompt = document.getElementById('select-prompt');
    const count = this.selected.length;

    if (count === 0) {
      prompt.innerHTML = 'Choose <span class="count">2</span> fighters to battle';
      btn.classList.remove('ready');
    } else if (count === 1) {
      prompt.innerHTML = `<span class="count">${this.selected[0].icon} ${this.selected[0].name}</span> selected — pick an opponent`;
      btn.classList.remove('ready');
    } else {
      prompt.innerHTML = `<span class="count">${this.selected[0].icon} ${this.selected[0].name}</span> vs <span class="count">${this.selected[1].icon} ${this.selected[1].name}</span>`;
      btn.classList.add('ready');
    }
  }

  // === BATTLE ===
  startBattle() {
    if (this.selected.length !== 2) return;

    const [t1, t2] = this.selected;
    this.currentBattle = { left: t1, right: t2 };
    this.updateURL(t1, t2);
    this.renderBattle(t1, t2);
    this.showScreen('battle');
  }

  renderBattle(t1, t2) {
    const container = document.getElementById('screen-battle');
    const o1 = this.getOverall(t1);
    const o2 = this.getOverall(t2);
    const winnerId = o1 > o2 ? t1.id : o2 > o1 ? t2.id : null;

    container.innerHTML = `
      <!-- VS Header -->
      <div class="battle-vs">
        <div class="battle-fighter slide-in-left ${winnerId === t1.id ? 'winner' : winnerId ? 'loser' : ''}" 
             style="--fighter-color: ${t1.color}">
          <div class="fighter-icon">${t1.icon}</div>
          <div class="fighter-name">${t1.name}</div>
          <div class="fighter-maker">${t1.maker}</div>
        </div>
        <div class="vs-divider">
          <span class="vs-text scale-in">VS</span>
        </div>
        <div class="battle-fighter slide-in-right ${winnerId === t2.id ? 'winner' : winnerId ? 'loser' : ''}" 
             style="--fighter-color: ${t2.color}">
          <div class="fighter-icon">${t2.icon}</div>
          <div class="fighter-name">${t2.name}</div>
          <div class="fighter-maker">${t2.maker}</div>
        </div>
      </div>

      <!-- Verdict -->
      <div class="verdict">
        ${winnerId 
          ? `<h2>🏆 THE VERDICT</h2>
             <div class="winner-name">${winnerId === t1.id ? t1.name : t2.name} wins!</div>
             <div class="verdict-detail">Overall score: ${Math.max(o1,o2).toFixed(1)} vs ${Math.min(o1,o2).toFixed(1)}</div>`
          : `<h2>⚔️ DEAD EVEN</h2>
             <div class="verdict-detail">Both score ${o1.toFixed(1)} overall</div>`
        }
      </div>

      <!-- Category Breakdown -->
      <div class="categories-list" id="categories-list"></div>

      <!-- Vote -->
      <div class="vote-section">
        <h3>🗳️ Cast your vote — who wins?</h3>
        <div class="vote-buttons">
          <button class="vote-btn" id="vote-left" style="border-color: ${t1.color}" 
                  onclick="arena.castVote('${t1.id}', '${t2.id}', 'left')">
            ${t1.icon} ${t1.name}
            <span class="vote-count" id="vote-count-left">${this.getVoteCount(t1.id, t2.id, 'left')} votes</span>
          </button>
          <button class="vote-btn" id="vote-draw" style="border-color: #666"
                  onclick="arena.castVote('${t1.id}', '${t2.id}', 'draw')">
            🤝 Draw
            <span class="vote-count" id="vote-count-draw">${this.getVoteCount(t1.id, t2.id, 'draw')} votes</span>
          </button>
          <button class="vote-btn" id="vote-right" style="border-color: ${t2.color}"
                  onclick="arena.castVote('${t1.id}', '${t2.id}', 'right')">
            ${t2.icon} ${t2.name}
            <span class="vote-count" id="vote-count-right">${this.getVoteCount(t1.id, t2.id, 'right')} votes</span>
          </button>
        </div>
      </div>

      <!-- Pros & Cons -->
      <div class="details-grid">
        <div class="detail-card">
          <h4>${t1.icon} ${t1.name} — Strengths</h4>
          ${t1.pros.map(p => `<span class="tag pro">✅ ${p}</span>`).join('')}
          <h4 style="margin-top:16px">${t1.icon} ${t1.name} — Weaknesses</h4>
          ${t1.cons.map(c => `<span class="tag con">⚠️ ${c}</span>`).join('')}
        </div>
        <div class="detail-card">
          <h4>${t2.icon} ${t2.name} — Strengths</h4>
          ${t2.pros.map(p => `<span class="tag pro">✅ ${p}</span>`).join('')}
          <h4 style="margin-top:16px">${t2.icon} ${t2.name} — Weaknesses</h4>
          ${t2.cons.map(c => `<span class="tag con">⚠️ ${c}</span>`).join('')}
        </div>
      </div>

      <!-- Pricing -->
      <div class="details-grid">
        <div class="detail-card">
          <h4>💰 ${t1.name} Pricing</h4>
          <span class="tag">Free: ${t1.pricing.free}</span>
          <span class="tag">Pro: ${t1.pricing.pro}</span>
          <span class="tag">Enterprise: ${t1.pricing.enterprise}</span>
          <p style="margin-top:12px;font-size:0.85rem;color:var(--text-dim)">Best for: ${t1.bestFor}</p>
        </div>
        <div class="detail-card">
          <h4>💰 ${t2.name} Pricing</h4>
          <span class="tag">Free: ${t2.pricing.free}</span>
          <span class="tag">Pro: ${t2.pricing.pro}</span>
          <span class="tag">Enterprise: ${t2.pricing.enterprise}</span>
          <p style="margin-top:12px;font-size:0.85rem;color:var(--text-dim)">Best for: ${t2.bestFor}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="battle-actions">
        <button class="action-btn" onclick="arena.newBattle()">⚔️ New Battle</button>
        <button class="action-btn" onclick="arena.randomBattle()">🎲 Random Battle</button>
        <button class="action-btn primary" onclick="arena.shareBattle()">📤 Share This Battle</button>
      </div>
    `;

    // Render category bars with animation delay
    this.renderCategories(t1, t2);
    this.highlightVoted(t1.id, t2.id);
  }

  renderCategories(t1, t2) {
    const list = document.getElementById('categories-list');
    list.innerHTML = CATEGORIES.map((cat, i) => {
      const r1 = t1.ratings[cat.id];
      const r2 = t2.ratings[cat.id];
      const max = 10;
      const w1 = (r1 / max) * 100;
      const w2 = (r2 / max) * 100;
      const winner = r1 > r2 ? 'left' : r2 > r1 ? 'right' : 'tie';

      return `
        <div class="category-row" style="animation-delay: ${i * 0.1}s">
          <div class="cat-bar-wrap">
            <div class="cat-bar left ${winner === 'left' ? 'winner-bar' : ''}" 
                 style="width: 0%; background: linear-gradient(90deg, transparent, ${t1.color}); --bar-glow: ${this.hexToRgb(t1.color)}"
                 data-width="${w1}">
              ${r1}
            </div>
          </div>
          <div class="cat-label">
            <div class="cat-icon">${cat.icon}</div>
            <div class="cat-name">${cat.name}</div>
          </div>
          <div class="cat-bar-wrap">
            <div class="cat-bar right ${winner === 'right' ? 'winner-bar' : ''}" 
                 style="width: 0%; background: linear-gradient(270deg, transparent, ${t2.color}); --bar-glow: ${this.hexToRgb(t2.color)}"
                 data-width="${w2}">
              ${r2}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Animate bars
    requestAnimationFrame(() => {
      setTimeout(() => {
        list.querySelectorAll('.cat-bar').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }, 200);
    });
  }

  // === VOTING ===
  loadVotes() {
    try {
      return JSON.parse(localStorage.getItem('aiarena-votes') || '{}');
    } catch { return {}; }
  }

  saveVotes() {
    localStorage.setItem('aiarena-votes', JSON.stringify(this.votes));
  }

  getVoteKey(id1, id2) {
    return [id1, id2].sort().join('-vs-');
  }

  getVoteCount(id1, id2, side) {
    const key = this.getVoteKey(id1, id2);
    return (this.votes[key]?.counts?.[side]) || 0;
  }

  castVote(id1, id2, side) {
    const key = this.getVoteKey(id1, id2);
    if (!this.votes[key]) {
      this.votes[key] = { counts: { left: 0, right: 0, draw: 0 }, userVote: null };
    }

    // Remove previous vote
    if (this.votes[key].userVote) {
      this.votes[key].counts[this.votes[key].userVote]--;
    }

    // Add new vote
    if (this.votes[key].userVote === side) {
      this.votes[key].userVote = null; // Toggle off
    } else {
      this.votes[key].counts[side]++;
      this.votes[key].userVote = side;
    }

    this.saveVotes();
    this.updateVoteUI(id1, id2);
  }

  updateVoteUI(id1, id2) {
    const key = this.getVoteKey(id1, id2);
    const data = this.votes[key] || { counts: { left: 0, right: 0, draw: 0 }, userVote: null };

    document.getElementById('vote-count-left').textContent = `${data.counts.left} votes`;
    document.getElementById('vote-count-right').textContent = `${data.counts.right} votes`;
    document.getElementById('vote-count-draw').textContent = `${data.counts.draw} votes`;

    ['left', 'right', 'draw'].forEach(s => {
      const btn = document.getElementById(`vote-${s}`);
      btn.classList.toggle('voted', data.userVote === s);
      if (data.userVote === s) {
        btn.style.background = s === 'left' ? this.currentBattle.left.color 
                             : s === 'right' ? this.currentBattle.right.color 
                             : '#666';
      } else {
        btn.style.background = 'transparent';
      }
    });
  }

  highlightVoted(id1, id2) {
    const key = this.getVoteKey(id1, id2);
    const data = this.votes[key];
    if (data?.userVote) {
      this.updateVoteUI(id1, id2);
    }
  }

  // === RANKINGS ===
  renderRankings() {
    this.renderSortControls();
    this.updateRankings();
  }

  renderSortControls() {
    const controls = document.getElementById('sort-controls');
    const options = [{ id: 'overall', name: 'Overall' }, ...CATEGORIES];
    controls.innerHTML = options.map(opt => 
      `<button class="sort-btn ${opt.id === this.currentSort ? 'active' : ''}" 
              onclick="arena.sortRankings('${opt.id}')">${opt.icon || '🏆'} ${opt.name}</button>`
    ).join('');
  }

  sortRankings(category) {
    this.currentSort = category;
    this.renderSortControls();
    this.updateRankings();
  }

  updateRankings() {
    const sorted = [...TOOLS].sort((a, b) => {
      if (this.currentSort === 'overall') {
        return this.getOverall(b) - this.getOverall(a);
      }
      return b.ratings[this.currentSort] - a.ratings[this.currentSort];
    });

    const maxScore = this.currentSort === 'overall' 
      ? this.getOverall(sorted[0]) 
      : sorted[0].ratings[this.currentSort];

    const tbody = document.getElementById('rankings-body');
    tbody.innerHTML = sorted.map((tool, i) => {
      const score = this.currentSort === 'overall' 
        ? this.getOverall(tool) 
        : tool.ratings[this.currentSort];
      const pct = (score / maxScore) * 100;
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';

      return `
        <tr>
          <td><span class="rank-num ${rankClass}">${i + 1}</span></td>
          <td>
            <div class="rank-tool">
              <span class="rank-icon">${tool.icon}</span>
              <div>
                <div class="rank-name">${tool.name}</div>
                <div class="rank-maker">${tool.maker}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="rank-bar">
              <div class="rank-bar-fill" style="width:${pct}%; background:${tool.color}"></div>
            </div>
          </td>
          <td><span class="rank-score" style="color:${tool.color}">${score.toFixed(1)}</span></td>
          <td>${tool.bestFor}</td>
        </tr>
      `;
    }).join('');
  }

  // === SHARING ===
  shareBattle() {
    if (!this.currentBattle) return;
    const { left, right } = this.currentBattle;
    const url = `${window.location.origin}${window.location.pathname}?battle=${left.id}-vs-${right.id}`;
    
    const modal = document.getElementById('share-modal');
    document.getElementById('share-url').value = url;
    modal.classList.add('active');
  }

  closeShare() {
    document.getElementById('share-modal').classList.remove('active');
  }

  copyShareURL() {
    const input = document.getElementById('share-url');
    input.select();
    navigator.clipboard.writeText(input.value);
    const btn = document.querySelector('.share-btn.copy');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy Link', 2000);
  }

  shareTwitter() {
    if (!this.currentBattle) return;
    const { left, right } = this.currentBattle;
    const url = document.getElementById('share-url').value;
    const text = `⚔️ ${left.name} vs ${right.name} — who wins?\n\nCheck the AI Arena battle:\n${url}\n\n#AIArena #AI`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }

  shareLinkedIn() {
    const url = document.getElementById('share-url').value;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  }

  // === HELPERS ===
  getOverall(tool) {
    const vals = Object.values(tool.ratings);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  newBattle() {
    this.selected = [];
    document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('selected'));
    this.updateSelectUI();
    const url = new URL(window.location);
    url.searchParams.delete('battle');
    window.history.pushState({}, '', url);
    this.showScreen('select');
  }

  randomBattle() {
    const shuffled = [...TOOLS].sort(() => Math.random() - 0.5);
    this.selected = [shuffled[0], shuffled[1]];
    this.startBattle();
  }
}

// Initialize
let arena;
document.addEventListener('DOMContentLoaded', () => {
  arena = new AIArena();
});
