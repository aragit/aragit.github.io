#!/usr/bin/env python3
import re

with open("style.css", "r") as f:
    content = f.read()

# Remove all the conflicting insight-headline rules and add one clean rule
# Find and remove old insight-headline rules
content = re.sub(r'\.insight-headline\s*\{[^}]*\}', '', content)
content = re.sub(r'\.headline-line1\s*\{[^}]*\}', '', content)
content = re.sub(r'\.headline-line2\s*\{[^}]*\}', '', content)

# Add clean consolidated rules at the end
clean_css = '''

/* ===== CLEAN: INSIGHT SECTION SPACING ===== */

/* Headline with proper spacing below */
.insight-headline {
  text-align: center;
  margin-bottom: 30px !important;
  margin-top: 0 !important;
  padding: 0 !important;
}

.headline-line1 {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ff8533;
  margin-bottom: 6px;
  letter-spacing: 0.01em;
  line-height: 1.3;
}

.headline-line2 {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  letter-spacing: 0.01em;
}

/* Card with proper internal spacing */
.insight-card-combined {
  background: rgba(22, 22, 22, 0.98);
  border-radius: 16px;
  padding: 30px 40px !important;
  display: flex;
  gap: 40px;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 1150px;
  margin: 0 auto;
  position: relative;
}

/* Vertical orange lines */
.insight-card-combined::before,
.insight-card-combined::after {
  content: '';
  position: absolute;
  top: 10%;
  bottom: 10%;
  width: 2px;
  background: linear-gradient(180deg, 
    transparent 0%,
    #ff6b00 20%,
    #ff8533 50%,
    #ff6b00 80%,
    transparent 100%
  );
  opacity: 0.6;
}

.insight-card-combined::before {
  left: 15px;
}

.insight-card-combined::after {
  right: 15px;
}

/* Pillars spacing */
.insight-pillars {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 !important;
  padding: 0 !important;
}

.insight-pillar {
  margin: 0 !important;
  padding: 0 !important;
}

.pillar-content {
  margin: 0 !important;
  padding: 0 !important;
}

.pillar-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0 !important;
  padding: 0 !important;
  line-height: 1.3;
}

.pillar-subtitle {
  font-weight: 700;
  color: #ffffff;
  margin-left: 6px;
  opacity: 0.9;
}

.pillar-desc {
  font-size: 0.78rem;
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0 !important;
  padding: 0 !important;
}

/* Image sizing */
.insight-visual {
  flex: 0 0 52%;
  max-width: 550px;
}

.insight-visual img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
}

/* Mobile */
@media (max-width: 900px) {
  .insight-headline {
    margin-bottom: 20px !important;
  }
  
  .headline-line1,
  .headline-line2 {
    font-size: 1.2rem;
  }
  
  .insight-card-combined {
    flex-direction: column;
    padding: 25px 20px !important;
    gap: 25px;
  }
  
  .insight-visual {
    flex: 1;
    max-width: 100%;
    order: -1;
  }
  
  .insight-card-combined::before,
  .insight-card-combined::after {
    display: none;
  }
}
'''

content = content + clean_css

with open("style.css", "w") as f:
    f.write(content)

print("✓ Clean CSS applied with proper spacing")
