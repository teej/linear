import { LinearClient } from "@linear/sdk";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

interface EmergencyIssueOptions {
  title: string;
  description: string;
  teamId?: string;
  assigneeId?: string;
  labels?: string[];
}

interface EmergencyUpdate {
  issueId: string;
  update: string;
  severity?: "critical" | "high" | "medium" | "resolved";
}

/**
 * Emergency Issue Handler
 *
 * A utility class for handling critical incidents in Linear.
 * Demonstrates best practices for creating and managing high-priority issues.
 */
class EmergencyIssueHandler {
  private client: LinearClient;

  constructor(apiKey: string) {
    this.client = new LinearClient({ apiKey });
  }

  /**
   * Create an emergency issue with high priority
   */
  async createEmergencyIssue(options: EmergencyIssueOptions) {
    console.log("🚨 Creating emergency issue...");

    try {
      const issuePayload: any = {
        title: `🔥 EMERGENCY: ${options.title}`,
        description: options.description,
        priority: 1, // Urgent priority
      };

      // Add team ID if provided
      if (options.teamId) {
        issuePayload.teamId = options.teamId;
      } else {
        // Get first available team
        const teams = await this.client.teams();
        const firstTeam = (await teams).nodes[0];
        if (firstTeam) {
          issuePayload.teamId = firstTeam.id;
          console.log(`📋 Using team: ${firstTeam.name}`);
        }
      }

      // Add assignee if provided
      if (options.assigneeId) {
        issuePayload.assigneeId = options.assigneeId;
      }

      // Create the issue
      const issueResponse = await this.client.createIssue(issuePayload);
      const issue = await issueResponse.issue;

      if (!issue) {
        throw new Error("Failed to create issue");
      }

      console.log(`✅ Emergency issue created: ${issue.identifier}`);
      console.log(`   URL: ${issue.url}`);
      console.log(`   Title: ${issue.title}`);

      // Add labels if provided
      if (options.labels && options.labels.length > 0) {
        console.log(`🏷️  Adding labels: ${options.labels.join(", ")}`);
        // Note: Label assignment would require label IDs, which would need to be
        // fetched or provided. This is left as an exercise for implementation.
      }

      return issue;
    } catch (error) {
      console.error("❌ Error creating emergency issue:", error);
      throw error;
    }
  }

  /**
   * Post an update to an emergency issue
   */
  async postUpdate(options: EmergencyUpdate) {
    console.log(`📝 Posting update to issue...`);

    try {
      const severityEmoji: Record<string, string> = {
        critical: "🔴",
        high: "🟠",
        medium: "🟡",
        resolved: "✅",
      };

      const emoji = options.severity ? severityEmoji[options.severity] : "ℹ️";
      const commentBody = `${emoji} **Update**: ${options.update}`;

      const commentResponse = await this.client.createComment({
        issueId: options.issueId,
        body: commentBody,
      });

      const comment = await commentResponse.comment;
      console.log(`✅ Update posted successfully`);

      return comment;
    } catch (error) {
      console.error("❌ Error posting update:", error);
      throw error;
    }
  }

  /**
   * Get issue details
   */
  async getIssueStatus(issueId: string) {
    console.log(`🔍 Fetching issue status...`);

    try {
      const issue = await this.client.issue(issueId);

      if (!issue) {
        throw new Error(`Issue not found: ${issueId}`);
      }

      const state = await issue.state;
      const assignee = await issue.assignee;

      console.log(`\n📊 Issue Status:`);
      console.log(`   ID: ${issue.identifier}`);
      console.log(`   Title: ${issue.title}`);
      console.log(`   State: ${state?.name || "Unknown"}`);
      console.log(`   Priority: ${issue.priorityLabel}`);
      console.log(`   Assignee: ${assignee?.name || "Unassigned"}`);
      console.log(`   URL: ${issue.url}\n`);

      return issue;
    } catch (error) {
      console.error("❌ Error fetching issue:", error);
      throw error;
    }
  }
}

/**
 * Example: Handling a warehouse fire emergency
 */
async function warehouseFireScenario() {
  const apiKey = process.env.LINEAR_API_KEY;

  if (!apiKey) {
    console.error("❌ LINEAR_API_KEY not found in environment variables");
    console.error("Please copy .env.local.example to .env.local and add your API key");
    process.exit(1);
  }

  const handler = new EmergencyIssueHandler(apiKey);

  console.log("\n" + "=".repeat(60));
  console.log("🔥 WAREHOUSE FIRE EMERGENCY SCENARIO");
  console.log("=".repeat(60) + "\n");

  try {
    // Step 1: Create emergency issue
    const issue = await handler.createEmergencyIssue({
      title: "Warehouse Fire - Widget Storage",
      description: `**CRITICAL INCIDENT**

The warehouse where we keep all the widgets is currently on fire.

**Immediate Actions Required:**
- [ ] Contact emergency services
- [ ] Evacuate all personnel
- [ ] Secure perimeter
- [ ] Account for all staff
- [ ] Contact insurance provider
- [ ] Assess widget inventory damage
- [ ] Establish temporary storage solution
- [ ] Communicate with customers about potential delays

**Initial Assessment:**
- Location: Main widget storage facility
- Time reported: ${new Date().toISOString()}
- Severity: Critical
- Impact: All widget inventory at risk`,
      teamId: process.env.LINEAR_TEAM_ID,
      assigneeId: process.env.LINEAR_ASSIGNEE_ID,
      labels: ["emergency", "incident", "infrastructure"],
    });

    console.log("\n⏳ Waiting 2 seconds before posting updates...\n");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Post immediate action update
    await handler.postUpdate({
      issueId: issue.id,
      update: "Emergency services have been contacted. Fire department en route. All personnel evacuated safely.",
      severity: "critical",
    });

    console.log("\n⏳ Waiting 2 seconds...\n");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 3: Post situation update
    await handler.postUpdate({
      issueId: issue.id,
      update: "Fire contained to north wing. Approximately 30% of widget inventory affected. Investigating cause.",
      severity: "high",
    });

    console.log("\n⏳ Waiting 2 seconds...\n");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 4: Post resolution update
    await handler.postUpdate({
      issueId: issue.id,
      update: "Fire extinguished. Beginning damage assessment and cleanup operations. Temporary storage secured at alternate facility.",
      severity: "resolved",
    });

    // Step 5: Check final status
    console.log("\n" + "=".repeat(60));
    await handler.getIssueStatus(issue.id);
    console.log("=".repeat(60) + "\n");

    console.log("✅ Emergency scenario completed successfully");
    console.log(`\n🔗 View issue in Linear: ${issue.url}\n`);
  } catch (error) {
    console.error("\n❌ Scenario failed:", error);
    process.exit(1);
  }
}

// Run the example if executed directly
if (require.main === module) {
  warehouseFireScenario()
    .then(() => {
      console.log("✨ Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { EmergencyIssueHandler, warehouseFireScenario };
