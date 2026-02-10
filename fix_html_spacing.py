#!/usr/bin/env python3
import re

with open("index.html", "r") as f:
    content = f.read()

# Remove any whitespace/newlines between headline and pillars
pattern = r'(</h2>)\s+(<div class="insight-pillars">)'
replacement = r'\1<div class="insight-pillars">'

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)

print("✓ HTML whitespace removed between headline and pillars")
