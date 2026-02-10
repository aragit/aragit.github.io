#!/usr/bin/env python3
import re

with open("index.html", "r") as f:
    content = f.read()

# Replace the insight bullets with numbered sections
old_bullets = r'<ul class="insight-bullets.*?">.*?</ul>'

new_sections = '''<div class="insight-pillars">
          <div class="insight-pillar">
            <div class="pillar-number">01</div>
            <div class="pillar-content">
              <h4 class="pillar-title">Execution</h4>
              <p class="pillar-desc">Build AI systems that read reports, flag risks, generate artifacts, and update systems autonomously while learning from outcomes. Intelligence that cannot act or improve from action is not a system; it's a demo.</p>
            </div>
          </div>
          
          <div class="insight-pillar">
            <div class="pillar-number">02</div>
            <div class="pillar-content">
              <h4 class="pillar-title">Planning</h4>
              <p class="pillar-desc">Most so-called "AI agents" respond to prompts but fail to plan, execute multi-step workflows, persist state, or refine behavior over time. Stateless LLM wrappers are costly — and fragile.</p>
            </div>
          </div>
          
          <div class="insight-pillar">
            <div class="pillar-number">03</div>
            <div class="pillar-content">
              <h4 class="pillar-title">Control</h4>
              <p class="pillar-desc">Apply robust agentic architectures that separate stochastic reasoning from deterministic execution, enabling learning within explicit constraints. Governance, validation, and recovery come first.</p>
            </div>
          </div>
        </div>'''

content = re.sub(old_bullets, new_sections, content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)

print("✓ Insight bullets replaced with numbered pillars (01, 02, 03)")
