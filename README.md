# Visca AI Systems Status 🚀

Real-time status and uptime monitoring for all Visca AI services, powered by GitHub Actions, Issues, and Pages.

Live at: [status.visca.ai](https://status.visca.ai)

## Monitored Services

- **Visca AI Gateway** - api.visca.ai
- **Visca AI API** - backend.visca.ai
- **Visca AI UI** - gateway.visca.ai
- **Visca AI Sandbox** - sandbox.visca.ai
- **Visca AI Docs** - docs.visca.ai

## Configuration

### Services Monitored
Services are configured in `public/urls.cfg`:

```text
Visca AI Gateway=https://api.visca.ai
Visca AI API=https://backend.visca.ai
Visca AI UI=https://gateway.visca.ai
Visca AI Sandbox=https://sandbox.visca.ai
Visca AI Docs=https://docs.visca.ai
```

### Monitoring Interval
Health checks run every 7 minutes via GitHub Actions workflow in `.github/workflows/health-check.yml`:

```yaml
on:
  schedule:
    - cron: "*/7 * * * *"
```

### Repository Configuration
All hooks are configured to use the **visca-ai/status** repository:
- Incidents: `https://api.github.com/repos/visca-ai/status/issues`
- Service logs: `https://raw.githubusercontent.com/visca-ai/status/main/public/status/`

## Incident Management

To report a new incident:
1. Go to the [Issues](https://github.com/visca-ai/status/issues) tab
2. Create a new issue
3. Add the `incident` label
4. The incident will automatically appear on the status page

To resolve an incident, simply close the issue.

## How It Works

- **Hosting**: GitHub Pages (status.visca.ai)
- **Monitoring**: GitHub Actions runs health checks every 7 minutes, recording response status and time
- **Incidents**: GitHub Issues with the `incident` label are automatically displayed on the status page
- **Data Storage**: Health check results are committed to the repository in `public/status/`

## Local Development

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the status page locally.

## Tech Stack

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **GitHub Actions** - Automated monitoring
- **GitHub Pages** - Hosting

---

Built with ❤️ for Visca AI | Based on [Fettle](https://github.com/mehatab/fettle)
