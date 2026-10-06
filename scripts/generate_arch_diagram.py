import os
from PIL import Image, ImageDraw, ImageFont

def draw_architecture_diagram():
    # Setup canvas dimensions
    width, height = 1600, 1000
    img = Image.new('RGB', (width, height), color='#0F172A') # Dark slate theme
    draw = ImageDraw.Draw(img)

    # Fonts
    try:
        font_title = ImageFont.truetype("arial.ttf", 32)
        font_header = ImageFont.truetype("arial.ttf", 20)
        font_body = ImageFont.truetype("arial.ttf", 14)
        font_small = ImageFont.truetype("arial.ttf", 12)
    except:
        font_title = font_header = font_body = font_small = ImageFont.load_default()

    # Draw Header Title
    draw.text((60, 40), "Production-Scale Vacation Rental Marketplace Architecture", fill="#F8FAFC", font=font_title)
    draw.text((60, 85), "High-Availability Distributed Microservices Platform Architecture", fill="#94A3B8", font=font_header)

    # Helper function to draw rounded box
    def draw_box(x1, y1, x2, y2, bg_color, border_color, title, subtitle="", radius=10):
        draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=bg_color, outline=border_color, width=2)
        draw.text((x1 + 16, y1 + 14), title, fill="#FFFFFF", font=font_header)
        if subtitle:
            draw.text((x1 + 16, y1 + 42), subtitle, fill="#CBD5E1", font=font_small)

    # Helper for arrow connection
    def draw_arrow(x1, y1, x2, y2, color="#38BDF8"):
        draw.line([(x1, y1), (x2, y2)], fill=color, width=3)
        # Arrowhead
        dx, dy = x2 - x1, y2 - y1
        if abs(dx) > abs(dy):
            if dx > 0:
                draw.polygon([(x2, y2), (x2 - 10, y2 - 6), (x2 - 10, y2 + 6)], fill=color)
            else:
                draw.polygon([(x2, y2), (x2 + 10, y2 - 6), (x2 + 10, y2 + 6)], fill=color)
        else:
            if dy > 0:
                draw.polygon([(x2, y2), (x2 - 6, y2 - 10), (x2 + 6, y2 - 10)], fill=color)
            else:
                draw.polygon([(x2, y2), (x2 - 6, y2 + 10), (x2 + 6, y2 + 10)], fill=color)

    # Layer 1: Clients & Edge
    draw_box(60, 150, 320, 240, "#1E293B", "#38BDF8", "1. Client Applications", "Web (React/Vite) & Native Mobile Apps")
    draw_box(380, 150, 640, 240, "#1E293B", "#38BDF8", "2. Edge & CDN", "Cloudflare WAF / CloudFront Caching")
    draw_box(700, 150, 960, 240, "#1E293B", "#38BDF8", "3. API Gateway", "Envoy / Kong API Rate Limiting & Auth")

    draw_arrow(320, 195, 380, 195)
    draw_arrow(640, 195, 700, 195)
    draw_arrow(830, 240, 830, 310)

    # Layer 2: Microservices Grid
    draw.text((60, 280), "APPLICATION MICROSERVICES LAYER", fill="#38BDF8", font=font_header)
    
    services = [
        ("Listing Service", "Property Metadata & Media Handler", 60, 310),
        ("Search Service", "Geo-Spatial & Filter Queries", 280, 310),
        ("Booking Service", "Reservations & Transaction Locks", 500, 310),
        ("User/Auth Service", "Identity & OAuth Integration", 720, 310),
        ("Payment Gateway", "Stripe / Adyen Escrow Engine", 940, 310),
        ("Review Service", "Sub-scores & Trust Scores", 1160, 310),
        ("Notification Svc", "SMS / Email & Push Stream", 1380, 310),
    ]

    for title, sub, x, y in services:
        draw_box(x, y, x + 200, y + 120, "#1E293B", "#475569", title, sub)

    # Connections from Gateway to Services
    for title, sub, x, y in services:
        draw_arrow(830, 275, x + 100, y, color="#64748B")

    # Layer 3: Event Bus & Storage
    draw.text((60, 480), "ASYNC EVENT BUS & DATA STORAGE LAYER", fill="#38BDF8", font=font_header)

    draw_box(60, 520, 360, 640, "#1E293B", "#F59E0B", "PostgreSQL Primary/Replica", "ACID Data Store for Listings & Bookings")
    draw_box(400, 520, 700, 640, "#1E293B", "#EF4444", "Redis In-Memory Cache", "Session Cache & Redlock Mutex")
    draw_box(740, 520, 1040, 640, "#1E293B", "#10B981", "Elasticsearch Cluster", "Sub-millisecond Search & Spatial Indexes")
    draw_box(1080, 520, 1380, 640, "#1E293B", "#8B5CF6", "AWS S3 / Media CDN", "Optimized WebP/AVIF Image Pipeline")
    draw_box(1420, 520, 1540, 640, "#1E293B", "#EC4899", "Apache Kafka", "Event Stream")

    # Connect services to DBs
    draw_arrow(160, 430, 160, 520, color="#10B981") # Listing -> Postgres
    draw_arrow(380, 430, 890, 520, color="#10B981") # Search -> Elasticsearch
    draw_arrow(600, 430, 550, 520, color="#EF4444") # Booking -> Redis
    draw_arrow(1040, 430, 210, 520, color="#F59E0B") # Payment -> Postgres

    # Layer 4: Infrastructure, CI/CD & Observability
    draw.text((60, 690), "DEVOPS, CI/CD & OBSERVABILITY INFRASTRUCTURE", fill="#38BDF8", font=font_header)

    draw_box(60, 730, 520, 920, "#0F172A", "#64748B", "Kubernetes (EKS) Auto-Scaling Cluster", "Pod Auto-Scaling, Ingress Controller & Multi-AZ Nodes")
    draw.text((80, 780), "• Dual Multi-Region Active-Active Deployments\n• Automated Helm & ArgoCD Continuous Deployment\n• Blue/Green Zero-Downtime Rollouts", fill="#CBD5E1", font=font_body)

    draw_box(560, 730, 1020, 920, "#0F172A", "#64748B", "Observability Stack", "Distributed Tracing, Metrics & Logs")
    draw.text((580, 780), "• OpenTelemetry Collector Agent\n• Datadog APM & Prometheus Metrics\n• Centralized ELK Log Analytics", fill="#CBD5E1", font=font_body)

    draw_box(1060, 730, 1540, 920, "#0F172A", "#64748B", "Disaster Recovery & Security", "Automated Backups & Compliance")
    draw.text((1080, 780), "• Hourly Automated Point-In-Time PostgreSQL Snapshots\n• TLS 1.3 Encryption At-Rest & In-Transit\n• GDPR & PCI-DSS Compliant Storage Scaffolding", fill="#CBD5E1", font=font_body)

    # Footer note
    draw.text((60, 950), "Airbnb Listing Clone — Production Architecture Specification | docs/architecture.png", fill="#64748B", font=font_small)

    os.makedirs("docs", exist_ok=True)
    img.save("docs/architecture.png")
    print("Successfully generated docs/architecture.png")

if __name__ == "__main__":
    draw_architecture_diagram()
