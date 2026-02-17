#!/bin/bash

# 1. Navigate to your repository
cd ~/portfolio

# 2. Backups
BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
cp index.html "index.html.backup.${BACKUP_TIME}"
cp style.css "style.css.backup.${BACKUP_TIME}"
echo "✓ Backups created"

# 3. Apply the new section using Python
python3 << 'PYEOF'
import re

# --- 1. UPDATE STYLE.CSS ---
with open('style.css', 'r') as f:
    css_content = f.read()

forge_css = """
/* ===== OPEN FORGE INITIATIVES (PORTFOLIO FOOTER) ===== */
.forge-container {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 107, 0, 0.2);
}

.forge-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.forge-header h3 {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.forge-header p {
  color: var(--muted, #a8aeb3);
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto;
}

.forge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.forge-card {
  background: rgba(22, 22, 22, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.forge-card:hover {
  border-color: var(--accent, #ff6b00);
  background: rgba(255, 107, 0, 0.03);
  transform: translateY(-4px);
}

.forge-icon {
  font-size: 1.8rem;
  color: var(--accent, #ff6b00);
  margin-bottom: 1rem;
}

.forge-card h4 {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.forge-card p {
  font-size: 0.85rem;
  color: var(--muted, #a8aeb3);
  margin-bottom: 1.5rem;
  line-height: 1.5;
  flex-grow: 1;
}

.forge-btn {
  display: inline-block;
  background: transparent;
  border: 1px solid var(--accent, #ff6b00);
  color: var(--accent, #ff6b00);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.forge-card:hover .forge-btn {
  background: var(--accent, #ff6b00);
  color: #ffffff;
}
"""

if "/* ===== OPEN FORGE INITIATIVES (PORTFOLIO FOOTER) ===== */" not in css_content:
    css_content += "\n" + forge_css
    with open('style.css', 'w') as f:
        f.write(css_content)
    print("✓ Injected Open Forge CSS into style.css")


# --- 2. UPDATE INDEX.HTML ---
with open('index.html', 'r') as f:
    html = f.read()

forge_html = """
      <div class="forge-container">
        <div class="forge-header">
          <h3>Join the Agentic Task Force</h3>
          <p>We build in the open. Critique the architecture, write a pluggable node, or try to break our safety guardrails.</p>
        </div>
        
        <div class="forge-grid">
          
          <div class="forge-card">
            <div class="forge-icon"><i class="fas fa-project-diagram" aria-hidden="true"></i></div>
            <h4>Architecture RFCs</h4>
            <p>Review our system design diagrams and propose optimizations to our Temporal workflows and handoffs.</p>
            <a href="https://github.com/aragit" target="_blank" rel="noopener noreferrer" class="forge-btn">View RFCs (GitHub)</a>
          </div>

          <div class="forge-card">
            <div class="forge-icon"><i class="fas fa-puzzle-piece" aria-hidden="true"></i></div>
            <h4>Pluggable Nodes</h4>
            <p>Our Core is locked, but our 'Hands' are open. Build and integrate new API tools for our agents to use.</p>
            <a href="https://github.com/aragit" target="_blank" rel="noopener noreferrer" class="forge-btn">Explore Nodes</a>
          </div>

          <div class="forge-card">
            <div class="forge-icon"><i class="fas fa-shield-alt" aria-hidden="true"></i></div>
            <h4>Red Team Challenge</h4>
            <p>Think you can force a hallucination? Try to bypass the Deterministic Core of our Medical Triage Agent.</p>
            <a href="case-studies/medical-triage/medical-triage.html" class="forge-btn">Attack the Core</a>
          </div>

          <div class="forge-card">
            <div class="forge-icon"><i class="fas fa-fire" aria-hidden="true"></i></div>
            <h4>Open Bounties</h4>
            <p>Solve high-priority architectural bottlenecks and earn co-authorship on our production deployments.</p>
            <a href="case-studies/medical-triage/medical-triage.html" class="forge-btn">View Bounties</a>
          </div>

        </div>
      </div>
"""

target_str = '</div>\n    </div>\n  </section>\n\n
