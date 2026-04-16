/* eslint-disable no-console */
import chalk from "chalk";
import inquirer from "inquirer";
import inquirerFilePath from "inquirer-file-path";
import { importIssues } from "./importIssues.ts";
import { asanaCsvImport } from "./importers/asanaCsv/index.ts";
import { githubImport } from "./importers/github/index.ts";
import { gitlabCsvImporter } from "./importers/gitlabCsv/index.ts";
import { jiraCsvImport } from "./importers/jiraCsv/index.ts";
import { linearCsvImporter } from "./importers/linearCsv/index.ts";
import { pivotalCsvImport } from "./importers/pivotalCsv/index.ts";
import { shortcutCsvImport } from "./importers/shortcutCsv/index.ts";
import { trelloJsonImport } from "./importers/trelloJson/index.ts";
import type { ImportAnswers } from "./types.ts";
import { helpText, parseCliArgs } from "./utils/args.ts";

inquirer.registerPrompt("filePath", inquirerFilePath);

(async () => {
  try {
    const args = parseCliArgs();

    if (args.help) {
      console.log(helpText);
      return;
    }

    const prefilled: Partial<ImportAnswers> = {};
    if (args.apiKey) {
      prefilled.linearApiKey = args.apiKey;
    }
    if (args.service) {
      prefilled.service = args.service;
    }

    const importAnswers = await inquirer.prompt<ImportAnswers>(
      [
        {
          type: "input",
          name: "linearApiKey",
          message: "Input your Linear API key (https://linear.app/settings/account/security)",
        },
        {
          type: "list",
          name: "service",
          message: "Which service would you like to import from?",
          choices: [
            {
              name: "GitHub",
              value: "github",
            },
            {
              name: "GitLab (CSV export)",
              value: "gitlabCsv",
            },
            {
              name: "Jira (CSV export)",
              value: "jiraCsv",
            },
            {
              name: "Asana (CSV export)",
              value: "asanaCsv",
            },
            {
              name: "Pivotal (CSV export)",
              value: "pivotalCsv",
            },
            {
              name: "Shortcut (CSV export)",
              value: "shortcutCsv",
            },
            {
              name: "Trello (JSON export)",
              value: "trelloJson",
            },
            {
              name: "Linear (CSV export)",
              value: "linearCsv",
            },
          ],
        },
      ],
      prefilled
    );

    // TODO: Validate Linear API
    let importer;
    switch (importAnswers.service) {
      case "github":
        importer = await githubImport(args);
        break;
      case "gitlabCsv":
        importer = await gitlabCsvImporter(args);
        break;
      case "jiraCsv":
        importer = await jiraCsvImport(args);
        break;
      case "asanaCsv":
        importer = await asanaCsvImport(args);
        break;
      case "pivotalCsv":
        importer = await pivotalCsvImport(args);
        break;
      case "shortcutCsv":
        importer = await shortcutCsvImport(args);
        break;
      case "trelloJson":
        importer = await trelloJsonImport(args);
        break;
      case "linearCsv":
        importer = await linearCsvImporter(args);
        break;
      default:
        console.log(chalk.red(`Invalid importer`));
        return;
    }

    if (importer) {
      await importIssues(importAnswers.linearApiKey, importer, args.apiUrl, args);
    }
  } catch (error) {
    const userFriendlyMessage = error.errors?.[0]?.message;
    if (error.type !== "UsageLimitExceeded") {
      // Don't log when the usage limit is exceeded as we already know the cause.
      console.error(error);
    }
    if (userFriendlyMessage) {
      console.log(chalk.red(userFriendlyMessage));
    }
  }
})();
