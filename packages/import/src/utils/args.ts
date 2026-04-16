export interface CliArgs {
  apiKey?: string;
  apiUrl?: string;
  service?: string;

  teamId?: string;
  teamName?: string;
  projectId?: string;
  noProject?: boolean;
  assignee?: string;
  includeComments?: boolean;

  file?: string;

  githubApiKey?: string;
  repo?: string;

  asanaUrl?: string;

  jiraCloud?: boolean;
  jiraUrl?: string;
  customJiraUrl?: string;

  shortcutSlug?: string;
  shortcutApiToken?: string;

  mapListsToStatuses?: boolean;
  discardArchivedCards?: boolean;
  discardArchivedLists?: boolean;

  help?: boolean;
}

const stringFlags = new Set([
  "apiKey",
  "apiUrl",
  "service",
  "teamId",
  "teamName",
  "projectId",
  "assignee",
  "file",
  "githubApiKey",
  "repo",
  "asanaUrl",
  "jiraUrl",
  "customJiraUrl",
  "shortcutSlug",
  "shortcutApiToken",
]);

const booleanFlags = new Set([
  "noProject",
  "includeComments",
  "jiraCloud",
  "mapListsToStatuses",
  "discardArchivedCards",
  "discardArchivedLists",
  "help",
]);

const aliases: Record<string, string> = {
  h: "help",
};

const parseBoolean = (value: string | undefined): boolean => {
  if (value === undefined) {
    return true;
  }
  return value !== "false" && value !== "0" && value !== "no";
};

export const parseCliArgs = (argv: string[] = process.argv.slice(2)): CliArgs => {
  const args: Record<string, string | boolean> = {};
  let i = 0;
  while (i < argv.length) {
    const token = argv[i];
    if (!token.startsWith("--") && !token.startsWith("-")) {
      i++;
      continue;
    }

    let key = token.replace(/^-+/, "");
    let explicitValue: string | undefined;

    const eqIdx = key.indexOf("=");
    if (eqIdx !== -1) {
      explicitValue = key.slice(eqIdx + 1);
      key = key.slice(0, eqIdx);
    }

    if (key.startsWith("no-") && !booleanFlags.has(key)) {
      const negated = key.slice(3);
      const negatedCamel = aliases[negated] ?? negated;
      if (booleanFlags.has(negatedCamel)) {
        args[negatedCamel] = false;
        i++;
        continue;
      }
    }

    const camel = aliases[key] ?? key;

    if (booleanFlags.has(camel)) {
      args[camel] = parseBoolean(explicitValue);
      i++;
      continue;
    }

    if (stringFlags.has(camel)) {
      if (explicitValue !== undefined) {
        args[camel] = explicitValue;
        i++;
      } else {
        const next = argv[i + 1];
        if (next === undefined || next.startsWith("-")) {
          throw new Error(`Missing value for --${camel}`);
        }
        args[camel] = next;
        i += 2;
      }
      continue;
    }

    throw new Error(`Unknown flag: --${key}`);
  }

  return args as CliArgs;
};

export const helpText = `Usage: linear-import [options]

Runs interactively by default. Pass flags to skip prompts and run in CI.

General:
  --apiKey <key>             Linear API key
  --apiUrl <url>             Linear API URL (defaults to production)
  --service <name>           Importer: github, gitlabCsv, jiraCsv, asanaCsv,
                             pivotalCsv, shortcutCsv, trelloJson, linearCsv
  --help, -h                 Show this help

Target team/project/assignee:
  --teamId <id>              Import into an existing team
  --teamName <name>          Create a new team with this name
  --projectId <id>           Import into this project
  --noProject                Skip project selection
  --assignee <value>         User ID to assign issues to, or "self" to
                             self-assign, or "provided" to use the assignee
                             from the import source, or "none" to leave
                             unassigned
  --includeComments          Include source comments in issue descriptions
  --no-includeComments       Do not include comments

Importer options:
  --file <path>              CSV/JSON file path (for *Csv/trelloJson importers)

  GitHub:
    --githubApiKey <token>   GitHub personal access token
    --repo <owner/name>      Repo to import from

  Asana:
    --asanaUrl <url>         Asana board URL

  Jira CSV:
    --jiraCloud              Source is Jira Cloud (default)
    --no-jiraCloud           Source is on-prem Jira
    --jiraUrl <url>          Jira Cloud URL (when --jiraCloud)
    --customJiraUrl <url>    On-prem Jira URL (when --no-jiraCloud)

  Shortcut:
    --shortcutSlug <slug>    Shortcut workspace slug
    --shortcutApiToken <t>   Shortcut API token

  Trello:
    --mapListsToStatuses     Map Trello lists to Linear statuses
    --discardArchivedCards   Discard archived cards
    --discardArchivedLists   Discard cards in archived lists
`;
