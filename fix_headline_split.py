#!/usr/bin/env python3
import re

with open("index.html", "r") as f:
    content = f.read()

# Replace single headline with two-line version
old_headline = r'<h2 class="insight-headline">.*?</h2>'

new_headline = '''<h2 class="insight-headline">
          <span class="headline-line1">Don't Build Just "Expensive Chatbots"</span>
          <span class="headline-line2">Real "Agentic Systems" Reason and Learn within "Adaptive Architecture"</span>
        </h2>'''

content = re.sub(old_headline, new_headline, content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)

print("✓ Headline split into two centered lines")
