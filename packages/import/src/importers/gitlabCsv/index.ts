import inquirer from "inquirer";

import type { Importer } from "../../types.ts";
import type { CliArgs } from "../../utils/args.ts";
import { GitLabCsvImporter } from "./GitlabCsvImporter.ts";

const BASE_PATH = process.cwd();

export const gitlabCsvImporter = async (args: CliArgs = {}): Promise<Importer> => {
  const prefilled: Partial<GitLabImportAnswers> = {};
  if (args.file) {
    prefilled.csvFilePath = args.file;
  }
  const answers = await inquirer.prompt<GitLabImportAnswers>(questions, prefilled);
  return new GitLabCsvImporter(answers.csvFilePath);
};

interface GitLabImportAnswers {
  csvFilePath: string;
}

const questions = [
  {
    basePath: BASE_PATH,
    type: "filePath",
    name: "csvFilePath",
    message: "Select your exported CSV file of GitLab issues",
  },
];
