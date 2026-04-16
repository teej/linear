import inquirer from "inquirer";
import type { Importer } from "../../types.ts";
import type { CliArgs } from "../../utils/args.ts";
import { ShortcutCsvImporter } from "./ShortcutCsvImporter.ts";

const BASE_PATH = process.cwd();

export const shortcutCsvImport = async (args: CliArgs = {}): Promise<Importer> => {
  const prefilled: Partial<ShortcutImportAnswers> = {};
  if (args.file) {
    prefilled.shortcutFilePath = args.file;
  }
  if (args.shortcutSlug) {
    prefilled.shortcutWorkspaceSlug = args.shortcutSlug;
  }
  if (args.shortcutApiToken) {
    prefilled.shortcutAPIToken = args.shortcutApiToken;
  }
  const answers = await inquirer.prompt<ShortcutImportAnswers>(questions, prefilled);
  const shortcutImporter = new ShortcutCsvImporter(
    answers.shortcutFilePath,
    answers.shortcutWorkspaceSlug,
    answers.shortcutAPIToken
  );
  return shortcutImporter;
};

interface ShortcutImportAnswers {
  shortcutFilePath: string;
  shortcutWorkspaceSlug: string;
  shortcutAPIToken: string;
}

const questions = [
  {
    basePath: BASE_PATH,
    type: "filePath",
    name: "shortcutFilePath",
    message: "Select your exported CSV file of Shortcut stories",
  },
  {
    type: "input",
    name: "shortcutWorkspaceSlug",
    message: "Input the slug of your Shortcut workspace (e.g. acme):",
  },
  {
    type: "input",
    name: "shortcutAPIToken",
    message:
      "To transfer files from Shortcut, enter a Shortcut API token (https://app.shortcut.com/settings/account/api-tokens):",
  },
];
