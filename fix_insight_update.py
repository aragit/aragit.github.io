#!/usr/bin/env python3
import re

with open("index.html", "r") as f:
    content = f.read()

# Update image reference to image.jpg
content = re.sub(r'src="chatvsagent\.png"', 'src="image.jpg"', content)
content = re.sub(r'src="chatvsAgent\.jpg"', 'src="image.jpg"', content)

# Update insight bullets with new content and order
old_bullets = r'<ul class="insight-bullets">.*?</ul>'
new_bullets = '''<ul class="insight-bullets">
              <li>The era of "chat" is over. Businesses need systems that read reports, flag risks, draft notices, and update ledgers — while they sleep. Intelligence without execution is just entertainment.</li>
              <li>Most "AI Agents" fail the Planning Rubicon — they react but never truly plan, execute, or persist state across time. Stateless LLM wrappers are expensive chatbots, not autonomous systems.</li>
              <li>True agentic architectures separate the "brain" (stochastic reasoning) from the "skeleton" (deterministic execution). Governance first, intelligence second — because intelligence without control is liability.</li>
            </ul>'''

content = re.sub(old_bullets, new_bullets, content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)

print("✓ Insight section updated: new image + revised bullet order")
