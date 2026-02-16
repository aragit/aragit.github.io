#!/bin/bash

# Ensure we're in the right directory
cd ~/portfolio || exit 1

# 1. Back up current state
BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
cp index.html "index.html.backup.${BACKUP_TIME}"
echo "✓ Backup created"

# 2. Rescue CSS and Inject Final UI
python3 << 'PYEOF'
import re
import time

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

ts = str(int(time.time()))

# --- FIX 1: RESCUE THE WHITE SCREEN (Fix broken CSS/JS links) ---
html = re.sub(r'href="[^"]*style\.css[^"]*"', f'href="style.css?v={ts}"', html)
html = re.sub(r'src="[^"]*script\.js[^"]*"', f'src="script.js?v={ts}"', html)

# --- FIX 2: INJECT THE FLAWLESS UI COMPONENT ---
pattern = r'(<h2 class="section-title">\s*Agentic Solutions\s*</h2>).*?(<div class="bento-grid">)'

final_component = r'''\1
      <p class="section-subtitle" style="font-style: normal;">Real problems, strict constraints. Engineering autonomous systems built to survive and scale in production.</p>
      
      <style>
        .domain-bento-container { max-width: 850px; margin: 32px auto 48px auto; width: 100%; position: relative; z-index: 50; }
        
        .domain-instruction { text-align: center; font-size: 0.9rem; color: var(--muted); margin-bottom: 18px; font-weight: 400; }
        .domain-instruction i { color: var(--accent); margin-right: 8px; opacity: 0.9; }

        .domain-tabs { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .domain-btn { 
          display: flex; align-items: center; justify-content: center; gap: 8px; 
          flex: 1 1 28%; min-width: 160px; background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); 
          border-radius: 6px; padding: 10px 14px; color: var(--text); font-size: 0.85rem; font-weight: 500; 
          cursor: pointer; transition: all 0.3s ease; text-align: center; 
        }
        
        .domain-btn::after { content: '+'; font-size: 1.3rem; font-weight: 300; line-height: 1; transition: transform 0.3s ease, color 0.3s ease; }
        .domain-btn:hover { border-color: var(--accent); background: rgba(255, 107, 0, 0.08); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255, 107, 0, 0.15); }
        .domain-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(255, 107, 0, 0.12); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255, 107, 0, 0.15); }
        .domain-btn.active::after { transform: rotate(45deg); color: var(--accent); }
        
        .bento-drawer { 
          max-height: 0; overflow: hidden; opacity: 0; margin-top: 0; border-radius: 8px;
          background: rgba(22, 22, 22, 0.45); 
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin 0.3s ease; 
        }
        .bento-drawer.open { max-height: 800px; opacity: 1; margin-top: 16px; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        
        .drawer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; padding: 20px; }
        .use-case-item { display: flex; align-items: flex-start; gap: 8px; font-size: 0.85rem; color: var(--muted); line-height: 1.4; }
        .use-case-item::before { content: "▹"; color: var(--accent); font-size: 1rem; line-height: 1; }
        .use-case-item strong { color: var(--text); display: block; margin-bottom: 2px; font-size: 0.9rem; }
      </style>

      <div class="domain-bento-container">
        <div class="domain-instruction"><i class="fas fa-hand-pointer"></i>Hover or click an industry to explore agentic workflows</div>
        <div class="domain-tabs" id="domainTabs">
          <button class="domain-btn" data-domain="healthcare">Healthcare & Life Sciences</button>
          <button class="domain-btn" data-domain="manufacturing">Manufacturing & Industrial</button>
          <button class="domain-btn" data-domain="ecommerce">E-Commerce & Marketing</button>
          <button class="domain-btn" data-domain="supplychain">Supply Chain</button>
          <button class="domain-btn" data-domain="finance">Financial Services</button>
        </div>
        <div class="bento-drawer" id="bentoDrawer">
          <div class="drawer-content" id="drawerContent"></div>
        </div>
      </div>

      <script>
      document.addEventListener('DOMContentLoaded', () => {
        const domainData = {
          healthcare: [
            { title: "Autonomous Clinical Triage", desc: "Monitors vitals/EHR streams and autonomously escalates priority patients." },
            { title: "Ambient Clinical Documentation", desc: "Agents listen to visits, draft structured notes, and code for billing." },
            { title: "Automated Prior Authorization", desc: "Gathers medical necessity evidence and negotiates with payer portals." },
            { title: "Hypothesis-Driven Drug Repurposing", desc: "Multi-agent swarms cross-reference PubMed and run molecular simulations." },
            { title: "Dynamic Supply Management", desc: "Autonomously reorders critical medical supplies based on predictive ward census." },
            { title: "Precision Patient Management", desc: "Agents act as digital health coaches, adjusting care plans via telemetry." },
            { title: "Clinical Trial Optimization", desc: "Autonomously drafts regulatory protocols and flags adverse events in real-time." }
          ],
          manufacturing: [
            { title: "Dynamic Production Rescheduling", desc: "Autonomously rebalances factory lines during material delays or machine failures." },
            { title: "Robotic Cell Orchestration", desc: "Machines negotiate workloads with each other to optimize factory throughput." },
            { title: "Predictive Maintenance Dispatch", desc: "Agents detect anomalies, halt lines, and autonomously dispatch repair crews." },
            { title: "Real-Time Quality Control", desc: "Isolates defective batches and triggers root-cause analysis workflows." },
            { title: "Generative Digital Twins", desc: "Runs thousands of autonomous counterfactual simulations to optimize layouts." },
            { title: "Energy Consumption Optimization", desc: "Agents dynamically adjust heavy machinery usage to avoid peak energy pricing." },
            { title: "Autonomous Vendor Onboarding", desc: "Verifies compliance, safety records, and financial health of new suppliers." }
          ],
          ecommerce: [
            { title: "Continuous ROI Optimization", desc: "Reinforcement learning agents dynamically reallocate ad budgets across platforms." },
            { title: "Agent-to-Agent (A2A) Commerce", desc: "Brand agents negotiate pricing directly with consumer AI assistants." },
            { title: "Autonomous Hyper-Personalization", desc: "Adjusts site UI, pricing, and product bundles in real-time per user." },
            { title: "Generative Engine Optimization", desc: "Agents structure and feed brand data to global LLM crawlers." },
            { title: "Predictive Inventory Alignment", desc: "Autonomously drafts purchase orders based on viral social media sentiment." },
            { title: "Level 3 Support Agents", desc: "Capable of issuing refunds, rerouting packages, and updating accounts." },
            { title: "Dynamic Pricing Agents", desc: "Adjusts SKU pricing based on competitor stock and demand elasticity." }
          ],
          supplychain: [
            { title: "Autonomous Route Optimization", desc: "Reroutes active freight in real-time based on weather, port telemetry, or traffic." },
            { title: "Intelligent Supplier Risk Mitigation", desc: "Drafts alternative procurement contracts if a primary vendor flags risk." },
            { title: "Multi-Tier Inventory Rebalancing", desc: "Negotiates stock transfers between regional warehouses without human input." },
            { title: "Automated Customs Clearance", desc: "Generates, validates, and submits cross-border compliance documentation." },
            { title: "Freight Bidding & Procurement", desc: "Agents bid on spot-market freight rates within pre-approved financial bounds." },
            { title: "Warehouse Robotics Orchestration", desc: "AI supervisors dynamically assign tasks to Automated Guided Vehicles." },
            { title: "Climate Event Execution", desc: "Automatically executes contingency plans when weather events form." }
          ],
          finance: [
            { title: "Autonomous KYC/AML Resolution", desc: "Scrapes global registries to map beneficial owners and freeze flagged accounts." },
            { title: "Dynamic Credit Decisioning", desc: "Evaluates streaming cash flow to autonomously approve or adjust credit limits." },
            { title: "Algorithmic Portfolio Rebalancing", desc: "Multi-agent systems execute trades based on real-time geopolitical sentiment." },
            { title: "Real-Time Fraud Interception", desc: "Millisecond-decisioning agents that halt transactions and initiate verification." },
            { title: "Automated Claims Adjudication", desc: "Cross-references incident reports with policy clauses to approve payouts." },
            { title: "Regulatory Compliance Auditing", desc: "Continuously monitors internal communications to flag insider trading risks." },
            { title: "Smart Contract Orchestration", desc: "Triggers multi-party financial settlements when external conditions are met." }
          ]
        };

        const btns = document.querySelectorAll('.domain-btn');
        const drawer = document.getElementById('bentoDrawer');
        const content = document.getElementById('drawerContent');

        if (btns.length > 0 && drawer && content) {
          const triggerOpen = function(e) {
            e.preventDefault();
            const domain = this.getAttribute('data-domain');
            const isActive = this.classList.contains('active');
            
            if (isActive && e.type === 'click') {
                this.classList.remove('active');
                drawer.classList.remove('open');
                return;
            }

            btns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            let htmlStr = '';
            domainData[domain].forEach(item => {
              htmlStr += '<div class="use-case-item"><div><strong>' + item.title + '</strong>' + item.desc + '</div></div>';
            });
            content.innerHTML = htmlStr;
            drawer.classList.add('open');
          };

          btns.forEach(btn => {
            btn.addEventListener('click', triggerOpen);
            btn.addEventListener('mouseenter', triggerOpen);
          });
          
          setTimeout(() => {
            btns[0].classList.add('active');
            let initialHtml = '';
            domainData['healthcare'].forEach(item => {
              initialHtml += '<div class="use-case-item"><div><strong>' + item.title + '</strong>' + item.desc + '</div></div>';
            });
            content.innerHTML = initialHtml;
            drawer.classList.add('open');
          }, 300);
        }
      });
      </script>
      \2'''

new_html, count = re.subn(pattern, final_component, html, flags=re.DOTALL | re.IGNORECASE)

if count > 0:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("✓ Successfully rescued the CSS styling and injected the polished Bento Drawer.")
else:
    print("⚠ Could not find the section to update. Please verify index.html structure.")
PYEOF

# 3. Git push
git add index.html
git commit -m "Emergency Fix: Rescue CSS styling and finalize Bento Drawer UX"
git push origin main
echo "✓ Changes pushed to GitHub! Refresh your live site now."
