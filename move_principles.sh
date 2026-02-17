#!/bin/bash

# Ensure we're in the right directory
cd ~/portfolio || exit 1

# 1. Back up both files just in case
BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
cp index.html "index.html.backup.${BACKUP_TIME}"
if [ -f "architecture.html" ]; then
    cp architecture.html "architecture.html.backup.${BACKUP_TIME}"
fi
echo "✓ Backups created"

# 2. Safely cut from index.html and paste into architecture.html
python3 << 'PYEOF'
import os

try:
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Define exactly where the block starts and ends
    start_marker = '<div class="principles-strip" id="core-principles">'
    end_marker = '<div class="architecture-tagline"'
    
    start_idx = html.find(start_marker)
    end_idx = html.find(end_marker)

    if start_idx != -1 and end_idx != -1:
        # 1. Cut the block
        extracted_block = html[start_idx:end_idx]
        
        # 2. Remove it from index.html
        new_html = html[:start_idx] + html[end_idx:]
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("✓ Successfully removed 'Agentic Principles' from index.html")

        # 3. Inject it into architecture.html
        if os.path.exists('architecture.html'):
            with open('architecture.html', 'r', encoding='utf-8') as f:
                arch_html = f.read()
            
            # Wrap it in a clean section so it aligns well on the new page
            injection = f'\n<section class="section">\n  <div class="container">\n{extracted_block}  </div>\n</section>\n'
            
            # Place it right before the closing </main> tag
            if '</main>' in arch_html:
                arch_html = arch_html.replace('</main>', injection + '\n</main>')
                with open('architecture.html', 'w', encoding='utf-8') as f:
                    f.write(arch_html)
                print("✓ Successfully injected into architecture.html")
            else:
                # Fallback if </main> isn't found
                arch_html = arch_html.replace('</body>', injection + '\n</body>')
                with open('architecture.html', 'w', encoding='utf-8') as f:
                    f.write(arch_html)
                print("✓ Injected into architecture.html (appended to bottom)")
        else:
            print("⚠ architecture.html not found! The code was removed from index.html but couldn't be pasted.")
            
    else:
        print("⚠ Could not find the exact start/end markers in index.html. No changes made.")

except Exception as e:
    print(f"Error: {e}")
PYEOF

# 3. Commit and Push
git add index.html architecture.html
git commit -m "Refactor: Move Agentic Principles grid from home page to architecture page"
git push origin main
echo "✓ Changes pushed to GitHub! Refresh your live site."
