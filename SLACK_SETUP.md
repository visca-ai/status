# Slack Notifications Setup

## Quick Setup Guide

### 1. Create a Slack Webhook

1. Go to your Slack workspace
2. Navigate to: https://api.slack.com/apps
3. Click **"Create New App"** → **"From scratch"**
4. Name it "Status Page Alerts" and select your workspace
5. Click **"Incoming Webhooks"** in the sidebar
6. Toggle **"Activate Incoming Webhooks"** to ON
7. Click **"Add New Webhook to Workspace"**
8. Select the channel where you want alerts (e.g., `#alerts`, `#monitoring`)
9. Click **"Allow"**
10. Copy the **Webhook URL** (looks like: `https://hooks.slack.com/services/...`)

### 2. Add to GitHub Secrets

1. Go to your GitHub repository: https://github.com/visca-ai/status
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Paste your webhook URL from step 1
6. Click **"Add secret"**

### 3. That's it! 🎉

The workflow will now automatically send Slack notifications when:
- Any service check fails
- Health check detects issues

### Notification Format

You'll receive rich notifications with:
- 🚨 Alert header
- Link to status page
- Recent failure details
- Timestamp

### Test the Setup

Trigger a manual workflow run:
1. Go to **Actions** tab in GitHub
2. Select **"Scheduled Health Check"**
3. Click **"Run workflow"**

### Disable Notifications

To disable: Delete the `SLACK_WEBHOOK_URL` secret from GitHub repository settings.

---

**Note:** The workflow only sends notifications when failures are detected, not for successful checks.
