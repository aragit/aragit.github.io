#!/usr/bin/env python3
import re

with open("index.html", "r") as f:
    content = f.read()

# Replace with structure without numbers, subtitles same style as title
old_pillars = r'<div class="insight-pillars">.*?</div>\s*</div>\s*<div class="insight-visual insight-visual-large">'

new_pillars = '''<div class="insight-pillars">
          <div class="insight-pillar">
            <div class="pillar-content">
              <h4 class="pillar-title">Execution <span class="pillar-subtitle">over Conversation</span></h4>
              <p class="pillar-desc">Build AI systems that read reports, flag risks, generate artifacts, and update systems autonomously while learning from outcomes. Intelligence that cannot act or improve from action is not a system; it's a demo.</p>
            </div>
          </div>
          
          <div class="insight-pillar">
            <div class="pillar-content">
              <h4 class="pillar-title">Planning <span class="pillar-subtitle">over Reaction</span></h4>
              <p class="pillar-desc">Most so-called "AI agents" respond to prompts but fail to plan, execute multi-step workflows, persist state, or refine behavior over time. Stateless LLM wrappers are costly — and fragile.</p>
            </div>
          </div>
          
          <div class="insight-pillar">
            <div class="pillar-content">
              <h4 class="pillar-title">Control <span class="pillar-subtitle">over Cleverness</span></h4>
              <p class="pillar-desc">Apply robust agentic architectures that separate stochastic reasoning from deterministic execution, enabling learning within explicit constraints. Governance, validation, and recovery come first.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="insight-visual insight-visual-large">'''

content = re.sub(old_pillars, new_pillars, content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)

print("✓ Numbers removed, subtitles will match title style")
