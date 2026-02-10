#!/usr/bin/env python3
import re

# Read the current files
with open('index.html', 'r') as f:
    html = f.read()

with open('style.css', 'r') as f:
    css = f.read()

print("Step 1: Removing icons from portfolio cards...")

# Find portfolio section
portfolio_start = html.find('<section id="portfolio"')
portfolio_end = html.find('</section>', portfolio_start)
portfolio_end = html.find('</section>', portfolio_end + 1) + len('</section>')

portfolio_section = html[portfolio_start:portfolio_end]
before_portfolio = html[:portfolio_start]
after_portfolio = html[portfolio_end:]

# Count icons before
icon_count_before = len(re.findall(r'<div class="card-icon">.*?</div>', portfolio_section, re.DOTALL))
print(f"Found {icon_count_before} card-icon divs in portfolio")

# Remove card-icon divs from portfolio section
portfolio_section_clean = re.sub(
    r'<div class="card-icon">.*?</div>',
    '',
    portfolio_section,
    flags=re.DOTALL
)

# Count icons after
icon_count_after = len(re.findall(r'<div class="card-icon">.*?</div>', portfolio_section_clean, re.DOTALL))
print(f"After removal: {icon_count_after} card-icon divs remain")

# Reconstruct HTML
html = before_portfolio + portfolio_section_clean + after_portfolio

print("\nStep 2: Adding CSS to hide icons and restore card styling...")

# CSS to add at the end
css_addition = """
/* ===== FIX: REMOVE ICONS AND RESTORE CARD STYLING ===== */

/* 1. Hide ALL card icons in portfolio section */
#portfolio .card .card-icon,
#portfolio .portfolio-grid .card .card-icon,
#portfolio .big-cards .card .card-icon,
#portfolio .small-cards .card .card-icon,
#portfolio .cards .card-icon {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 2. Restore previous card background styling */
#portfolio .card,
#portfolio .portfolio-grid .card,
#portfolio .big-cards .card,
#portfolio .small-cards .card {
  background: rgba(25, 25, 25, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45) !important;
  transform: none !important;
  transform-style: flat !important;
  perspective: none !important;
}

/* 3. Hover effect - subtle lift */
#portfolio .card:hover,
#portfolio .portfolio-grid .card:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6) !important;
  border-color: rgba(255, 107, 0, 0.3) !important;
}

/* 4. Remove any pseudo-element effects */
#portfolio .card::before,
#portfolio .card::after {
  display: none !important;
  content: none !important;
  background: none !important;
}

/* 5. Card body styling */
#portfolio .card .card-body {
  text-align: center !important;
}

#portfolio .card .card-body h3 {
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  color: #fff !important;
  text-align: center !important;
}

/* 6. Button styling */
#portfolio .card .card-actions .cta-secondary {
  background: #0d0d0d !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #b8b8b8 !important;
}

#portfolio .card .card-actions .cta-secondary:hover {
  border-color: #ff6b00 !important;
  color: #ff6b00 !important;
}
"""

# Add CSS at the end
css = css + css_addition

# Write files
with open('index.html', 'w') as f:
    f.write(html)

with open('style.css', 'w') as f:
    f.write(css)

print("\n✅ SUCCESS!")
print("Changes made:")
print("  1. Removed all card-icon divs from portfolio section")
print("  2. Added CSS to hide any remaining icons")
print("  3. Restored card background: rgba(25, 25, 25, 0.95)")
print("  4. Restored border styling")
print("  5. Restored hover effects")
