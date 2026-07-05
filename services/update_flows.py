import re

with open('services/agentic-ai.html', 'r') as f:
    html = f.read()

# 1. Healthcare: Multi-Agent DAG Orchestration
html = re.sub(
    r'<div class="guardrail-box">[\s\S]*?Escalated to Dr. Smith.\s*</div>',
    '''<div class="guardrail-box">
          <strong><i class="fa-solid fa-code-branch"></i> Multi-Agent DAG Orchestration</strong>
          <p style="margin-bottom:0; font-size:0.95rem; color:#a8aeb3;"><em>Consensus-Driven Routing:</em> Instead of a single LLM hallucinating a diagnosis, the system spawns a Directed Acyclic Graph (DAG) of specialized sub-agents. They independently query EHRs, analyze imaging, and cross-reference research. A strict Policy-as-Code gate intercepts any action that violates HIPAA.</p>
        </div>
      </div>
      <div class="card" style="padding:40px; text-align:center; background:rgba(20,20,20,0.8); border-color:rgba(255,107,0,0.3);">
        <i class="fa-solid fa-hospital-user" style="font-size:4rem; color:var(--gray); margin-bottom:20px;"></i>
        <h4 style="color:#fff; margin-bottom:10px;">DAG Consensus Orchestration</h4>
        <div style="text-align:left; background:#000; padding:15px; border-radius:8px; font-family:monospace; font-size:0.85rem; color:#00ff00; line-height:1.5;">
          > [Orchestrator] Initializing Clinical Evaluation DAG...<br>
          > [Spawn] Vision_Agent (Gemini 1.5) -> Analyzing X-Ray Scans...<br>
          > [Spawn] History_Agent (Claude 3.5) -> Querying EHR database...<br>
          > [Spawn] Research_Agent (DeepSeek R1) -> Cross-referencing PubMed...<br>
          > [Merge] Consensus Reached: 94% probability of anomaly C4.<br>
          > [Gateway] Evaluating Policy Request: /med/prescribe/auth<br>
          > [BLOCKED] Policy-as-Code: 'Autonomous prescription denied (Rule 4).'<br>
          > [Fallback] Escalate to Dr. Smith via secure gRPC stream.<br>
          > [Status] Awaiting cryptographic human-in-the-loop sign-off.
        </div>''',
    html
)

# 2. Manufacturing: Durable Execution & POMDP
html = re.sub(
    r'<div class="guardrail-box">[\s\S]*?Circuit_Breaker_Triggered: Halting ReAct loop.\s*</div>',
    '''<div class="guardrail-box">
          <strong><i class="fa-solid fa-server"></i> Durable Execution & Stateful POMDP</strong>
          <p style="margin-bottom:0; font-size:0.95rem; color:#a8aeb3;"><em>Crash-Resistant Autonomy:</em> Supply chain reroutes take days. We utilize durable execution frameworks (like Temporal) to track the agent's POMDP state. If a server crashes or an API rate-limits, the agent simply sleeps, wakes up, and resumes exactly where it left off.</p>
        </div>
      </div>
      <div class="card" style="padding:40px; text-align:center; background:rgba(20,20,20,0.8); border-color:rgba(255,107,0,0.3);">
        <i class="fa-solid fa-truck-fast" style="font-size:4rem; color:var(--gray); margin-bottom:20px;"></i>
        <h4 style="color:#fff; margin-bottom:10px;">Durable Execution Recovery</h4>
        <div style="text-align:left; background:#000; padding:15px; border-radius:8px; font-family:monospace; font-size:0.85rem; color:#00ff00; line-height:1.5;">
          > [Durable_Worker] Execution ID: #Mfg-77A initiated.<br>
          > [IIoT_Stream] Kafka event: Machine_7 vibration critical.<br>
          > [Planner] Drafting 48-hour reroute logistics...<br>
          > [Action] Dispatching queries to 12 alternative Tier-2 suppliers.<br>
          > [State] Suspending agent. Awaiting external API responses...<br>
          > [System_Alert] Node crash detected! Process terminated.<br>
          > [Durable_Worker] Node recovered. Restoring exact POMDP state...<br>
          > [Planner] Resuming from step 4. 9 supplier quotes received.<br>
          > [Action] Executing optimal reroute. Issuing ERP update.
        </div>''',
    html
)

# 3. FinOps: MCP Grounding & Tools
html = re.sub(
    r'<div class="guardrail-box">[\s\S]*?Awaiting human dual-key authorization.\s*</div>',
    '''<div class="guardrail-box">
          <strong><i class="fa-solid fa-database"></i> Deterministic Tooling & MCP Grounding</strong>
          <p style="margin-bottom:0; font-size:0.95rem; color:#a8aeb3;"><em>Zero-Hallucination Math:</em> LLMs are probabilistic text predictors, not calculators. Our FinOps swarms isolate reasoning from execution using the Model Context Protocol (MCP). Agents retrieve context via PGVector, but delegate ledger mathematics to strict deterministic sandbox tools.</p>
        </div>
      </div>
      <div class="card" style="padding:40px; text-align:center; background:rgba(20,20,20,0.8); border-color:rgba(255,107,0,0.3);">
        <i class="fa-solid fa-money-bill-transfer" style="font-size:4rem; color:var(--gray); margin-bottom:20px;"></i>
        <h4 style="color:#fff; margin-bottom:10px;">Tool-Augmented Reconciliation</h4>
        <div style="text-align:left; background:#000; padding:15px; border-radius:8px; font-family:monospace; font-size:0.85rem; color:#00ff00; line-height:1.5;">
          > [Trigger] End-of-month ledger reconciliation initiated.<br>
          > [Memory] Querying PGVector: "Find Stripe dispute matches for #884"<br>
          > [Context] K=5 historical transactions loaded to working memory.<br>
          > [Reasoning] LLM identifies discrepancy between ERP and Stripe API.<br>
          > [Tool_Invoke] Sending context to MCP: &lt;DuckDB_Ledger_Math&gt;<br>
          > [Tool_Output] Variance calculated deterministically: $12,450.00.<br>
          > [Planner] Drafting Journal Entry Adjustment...<br>
          > [Gate] Transaction > $10k threshold. Auto-commit disabled.<br>
          > [Auth] Awaiting dual-key cryptographic signing by CFO.
        </div>''',
    html
)

with open('services/agentic-ai.html', 'w') as f:
    f.write(html)
