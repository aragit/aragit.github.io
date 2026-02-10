#!/usr/bin/env python3
import re

with open("index.html", "r") as f:
    content = f.read()

# Find the insight-card-combined closing and add article cards before section close
old_pattern = r'(</div>\s*</div>\s*</section>\s*<!-- PORTFOLIO -->)'

new_html = r'''      </div>
      
      <!-- Article Cards - Deep Dive -->
      <div class="insight-articles">
        <h3 class="insight-articles-title">Deep Dive: The Agentic Architecture Philosophy</h3>
        
        <div class="article-cards-grid">
          
          <!-- Card 1: Planning Rubicon -->
          <a href="https://medium.com/@anicomanesh/the-planning-rubicon-why-the-vast-majority-of-ai-agents-are-just-expensive-chatbots-part-i-fa0409a10d8e" 
             target="_blank" rel="noopener noreferrer" class="article-card">
            <div class="article-card-header">
              <span class="article-icon">🎯</span>
              <span class="article-number">01</span>
            </div>
            <h4 class="article-title">The Planning Rubicon</h4>
            <p class="article-summary">Why the vast majority of "AI agents" are just expensive chatbots. Most systems react but never truly plan, execute, or persist state across time.</p>
            <div class="article-meta">
              <span class="article-tag">Architecture</span>
              <span class="article-read">7 min read →</span>
            </div>
          </a>
          
          <!-- Card 2: 2026 Roadmap -->
          <a href="https://medium.com/@anicomanesh/from-generative-to-agentic-ai-a-roadmap-in-2026-8e553b43aeda" 
             target="_blank" rel="noopener noreferrer" class="article-card">
            <div class="article-card-header">
              <span class="article-icon">🗺️</span>
              <span class="article-number">02</span>
            </div>
            <h4 class="article-title">From Generative to Agentic AI</h4>
            <p class="article-summary">A roadmap for 2026. The shift from "Chat" to "Work" — why the future of AI isn't about better brains, it's about better bodies.</p>
            <div class="article-meta">
              <span class="article-tag">Strategy</span>
              <span class="article-read">12 min read →</span>
            </div>
          </a>
          
          <!-- Card 3: Reasoning Revolution -->
          <a href="https://medium.com/@anicomanesh/how-llm-reasoning-powers-the-agentic-ai-revolution-cbefd10ebf3f" 
             target="_blank" rel="noopener noreferrer" class="article-card">
            <div class="article-card-header">
              <span class="article-icon">🧠</span>
              <span class="article-number">03</span>
            </div>
            <h4 class="article-title">How LLM Reasoning Powers Agency</h4>
            <p class="article-summary">The reasoning revolution: how advanced LLMs enable true agentic behavior through goal decomposition, tool selection, and adaptive planning.</p>
            <div class="article-meta">
              <span class="article-tag">Technology</span>
              <span class="article-read">9 min read →</span>
            </div>
          </a>
          
        </div>
      </div>
      
    </section>
    <!-- PORTFOLIO -->'''

content = re.sub(old_pattern, new_html, content, flags=re.DOTALL)

with open("index.html", "w") as f:
    f.write(content)

print("✓ Three article cards added to insight section")
