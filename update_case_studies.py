import re

# Read current HTML
with open('index.html', 'r') as f:
    html = f.read()

# New case studies section
new_portfolio = '''<!-- CASE STUDIES - NEW AGENTIC DESIGN -->
<section id="portfolio" class="section" aria-labelledby="portfolio-title">
  <div class="container">
    <h2 id="portfolio-title" class="section-title">Case Studies</h2>
    <p class="section-subtitle">Systems in the Real World. Real Problems. Real Constraints. How Ideas Survive Production.</p>

    <div class="cs-grid">
      
      <!-- Card A: CBT Autonomous Agent -->
      <article class="cs-card cs-card--clinical" role="article" aria-labelledby="cs-cbt-title">
        <div class="cs-card-body">
          <div class="cs-card-header">
            <div class="cs-icon" aria-hidden="true">🧠</div>
            <h3 id="cs-cbt-title">CBT Autonomous Agent</h3>
            <div class="cs-tags"><span>Multi-agent</span><span>RAG</span><span>Human-in-loop</span></div>
          </div>

          <p class="cs-oneline">Scalable, evidence-guided CBT workflows that adapt to patient responses.</p>

          <ul class="cs-loop" aria-label="Agentic loop">
            <li><strong>Observe</strong><span>Session transcripts, homework, mood logs</span></li>
            <li><strong>Reason</strong><span>Detect cognitive distortions & patterns</span></li>
            <li><strong>Plan</strong><span>Personalized Socratic prompts & homework</span></li>
            <li><strong>Act</strong><span>Deliver interventions & reminders</span></li>
            <li><strong>Adapt</strong><span>Update policy from engagement signals</span></li>
          </ul>

          <p class="cs-impact"><strong>Impact:</strong> Scales therapy support with traceable reasoning and clinician oversight.</p>

          <div class="cs-cta-row">
            <a class="btn btn-primary" href="case-studies/cbt-agent">View Case Study</a>
            <a class="btn btn-ghost" href="case-studies/cbt-agent#details" aria-label="Details for CBT Autonomous Agent">Details</a>
          </div>

          <p class="cs-note">Research/augmentation tool — not a replacement for licensed clinicians.</p>
        </div>
      </article>

      <!-- Card B: Emotion-Focused Therapy Multi-Agent System -->
      <article class="cs-card cs-card--clinical" role="article" aria-labelledby="cs-emotion-title">
        <div class="cs-card-body">
          <div class="cs-card-header">
            <div class="cs-icon" aria-hidden="true">💙</div>
            <h3 id="cs-emotion-title">Emotion-Focused Therapy Multi-Agent</h3>
            <div class="cs-tags"><span>Multi-agent</span><span>Explainable</span><span>Session-memory</span></div>
          </div>

          <p class="cs-oneline">Support deep emotional processing through multi-agent empathy and somatic guidance.</p>

          <ul class="cs-loop" aria-label="Agentic loop">
            <li><strong>Observe</strong><span>Session signals, sentiment trends, physiological proxies</span></li>
            <li><strong>Reason</strong><span>Map emotions to schemas and attachment patterns</span></li>
            <li><strong>Plan</strong><span>Sequence interventions: grounding → exploration → integration</span></li>
            <li><strong>Act</strong><span>Deliver guided exercises, journaling prompts, somatic tasks</span></li>
            <li><strong>Adapt</strong><span>Refine interventions based on emotional shift metrics</span></li>
          </ul>

          <p class="cs-impact"><strong>Impact:</strong> Supports clinicians by structuring emotion work and tracking progress.</p>

          <div class="cs-cta-row">
            <a class="btn btn-primary" href="case-studies/emotion-agent">View Case Study</a>
            <a class="btn btn-ghost" href="case-studies/emotion-agent#details" aria-label="Details for Emotion-Focused Therapy Agent">Details</a>
          </div>

          <p class="cs-note">Designed for clinician-augmented workflows; not for emergency or crisis situations.</p>
        </div>
      </article>

      <!-- Card C: Medical Triage Agent (FLAGSHIP) -->
      <article class="cs-card cs-card--clinical cs-card--flagship" role="article" aria-labelledby="cs-triage-title">
        <div class="cs-card-body">
          <div class="cs-card-header">
            <div class="cs-icon" aria-hidden="true">🏥</div>
            <h3 id="cs-triage-title">Medical Triage Agent</h3>
            <div class="cs-tags"><span>EHR-native</span><span>RAG</span><span>Policy-gated</span></div>
          </div>

          <p class="cs-oneline">EHR-integrated triage that reasons like a clinician and prioritizes care safely.</p>

          <ul class="cs-loop" aria-label="Agentic loop">
            <li><strong>Observe</strong><span>Intake notes, vitals, meds, comorbidities</span></li>
            <li><strong>Reason</strong><span>Risk stratification + differential hypotheses</span></li>
            <li><strong>Plan</strong><span>Recommend next steps: labs, imaging, escalation</span></li>
            <li><strong>Act</strong><span>Create tasks/alerts and populate triage notes</span></li>
            <li><strong>Adapt</strong><span>Learn from outcomes to reduce false alarms</span></li>
          </ul>

          <p class="cs-impact"><strong>Impact:</strong> Faster, consistent triage with audit trails and governance.</p>

          <div class="cs-cta-row">
            <a class="btn btn-primary" href="case-studies/medical-triage/medical-triage.html">View Case Study</a>
            <a class="btn btn-ghost" href="case-studies/medical-triage/medical-triage.html#details" aria-label="Details for Medical Triage Agent">Details</a>
          </div>

          <p class="cs-note">Clinical decision support — requires provider validation.</p>
        </div>
      </article>

      <!-- Card D: Biomedical Hypothesis Agent -->
      <article class="cs-card cs-card--biomedical" role="article" aria-labelledby="cs-bio-title">
        <div class="cs-card-body">
          <div class="cs-card-header">
            <div class="cs-icon" aria-hidden="true">🧬</div>
            <h3 id="cs-bio-title">Biomedical Hypothesis Agent</h3>
            <div class="cs-tags"><span>RAG</span><span>Biomedical KB</span><span>Explainability</span></div>
          </div>

          <p class="cs-oneline">Hypothesis-driven retrieval and reasoning over biomedical literature for repurposing leads.</p>

          <ul class="cs-loop" aria-label="Agentic loop">
            <li><strong>Observe</strong><span>PubMed, DrugBank, clinical trial data, RWD embeddings</span></li>
            <li><strong>Reason</strong><span>Mechanism-of-action synthesis and plausibility scoring</span></li>
            <li><strong>Plan</strong><span>Generate prioritized hypotheses and experimental designs</span></li>
            <li><strong>Act</strong><span>Produce audit-trailed hypotheses and evidence packs</span></li>
            <li><strong>Adapt</strong><span>Update ranking from experimental feedback</span></li>
          </ul>

          <p class="cs-impact"><strong>Impact:</strong> Accelerates idea generation with explainable evidence trails.</p>

          <div class="cs-cta-row">
            <a class="btn btn-primary" href="case-studies/drug-repurposing/index.html">View Case Study</a>
            <a class="btn btn-ghost" href="case-studies/drug-repurposing/index.html#details" aria-label="Details for Biomedical Hypothesis Agent">Details</a>
          </div>

          <p class="cs-note">Hypothesis generation only — not medical advice. Experimental validation required.</p>
        </div>
      </article>

      <!-- Card E: Marketing Optimization Agent -->
      <article class="cs-card cs-card--business" role="article" aria-labelledby="cs-marketing-title">
        <div class="cs-card-body">
          <div class="cs-card-header">
            <div class="cs-icon" aria-hidden="true">📊</div>
            <h3 id="cs-marketing-title">Marketing Optimization Agent</h3>
            <div class="cs-tags"><span>Streaming</span><span>Multi-armed bandits</span><span>Safe-policy</span></div>
          </div>

          <p class="cs-oneline">Continuously reallocates spend to optimize ROI across channels.</p>

          <ul class="cs-loop" aria-label="Agentic loop">
            <li><strong>Observe</strong><span>Real-time campaign metrics and conversion signals</span></li>
            <li><strong>Reason</strong><span>Attribution, uplift estimation, budget elasticity</span></li>
            <li><strong>Plan</strong><span>Propose allocation adjustments and A/B tests</span></li>
            <li><strong>Act</strong><span>Execute low-risk budget shifts with guardrails</span></li>
            <li><strong>Adapt</strong><span>Learn from outcomes to improve allocation policy</span></li>
          </ul>

          <p class="cs-impact"><strong>Impact:</strong> Reduces wasted ad spend and increases campaign ROI via closed-loop optimization.</p>

          <div class="cs-cta-row">
            <a class="btn btn-primary" href="case-studies/marketing-agent">View Case Study</a>
            <a class="btn btn-ghost" href="case-studies/marketing-agent#details" aria-label="Details for Marketing Optimization Agent">Details</a>
          </div>

          <p class="cs-note">Requires baseline performance data for effective optimization.</p>
        </div>
      </article>

      <!-- Card F: Supply Chain Orchestration Agents -->
      <article class="cs-card cs-card--business" role="article" aria-labelledby="cs-supply-title">
        <div class="cs-card-body">
          <div class="cs-card-header">
            <div class="cs-icon" aria-hidden="true">🚚</div>
            <h3 id="cs-supply-title">Supply Chain Orchestration Agents</h3>
            <div class="cs-tags"><span>Event-driven</span><span>Simulation</span><span>SLA-aware</span></div>
          </div>

          <p class="cs-oneline">Autonomously reroute and reprioritize logistics to minimize disruption and cost.</p>

          <ul class="cs-loop" aria-label="Agentic loop">
            <li><strong>Observe</strong><span>Inventory, shipment telemetry, supplier KPIs, weather/events</span></li>
            <li><strong>Reason</strong><span>Disruption analysis and cost vs. service trade-offs</span></li>
            <li><strong>Plan</strong><span>Rebalance stock, reroute shipments, update priorities</span></li>
            <li><strong>Act</strong><span>Trigger carrier changes, create work orders, notify stakeholders</span></li>
            <li><strong>Adapt</strong><span>Recalibrate supplier weights and contingency heuristics</span></li>
          </ul>

          <p class="cs-impact"><strong>Impact:</strong> Improves fill-rate and reduces expedited shipping costs.</p>

          <div class="cs-cta-row">
            <a class="btn btn-primary" href="case-studies/supply-chain-agent">View Case Study</a>
            <a class="btn btn-ghost" href="case-studies/supply-chain-agent#details" aria-label="Details for Supply Chain Orchestration Agents">Details</a>
          </div>

          <p class="cs-note">Requires integration with existing ERP/WMS systems.</p>
        </div>
      </article>

    </div>
  </div>
</section>'''

# Replace old portfolio section
pattern = r'<section id="portfolio".*?</section>'
html = re.sub(pattern, new_portfolio, html, flags=re.DOTALL)

# Write back
with open('index.html', 'w') as f:
    f.write(html)

print("✓ HTML updated successfully")
