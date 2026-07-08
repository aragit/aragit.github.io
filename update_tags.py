import sys

with open('index.html', 'r') as f:
    html = f.read()

new_tags = [
    "Anthropic Claude", "Celery", "DeepSeek", "Docker", "DuckDB", "FastAPI",
    "Google Gemini", "gRPC", "Kafka", "Kubernetes", "Model Context Protocol (MCP)",
    "Neo4j", "Nvidia Triton Inference Server", "Okta", "Open Policy Agent (OPA)",
    "OpenAI", "OpenTelemetry", "PGVector", "PostgreSQL", "Prometheus", "Pulumi",
    "Pydantic", "Python", "PyTorch", "Ray", "Redis", "Rego", "Rust",
    "S3 (MinIO / AWS)", "Server-Sent Events (SSE)", "Temporal", "TensorRT-LLM",
    "TypeScript", "Unsloth", "vLLM"
]

# Generate beautiful dark-mode text badges for the tools
tags_html = "\n".join([
    f'          <span class="tech-badge" style="display:inline-block; padding:8px 16px; margin:4px; background:#161616; border:1px solid #333; border-radius:6px; font-size:14px; color:#eaf2fb; white-space:nowrap;">{tag}</span>'
    for tag in new_tags
])

# Use raw string finding (No Regex!) to find the exact start and end points
start_marker = "149 logo items"
end_marker = 'title="Vespa">'

start_idx = html.find(start_marker)
end_idx = html.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    # Back up the start index to remove the whole HTML comment
    actual_start = html.rfind("\n" + tags_html + "\n" + html[actual_end:]
    
    with open('index.html', 'w') as f:
        f.write(new_html)
    print("✓ Success! Replaced 149 logos with 35 BAIA-aligned text badges.")
else:
    print("✗ ERROR: Could not find the '149 logo items' or 'Vespa' markers.")
    sys.exit(1)
