import inquirer from "inquirer";
import type { Importer } from "../../types.ts";
import type { CliArgs } from "../../utils/args.ts";
import { PivotalCsvImporter } from "./PivotalCsvImporter.ts";

const BASE_PATH = process.cwd();

export const pivotalCsvImport = async (args: CliArgs = {}): Promise<Importer> => {
  const prefilled: Partial<PivotalImportAnswers> = {};
  if (args.file) {
    prefilled.pivotalFilePath = args.file;
  }
  const answers = await inquirer.prompt<PivotalImportAnswers>(questions, prefilled);
  const pivotalImporter = new PivotalCsvImporter(answers.pivotalFilePath);
  return pivotalImporter;
};

interface PivotalImportAnswers {
  pivotalFilePath: string;
}

const questions = [
  {
    basePath: BASE_PATH,
    type: "filePath",
    name: "pivotalFilePath",
    message: "Select your exported CSV file of Pivotal stories",
  },
];
