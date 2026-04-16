import inquirer from "inquirer";
import type { Importer } from "../../types.ts";
import type { CliArgs } from "../../utils/args.ts";
import { AsanaCsvImporter } from "./AsanaCsvImporter.ts";

const BASE_PATH = process.cwd();

const ASANA_URL_REGEX = /(^https?:\/\/app.asana.com\/0\/\d+\/)list/;

export const asanaCsvImport = async (args: CliArgs = {}): Promise<Importer> => {
  const prefilled: Partial<AsanaImportAnswers> = {};
  if (args.file) {
    prefilled.asanaFilePath = args.file;
  }
  if (args.asanaUrl) {
    prefilled.asanaUrlName = args.asanaUrl;
  }
  const answers = await inquirer.prompt<AsanaImportAnswers>(questions, prefilled);
  const orgSlug = answers.asanaUrlName.match(ASANA_URL_REGEX)?.[1];
  const asanaImporter = new AsanaCsvImporter(answers.asanaFilePath, orgSlug ?? "");
  return asanaImporter;
};

interface AsanaImportAnswers {
  asanaFilePath: string;
  asanaUrlName: string;
}

const questions = [
  {
    basePath: BASE_PATH,
    type: "filePath",
    name: "asanaFilePath",
    message: "Select your exported CSV file of Asana issues",
  },
  {
    type: "input",
    name: "asanaUrlName",
    message: "Input the URL of your Asana board (e.g. https://app.asana.com/0/123456789/list):",
    validate: (input: string) => {
      return !!input.match(ASANA_URL_REGEX);
    },
  },
];
