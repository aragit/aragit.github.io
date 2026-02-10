#!/usr/bin/env python3
import re

with open("index.html", "r") as f:
    content = f.read()

# Replace entire article cards section with updated version
old_section = r'<div class="article-cards-grid">.*?</div>\s*</div>\s*</section>\s*<!-- PORTFOLIO -->'

new_section = '''<div class="article-cards-grid">
          
          <!-- Card 1: Planning Rubicon -->
          <a href="https://medium.com/@anicomanesh/the-planning-rubicon-why-the-vast-majority-of-ai-agents-are-just-expensive-chatbots-part-i-fa0409a10d8e" 
             target="_blank" rel="noopener noreferrer" class="article-card">
            <div class="article-image">
              <img src="x3.jpg" alt="The Planning Rubicon">
            </div>
            <div class="article-card-content">
              <h4 class="article-title">The Planning Rubicon</h4>
              <p class="article-summary">Why most "AI agents" are just expensive chatbots that react but never truly plan or execute.</p>
              <div class="article-meta">
                <span class="article-tag">Architecture</span>
                <span class="article-read">7 min →</span>
              </div>
            </div>
          </a>
          
          <!-- Card 2: 2026 Roadmap -->
          <a href="https://medium.com/@anicomanesh/from-generative-to-agentic-ai-a-roadmap-in-2026-8e553b43aeda" 
             target="_blank" rel="noopener noreferrer" class="article-card">
            <div class="article-image">
              <img src="alpha.jpg" alt="2026 Roadmap">
            </div>
            <div class="article-card-content">
              <h4 class="article-title">From generative to agentic AI</h4>
              <p class="article-summary">The 2026 roadmap: why the future of AI isn't better brains, it's better bodies.</p>
              <div class="article-meta">
                <span class="article-tag">Strategy</span>
                <span class="article-read">12 min →</span>
              </div>
            </div>
          </a>
          
          <!-- Card 3: Reasoning Revolution -->
          <a href="https://medium.com/@anicomanesh/how-llm-reasoning-powers-the-agentic-ai-revolution-cbefd10ebf3f" 
             target="_blank" rel="noopener noreferrer" class="article-card">
            <div class="article-image">
              <img src="reason.png" alt="Reasoning Revolution">
            </div>
            <div class="article-card-content">
              <h4 class="article-title">How LLM reasoning powers agency</h4>
              <p class="article-summary">How advanced LLMs enable true agentic behavior through reasoning and planning.</p>
              <div class="article-meta">
                <span class="article-tag">Technology</span>
                <span class="article-read">9 min →</span>
              </div>
            </div>
          </a>
          
        </div>
      </div>
      
    </section>
    <!-- PORTFOLIO -->'''

content = re.sub(old_section, new_section, content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)

print("✓ Article cards updated: removed numbers, smaller text, shorter descriptions")
