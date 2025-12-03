# Status Page Logic & Triggers

## Status Definitions

### 🟢 Operational (Green)
**When triggered:**
- All health checks in a day returned HTTP codes: `200`, `202`, `301`, `302`, or `307`
- Every single check that day was successful
- Service responding normally

**Example:** All 12 checks today returned `200 OK`

---

### 🟡 Degraded (Yellow/Amber)
**When triggered:**
- Mix of successful and failed checks on the same day
- At least one check succeeded AND at least one check failed
- Indicates intermittent issues or partial outage

**Example:** 
- Morning checks: `200 OK` ✅
- Afternoon check: `500 Error` ❌
- Evening checks: `200 OK` ✅
→ Day status = **Degraded**

---

### 🔴 Outage (Red)
**When triggered:**
- All health checks in a day failed
- Every single check returned a non-success HTTP code
- Service completely unavailable for the entire day

**Example:** All 12 checks today returned `503 Service Unavailable`

---

### ⚪ No Data (Gray)
**When triggered:**
- No health check logs exist for that day
- Service was added after that date
- Monitoring was not yet enabled
- Placeholder for days without monitoring data

**Example:** Service added on Dec 1, but viewing Nov 30 data

---

## HTTP Status Codes

### Considered Success ✅
- `200` - OK
- `202` - Accepted
- `301` - Moved Permanently (redirect)
- `302` - Found (redirect)
- `307` - Temporary Redirect

### Considered Failure ❌
- Any other HTTP code (4xx, 5xx, timeouts, etc.)
- Examples: `400`, `401`, `403`, `404`, `500`, `502`, `503`, `504`

---

## Health Check Process

1. **Frequency:** Every 5 minutes (12 checks per hour)
2. **Retry Logic:** Up to 3 attempts per check
   - If 1st attempt fails → wait 5 seconds → try again
   - If 2nd attempt fails → wait 5 seconds → try again
   - If 3rd attempt fails → log as `failed`
3. **Timeout:** Uses curl default timeout
4. **Recording:** Each check result logged to `public/status/{service}_report.log`

---

## Daily Status Calculation

For each day, the system:
1. Groups all checks by date
2. Analyzes the results:
   - **All success** → Operational 🟢
   - **All failed** → Outage 🔴
   - **Mixed results** → Degraded 🟡
   - **No logs** → No data ⚪

---

## System Status Banner

The overall system status (top of page) follows these rules:

### All Systems Operational 🟢
- **Every service** shows Operational status
- No degraded or failed services

### Partial Outage 🟡
- **At least one service** is Degraded or in Outage
- **At least one service** is still Operational
- Mixed health across services

### Outage 🔴
- **All services** are in Outage status
- Complete system failure

---

## Uptime Calculation

**Formula:** `(Operational Days / Total Days with Data) × 100`

**Important:**
- Only counts days with actual monitoring data
- Excludes "No data" days from calculation
- Shows accurate uptime percentage based on real checks

**Example:**
- 90 days displayed
- 85 days have data (5 days before monitoring started)
- 84 days operational, 1 day degraded
- **Uptime: 98.82%** (84/85 × 100)

---

## Timeline Bars

Each vertical bar represents one day:
- **Green bar:** Operational (all checks passed)
- **Yellow bar:** Degraded (some checks failed)
- **Red bar:** Outage (all checks failed)
- **Gray bar:** No data available

Hover over any bar to see:
- Date
- Status
- "No incidents" or issue description

---

## Monitoring Best Practices

✅ **What triggers alerts:**
- Service returns non-success HTTP codes
- Service unreachable after 3 retries
- All services down simultaneously

✅ **What doesn't trigger alerts:**
- Successful checks (200, 301, 307, etc.)
- Single retry that succeeds
- Temporary redirects

✅ **Slack notifications sent when:**
- Any service logs a "failed" status
- Health check workflow detects failures in logs
- Real-time alerts to configured Slack channel
