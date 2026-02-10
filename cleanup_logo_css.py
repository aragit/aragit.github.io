#!/usr/bin/env python3

with open("style.css", "r") as f:
    lines = f.readlines()

# Remove ALL lines containing hero-logo-small
new_lines = []
for line in lines:
    if 'hero-logo-small' not in line:
        new_lines.append(line)

content = ''.join(new_lines)
content = content.replace('\n\n\n\n', '\n\n')

with open("style.css", "w") as f:
    f.write(content)

print("✓ Logo CSS cleaned up")
