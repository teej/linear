# Emergency Issue Handler

This example demonstrates how to use the Linear SDK to handle critical emergency issues, such as warehouse fires or other urgent incidents that require immediate attention.

## Features

- Create high-priority emergency issues
- Automatically assign to the right team members
- Set appropriate labels and workflow states
- Add detailed comments with incident information
- Track resolution progress

## Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Linear API key to `.env.local`:
   ```
   LINEAR_API_KEY=your_api_key_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the example:
   ```bash
   npm start
   ```

## Usage

The example shows how to:

1. **Create an emergency issue** with high priority
2. **Assign it to team members** who can respond
3. **Add labels** for categorization (e.g., "emergency", "incident")
4. **Post updates** as the situation evolves
5. **Track resolution** through workflow states

## Scenario: Warehouse Fire

The example uses a warehouse fire scenario to demonstrate handling a critical incident:

```typescript
import { LinearClient } from "@linear/sdk";

const client = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

// Create emergency issue
const issue = await client.createIssue({
  teamId: "team-id",
  title: "🔥 EMERGENCY: Warehouse Fire - Widget Storage",
  description: "Critical incident: The warehouse where we keep all the widgets is currently on fire.",
  priority: 1, // Urgent
  stateId: "in-progress-state-id",
});

// Add immediate action comment
await client.createComment({
  issueId: issue.id,
  body: "Emergency services contacted. Evacuating building.",
});
```

## Adapting for Your Use Case

You can adapt this example for any critical incident:
- System outages
- Security breaches
- Data loss events
- Production failures
- Customer-impacting issues

Simply modify the issue details and workflow to match your team's process.
